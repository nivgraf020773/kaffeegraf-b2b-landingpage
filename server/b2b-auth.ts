import axios from "axios";
import crypto from "crypto";

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL || "https://kaffeegraf.coffee";
const WOOCOMMERCE_CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
const WOOCOMMERCE_CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

interface WooCommerceCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  meta_data?: Array<{ key: string; value: string }>;
}

/**
 * Validate B2B credentials against WooCommerce
 * Accepts either email or customer number (stored in meta_data)
 */
export async function validateB2BCredentials(
  identifier: string,
  password: string,
  type: "email" | "customerNumber"
): Promise<WooCommerceCustomer | null> {
  try {
    // First, find the customer
    let customer: WooCommerceCustomer | null = null;

    if (type === "email") {
      // Search by email
      const response = await axios.get(
        `${WOOCOMMERCE_URL}/wp-json/wc/v3/customers`,
        {
          params: {
            email: identifier,
            per_page: 1,
          },
          auth: {
            username: WOOCOMMERCE_CONSUMER_KEY,
            password: WOOCOMMERCE_CONSUMER_SECRET,
          },
        }
      );

      if (response.data && response.data.length > 0) {
        customer = response.data[0];
      }
    } else {
      // Search by customer number in meta_data
      const response = await axios.get(
        `${WOOCOMMERCE_URL}/wp-json/wc/v3/customers`,
        {
          params: {
            per_page: 100, // Get more customers to search through
          },
          auth: {
            username: WOOCOMMERCE_CONSUMER_KEY,
            password: WOOCOMMERCE_CONSUMER_SECRET,
          },
        }
      );

      // Find customer with matching b2b_customer_number
      customer = response.data.find((c: WooCommerceCustomer) => {
        const customerNumber = c.meta_data?.find(
          (m) => m.key === "b2b_customer_number"
        )?.value;
        return customerNumber === identifier;
      });
    }

    if (!customer) {
      console.log(`Customer not found: ${identifier}`);
      return null;
    }

    // Validate password
    const isPasswordValid = await validateWooCommercePassword(
      customer.id,
      password
    );

    if (!isPasswordValid) {
      console.log(`Invalid password for customer: ${customer.id}`);
      return null;
    }

    return customer;
  } catch (error) {
    console.error("Error validating B2B credentials:", error);
    return null;
  }
}

/**
 * Validate password against WooCommerce customer
 * This uses WooCommerce REST API authentication check
 */
async function validateWooCommercePassword(
  customerId: number,
  password: string
): Promise<boolean> {
  try {
    // Get customer data
    const response = await axios.get(
      `${WOOCOMMERCE_URL}/wp-json/wc/v3/customers/${customerId}`,
      {
        auth: {
          username: WOOCOMMERCE_CONSUMER_KEY,
          password: WOOCOMMERCE_CONSUMER_SECRET,
        },
      }
    );

    if (!response.data) {
      return false;
    }

    // Get stored password hash from meta_data
    const passwordHash = response.data.meta_data?.find(
      (m: any) => m.key === "b2b_password_hash"
    )?.value;

    if (!passwordHash) {
      // If no password hash stored, check against WordPress user
      return await validateWordPressPassword(response.data.email, password);
    }

    // Compare password with stored hash
    return comparePasswordHash(password, passwordHash);
  } catch (error) {
    console.error("Error validating password:", error);
    return false;
  }
}

/**
 * Validate password against WordPress user
 * This attempts to authenticate via WordPress REST API
 */
async function validateWordPressPassword(
  email: string,
  password: string
): Promise<boolean> {
  try {
    // Use kg-b2b/v1/auth endpoint (the active auth endpoint on this WordPress instance)
    // This endpoint accepts { email, password } and returns { user_id, email, ... } on success
    const response = await axios.post(
      `${WOOCOMMERCE_URL}/wp-json/kg-b2b/v1/auth`,
      {
        email: email,
        password: password,
      }
    );

    // Success if we get a user_id back
    return !!(response.data && response.data.user_id);
  } catch (error: any) {
    // 401 = invalid credentials (expected for wrong password)
    if (error?.response?.status === 401) {
      return false;
    }
    console.error("WordPress auth error:", error?.response?.status, error?.response?.data?.code);
    return false;
  }
}

/**
 * Compare password with hash
 * Simple bcrypt-like comparison (in production, use bcrypt library)
 */
function comparePasswordHash(password: string, hash: string): boolean {
  try {
    // This is a simplified version - in production, use bcrypt.compare()
    // For now, we'll do a simple hash comparison
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    return hashedPassword === hash;
  } catch (error) {
    console.error("Error comparing password hash:", error);
    return false;
  }
}

/**
 * Generate session token for B2B customer
 */
export function generateSessionToken(customerId: number): string {
  const payload = {
    customerId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  };

  // In production, use proper JWT signing with secret
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

/**
 * Hash password for storage
 */
export function hashPassword(password: string): string {
  // In production, use bcrypt.hash()
  return crypto.createHash("sha256").update(password).digest("hex");
}
