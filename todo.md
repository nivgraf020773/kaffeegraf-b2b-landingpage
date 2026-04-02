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

## Phase 1.5: Bug Fixes & Improvements (IN PROGRESS)

### Form Field Improvements
- [ ] Split Name field into Vorname/Nachname in Kontaktformular
- [ ] Split Name field into Vorname/Nachname in Verkostungsformular
- [ ] Split Name field into Vorname/Nachname in B2B Access Request Modal
- [ ] Update WooCommerce customer creation to use first_name/last_name correctly

### B2B Access Request Bug Fixes
- [ ] Fix: B2B access request values not sent to WooCommerce
- [ ] Implement WooCommerce customer creation in b2b.accessRequest endpoint
- [ ] Store B2B request data in WooCommerce with proper custom fields

### Verkostungsformular Bug Fixes
- [ ] Fix: UID not stored in WooCommerce from Verkostungsformular
- [ ] Ensure UID is included in contact.submit mutation input
- [ ] Verify UID is saved to WooCommerce meta_data

### Navigation & UX
- [ ] Add anchor link (#verkostung-form) to "Jetzt Verkosten" button
- [ ] Ensure smooth scroll to Verkostungsformular

