# Checkpoint Notes — kaffeegraf B2B Landing Page
**Date:** 2026-04-05  
**Version:** 81d0f5e3 (Manus checkpoint)  
**Branch:** main  

---

## ✅ Completed in This Checkpoint

### 1. SMTP Authentication Fix (Phase 4.2)
- **Root Cause:** LiteSpeed Web Server escapes `%` → `\%` when injecting ENV variables into the Node.js process. The old SMTP password `BY^27vEm8Ed%fULAfPnC` was received as `BY^27vEm8Ed\%fULAfPnC` by nodemailer → `535 5.7.8 authentication failed`.
- **Fix:** New SMTP password without `%` characters (`36BT1qYj-4qfw1M6jHA`) set directly in hPanel Node.js Environment Variables interface.
- **Verified:** `transporter.verify()` succeeds on both port 465 (SSL) and 587 (STARTTLS).
- **E2E:** Full email flow confirmed — customer confirmation + owner notification delivered to Mailinator test inbox.

### 2. BCC to support@kaffeegraf.coffee (Phase 4.1)
- `BCC_INTERNAL = "support@kaffeegraf.coffee"` added to all outgoing emails.
- Applies to: customer confirmation email + owner notification email.
- BCC is **not** redirected by `MAIL_TEST_MODE` — always goes to the real mailbox.
- **Verified:** 2 emails received directly in `support@kaffeegraf.coffee` mailbox (confirmed by operator).
- Note: `team@kaffeegraf.coffee` was tested first and failed to receive BCC — `support@` is the correct and permanent BCC address.

### 3. Release Readiness Cleanup (Phase 4.3)

#### Frontend (`client/src/components/KontaktSection.tsx`)
Removed:
- `<div>DEBUG VERSION 1</div>` — visible debug label
- `console.log("[KontaktSection] Component render")`
- `useEffect` with `formData changed` debug log
- `useEffect` with native `form.addEventListener('submit', ...)` debug listener
- All `console.log` calls in `handleChange` and `handleSubmit`
- `onClick={() => console.log('submit button clicked')}` on submit button
- Unused `useEffect` import

Kept: `console.error("[KontaktSection] Mutation error:", error)` — legitimate error handling.

#### Backend (`server/routers.ts`)
Removed:
- `diagnostic` router block (19 lines) from `appRouter`
- Imports: `runAllDiagnostics`, `runNonceInvestigation`, `runSMTPDiagnostics`

Result: `/api/trpc/diagnostic.*` endpoints are **no longer publicly reachable**.  
Bundle size reduced: **65.6 kb → 46.4 kb**

Retained (not in bundle, not registered):
- `server/woocommerce-diagnostic.ts`
- `server/smtp-diagnostic.ts`
- `server/woocommerce-nonce-investigation.ts`

### 4. UID / VAT Persistence Fix (Phase 4.4)
- **Root Cause:** `billing.vat_id` was missing from the WooCommerce customer creation payload. UID was only stored in `meta_data.vat_id` (not visible in WooCommerce admin UI).
- **Fix:** Added `billing.vat_id: input.uid` to the payload in `server/routers.ts` (contact.submit procedure).
- Also added: `meta_data.billing_vat_id` and `meta_data.shipping_vat_id` for plugin compatibility.
- Extended `WooCommerceCustomer` interface in `server/woocommerce.ts` to include `billing.vat_id`.
- **Verified:** Customer 180 (`ATU99887766`) shows USt.-ID correctly in WooCommerce admin user edit page.
- **Scope:** Applies to all new customers. Existing customers without `billing.vat_id` require manual update.

---

## 🔴 Open / Remaining Work

### Immediate Next Step
- **Admin visibility for B2B meta states:** Operator needs to see `b2b_status`, `b2b_business_type`, `b2b_priority` etc. in WooCommerce admin without command line access.

### Production Readiness
- `MAIL_TEST_MODE=false` must be set in hPanel for production email delivery to real recipients.
- Phase 1.7 Security Hardening (not started):
  - Rate limiting (b2b.login: 5/15min, contact.submit: 3/hour)
  - WooCommerce API timeouts + retry logic
  - Security review (CSRF, XSS, sensitive data in logs)

### Legal / GDPR
- Phase 3 Step B: Cookie Consent Banner (not started)
  - Block Meta Pixel and Google Analytics until consent
  - Persist consent state in localStorage

### B2B Dashboard (Phase 2 — future)
- React-based B2B customer portal
- WooCommerce order history, new orders, invoices

---

## 🔧 Build Status

| Check | Result |
|---|---|
| `pnpm build` | ✅ Clean (46.7 kb server bundle, 875.92 kb client bundle) |
| `npx tsc --noEmit` | ✅ No errors |
| Deployed to Hostinger | ✅ `b2b-app.kaffeegraf.coffee` |

---

## 📁 Key Files Modified in This Checkpoint

| File | Change |
|---|---|
| `server/email.ts` | BCC_INTERNAL = support@kaffeegraf.coffee |
| `server/routers.ts` | Removed diagnostic router; added billing.vat_id to customer payload |
| `server/woocommerce.ts` | Added vat_id to WooCommerceCustomer billing interface |
| `client/src/components/KontaktSection.tsx` | Removed all debug artifacts |
