/**
 * VAT/UID Validation Utilities
 * Supports EU VAT numbers (VIES) and Austrian UID numbers (BMF)
 */

export type VATValidationStatus = 
  | "valid"
  | "invalid"
  | "format_error"
  | "service_unavailable"
  | "timeout";

export interface VATValidationResult {
  status: VATValidationStatus;
  uid: string;
  normalized: string;
  message: string;
  timestamp?: string;
  source?: string;
}

/**
 * Frontend: Normalize and validate VAT format
 * Supports:
 * - Austrian UID: ATU12345678 (11 chars, starts with AT)
 * - EU VAT: DE123456789 (format varies by country)
 */
export function normalizeVAT(input: string): string {
  return input
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ""); // Remove all whitespace
}

/**
 * Frontend: Basic format validation
 * Returns true if format looks valid, false otherwise
 */
export function validateVATFormat(vat: string): boolean {
  const normalized = normalizeVAT(vat);

  // Austrian UID format: ATU + 8 digits
  if (normalized.startsWith("ATU")) {
    return /^ATU\d{8}$/.test(normalized);
  }

  // EU VAT format: 2-letter country code + 2-12 digits/letters
  if (/^[A-Z]{2}/.test(normalized)) {
    return /^[A-Z]{2}[A-Z0-9]{2,12}$/.test(normalized);
  }

  return false;
}

/**
 * Frontend: Get user-friendly error message
 */
export function getVATErrorMessage(status: VATValidationStatus): string {
  const messages: Record<VATValidationStatus, string> = {
    valid: "UID ist gültig",
    invalid: "Die angegebene UID konnte nicht bestätigt werden. Bitte prüfen Sie Ihre Eingabe.",
    format_error: "Bitte prüfen Sie das Format Ihrer UID. Beispiel: ATU12345678",
    service_unavailable: "Die UID-Prüfung ist derzeit nicht verfügbar. Bitte versuchen Sie es in wenigen Minuten erneut oder kontaktieren Sie uns direkt.",
    timeout: "Die UID-Prüfung hat zu lange gedauert. Bitte versuchen Sie es erneut.",
  };
  return messages[status];
}

/**
 * Frontend: Get help text for VAT field
 */
export function getVATHelpText(): string {
  return "Bitte geben Sie Ihre gültige UID / USt-IdNr. ein. Beispiel: ATU12345678";
}

/**
 * Frontend: Get placeholder for VAT field
 */
export function getVATPlaceholder(): string {
  return "z.B. ATU12345678";
}
