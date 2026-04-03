/**
 * Rate Limiting Middleware
 * Protects against brute force and abuse
 */

import rateLimit, { ipKeyGenerator } from "express-rate-limit";

/**
 * Wrapper for ipKeyGenerator to use with express-rate-limit
 */
const getKeyGenerator = () => {
  return (req: any) => ipKeyGenerator(req.ip || "");
};

/**
 * Login rate limiter: 5 attempts per 15 minutes
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Zu viele Login-Versuche. Bitte versuchen Sie es später erneut.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for non-login requests
    return !req.path.includes("/api/trpc/b2b.login");
  },
  keyGenerator: getKeyGenerator(),
});

/**
 * Contact form rate limiter: 3 attempts per hour
 */
export const contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts
  message: "Zu viele Formular-Einreichungen. Bitte versuchen Sie es später erneut.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for non-contact requests
    return !req.path.includes("/api/trpc/contact.submit");
  },
  keyGenerator: getKeyGenerator(),
});

/**
 * B2B Access Request rate limiter: 3 attempts per hour
 */
export const b2bAccessLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts
  message: "Zu viele B2B-Anfragen. Bitte versuchen Sie es später erneut.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for non-b2b-access requests
    return !req.path.includes("/api/trpc/b2b.accessRequest");
  },
  keyGenerator: getKeyGenerator(),
});

/**
 * General API rate limiter: 100 requests per 15 minutes
 * Applied to all tRPC endpoints as a catch-all
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests
  message: "Zu viele Anfragen. Bitte versuchen Sie es später erneut.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getKeyGenerator(),
});
