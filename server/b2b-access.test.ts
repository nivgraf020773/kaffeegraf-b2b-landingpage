import { describe, it, expect } from "vitest";
import { processB2BAccessRequest, B2BAccessRequestSchema } from "./b2b-access";

describe("B2B Access Request", () => {
  it("should validate valid B2B access request", async () => {
    const validRequest = {
      companyName: "Test Company GmbH",
      name: "Max Mustermann",
      email: "max@example.com",
      phone: "+43 1 234 56789",
      uid: "ATU12345678",
    };

    const result = await processB2BAccessRequest(validRequest);
    expect(result.success).toBe(true);
    expect(result.requestId).toBeDefined();
    expect(result.message).toContain("erfolgreich");
  });

  it("should reject invalid UID format", async () => {
    const invalidRequest = {
      companyName: "Test Company GmbH",
      name: "Max Mustermann",
      email: "max@example.com",
      uid: "INVALID123", // Invalid format
    };

    const result = await processB2BAccessRequest(invalidRequest as any);
    expect(result.success).toBe(false);
    expect(result.message).toContain("ATU");
  });

  it("should reject invalid email", async () => {
    const invalidRequest = {
      companyName: "Test Company GmbH",
      name: "Max Mustermann",
      email: "not-an-email",
      uid: "ATU12345678",
    };

    const result = await processB2BAccessRequest(invalidRequest as any);
    expect(result.success).toBe(false);
    expect(result.message).toContain("E-Mail");
  });

  it("should reject missing required fields", async () => {
    const incompleteRequest = {
      companyName: "Test Company GmbH",
      email: "max@example.com",
      // missing name and uid
    };

    const result = await processB2BAccessRequest(incompleteRequest as any);
    expect(result.success).toBe(false);
  });

  it("should validate schema with Zod", () => {
    const validData = {
      companyName: "Test Company",
      name: "John Doe",
      email: "john@example.com",
      uid: "ATU12345678",
    };

    const validation = B2BAccessRequestSchema.safeParse(validData);
    expect(validation.success).toBe(true);
  });

  it("should reject schema with invalid UID", () => {
    const invalidData = {
      companyName: "Test Company",
      name: "John Doe",
      email: "john@example.com",
      uid: "ATU1234567", // Only 7 digits instead of 8
    };

    const validation = B2BAccessRequestSchema.safeParse(invalidData);
    expect(validation.success).toBe(false);
  });
});
