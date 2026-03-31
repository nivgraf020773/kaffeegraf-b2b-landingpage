/**
 * WooCommerce REST API Diagnostic Tests
 * Tests various authentication methods to identify nonce issue root cause
 */

import { ENV } from "./_core/env";

export interface DiagnosticResult {
  method: string;
  url: string;
  headers: Record<string, string>;
  status: number;
  statusText: string;
  responseBody: any;
  success: boolean;
  error?: string;
}

/**
 * Test 1: Current implementation (Basic Auth in header)
 */
export async function testBasicAuthHeader(): Promise<DiagnosticResult> {
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  const woocommerceUrl = process.env.WOOCOMMERCE_URL;

  if (!consumerKey || !consumerSecret || !woocommerceUrl) {
    throw new Error("WooCommerce credentials not configured");
  }

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );
  const url = `${woocommerceUrl}/wp-json/wc/v3/customers`;
  const headers = {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
  };

  console.log("\n[DIAGNOSTIC] Test 1: Basic Auth Header");
  console.log("URL:", url);
  console.log("Headers:", { ...headers, Authorization: "Basic [REDACTED]" });

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const body = await response.json();
    const result: DiagnosticResult = {
      method: "Basic Auth Header (GET /customers)",
      url,
      headers,
      status: response.status,
      statusText: response.statusText,
      responseBody: body,
      success: response.ok,
    };

    console.log("Status:", response.status);
    console.log("Response:", body);
    return result;
  } catch (error) {
    return {
      method: "Basic Auth Header (GET /customers)",
      url,
      headers,
      status: 0,
      statusText: "Network Error",
      responseBody: null,
      success: false,
      error: String(error),
    };
  }
}

/**
 * Test 2: Query String Authentication (diagnostic only)
 */
export async function testQueryStringAuth(): Promise<DiagnosticResult> {
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  const woocommerceUrl = process.env.WOOCOMMERCE_URL;

  if (!consumerKey || !consumerSecret || !woocommerceUrl) {
    throw new Error("WooCommerce credentials not configured");
  }

  const url = `${woocommerceUrl}/wp-json/wc/v3/customers?consumer_key=${encodeURIComponent(
    consumerKey
  )}&consumer_secret=${encodeURIComponent(consumerSecret)}`;

  const headers = {
    "Content-Type": "application/json",
  };

  console.log("\n[DIAGNOSTIC] Test 2: Query String Auth");
  console.log("URL:", url.replace(consumerSecret, "[REDACTED]"));

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const body = await response.json();
    const result: DiagnosticResult = {
      method: "Query String Auth (GET /customers)",
      url,
      headers,
      status: response.status,
      statusText: response.statusText,
      responseBody: body,
      success: response.ok,
    };

    console.log("Status:", response.status);
    console.log("Response:", body);
    return result;
  } catch (error) {
    return {
      method: "Query String Auth (GET /customers)",
      url,
      headers,
      status: 0,
      statusText: "Network Error",
      responseBody: null,
      success: false,
      error: String(error),
    };
  }
}

/**
 * Test 3: Basic Auth with X-WP-Nonce header (empty nonce)
 */
export async function testBasicAuthWithEmptyNonce(): Promise<DiagnosticResult> {
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  const woocommerceUrl = process.env.WOOCOMMERCE_URL;

  if (!consumerKey || !consumerSecret || !woocommerceUrl) {
    throw new Error("WooCommerce credentials not configured");
  }

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );
  const url = `${woocommerceUrl}/wp-json/wc/v3/customers`;
  const headers = {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
    "X-WP-Nonce": "", // Empty nonce
  };

  console.log("\n[DIAGNOSTIC] Test 3: Basic Auth + Empty X-WP-Nonce");
  console.log("URL:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const body = await response.json();
    const result: DiagnosticResult = {
      method: "Basic Auth + Empty X-WP-Nonce (GET /customers)",
      url,
      headers,
      status: response.status,
      statusText: response.statusText,
      responseBody: body,
      success: response.ok,
    };

    console.log("Status:", response.status);
    console.log("Response:", body);
    return result;
  } catch (error) {
    return {
      method: "Basic Auth + Empty X-WP-Nonce (GET /customers)",
      url,
      headers,
      status: 0,
      statusText: "Network Error",
      responseBody: null,
      success: false,
      error: String(error),
    };
  }
}

