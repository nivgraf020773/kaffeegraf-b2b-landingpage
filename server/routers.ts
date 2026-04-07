import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createWooCommerceCustomer, updateWooCommerceCustomer, getWooCommerceCustomerByEmail } from "./woocommerce";
import { sendContactConfirmationEmail } from "./email";
import { validateVAT } from "./vat-validation";
import { processB2BAccessRequest } from "./b2b-access";
import { checkRateLimit, RATE_LIMIT_POLICIES, RATE_LIMIT_MESSAGE } from "./rate-limiter";
import axios from "axios";

// ─── Constants ────────────────────────────────────────────────────────────────

const B2B_API_BASE = process.env.B2B_API_URL ?? "https://b2b-api.kaffeegraf.coffee";
const DASHBOARD_URL = process.env.DASHBOARD_URL ?? "https://b2b-dashboard.kaffeegraf.coffee";

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
          // Login-Contract v3 (Übergangsschema):
          // Die bestehende Landingpage-UI sendet weiterhin { identifier, type }.
          // Die UI-Anpassung auf { email } erfolgt im separaten Landingpage-Projekt.
          // Serverseitig wird Nicht-E-Mail-Input sauber abgelehnt (kein stilles Fehlverhalten).
          identifier: z.string().min(1, "E-Mail-Adresse erforderlich"),
          password: z.string().min(1, "Passwort erforderlich"),
          type: z.enum(["email", "customerNumber"]).optional(),
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
            dashboardUrl: null as string | null,
          };
        }

        try {
          // ─────────────────────────────────────────────────────────────
          // DELEGATE to kaffeegraf-b2b-api — single auth system
          // The b2b-api handles: credential check, access gating, JWT
          // issuance and sets the HttpOnly refresh_token cookie on
          // domain=.kaffeegraf.coffee so it is shared across subdomains.
          // ─────────────────────────────────────────────────────────────
          // Login-Contract v3: Serverseitige E-Mail-Validierung
          // Nur E-Mail-Login ist aktiv. Kundennummer-Input wird sauber abgelehnt.
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.identifier.trim())) {
            return {
              success: false,
              accessStatus: null as string | null,
              message: "Bitte geben Sie eine gültige E-Mail-Adresse ein. Login mit Kundennummer wird aktuell nicht unterstützt.",
              dashboardUrl: null as string | null,
            };
          }

          const loginPayload = {
            email: input.identifier.trim().toLowerCase(),
            password: input.password,
          };

          let apiResponse: any;
          try {
            apiResponse = await axios.post(
              `${B2B_API_BASE}/api/b2b/login`,
              loginPayload,
              {
                headers: { "Content-Type": "application/json" },
                // Do NOT follow redirects; we need the raw response with Set-Cookie
                maxRedirects: 0,
                validateStatus: () => true, // handle all status codes manually
              }
            );
          } catch (networkErr) {
            console.error("[B2B Login] Network error calling b2b-api:", networkErr);
            return {
              success: false,
              accessStatus: null as string | null,
              message: "Verbindungsfehler. Bitte versuchen Sie es später erneut.",
              dashboardUrl: null as string | null,
            };
          }

          const status = apiResponse.status;
          const data = apiResponse.data;

          // ─── Forward Set-Cookie header from b2b-api to the browser ───
          // The refresh_token cookie is HttpOnly, domain=.kaffeegraf.coffee,
          // path=/ — it will be sent automatically on all subdomains.
          const setCookieHeader = apiResponse.headers["set-cookie"];
          if (setCookieHeader) {
            const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
            cookies.forEach((cookie: string) => {
              ctx.res.append("Set-Cookie", cookie);
            });
            console.log(`[B2B Login] Forwarded ${cookies.length} Set-Cookie header(s) to browser`);
          }

          // ─── Handle non-2xx from b2b-api ──────────────────────────────
          if (status === 401) {
            // Map b2b-api error codes to user-facing messages
            const code = data?.error?.code ?? data?.code ?? "";
            const DENIAL_MESSAGES: Record<string, string> = {
              INVALID_CREDENTIALS: "Kundennummer/E-Mail oder Passwort ungültig",
              ACCOUNT_NOT_ACTIVE: "Für Ihr Konto ist derzeit noch kein B2B-Zugang freigeschaltet.\nWenn Sie einen Zugang benötigen, stellen Sie bitte eine Anfrage über das Formular.",
              DASHBOARD_ACCESS_DENIED: "Ihr Zugang ist derzeit nicht freigeschaltet.\nBei Fragen melden wir uns gerne persönlich bei Ihnen.",
            };
            return {
              success: false,
              accessStatus: null as string | null,
              message: DENIAL_MESSAGES[code] ?? "Anmeldung fehlgeschlagen. Bitte prüfen Sie Ihre Zugangsdaten.",
              dashboardUrl: null as string | null,
            };
          }

          if (status !== 200) {
            console.error(`[B2B Login] Unexpected status ${status} from b2b-api:`, data);
            return {
              success: false,
              accessStatus: null as string | null,
              message: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
              dashboardUrl: null as string | null,
            };
          }

          // ─── Success ──────────────────────────────────────────────────
          // Cookie is already set on the browser via the forwarded Set-Cookie header.
          // Return dashboardUrl so the frontend can redirect.
          console.log(`[B2B Login] Success for customer ${data.customerId ?? "unknown"}, redirecting to dashboard`);
          return {
            success: true,
            accessStatus: "active",
            message: "Erfolgreich angemeldet",
            dashboardUrl: DASHBOARD_URL,
            // Do NOT return token — no JWT in response body, no localStorage
          };

        } catch (error) {
          console.error("[B2B Login] Unexpected error:", error);
          return {
            success: false,
            accessStatus: null as string | null,
            message: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
            dashboardUrl: null as string | null,
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
