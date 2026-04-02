/**
 * Simple VAT/UID Validation Service
 * 
 * Current implementation: Basic format validation only
 * - Checks if UID starts with ATU
 * - Checks if followed by exactly 8 digits
 * 
 * No external API calls - purely local validation
 */

import type { VATValidationResult } from "@shared/vat-validation";

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

export async function validateVATBatch(
  uids: string[]
): Promise<VATValidationResult[]> {
  return Promise.all(uids.map((uid) => validateVAT(uid)));
}