/**
 * Test 4: Basic Auth with X-WP-Nonce header (value "0")
 */
export async function testBasicAuthWithZeroNonce(): Promise<DiagnosticResult> {
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  const woocommerceUrl = process.env.WOOCOMMERCE_URL;

  if (!consumerKey || !consumerSecret || !woocommerceUrl) {
    throw new Error("WooCommerce credentials not configured");
  }

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );
  const url = `${woocommerceUrl}/wp-json/wc/v3/customers`;
  const headers = {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
    "X-WP-Nonce": "0", // Nonce value "0"
  };

  console.log("\n[DIAGNOSTIC] Test 4: Basic Auth + X-WP-Nonce=0");
  console.log("URL:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const body = await response.json();
    const result: DiagnosticResult = {
      method: "Basic Auth + X-WP-Nonce=0 (GET /customers)",
      url,
      headers,
      status: response.status,
      statusText: response.statusText,
      responseBody: body,
      success: response.ok,
    };

    console.log("Status:", response.status);
    console.log("Response:", body);
    return result;
  } catch (error) {
    return {
      method: "Basic Auth + X-WP-Nonce=0 (GET /customers)",
      url,
      headers,
      status: 0,
      statusText: "Network Error",
      responseBody: null,
      success: false,
      error: String(error),
    };
  }
}

/**
 * Test 5: Check if GET works (to isolate POST-specific nonce issue)
 */
export async function testGetWithBasicAuth(): Promise<DiagnosticResult> {
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  const woocommerceUrl = process.env.WOOCOMMERCE_URL;

  if (!consumerKey || !consumerSecret || !woocommerceUrl) {
    throw new Error("WooCommerce credentials not configured");
  }

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );
  const url = `${woocommerceUrl}/wp-json/wc/v3/customers`;
  const headers = {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
  };

  console.log("\n[DIAGNOSTIC] Test 5: GET Request (should work)");
  console.log("URL:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const body = await response.json();
    const result: DiagnosticResult = {
      method: "GET /customers with Basic Auth",
      url,
      headers,
      status: response.status,
      statusText: response.statusText,
      responseBody: body,
      success: response.ok,
    };

    console.log("Status:", response.status);
    console.log("Response:", Array.isArray(body) ? `Array of ${body.length} customers` : body);
    return result;
  } catch (error) {
    return {
      method: "GET /customers with Basic Auth",
      url,
      headers,
      status: 0,
      statusText: "Network Error",
      responseBody: null,
      success: false,
      error: String(error),
    };
  }
}

/**
 * Run all diagnostic tests
 */
export async function runAllDiagnostics(): Promise<DiagnosticResult[]> {
  console.log("\n========================================");
  console.log("WooCommerce REST API Diagnostic Tests");
  console.log("========================================");

  const results: DiagnosticResult[] = [];

  try {
    results.push(await testBasicAuthHeader());
  } catch (e) {
    console.error("Test 1 failed:", e);
  }

  try {
    results.push(await testQueryStringAuth());
  } catch (e) {
    console.error("Test 2 failed:", e);
  }

  try {
    results.push(await testBasicAuthWithEmptyNonce());
  } catch (e) {
    console.error("Test 3 failed:", e);
  }

  try {
    results.push(await testBasicAuthWithZeroNonce());
  } catch (e) {
    console.error("Test 4 failed:", e);
  }

  try {
    results.push(await testGetWithBasicAuth());
  } catch (e) {
    console.error("Test 5 failed:", e);
  }

  console.log("\n========================================");
  console.log("Diagnostic Summary:");
  console.log("========================================");
  results.forEach((result, index) => {
    console.log(`\n[Test ${index + 1}] ${result.method}`);
    console.log(`Status: ${result.status} ${result.statusText}`);
    console.log(`Success: ${result.success}`);
    if (result.error) {
      console.log(`Error: ${result.error}`);
    }
  });

  return results;
}
