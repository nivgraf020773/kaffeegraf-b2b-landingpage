# Environment Variables - Deployment Notes
**Version:** 306d5902  
**Date:** April 3, 2026  
**Purpose:** Production deployment to Hostinger

---

## 📋 STEP 1: INVENTORY & CONSISTENCY CHECK

### All Environment Variables Used in Code

| Variable | Type | Required? | Used In | Frontend Exposed? |
|----------|------|-----------|---------|------------------|
| `DATABASE_URL` | Backend Secret | ✅ YES | server/db.ts | ❌ NO |
| `JWT_SECRET` | Backend Secret | ✅ YES | server/_core/env.ts | ❌ NO |
| `VITE_APP_ID` | Backend Secret | ✅ YES | server/_core/env.ts | ⚠️ FRONTEND |
| `OAUTH_SERVER_URL` | Backend Secret | ✅ YES | server/_core/env.ts | ❌ NO |
| `VITE_OAUTH_PORTAL_URL` | Frontend Config | ✅ YES | client/const.ts | ✅ YES |
| `OWNER_OPEN_ID` | Backend Secret | ✅ YES | server/_core/env.ts | ❌ NO |
| `OWNER_NAME` | Backend Config | ✅ YES | server/_core/env.ts | ❌ NO |
| `BUILT_IN_FORGE_API_URL` | Backend Secret | ✅ YES | server/_core/env.ts | ❌ NO |
| `BUILT_IN_FORGE_API_KEY` | Backend Secret | ✅ YES | server/_core/env.ts | ❌ NO |
| `VITE_FRONTEND_FORGE_API_KEY` | Frontend Secret | ✅ YES | client/src/components/Map.tsx | ✅ YES |
| `VITE_FRONTEND_FORGE_API_URL` | Frontend Config | ✅ YES | client/src/components/Map.tsx | ✅ YES |
| `NODE_ENV` | System | ✅ YES | server/index.ts, server/_core/vite.ts | ❌ NO |
| `PORT` | System | ⚠️ OPTIONAL | server/index.ts, server/_core/index.ts | ❌ NO |
| `MAIL_HOST` | Backend Secret | ✅ YES | server/email.ts | ❌ NO |
| `MAIL_PORT` | Backend Config | ✅ YES | server/email.ts | ❌ NO |
| `MAIL_USER` | Backend Secret | ✅ YES | server/email.ts | ❌ NO |
| `MAIL_PASSWORD` | Backend Secret | ✅ YES | server/email.ts | ❌ NO |
| `MAIL_FROM` | Backend Config | ✅ YES | server/email.ts | ❌ NO |
| `WOOCOMMERCE_URL` | Backend Config | ✅ YES | server/b2b-auth.ts, server/woocommerce.ts | ❌ NO |
| `WOOCOMMERCE_CONSUMER_KEY` | Backend Secret | ✅ YES | server/b2b-auth.ts, server/woocommerce.ts | ❌ NO |
| `WOOCOMMERCE_CONSUMER_SECRET` | Backend Secret | ✅ YES | server/b2b-auth.ts, server/woocommerce.ts | ❌ NO |
| `VITE_GA_ID` | Frontend Config | ⚠️ OPTIONAL | client/src/components/CookieConsentBanner.tsx | ✅ YES |
| `VITE_META_PIXEL_ID` | Frontend Config | ⚠️ OPTIONAL | client/src/components/CookieConsentBanner.tsx | ✅ YES |
| `VIES_API_KEY` | Backend Secret | ⚠️ OPTIONAL | (VAT validation - not actively used) | ❌ NO |
| `VIES_API_KEY_ID` | Backend Secret | ⚠️ OPTIONAL | (VAT validation - not actively used) | ❌ NO |
| `VITE_ANALYTICS_ENDPOINT` | Frontend Config | ⚠️ OPTIONAL | (Analytics - not actively used) | ✅ YES |
| `VITE_ANALYTICS_WEBSITE_ID` | Frontend Config | ⚠️ OPTIONAL | (Analytics - not actively used) | ✅ YES |

