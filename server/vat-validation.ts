/**
 * VAT/UID Validation Service
 * 
 * CURRENT: Simple format validation (ATU + 8 digits)
 * TODO: Integrate with VIES REST API when service is stable
 */

import type { VATValidationResult } from "@shared/vat-validation";

/**
 * Simple format validation for Austrian UID
 * Checks: ATU + exactly 8 digits
 * 
 * This is a temporary implementation for MVP.
 * Real VIES API validation will be added later.
 */
export async function validateVAT(uid: string): Promise<VATValidationResult> {
  const normalized = uid.trim().toUpperCase().replace(/\s+/g, "");

  // Must start with ATU
  if (!normalized.startsWith("ATU")) {
    return {
      status: "format_error",
      uid,
      normalized,
      message: "UID muss mit 'ATU' beginnen (z.B. ATU12345678)",
    };
  }

  // Must have exactly 8 digits after ATU
  const numberPart = normalized.substring(3);
  if (!/^\d{8}$/.test(numberPart)) {
    return {
      status: "format_error",
      uid,
      normalized,
      message: "UID muss ATU + 8 Ziffern sein (z.B. ATU12345678)",
    };
  }

  // Format is valid
  return {
    status: "valid",
    uid,
    normalized,
    message: "UID-Format ist gültig",
    timestamp: new Date().toISOString(),
    source: "FORMAT_CHECK",
  };
}

/**
 * Batch validate multiple VAT numbers
 */
export async function validateVATBatch(
  uids: string[]
): Promise<VATValidationResult[]> {
  return Promise.all(uids.map((uid) => validateVAT(uid)));
}

/**
 * TODO: VIES REST API Integration
 * 
 * When VIES API is working properly, replace the simple validation above with:
 * 
 * 1. Generate HMAC SHA256 Authorization header
 * 2. Make GET request to: https://viesapi.eu/api/get/vies/euvat/{UID}
 * 3. Parse JSON response
 * 4. Return validation result
 * 
 * Documentation: https://viesapi.eu/de/vies-rest-api-dokumentation/
 * Credentials: VIES_API_KEY_ID, VIES_API_KEY (from env)
 */
