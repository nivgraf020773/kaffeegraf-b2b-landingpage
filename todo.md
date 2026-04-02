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

### Deployment
- [x] Projekt live auf Manus
- [x] Domain: kaffeegraf-l7t4bfip.manus.space

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

- ✅ FIXED: WooCommerce API nonce_error
  - Problem: Theme's validate_custom_registration_fields() enforced nonce on REST API
  - Solution: Added REST_REQUEST check to skip nonce validation for API requests
  - Status: Working correctly in production
  
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

---

## Phase 3: B2B UID/VAT Validation (IN PROGRESS)

### UID/Steuernummern-Prüfung
- [ ] Frontend-Formularfeld für UID/Steuernummer hinzufügen
- [ ] Frontend-Vorprüfung (Format, Normalisierung)
- [ ] Serverseitige UID-Validierung gegen externe APIs (VIES/BMF)
- [ ] Error Handling für alle Validierungszustände
- [ ] WooCommerce Custom Fields für UID-Speicherung
- [ ] Landingpage mit B2B-Hinweis aktualisieren
- [ ] Tests für UID-Validierung
- [ ] Dokumentation der Validierungslogik
