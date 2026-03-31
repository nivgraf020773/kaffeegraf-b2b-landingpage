import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createWooCommerceCustomer } from "./woocommerce";
import { sendContactConfirmationEmail } from "./email";

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

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
          email: z.string().email("Ungültige Email-Adresse"),
          company: z.string().min(2, "Unternehmensname erforderlich"),
          phone: z.string().optional(),
          businessType: z.string().optional(),
          priority: z.string().optional(),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Create customer in WooCommerce
          const customer = await createWooCommerceCustomer({
            email: input.email,
            first_name: input.name,
            billing: {
              company: input.company,
              phone: input.phone,
              email: input.email,
            },
            meta_data: [
              {
                key: "b2b_status",
                value: "prospect",
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
          });

          // Send confirmation email (non-blocking)
          try {
            await sendContactConfirmationEmail({
              name: input.name,
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
              "Vielen Dank für Ihre Anfrage! Wir melden uns innerhalb von 24 Stunden bei Ihnen.",
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
