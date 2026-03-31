/**
 * WooCommerce REST API Integration
 * Handles all communication with WooCommerce for B2B customer management
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
  };
  meta_data?: Array<{
    id: number;
    key: string;
    value: string;
  }>;
}

/**
 * Create a new customer in WooCommerce
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

  try {
    const response = await fetch(
      `${woocommerceUrl}/wp-json/wc/v3/customers`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[WooCommerce API Error]", errorData);
      throw new Error(
        `WooCommerce API error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const customer = await response.json();
    return customer;
  } catch (error) {
    console.error("[WooCommerce Integration] Failed to create customer:", error);
    throw error;
  }
}

/**
 * Get customer by email
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

  try {
    const response = await fetch(
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
      throw new Error(`WooCommerce API error: ${response.status}`);
    }

    const customers = await response.json();
    return customers.length > 0 ? customers[0] : null;
  } catch (error) {
    console.error("[WooCommerce Integration] Failed to get customer:", error);
    throw error;
  }
}
