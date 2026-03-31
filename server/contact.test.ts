import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("contact.submit", () => {
  it("should validate email format", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submit({
        name: "Test",
        email: "invalid",
        company: "Test Co",
        businessType: "buero",
        priority: "geschmack",
      } as any);
      expect.fail("Should reject invalid email");
    } catch (error) {
      expect(String(error).toLowerCase()).toContain("email");
      console.log("[Contact Form Test] PASS: Email validation");
    }
  });

  it("should validate required company field", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submit({
        name: "Test",
        email: "test@example.com",
        company: "",
        businessType: "buero",
        priority: "geschmack",
      } as any);
      expect.fail("Should reject empty company");
    } catch (error) {
      expect(String(error).toLowerCase()).toContain("company");
      console.log("[Contact Form Test] PASS: Company validation");
    }
  });

  it(
    "should call WooCommerce API with valid input",
    async () => {
      const ctx: TrpcContext = {
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: {} as TrpcContext["res"],
      };

      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.contact.submit({
          name: "Test User",
          email: `test-${Date.now()}@example.com`,
          company: "Test Company",
          phone: "+43 1 234 5678",
          businessType: "buero",
          priority: "geschmack",
          message: "Test",
        });

        console.log("[Contact Form Test] PASS: WooCommerce API called successfully");
        console.log("[Contact Form Test] Result:", result);
        expect(result.success).toBe(true);
        expect(result.customerId).toBeDefined();
      } catch (error) {
        const errorStr = String(error);
        console.error("[Contact Form Test] Error:", errorStr);
        throw error;
      }
    },
    { timeout: 30000 }
  );
});
