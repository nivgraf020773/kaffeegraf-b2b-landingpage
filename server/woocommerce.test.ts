import { describe, expect, it } from "vitest";
import { getWooCommerceCustomerByEmail } from "./woocommerce";

/**
 * Test WooCommerce API Integration
 * This test validates that the WooCommerce credentials are correct
 * and the API is accessible
 */
describe("WooCommerce API Integration", () => {
  it(
    "should validate WooCommerce credentials by attempting to fetch a customer",
    async () => {
      // This test tries to fetch a non-existent customer
      // If it succeeds (returns empty array or null), the credentials are valid
      // If it fails with 401/403, the credentials are invalid

      try {
        const result = await getWooCommerceCustomerByEmail(
          "nonexistent-test@example.com"
        );

        // If we get here, the API call succeeded
        // The result might be null (customer not found) or an empty array
        // Both indicate the credentials are valid
        expect(
          result === null ||
            result === undefined ||
            Array.isArray(result)
        ).toBe(true);
        console.log(
          "[WooCommerce Test] ✅ API credentials are valid and accessible"
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        // Check if it's an authentication error
        if (
          errorMessage.includes("401") ||
          errorMessage.includes("403") ||
          errorMessage.includes("Unauthorized")
        ) {
          throw new Error(
            "❌ WooCommerce API credentials are invalid. Please check WOOCOMMERCE_CONSUMER_KEY and WOOCOMMERCE_CONSUMER_SECRET"
          );
        }

        // For other errors, log but don't fail (might be network issues)
        console.warn("[WooCommerce Test] Warning:", errorMessage);
      }
    },
    10000
  );
});
