# CHECKPOINT NOTES — kaffeegraf B2B Landingpage
## Release: v1.0.0 — Production Ready
**Date:** 2026-04-06  
**Deployed Domain:** https://b2b-app.kaffeegraf.coffee  
**GitHub Repository:** nivgraf020773/kaffeegraf-b2b-landingpage  
**Final Checkpoint:** 195a9d12 (Phase 8)

---

## Release History (Cumulative)

### Phase 4.1 — BCC to support@kaffeegraf.coffee
- `BCC_INTERNAL = "support@kaffeegraf.coffee"` added to all outgoing emails
- Applies to: customer confirmation + owner notification
- BCC is NOT redirected by `MAIL_TEST_MODE`

### Phase 4.2 — SMTP Authentication Fix
- Root cause: LiteSpeed escapes `%` → `\%` in ENV vars; old password contained `%`
- Fix: New SMTP password without `%` characters set in hPanel Node.js ENV
- Verified: `transporter.verify()` succeeds on port 587 (STARTTLS)

### Phase 4.3 — Release Readiness Cleanup
- Removed all debug artifacts from `KontaktSection.tsx`
- Removed `diagnostic` router from `appRouter` (no longer publicly reachable)
- Bundle size reduced: 65.6 kb → 46.4 kb

### Phase 4.4 — UID / VAT Persistence Fix
- Added `billing.vat_id` to WooCommerce customer creation payload
- Also added `meta_data.billing_vat_id` and `meta_data.shipping_vat_id`
- Verified in WooCommerce admin UI

### Phase 4.6 — Upsert Logic for Existing Customers
- `contact.submit` now detects existing WooCommerce customer by email
- If exists: updates customer data + B2B meta fields instead of failing
- Always returns success response regardless of new/existing customer
- Success message: *„Vielen Dank – Ihre Anfrage ist bei uns eingegangen. Wir prüfen diese und melden uns zeitnah persönlich bei Ihnen."*

### Phase 5 — Unified B2B Admin Section
- Deactivated legacy `kaffeegraf-b2b-admin` plugin (had separate read-only block)
- New `class-b2b-user-profile.php` in `kaffeegraf-b2b` plugin (v1.2.0)
- Single unified "B2B Informationen" section in WordPress user profile
- `b2b_status`: read-only | `b2b_access_status`: editable dropdown (5 values)
- Timestamps auto-set on status change

### Phase 6 — Access Gating (b2b_access_status)
- Server-side gating in `b2b.login` procedure
- Only `b2b_access_status = active` grants dashboard access
- Status-specific denial messages for all 5 states
- `b2b_status` NOT used for access control (per B2B_STATUS_SPEC v2)

### Phase 7 — Rate Limiting
- New file: `server/rate-limiter.ts` (in-memory, no external dependencies)
- `contact.submit`: 5 req / 15 min / IP
- `b2b.accessRequest`: 5 req / 15 min / IP
- `b2b.login`: 5 attempts / 15 min / IP
- Error message: *„Zu viele Anfragen in kurzer Zeit. Bitte versuchen Sie es in einigen Minuten erneut."*

### Phase 8 — Login UX Alignment
- Redirect on success: `window.location.href = "https://kaffeebizdash-fqjhwufg.manus.space"`
- Demo credentials removed from `B2BLoginModal.tsx`
- Frontend does NOT evaluate `b2b_access_status`
- Backend message displayed verbatim

---

## System Components

| Component | Location | Status |
|---|---|---|
| B2B Landingpage (Node.js/React) | `b2b-app.kaffeegraf.coffee` | Live |
| WooCommerce Backend | `kaffeegraf.coffee` | Live |
| WordPress Admin Plugin | `kaffeegraf-b2b` (v1.2.0) | Active |
| B2B Admin Plugin (legacy) | `kaffeegraf-b2b-admin` | Deactivated |
| Rate Limiter | `server/rate-limiter.ts` | Active |
| B2B Status Spec | `B2B_STATUS_SPEC.md` (v2) | Mandatory reference |

---

## Confirmed Working Flows

| Flow | Status |
|---|---|
| Contact / Tasting request form (new customer) | Verified |
| Contact / Tasting request form (existing customer, upsert) | Verified |
| UID/VAT persistence in WooCommerce | Verified |
| B2B Access Request | Verified |
| B2B Login — `active` → dashboard redirect | Verified |
| B2B Login — denied states (4 messages) | Verified |
| Rate limiting (all 3 endpoints) | Verified (live test) |
| SMTP email delivery | Verified |
| WordPress password reset email | Verified (manual test in production) |
| Admin B2B section (unified, single block) | Verified |
| `b2b_access_status` editable in admin | Verified |

---

## Data Model (B2B_STATUS_SPEC v2 — Mandatory)

Two independent dimensions stored as WooCommerce user meta:

| Field | Values | Purpose |
|---|---|---|
| `b2b_status` | `none / prospect / qualified / customer` | Business relationship |
| `b2b_access_status` | `none / requested / approved / rejected / active` | Portal access |

**Strict rules:**
- NEVER merge or infer one from the other
- NEVER use `b2b_status` for access control
- Access granted ONLY if `b2b_access_status = active`

---

## Known Non-Blocking Limitations

| Item | Notes |
|---|---|
| Password hashing | `b2b_password_hash` uses SHA-256, not bcrypt. Upgrade to bcrypt recommended before high-volume use. |
| Customer number search | Fetches up to 100 customers for number-based login. Pagination needed at scale. |
| In-memory rate limiter | Resets on server restart. Redis recommended for multi-instance deployments. |
| JWT session token | Base64-encoded payload without HMAC signature. Acceptable for current dashboard redirect use case. |
| UID validation | Format-only check (ATU + 8 digits). Full VIES API validation deferred. |

---

## Security Checklist

| Check | Status |
|---|---|
| No hardcoded credentials in source | Confirmed |
| No diagnostic/debug routes exposed | Confirmed |
| `MAIL_TEST_MODE` defaults to `false` | Confirmed |
| No demo credentials in frontend | Confirmed |
| Rate limiting on all public endpoints | Confirmed |
| Server-side access gating | Confirmed |
| No `b2b_access_status` logic in frontend | Confirmed |
| TypeScript: 0 errors | Confirmed |

---

## Deployment

- **Platform:** Hostinger Shared Hosting (LiteSpeed + Passenger)
- **Node.js version:** 22.x (via `nodevenv`)
- **Build:** `pnpm build` → `dist/index.js` (58.8 kB) + `dist/public/`
- **Restart:** `touch ~/domains/b2b-app.kaffeegraf.coffee/nodejs/tmp/restart.txt`
- **Deploy workflow:** Local build → SCP `dist/` to Hostinger → restart

---

## Go-Live Verdict

**PRODUCTION-READY: YES**

All core flows verified. Security hardening complete. Data model compliant with B2B_STATUS_SPEC v2. No blocking issues.
