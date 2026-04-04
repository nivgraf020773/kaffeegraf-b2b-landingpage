/**
 * WooCommerce REST API Integration
 * Handles all communication with WooCommerce for B2B customer management
 * With timeouts, retries, and comprehensive error handling
 */

import { ENV } from "./_core/env";

export interface WooCommerceCustomer {
  email: string;
  first_name: string;
  last_name?: string;
  billing?: {
    company?: string;
    phone?: string;
    email?: string;
    vat_id?: string;
  };
  meta_data?: Array<{
    key: string;
    value: string;
  }>;
}

export interface WooCommerceCustomerResponse {
  id: number;
  email: string;
  first_name: string;
  last_name?: string;
  billing?: {
    company?: string;
    phone?: string;
    email?: string;
    vat_id?: string;
  };
  meta_data?: Array<{
    id: number;
    key: string;
    value: string;
  }>;
}

/**
 * WooCommerce API Configuration
 */
const API_TIMEOUT_MS = 10000; // 10 second timeout for WooCommerce API
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000; // 1 second initial delay

/**
 * Map WooCommerce error codes to user-friendly messages
 */
function mapWooCommerceError(error: any): string {
  if (error.code === "rest_invalid_param") {
    return "Ungültige Eingabedaten. Bitte überprüfen Sie Ihre Angaben.";
  }
  if (error.code === "rest_user_cannot_create") {
    return "Sie haben keine Berechtigung, Kunden zu erstellen.";
  }
  if (error.code === "rest_user_invalid_id") {
    return "Ungültige Benutzer-ID.";
  }
  if (error.code === "rest_no_route") {
    return "WooCommerce API ist nicht verfügbar.";
  }
  return "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.";
}

/**
 * Determine if an error is retryable (transient)
 */
function isRetryableError(status: number, error: any): boolean {
  // Retry on 5xx errors (server errors)
  if (status >= 500) return true;
  
  // Retry on 429 (rate limit)
  if (status === 429) return true;
  
  // Retry on timeout
  if (error?.name === "AbortError") return true;
  
  // Don't retry on 4xx client errors (except 429)
  if (status >= 400 && status < 500) return false;
  
  return false;
}

/**
 * Exponential backoff delay
 */
function getBackoffDelay(attempt: number): number {
  return RETRY_DELAY_MS * Math.pow(2, attempt - 1);
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = API_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Create a new customer in WooCommerce with retry logic
 * Uses Basic Auth with Consumer Key and Consumer Secret
 */
export async function createWooCommerceCustomer(
  customerData: WooCommerceCustomer
): Promise<WooCommerceCustomerResponse> {
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  const woocommerceUrl = process.env.WOOCOMMERCE_URL;

  if (!consumerKey || !consumerSecret || !woocommerceUrl) {
    throw new Error("WooCommerce credentials not configured");
  }

  // Create Basic Auth header
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );

  let lastError: any = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const url = `${woocommerceUrl}/wp-json/wc/v3/customers`;
      const authHeader = `Basic ${credentials}`;

      console.log(
        `[WooCommerce API] Creating customer (attempt ${attempt}/${MAX_RETRIES})`
      );
      console.log("  Email:", customerData.email);

      const response = await fetchWithTimeout(url, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error(
          `[WooCommerce API Error] Status ${response.status}:`,
          responseData
        );

        // Check if error is retryable
        if (isRetryableError(response.status, null) && attempt < MAX_RETRIES) {
          const delay = getBackoffDelay(attempt);
          console.log(
            `[WooCommerce API] Retrying in ${delay}ms after status ${response.status}`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          lastError = responseData;
          continue;
        }

        // Non-retryable error or final attempt
        const userMessage = mapWooCommerceError(responseData);
        throw new Error(
          `WooCommerce API error: ${response.status} - ${userMessage}`
        );
      }

      console.log("[WooCommerce API] Customer created successfully:", responseData.id);
      return responseData;
    } catch (error) {
      lastError = error;

      // Check if error is retryable
      if (attempt < MAX_RETRIES) {
        const isRetryable =
          error instanceof Error &&
          (error.name === "AbortError" ||
            error.message.includes("timeout") ||
            error.message.includes("ECONNREFUSED"));

        if (isRetryable) {
          const delay = getBackoffDelay(attempt);
          console.log(
            `[WooCommerce API] Retrying in ${delay}ms after error:`,
            error.message
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
      }

      // Non-retryable error or final attempt
      console.error("[WooCommerce Integration] Failed to create customer:", error);
      throw error;
    }
  }

  // All retries exhausted
  console.error(
    "[WooCommerce Integration] All retry attempts failed:",
    lastError
  );
  throw lastError || new Error("WooCommerce API unavailable after multiple retries");
}

/**
 * Get customer by email with retry logic
 */
export async function getWooCommerceCustomerByEmail(
  email: string
): Promise<WooCommerceCustomerResponse | null> {
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  const woocommerceUrl = process.env.WOOCOMMERCE_URL;

  if (!consumerKey || !consumerSecret || !woocommerceUrl) {
    throw new Error("WooCommerce credentials not configured");
  }

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );

  let lastError: any = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `[WooCommerce API] Fetching customer by email (attempt ${attempt}/${MAX_RETRIES})`
      );
      console.log("  Email:", email);

      const response = await fetchWithTimeout(
        `${woocommerceUrl}/wp-json/wc/v3/customers?search=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error(
          `[WooCommerce API Error] Status ${response.status} when fetching customer`
        );

        // Check if error is retryable
        if (isRetryableError(response.status, null) && attempt < MAX_RETRIES) {
          const delay = getBackoffDelay(attempt);
          console.log(
            `[WooCommerce API] Retrying in ${delay}ms after status ${response.status}`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          lastError = new Error(`HTTP ${response.status}`);
          continue;
        }

        throw new Error(`WooCommerce API error: ${response.status}`);
      }

      const customers = await response.json();
      console.log(
        `[WooCommerce API] Found ${customers.length} customer(s) for email: ${email}`
      );
      return customers.length > 0 ? customers[0] : null;
    } catch (error) {
      lastError = error;

      // Check if error is retryable
      if (attempt < MAX_RETRIES) {
        const isRetryable =
          error instanceof Error &&
          (error.name === "AbortError" ||
            error.message.includes("timeout") ||
            error.message.includes("ECONNREFUSED"));

        if (isRetryable) {
          const delay = getBackoffDelay(attempt);
          console.log(
            `[WooCommerce API] Retrying in ${delay}ms after error:`,
            error.message
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
      }

      // Non-retryable error or final attempt
      console.error("[WooCommerce Integration] Failed to get customer:", error);
      throw error;
    }
  }

  // All retries exhausted
  console.error(
    "[WooCommerce Integration] All retry attempts failed:",
    lastError
  );
  throw lastError || new Error("WooCommerce API unavailable after multiple retries");
}
