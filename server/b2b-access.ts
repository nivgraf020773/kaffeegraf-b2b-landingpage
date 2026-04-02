/**
 * B2B Access Request Service
 * Handles B2B customer access requests with UID validation
 */

import { z } from "zod";

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
}

/**
 * Process B2B access request
 * - Validate input
 * - Store request in database
 * - Send confirmation email
 * - Notify admin
 */
export async function processB2BAccessRequest(
  data: B2BAccessRequest
): Promise<B2BAccessRequestResult> {
  try {
    // Validate input
    const validated = B2BAccessRequestSchema.parse(data);

    // TODO: Store in database
    // TODO: Send confirmation email to customer
    // TODO: Notify admin about new B2B request
    // TODO: Create WooCommerce customer with B2B flag

    return {
      success: true,
      message: "B2B-Zugangsanfrage erfolgreich eingereicht",
      requestId: `B2B-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return {
        success: false,
        message: firstError?.message || "Validierungsfehler",
      };
    }

    return {
      success: false,
      message: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
    };
  }
}