---

## 🚨 CRITICAL FINDINGS

### 1. Mail Configuration Issue ⚠️
**Current Code (server/email.ts line 54):**
```javascript
const mailFrom = process.env.MAIL_FROM || "b2b@kaffeegraf.coffee";
```

**Problem:**
- `b2b@kaffeegraf.coffee` is only an **alias**, not a real mailbox
- SMTP login must use the **real mailbox**: `team@kaffeegraf.coffee`
- Sending FROM an alias while logging in as the real mailbox is technically valid but confusing

**Recommendation:**
- ✅ `MAIL_USER` = `team@kaffeegraf.coffee` (real mailbox for SMTP login)
- ✅ `MAIL_FROM` = `team@kaffeegraf.coffee` (send from real mailbox)
- ⚠️ If you want replies to go to the alias, add `REPLY_TO` header (currently not implemented)

**Action Required:**
- Confirm: Should `MAIL_FROM` be `team@kaffeegraf.coffee` instead of `b2b@kaffeegraf.coffee`?
- If yes: Update code to use `team@kaffeegraf.coffee` as default

---

### 2. WooCommerce Configuration
**Status:** ✅ Correctly configured
- `WOOCOMMERCE_URL` defaults to `https://kaffeegraf.coffee` (safe fallback)
- Consumer Key & Secret are required for API access
- All used consistently across server/b2b-auth.ts and server/woocommerce.ts

---

### 3. Optional/Unused Variables
**Status:** ⚠️ Not actively used but configured
- `VIES_API_KEY` & `VIES_API_KEY_ID` - VAT validation (imported but not called)
- `VITE_ANALYTICS_ENDPOINT` & `VITE_ANALYTICS_WEBSITE_ID` - Analytics (not used in code)

**Recommendation:** Keep configured for future use, but not required for current deployment

---

## 📋 STEP 2: MAIL RULES (APPLIED)

| Setting | Value | Reason |
|---------|-------|--------|
| `MAIL_HOST` | `smtp.hostinger.com` | Hostinger SMTP server |
| `MAIL_PORT` | `465` | SSL/TLS secure port |
| `MAIL_USER` | `team@kaffeegraf.coffee` | Real mailbox (not alias) |
| `MAIL_PASSWORD` | `<SET_THIS_IN_HOSTINGER>` | Hostinger email password |
| `MAIL_FROM` | `team@kaffeegraf.coffee` | Send from real mailbox |
| `secure` flag | `true` (auto-set when port=465) | SSL enabled in code |

**Important:** The code automatically sets `secure: true` when port is 465 (line 36 in server/email.ts)

---

## 🔒 STEP 3: FRONTEND-EXPOSED VARIABLES (Safe Check)

These variables are exposed to the browser (VITE_* prefix):

| Variable | Value Type | Risk Level | Used For |
|----------|-----------|-----------|----------|
| `VITE_APP_ID` | OAuth App ID | 🟡 MEDIUM | OAuth authentication (safe, public) |
| `VITE_OAUTH_PORTAL_URL` | URL | 🟢 LOW | Login portal link (public) |
| `VITE_FRONTEND_FORGE_API_KEY` | API Key | 🟡 MEDIUM | Manus API access (frontend-specific key) |
| `VITE_FRONTEND_FORGE_API_URL` | URL | 🟢 LOW | API endpoint (public) |
| `VITE_GA_ID` | Google Analytics ID | 🟢 LOW | Tracking (public) |
| `VITE_META_PIXEL_ID` | Meta Pixel ID | 🟢 LOW | Tracking (public) |
| `VITE_ANALYTICS_ENDPOINT` | URL | 🟢 LOW | Analytics endpoint (optional) |
| `VITE_ANALYTICS_WEBSITE_ID` | ID | 🟢 LOW | Analytics ID (optional) |

**Verdict:** ✅ All frontend-exposed variables are safe (no backend secrets exposed)

---

## ✅ STEP 4: HOSTINGER SAFETY CHECK

### Must Be Set in Hostinger Environment

