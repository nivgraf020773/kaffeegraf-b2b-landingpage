import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { validateB2BCredentials, generateSessionToken } from "./b2b-auth";
import { createWooCommerceCustomer, updateWooCommerceCustomer, getWooCommerceCustomerByEmail, getWooCommerceCustomerById } from "./woocommerce";
import { sendContactConfirmationEmail } from "./email";
import { validateVAT } from "./vat-validation";
import { processB2BAccessRequest } from "./b2b-access";
import { checkRateLimit, RATE_LIMIT_POLICIES, RATE_LIMIT_MESSAGE } from "./rate-limiter";

/**
 * Extract client IP from Express request.
 * Respects X-Forwarded-For (set by reverse proxies like LiteSpeed/Nginx).
 */
function getClientIp(req: { ip?: string; headers: Record<string, string | string[] | undefined> }): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const first = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0];
    return first.trim();
  }
  return req.ip ?? "unknown";
}

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  vat: router({
    validate: publicProcedure
      .input(
        z.object({
          uid: z.string().min(5, "UID muss mindestens 5 Zeichen lang sein"),
        })
      )
      .query(async ({ input }) => {
        return validateVAT(input.uid);
      }),
  }),

  b2b: router({
    login: publicProcedure
      .input(
        z.object({
          identifier: z.string().min(1, "Kundennummer oder E-Mail erforderlich"),
          password: z.string().min(1, "Passwort erforderlich"),
          type: z.enum(["email", "customerNumber"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // ─────────────────────────────────────────────────────────────
        // RATE LIMITING — 5 attempts / 15 min / IP
        // ─────────────────────────────────────────────────────────────
        const ip = getClientIp(ctx.req);
        const rateCheck = checkRateLimit("b2b.login", ip, RATE_LIMIT_POLICIES["b2b.login"]);
        if (!rateCheck.allowed) {
          console.warn(`[B2B Login] Rate limit exceeded for IP: ${ip}`);
          return {
            success: false,
            accessStatus: null as string | null,
            message: RATE_LIMIT_MESSAGE,
          };
        }

        try {
          // Validate credentials against WooCommerce
          const customer = await validateB2BCredentials(input.identifier, input.password, input.type);
          
          if (!customer) {
            return {
              success: false,
              accessStatus: null as string | null,
              message: "Kundennummer/E-Mail oder Passwort ungültig",
            };
          }

          // ─────────────────────────────────────────────────────────────
          // ACCESS GATING — B2B_STATUS_SPEC v2
          // ONLY b2b_access_status is used for access control.
          // b2b_status (business relationship) is NEVER used here.
          // ─────────────────────────────────────────────────────────────
          const fullCustomer = await getWooCommerceCustomerById(customer.id);
          const accessStatus = fullCustomer?.meta_data?.find(
            (m: { key: string; value: string }) => m.key === "b2b_access_status"
          )?.value ?? "none";

          // Status-specific denial messages (exact wording per spec)
          const DENIAL_MESSAGES: Record<string, string> = {
            none: "Für Ihr Konto ist derzeit noch kein B2B-Zugang freigeschaltet.\nWenn Sie einen Zugang benötigen, stellen Sie bitte eine Anfrage über das Formular.",
            requested: "Ihre Anfrage ist bei uns eingegangen und wird derzeit geprüft.\nWir melden uns zeitnah persönlich bei Ihnen.",
            approved: "Ihr Zugang wurde bereits freigegeben, ist aber noch nicht vollständig aktiviert.\nWir melden uns zeitnah persönlich bei Ihnen.",
            rejected: "Ihr Zugang ist derzeit nicht freigeschaltet.\nBei Fragen melden wir uns gerne persönlich bei Ihnen.",
          };

          if (accessStatus !== "active") {
            const denialMessage = DENIAL_MESSAGES[accessStatus] ?? DENIAL_MESSAGES["none"];
            console.log(`[B2B Login] Access denied for customer ${customer.id}: b2b_access_status=${accessStatus}`);
            return {
              success: false,
              accessStatus,
              message: denialMessage,
            };
          }

          // Access granted — generate session token
          const token = generateSessionToken(customer.id);

          return {
            success: true,
            accessStatus: "active",
            token,
            customerId: customer.id,
            customerNumber: customer.meta_data?.find((m: any) => m.key === "b2b_customer_number")?.value,
            dashboardUrl: "https://kaffeebizdash-fqjhwufg.manus.space/dashboard",
            message: "Erfolgreich angemeldet",
          };
        } catch (error) {
          console.error("B2B Login Error:", error);
          return {
            success: false,
            accessStatus: null as string | null,
            message: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
          };
        }
      }),

    accessRequest: publicProcedure
      .input(
        z.object({
          companyName: z.string().min(2, "Firmenname erforderlich"),
          firstName: z.string().min(1, "Vorname erforderlich"),
          lastName: z.string().min(1, "Nachname erforderlich"),
          email: z.string().email("Gültige E-Mail erforderlich"),
          phone: z.string().optional(),
          uid: z.string()
            .regex(/^ATU\d{8}$/, "UID muss ATU + 8 Ziffern sein"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // ─────────────────────────────────────────────────────────────
        // RATE LIMITING — 5 req / 15 min / IP
        // ─────────────────────────────────────────────────────────────
        const ip = getClientIp(ctx.req);
        const rateCheck = checkRateLimit("b2b.accessRequest", ip, RATE_LIMIT_POLICIES["b2b.accessRequest"]);
        if (!rateCheck.allowed) {
          console.warn(`[B2B AccessRequest] Rate limit exceeded for IP: ${ip}`);
          return {
            success: false,
            message: RATE_LIMIT_MESSAGE,
          };
        }

        return processB2BAccessRequest(input);
      }),
  }),

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          firstName: z.string().min(1, "Vorname erforderlich"),
          lastName: z.string().min(1, "Nachname erforderlich"),
          email: z.string().email("Ungültige Email-Adresse"),
          company: z.string().min(2, "Unternehmensname erforderlich"),
          phone: z.string().optional(),
          uid: z.string().min(5, "UID ist erforderlich"),
          businessType: z.string().optional(),
          priority: z.string().optional(),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // ─────────────────────────────────────────────────────────────
        // RATE LIMITING — 5 req / 15 min / IP
        // ─────────────────────────────────────────────────────────────
        const ip = getClientIp(ctx.req);
        const rateCheck = checkRateLimit("contact.submit", ip, RATE_LIMIT_POLICIES["contact.submit"]);
        if (!rateCheck.allowed) {
          console.warn(`[Contact Submit] Rate limit exceeded for IP: ${ip}`);
          throw new Error(RATE_LIMIT_MESSAGE);
        }

        try {
          // Build customer payload (shared for create and update)
          const customerPayload = {
            email: input.email,
            first_name: input.firstName,
            last_name: input.lastName,
            billing: {
              company: input.company,
              phone: input.phone,
              email: input.email,
              vat_id: input.uid, // visible USt.-ID field in WooCommerce admin
            },
            meta_data: [
              {
                key: "b2b_status",
                value: "prospect",
              },
              {
                key: "vat_id",
                value: input.uid,
              },
              {
                key: "billing_vat_id",
                value: input.uid,
              },
              {
                key: "shipping_vat_id",
                value: input.uid,
              },
              {
                key: "vat_validation_status",
                value: "valid",
              },
              {
                key: "vat_validation_checked_at",
                value: new Date().toISOString(),
              },
              {
                key: "vat_validation_source",
                value: "FORMAT_CHECK",
              },
              ...(input.businessType
                ? [
                    {
                      key: "b2b_business_type",
                      value: input.businessType,
                    },
                  ]
                : []),
              ...(input.priority
                ? [
                    {
                      key: "b2b_priority",
                      value: input.priority,
                    },
                  ]
                : []),
              ...(input.message
                ? [
                    {
                      key: "b2b_message",
                      value: input.message,
                    },
                  ]
                : []),
            ],
          };

          // Upsert: check if customer already exists, update or create
          let customer;
          const existingCustomer = await getWooCommerceCustomerByEmail(input.email);
          if (existingCustomer) {
            console.log(`[Contact Form] Existing customer found (ID: ${existingCustomer.id}), updating...`);
            customer = await updateWooCommerceCustomer(existingCustomer.id, customerPayload);
          } else {
            console.log("[Contact Form] New customer, creating...");
            customer = await createWooCommerceCustomer(customerPayload);
          }

          // Send confirmation email (non-blocking)
          try {
            await sendContactConfirmationEmail({
              firstName: input.firstName,
              email: input.email,
              company: input.company,
            });
          } catch (emailError) {
            console.warn(
              "[Contact Form] Email sending failed (non-blocking):",
              emailError
            );
            // Continue even if email fails - customer is still created in WooCommerce
          }

          return {
            success: true,
            customerId: customer.id,
            message:
              "Vielen Dank – Ihre Anfrage ist bei uns eingegangen.\nWir prüfen diese und melden uns zeitnah persönlich bei Ihnen.",
          };
        } catch (error) {
          console.error("[Contact Form] Error:", error);
          throw new Error(
            "Es gab einen Fehler beim Verarbeiten Ihrer Anfrage. Bitte versuchen Sie es später erneut."
          );
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
