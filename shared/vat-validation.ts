/**
 * VAT/UID Validation Result Types
 */

export interface VATValidationResult {
  status: "valid" | "format_error" | "service_unavailable" | "invalid";
  uid: string;
  normalized: string;
  message: string;
  timestamp?: string;
  source?: string;
  companyName?: string;
  companyAddress?: string;
}
