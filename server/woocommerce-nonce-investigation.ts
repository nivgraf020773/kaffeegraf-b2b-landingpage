/**
 * WooCommerce Nonce Enforcement Investigation
 * Tests various approaches to bypass nonce validation on POST requests
 */

export interface InvestigationResult {
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
 * Test 1: POST with Basic Auth (current failing approach)
 */
export async function testPostWithBasicAuth(): Promise<InvestigationResult> {
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

  const testCustomer = {
    email: `test-${Date.now()}@example.com`,
    first_name: "Test",
    last_name: "Customer",
  };

  console.log("\n[INVESTIGATION] Test 1: POST with Basic Auth");
  console.log("URL:", url);
  console.log("Headers:", { ...headers, Authorization: "Basic [REDACTED]" });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(testCustomer),
    });

    const body = await response.json();
    const result: InvestigationResult = {
      method: "POST with Basic Auth",
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
      method: "POST with Basic Auth",
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
 * Test 2: POST with Query String Auth (diagnostic)
 */
export async function testPostWithQueryStringAuth(): Promise<InvestigationResult> {
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

  const testCustomer = {
    email: `test-${Date.now()}@example.com`,
    first_name: "Test",
    last_name: "Customer",
  };

  console.log("\n[INVESTIGATION] Test 2: POST with Query String Auth");
  console.log("URL:", url.replace(consumerSecret, "[REDACTED]"));

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(testCustomer),
    });

    const body = await response.json();
    const result: InvestigationResult = {
      method: "POST with Query String Auth",
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
      method: "POST with Query String Auth",
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
 * Test 3: POST with Basic Auth + X-WP-Nonce header (various values)
 */
export async function testPostWithNonceHeader(
  nonceValue: string
): Promise<InvestigationResult> {
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
    "X-WP-Nonce": nonceValue,
  };

  const testCustomer = {
    email: `test-${Date.now()}@example.com`,
    first_name: "Test",
    last_name: "Customer",
  };

  console.log(
    `\n[INVESTIGATION] Test 3: POST with Basic Auth + X-WP-Nonce="${nonceValue}"`
  );

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(testCustomer),
    });

    const body = await response.json();
    const result: InvestigationResult = {
      method: `POST with Basic Auth + X-WP-Nonce="${nonceValue}"`,
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
      method: `POST with Basic Auth + X-WP-Nonce="${nonceValue}"`,
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
 * Test 4: POST with custom headers to bypass nonce check
 */
export async function testPostWithCustomHeaders(): Promise<InvestigationResult> {
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
    "X-Requested-With": "XMLHttpRequest", // Bypass some CSRF checks
    "X-WP-Nonce": "0", // Try with 0
  };

  const testCustomer = {
    email: `test-${Date.now()}@example.com`,
    first_name: "Test",
    last_name: "Customer",
  };

  console.log("\n[INVESTIGATION] Test 4: POST with Custom Headers");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(testCustomer),
    });

    const body = await response.json();
    const result: InvestigationResult = {
      method: "POST with Custom Headers (X-Requested-With, X-WP-Nonce=0)",
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
      method: "POST with Custom Headers",
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
 * Run all investigation tests
 */
export async function runNonceInvestigation(): Promise<InvestigationResult[]> {
  console.log("\n========================================");
  console.log("WooCommerce Nonce Enforcement Investigation");
  console.log("========================================");

  const results: InvestigationResult[] = [];

  try {
    results.push(await testPostWithBasicAuth());
  } catch (e) {
    console.error("Test 1 failed:", e);
  }

  try {
    results.push(await testPostWithQueryStringAuth());
  } catch (e) {
    console.error("Test 2 failed:", e);
  }

  try {
    results.push(await testPostWithNonceHeader(""));
  } catch (e) {
    console.error("Test 3a failed:", e);
  }

  try {
    results.push(await testPostWithNonceHeader("0"));
  } catch (e) {
    console.error("Test 3b failed:", e);
  }

  try {
    results.push(await testPostWithCustomHeaders());
  } catch (e) {
    console.error("Test 4 failed:", e);
  }

  console.log("\n========================================");
  console.log("Investigation Summary:");
  console.log("========================================");
  results.forEach((result, index) => {
    console.log(`\n[Test ${index + 1}] ${result.method}`);
    console.log(`Status: ${result.status} ${result.statusText}`);
    console.log(`Success: ${result.success}`);
    if (result.responseBody?.code) {
      console.log(`Error Code: ${result.responseBody.code}`);
    }
    if (result.error) {
      console.log(`Error: ${result.error}`);
    }
  });

  return results;
}
