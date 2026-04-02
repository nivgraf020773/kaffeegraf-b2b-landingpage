/**
 * VAT/UID Validation Service
 * Validates EU VAT numbers via VIES API and Austrian UID via BMF
 */

import type { VATValidationResult, VATValidationStatus } from "@shared/vat-validation";

const VIES_API_ENDPOINT = "https://ec.europa.eu/taxation_customs/vies/services/checkVatService";
const BMF_API_ENDPOINT = "https://finanzonline.bmf.gv.at/fonuid/ws/uidAbfrageService";

/**
 * Validate Austrian UID via VIES API
 * Austrian UIDs (ATU...) can be validated using the EU VIES API
 * This avoids the need for FinanzOnline credentials
 */
async function validateAustrianUID(uid: string): Promise<VATValidationResult> {
  // Route to VIES API - Austrian UIDs work with VIES
  return validateEUVAT(uid);
}

/**
 * Validate EU VAT number via VIES API
 */
async function validateEUVAT(uid: string): Promise<VATValidationResult> {
  try {
    const countryCode = uid.substring(0, 2);
    const vatNumber = uid.substring(2);

    // Build SOAP request for VIES API
    const soapBody = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="urn:ec.europa.eu:taxud:vies:services:checkVat:types_v2_1">
  <soap:Body>
    <tns:checkVat>
      <tns:vatNumber>${vatNumber}</tns:vatNumber>
      <tns:memberState>${countryCode}</tns:memberState>
      <tns:requesterMemberState>AT</tns:requesterMemberState>
      <tns:requesterVat>ATU12345678</tns:requesterVat>
    </tns:checkVat>
  </soap:Body>
</soap:Envelope>`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(VIES_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=UTF-8",
        SOAPAction: "",
      },
      body: soapBody,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        status: "service_unavailable",
        uid,
        normalized: uid,
        message: "VIES-Service antwortet nicht korrekt",
        source: "VIES",
      };
    }

    const xmlText = await response.text();

    // Parse SOAP response
    if (xmlText.includes("<valid>true</valid>")) {
      return {
        status: "valid",
        uid,
        normalized: uid,
        message: "VAT-Nummer ist gültig",
        timestamp: new Date().toISOString(),
        source: "VIES",
      };
    }

    if (xmlText.includes("<valid>false</valid>")) {
      return {
        status: "invalid",
        uid,
        normalized: uid,
        message: "VAT-Nummer konnte nicht bestätigt werden",
        source: "VIES",
      };
    }

    // Check for SOAP fault
    if (xmlText.includes("faultstring")) {
      const faultMatch = xmlText.match(/<faultstring>(.*?)<\/faultstring>/);
      const faultMessage = faultMatch ? faultMatch[1] : "VIES-Service Fehler";

      if (faultMessage.includes("SERVICE_UNAVAILABLE")) {
        return {
          status: "service_unavailable",
          uid,
          normalized: uid,
          message: "VIES-Service ist derzeit nicht verfügbar",
          source: "VIES",
        };
      }

      return {
        status: "service_unavailable",
        uid,
        normalized: uid,
        message: faultMessage,
        source: "VIES",
      };
    }

    return {
      status: "service_unavailable",
      uid,
      normalized: uid,
      message: "VIES-Service konnte nicht verarbeitet werden",
      source: "VIES",
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        status: "timeout",
        uid,
        normalized: uid,
        message: "VIES-Service Anfrage hat zu lange gedauert",
        source: "VIES",
      };
    }

    console.error("[VIES Validation Error]", error);
    return {
      status: "service_unavailable",
      uid,
      normalized: uid,
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
    return validateAustrianUID(normalized);
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