| Variable | Priority | Value |
|----------|----------|-------|
| `DATABASE_URL` | 🔴 CRITICAL | `mysql://...` (from Manus) |
| `JWT_SECRET` | 🔴 CRITICAL | Secret key (from Manus) |
| `VITE_APP_ID` | 🔴 CRITICAL | Manus OAuth ID |
| `OAUTH_SERVER_URL` | 🔴 CRITICAL | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | 🔴 CRITICAL | Manus OAuth portal URL |
| `OWNER_OPEN_ID` | 🔴 CRITICAL | Your Manus owner ID |
| `OWNER_NAME` | 🔴 CRITICAL | Your name |
| `BUILT_IN_FORGE_API_URL` | 🔴 CRITICAL | Manus Forge API URL |
| `BUILT_IN_FORGE_API_KEY` | 🔴 CRITICAL | Manus Forge API key |
| `VITE_FRONTEND_FORGE_API_KEY` | 🔴 CRITICAL | Frontend Forge key |
| `VITE_FRONTEND_FORGE_API_URL` | 🔴 CRITICAL | Frontend Forge URL |
| `MAIL_HOST` | 🔴 CRITICAL | `smtp.hostinger.com` |
| `MAIL_PORT` | 🔴 CRITICAL | `465` |
| `MAIL_USER` | 🔴 CRITICAL | `team@kaffeegraf.coffee` |
| `MAIL_PASSWORD` | 🔴 CRITICAL | Your email password |
| `MAIL_FROM` | 🔴 CRITICAL | `team@kaffeegraf.coffee` |
| `WOOCOMMERCE_URL` | 🟡 IMPORTANT | `https://kaffeegraf.coffee` |
| `WOOCOMMERCE_CONSUMER_KEY` | 🟡 IMPORTANT | WooCommerce API key |
| `WOOCOMMERCE_CONSUMER_SECRET` | 🟡 IMPORTANT | WooCommerce API secret |
| `VITE_GA_ID` | 🟢 OPTIONAL | Google Analytics ID (if using) |
| `VITE_META_PIXEL_ID` | 🟢 OPTIONAL | Meta Pixel ID (if using) |
| `NODE_ENV` | 🟡 IMPORTANT | `production` |
| `PORT` | 🟢 OPTIONAL | `3000` (default) |

### Variables That Must NEVER Be Exposed

- ❌ `DATABASE_URL` - Backend only
- ❌ `JWT_SECRET` - Backend only
- ❌ `MAIL_PASSWORD` - Backend only
- ❌ `WOOCOMMERCE_CONSUMER_SECRET` - Backend only
- ❌ `BUILT_IN_FORGE_API_KEY` - Backend only
- ❌ `VIES_API_KEY` - Backend only

**Verdict:** ✅ Code correctly keeps secrets backend-only

---

## 🔍 STEP 5: FINAL VALIDATION REPORT

### Required Variables - Status

| Variable | Status | Notes |
|----------|--------|-------|
| `DATABASE_URL` | ✅ CONFIRMED | Used in server/db.ts |
| `JWT_SECRET` | ✅ CONFIRMED | Used in server/_core/env.ts |
| `VITE_APP_ID` | ✅ CONFIRMED | Used in OAuth flow |
| `OAUTH_SERVER_URL` | ✅ CONFIRMED | Manus OAuth endpoint |
| `VITE_OAUTH_PORTAL_URL` | ✅ CONFIRMED | Login portal |
| `OWNER_OPEN_ID` | ✅ CONFIRMED | Owner identity |
| `OWNER_NAME` | ✅ CONFIRMED | Display name |
| `BUILT_IN_FORGE_API_URL` | ✅ CONFIRMED | Manus API endpoint |
| `BUILT_IN_FORGE_API_KEY` | ✅ CONFIRMED | Manus API auth |
| `VITE_FRONTEND_FORGE_API_KEY` | ✅ CONFIRMED | Frontend API auth |
| `VITE_FRONTEND_FORGE_API_URL` | ✅ CONFIRMED | Frontend API endpoint |
| `MAIL_HOST` | ✅ CONFIRMED | SMTP server |
| `MAIL_PORT` | ✅ CONFIRMED | SMTP port (465 for SSL) |
| `MAIL_USER` | ✅ CONFIRMED | SMTP login |
| `MAIL_PASSWORD` | ✅ CONFIRMED | SMTP password |
| `MAIL_FROM` | ✅ CONFIRMED | Sender email |
| `WOOCOMMERCE_URL` | ✅ CONFIRMED | WooCommerce endpoint |
| `WOOCOMMERCE_CONSUMER_KEY` | ✅ CONFIRMED | WooCommerce API key |
| `WOOCOMMERCE_CONSUMER_SECRET` | ✅ CONFIRMED | WooCommerce API secret |

