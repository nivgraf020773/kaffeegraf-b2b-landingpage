# kaffeegraf B2B Landing Page - TODO

## Phase 1: B2B Landing Page MVP (LIVE)

### Landing Page Sections
- [x] Navigation mit Logo und CTA Button
- [x] Hero Section mit Headline und Subheadline
- [x] USP Section (Unique Selling Points)
- [x] Sortiment Section
- [x] Verkostung Section
- [x] Beratung Section
- [x] Nachhaltigkeit Section
- [x] Testimonials Section
- [x] Kontakt Section
- [x] Footer

### Kontaktformular & Integration
- [x] Kontaktformular UI mit Validierung
- [x] Dropdown "Ich bin..." (Business Type)
- [x] Dropdown "Was ist dir wichtig?" (Priority)
- [x] Backend-Upgrade zu web-db-user
- [x] WooCommerce API Integration
- [x] Automatische Kundenerstellung in WooCommerce
- [x] Custom Fields für Dropdown-Daten (b2b_status, b2b_business_type, b2b_priority, b2b_message)
- [x] Email-Bestätigung an Benutzer
- [x] Email-Benachrichtigung an Team
- [x] Form Validation Tests
- [x] Success Message nach Formular-Submit

### UID/VAT Validation
- [x] UID/Steuernummer field in contact form
- [x] Format validation (ATU + 8 digits)
- [x] Backend UID validation
- [x] UID storage in WooCommerce
- [x] UID validation tests

### B2B Access Request Feature
- [x] "B2B-Zugang beantragen" button in Hero section
- [x] Renamed "B2B-Zugang" to "B2B Login"
- [x] B2BAccessRequestModal component
- [x] B2B access request form (company, name, email, phone, UID)
- [x] Backend b2b.accessRequest tRPC endpoint
- [x] UID validation in B2B access request
- [x] Success confirmation in modal
- [x] B2B access request tests

### Deployment
- [x] Projekt live auf Manus
- [x] Domain: kaffeegraf-l7t4bfip.manus.space
- [x] All tests passing (13/13)
- [x] Code committed to GitHub
- [x] Deploy to Hostinger production (b2b-app.kaffeegraf.coffee)
- [x] B2B Access Request feature tested in production

---

## Phase 2: B2B Dashboard & Bestellungsabwicklung (FUTURE)

### B2B Customer Portal
- [ ] React-basiertes B2B Dashboard
- [ ] Customer Login mit WooCommerce Integration
- [ ] Bestellhistorie anzeigen
- [ ] Neue Bestellungen aufgeben
- [ ] Rechnungen herunterladen
- [ ] Lieferstatus tracken
- [ ] Produktpreise & Lagerstände anzeigen
- [ ] Alte Bestellungen wiederholen

### WooCommerce API Integration
- [ ] Produkte abrufen (mit B2B Preisen)
- [ ] Lagerstände abrufen
- [ ] Bestellungen erstellen
- [ ] Bestellhistorie abrufen
- [ ] Rechnungen abrufen

### B2B Features
- [ ] Kundenspezifische Preise
- [ ] Mengenrabatte
- [ ] Zahlungsbedingungen
- [ ] Kundengruppen-Management

---

## Known Issues & Notes

- WooCommerce API erfordert gültige Session/Nonce für Customer-Erstellung
  - Im Test-Umfeld: nonce_error ist erwartet (validiert API-Sicherheit)
  - In Production: Funktioniert korrekt mit Backend-Session
  
- Email-Versand über Hostinger Mailserver konfiguriert
  - Credentials in Environment Variables gespeichert
  - Non-blocking: Formular funktioniert auch wenn Email fehlschlägt

---

## Architecture

```
Landing Page (React)
├── KontaktSection (Formular)
│   └── tRPC Mutation: contact.submit
│       ├── WooCommerce API: createWooCommerceCustomer
│       └── Email Service: sendContactConfirmationEmail
│
Backend (Express + tRPC)
├── server/routers.ts (API Procedures)
├── server/woocommerce.ts (WooCommerce Integration)
├── server/email.ts (Email Service)
└── server/contact.test.ts (Tests)

WooCommerce
└── B2B Customers (mit Custom Fields)
```

## Phase 1.5: Bug Fixes & Improvements (COMPLETE)

### Form Field Improvements
- [x] Split Name field into Vorname/Nachname in Kontaktformular
- [x] Split Name field into Vorname/Nachname in Verkostungsformular (same form)
- [x] Split Name field into Vorname/Nachname in B2B Access Request Modal
- [x] Update WooCommerce customer creation to use first_name/last_name correctly

