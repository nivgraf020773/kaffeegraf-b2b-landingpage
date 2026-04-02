/**
 * VAT/UID Validation Service
 * Validates EU VAT numbers via VIES REST API
 * 
 * Documentation: https://viesapi.eu/de/vies-rest-api-dokumentation/
 */

import crypto from "crypto";
import type { VATValidationResult } from "@shared/vat-validation";

const VIES_API_ENDPOINT = "https://viesapi.eu/api/get/vies/euvat";
const VIES_TEST_ENDPOINT = "https://viesapi.eu/api-test/get/vies/euvat";

// For testing, use the test API credentials
// In production, these should come from environment variables
const API_KEY_ID = process.env.VIES_API_KEY_ID || "test_id";
const API_KEY = process.env.VIES_API_KEY || "test_key";

/**
 * Generate HMAC SHA256 Authorization header for VIES API
 * 
 * Format: MAC id="key_id", ts="timestamp", nonce="random", mac="base64_hmac"
 */
function generateHMACAuth(path: string): {
  Authorization: string;
  "User-Agent": string;
  Accept: string;
} {
  const ts = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(8).toString("hex").substring(0, 16);
  const method = "GET";
  const host = "viesapi.eu";
  const port = "443";

  // Build the string to sign
  const stringToSign = `${ts}\n${nonce}\n${method}\n${path}\n${host}\n${port}\n\n`;

  // Calculate HMAC SHA256
  const hmac = crypto.createHmac("sha256", API_KEY);
  hmac.update(stringToSign);
  const macValue = hmac.digest("base64");

  // Build Authorization header
  const authHeader = `MAC id="${API_KEY_ID}", ts="${ts}", nonce="${nonce}", mac="${macValue}"`;

  return {
    Authorization: authHeader,
    "User-Agent": "kaffeegraf-b2b-app/1.0",
    Accept: "application/json",
  };
}

/**
 * Validate EU VAT number via VIES REST API
 */
async function validateEUVAT(uid: string): Promise<VATValidationResult> {
  try {
    const normalized = uid.trim().toUpperCase().replace(/\s+/g, "");

    // Determine if using test or production API
    // For now, always use test API for safety
    const isTestMode = true;
    const baseEndpoint = isTestMode ? VIES_TEST_ENDPOINT : VIES_API_ENDPOINT;
    const path = isTestMode
      ? `/api-test/get/vies/euvat/${normalized}`
      : `/api/get/vies/euvat/${normalized}`;

    const url = `${baseEndpoint}/${normalized}`;

    // Generate HMAC authentication
    const headers = generateHMACAuth(path);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(url, {
      method: "GET",
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Check for HTTP errors
    if (!response.ok) {
      console.error(`[VIES API Error] Status: ${response.status}`, {
        uid: normalized,
        status: response.status,
        statusText: response.statusText,
      });

      if (response.status === 429) {
        return {
          status: "service_unavailable",
          uid,
          normalized,
          message: "VIES-Service ist überlastet. Bitte versuchen Sie es später erneut.",
          source: "VIES",
        };
      }

      if (response.status >= 500) {
        return {
          status: "service_unavailable",
          uid,
          normalized,
          message: "VIES-Service ist derzeit nicht verfügbar",
          source: "VIES",
        };
      }

      return {
        status: "service_unavailable",
        uid,
        normalized,
        message: "VIES-Service konnte nicht erreicht werden",
        source: "VIES",
      };
    }

    const data = await response.json() as {
      valid?: boolean;
      vat?: string;
      name?: string;
      address?: string;
      requestDate?: string;
    };

    // Parse response
    if (data.valid === true) {
      return {
        status: "valid",
        uid,
        normalized,
        message: "VAT-Nummer ist gültig",
        timestamp: new Date().toISOString(),
        source: "VIES",
      };
    }

    if (data.valid === false) {
      return {
        status: "invalid",
        uid,
        normalized,
        message: "VAT-Nummer konnte nicht bestätigt werden",
        source: "VIES",
      };
    }

    return {
      status: "service_unavailable",
      uid,
      normalized,
      message: "VIES-Service konnte die Anfrage nicht verarbeiten",
      source: "VIES",
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.warn("[VIES API Timeout]", { uid });
      return {
        status: "timeout",
        uid,
        normalized: uid.toUpperCase(),
        message: "VIES-Service Anfrage hat zu lange gedauert",
        source: "VIES",
      };
    }

    console.error("[VIES API Exception]", error);
    return {
      status: "service_unavailable",
      uid,
      normalized: uid.toUpperCase(),
      message: "VIES-Service ist nicht verfügbar",
      source: "VIES",
    };
  }
}

/**
 * Main validation function
 * Routes to appropriate validation service based on country code
 */
export async function validateVAT(uid: string): Promise<VATValidationResult> {
  const normalized = uid.trim().toUpperCase().replace(/\s+/g, "");

  // Must start with 2 letters
  if (!normalized.match(/^[A-Z]{2}/)) {
    return {
      status: "format_error",
      uid,
      normalized,
      message: "Ungültiges VAT-Format",
    };
  }

  const countryCode = normalized.substring(0, 2);
  const vatNumber = normalized.substring(2);

  // Austrian UID: ATU + 8 digits
  if (countryCode === "AT") {
    if (!/^\d{8}$/.test(vatNumber)) {
      return {
        status: "format_error",
        uid,
        normalized,
        message: "Österreichische UID muss ATU + 8 Ziffern sein",
      };
    }
    return validateEUVAT(normalized);
  }

  // EU VAT: 2 letters + 2-12 alphanumeric
  if (!/^[A-Z0-9]{2,12}$/.test(vatNumber)) {
    return {
      status: "format_error",
      uid,
      normalized,
      message: "Ungültiges EU VAT-Format",
    };
  }

  // For all other EU countries, use VIES
  return validateEUVAT(normalized);
}

/**
 * Batch validate multiple VAT numbers
 * Useful for checking customer lists
 */
export async function validateVATBatch(
  uids: string[]
): Promise<VATValidationResult[]> {
  return Promise.all(uids.map((uid) => validateVAT(uid)));
}