### Optional Variables - Status

| Variable | Status | Notes |
|----------|--------|-------|
| `VITE_GA_ID` | ⚠️ OPTIONAL | Google Analytics (if enabled) |
| `VITE_META_PIXEL_ID` | ⚠️ OPTIONAL | Meta Pixel (if enabled) |
| `VIES_API_KEY` | ⚠️ OPTIONAL | VAT validation (not actively used) |
| `VIES_API_KEY_ID` | ⚠️ OPTIONAL | VAT validation (not actively used) |
| `VITE_ANALYTICS_ENDPOINT` | ⚠️ OPTIONAL | Custom analytics (not used) |
| `VITE_ANALYTICS_WEBSITE_ID` | ⚠️ OPTIONAL | Custom analytics (not used) |
| `PORT` | ⚠️ OPTIONAL | Defaults to 3000 |

### Suspicious Variables - None Found ✅

All variables are either:
- Used in code ✅
- Properly scoped (backend/frontend) ✅
- Correctly typed (secrets vs config) ✅

### Frontend-Exposed Variables - All Safe ✅

No backend secrets are exposed to the frontend.

### Backend-Only Secrets - All Protected ✅

All sensitive data is backend-only:
- Database credentials
- API keys
- Email passwords
- OAuth secrets

### Mail Configuration Verdict

**⚠️ ACTION REQUIRED:**

Current code defaults `MAIL_FROM` to `b2b@kaffeegraf.coffee` (alias), but SMTP login uses `team@kaffeegraf.coffee` (real mailbox).

**Recommendation:**
1. **Option A (Recommended):** Change default `MAIL_FROM` to `team@kaffeegraf.coffee`
   - Code: Line 54 in server/email.ts
   - Change: `"b2b@kaffeegraf.coffee"` → `"team@kaffeegraf.coffee"`
   - Reason: Consistency - send from the same mailbox you're logging in with

2. **Option B:** Keep current setup
   - Works technically (alias can send from real mailbox)
   - But confusing for users who see `team@` in their inbox

**Which option do you prefer?**

---

## 🚀 Ready for Hostinger?

### Overall Status: ⚠️ CONDITIONAL

**Blockers:**
1. ⚠️ Mail configuration needs clarification (Option A or B above?)

**If blocker resolved:** ✅ YES, ready for production

**Checklist before deployment:**
- [ ] All CRITICAL variables set in Hostinger
- [ ] Mail configuration decision made (Option A or B)
- [ ] If Option A: Update server/email.ts line 54
- [ ] If Option B: Confirm current setup is acceptable
- [ ] WOOCOMMERCE credentials verified
- [ ] Google Analytics ID set (if using)
- [ ] Meta Pixel ID set (if using)
- [ ] Database connection tested
- [ ] Email test sent successfully

---

## 📝 Summary

| Aspect | Status |
|--------|--------|
| Required variables | ✅ All identified |
| Optional variables | ✅ Documented |
| Suspicious variables | ✅ None found |
| Frontend secrets exposed | ✅ None |
| Backend secrets protected | ✅ Yes |
| Mail configuration | ⚠️ Needs decision |
| Code consistency | ✅ Good |
| Production readiness | ⚠️ Conditional (awaiting mail decision) |

---

**Next Step:** Confirm mail configuration preference (Option A or B), then deployment can proceed.
