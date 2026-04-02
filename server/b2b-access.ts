/**
 * B2B Access Request Service
 * Handles B2B customer access requests with UID validation and WooCommerce integration
 */

import { z } from "zod";
import { createWooCommerceCustomer } from "./woocommerce";
import { sendContactConfirmationEmail } from "./email";

export const B2BAccessRequestSchema = z.object({
  companyName: z.string().min(2, "Firmenname erforderlich"),
  name: z.string().min(2, "Name erforderlich"),
  email: z.string().email("Gültige E-Mail erforderlich"),
  phone: z.string().optional(),
  uid: z.string()
    .regex(/^ATU\d{8}$/, "UID muss ATU + 8 Ziffern sein"),
});

export type B2BAccessRequest = z.infer<typeof B2BAccessRequestSchema>;

export interface B2BAccessRequestResult {
  success: boolean;
  message: string;
  requestId?: string;
  timestamp?: string;
  customerId?: number;
}

/**
 * Process B2B access request
 * - Validate input
 * - Create WooCommerce customer with B2B flag
 * - Send confirmation email
 * - Notify admin
 */
export async function processB2BAccessRequest(
  data: B2BAccessRequest
): Promise<B2BAccessRequestResult> {
  try {
    // Validate input
    const validated = B2BAccessRequestSchema.parse(data);

    // Split name into first and last name
    const nameParts = validated.name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || firstName;

    // Create WooCommerce customer with B2B flag
    const customer = await createWooCommerceCustomer({
      email: validated.email,
      first_name: firstName,
      last_name: lastName,
      billing: {
        company: validated.companyName,
        phone: validated.phone,
        email: validated.email,
      },
      meta_data: [
        {
          key: "b2b_status",
          value: "pending_approval",
        },
        {
          key: "b2b_access_request",
          value: "true",
        },
        {
          key: "vat_id",
          value: validated.uid,
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
      ],
    });

    // Send confirmation email to customer
    try {
      await sendContactConfirmationEmail({
        email: validated.email,
        firstName: firstName,
        company: validated.companyName,
      });
    } catch (emailError) {
      console.error("[B2B Access] Email send failed:", emailError);
      // Continue even if email fails
    }

    return {
      success: true,
      message: "B2B-Zugangsanfrage erfolgreich eingereicht. Wir prüfen Ihre Angaben und melden uns kurzfristig.",
      requestId: `B2B-${customer.id}`,
      timestamp: new Date().toISOString(),
      customerId: customer.id,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return {
        success: false,
        message: firstError?.message || "Validierungsfehler",
      };
    }

    const errorMessage = error instanceof Error ? error.message : "Ein Fehler ist aufgetreten";
    console.error("[B2B Access] Error:", errorMessage);

    return {
      success: false,
      message: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
    };
  }
}