### B2B Access Request Bug Fixes
- [x] Fix: B2B access request values not sent to WooCommerce (now integrated)
- [x] Implement WooCommerce customer creation in b2b.accessRequest endpoint
- [x] Store B2B request data in WooCommerce with proper custom fields

### Verkostungsformular Bug Fixes
- [x] Fix: UID not stored in WooCommerce from Verkostungsformular (already working)
- [x] Ensure UID is included in contact.submit mutation input
- [x] Verify UID is saved to WooCommerce meta_data

### Navigation & UX
- [x] Add anchor link (#kontakt) to "Verkostung anfragen" button (working)
- [x] Ensure smooth scroll to Verkostungsformular (working)



## Phase 1.6: Final Fixes & B2B Login Modal (COMPLETE)

### Quick Fixes
- [x] Fix "Jetzt Verkosten" button anchor link (scrollIntoView working)
- [x] Change email from team@kaffeegraf.coffee to b2b@kaffeegraf.coffee

### B2B Login Modal
- [x] Create B2BLoginModal component (with Email/Customer Number tabs)
- [x] Implement WooCommerce authentication (Email or Customer Number)
- [x] Add B2B Login button to Hero section (already exists)
- [x] Test login flow with real WooCommerce data (b2b.login endpoint)
- [x] Integrate with B2B-Dashboard auth mechanism (validateB2BCredentials)
- [x] Backend b2b-auth.ts with password validation
- [x] tRPC b2b.login endpoint
- [x] Hash-based modal navigation (#b2b-login)
- [x] All tests passing (13/13)


## Phase 1.7: Pre-Production Security & Reliability Checks

### Rate Limiting
- [ ] Implement rate limiting middleware for Express
- [ ] Rate limit: b2b.login (5 attempts/15min)
- [ ] Rate limit: contact.submit (3 attempts/hour)
- [ ] Rate limit: b2b.accessRequest (3 attempts/hour)
- [ ] Rate limit: auth endpoints (5 attempts/15min)
- [ ] Add rate limit headers to responses

### Secrets & Environment Validation
- [ ] Verify all PROD secrets in Hostinger
- [ ] Ensure no DEV secrets in PROD env
- [ ] Check .env.example doesn't contain real keys
- [ ] Verify .env is in .gitignore
- [ ] Validate WOOCOMMERCE_* keys are correct
- [ ] Validate EMAIL_* config (MAIL_HOST, MAIL_PORT, etc)
- [ ] Verify DATABASE_URL points to correct DB
- [ ] Ensure JWT_SECRET is strong and unique

### WooCommerce API Hardening
- [ ] Set request timeouts (5s for API calls)
- [ ] Implement exponential backoff retry (max 3 attempts)
- [ ] Only retry on 5xx/timeout, not 4xx
- [ ] Add comprehensive error logging
- [ ] Map WooCommerce error codes to user messages
- [ ] Handle 429 (rate limit) from WooCommerce
- [ ] Handle connection timeouts gracefully
- [ ] Test WooCommerce down scenario

### Edge Case Testing
- [ ] Test WooCommerce API down
- [ ] Test WooCommerce API slow (>10s response)
- [ ] Test database connection failure
- [ ] Test email service failure
- [ ] Test duplicate form submissions
- [ ] Test session expiration during form submit
- [ ] Test invalid/malformed inputs
- [ ] Test network interruption during API call

### Security Review
- [ ] Verify CSRF protection on state-changing requests
- [ ] Check for unescaped HTML rendering
- [ ] Verify no raw SQL queries
- [ ] Check for XSS vulnerabilities in user inputs
- [ ] Verify authentication on protected endpoints
- [ ] Check for sensitive data in logs
- [ ] Verify API keys not exposed in frontend

### Logging Setup
- [ ] Setup error logging for server errors
- [ ] Log all WooCommerce API errors
- [ ] Log authentication failures
- [ ] Log form submission errors
- [ ] Setup log rotation
- [ ] Ensure logs don't contain sensitive data
- [ ] Test log output in production

### Final Pre-Deployment
- [ ] Run all tests (should be 13/13 passing)
- [ ] Build production bundle
- [ ] Verify bundle size acceptable
- [ ] Test on staging/Hostinger
- [ ] Verify all features work end-to-end
- [ ] Check performance metrics
- [ ] Prepare deployment checklist
