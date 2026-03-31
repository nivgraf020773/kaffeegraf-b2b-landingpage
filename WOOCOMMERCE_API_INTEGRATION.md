# WooCommerce API Integration - Detaillierte Erklärung (Schritte 1-3)

## 🎯 Überblick: Was passiert?

```
Benutzer füllt Formular auf Landing Page
              ↓
Klickt "Verkostung anfragen"
              ↓
Frontend sendet Daten zu Backend
              ↓
Backend macht API-Call zu WooCommerce
              ↓
WooCommerce erstellt neuen Kunden
              ↓
Benutzer sieht: "Vielen Dank! Wir melden uns in 24h"
```

---

## 📝 Schritt 1: WooCommerce REST API Integration

### Was ist die WooCommerce REST API?

Die **REST API** ist eine Schnittstelle, über die externe Systeme (wie unsere Landing Page) mit WooCommerce kommunizieren können.

**Beispiel:**
```
Unsere Landing Page sagt zu WooCommerce:
"Erstelle einen neuen Kunden mit diesen Daten:
- Name: Max Mustermann
- Email: max@example.com
- Unternehmen: Muster GmbH
- Status: B2B Lead"

WooCommerce antwortet:
"OK, Kunde erstellt! ID: 12345"
```

### Wie funktioniert das technisch?

**1. Authentifizierung:**
- WooCommerce braucht API Keys (Consumer Key + Consumer Secret)
- Das sind wie Benutzername + Passwort für die API
- Nur mit diesen Keys kann die Landing Page mit WooCommerce sprechen

**2. API Endpoint:**
```
POST https://www.kaffeegraf.coffee/wp-json/wc/v3/customers
```

Das ist die Adresse, an die wir die Daten senden.

**3. Daten senden:**
```json
{
  "email": "max@example.com",
  "first_name": "Max",
  "last_name": "Mustermann",
  "billing": {
    "company": "Muster GmbH",
    "phone": "+43 1 234 5678"
  },
  "meta_data": [
    {
      "key": "b2b_status",
      "value": "prospect"
    },
    {
      "key": "b2b_business_type",
      "value": "buero"
    },
    {
      "key": "b2b_priority",
      "value": "geschmack"
    }
  ]
}
```

**4. Antwort von WooCommerce:**
```json
{
  "id": 12345,
  "email": "max@example.com",
  "first_name": "Max",
  "last_name": "Mustermann",
  "status": "prospect"
}
```

---

## 🔌 Schritt 2: Kontaktformular Integration

### Wie das Formular damit verbunden wird

**Aktuell (Tally):**
```
Formular → Benutzer wird zu Tally weitergeleitet
```

**Mit WooCommerce API:**
```
Formular → Backend API → WooCommerce → Bestätigung auf der Page
```

### Der Ablauf im Detail

**1. Benutzer füllt Formular aus:**
```
Name: Max Mustermann
Unternehmen: Muster GmbH
Email: max@example.com
Telefon: +43 1 234 5678
Geschäftstyp: Büro
Priorität: Guter Geschmack
Nachricht: Wir interessieren uns für...
```

**2. Benutzer klickt "Verkostung anfragen"**

Der Browser sendet die Daten an **unseren Backend** (nicht direkt zu WooCommerce):
```
POST /api/contact
{
  "name": "Max Mustermann",
  "company": "Muster GmbH",
  "email": "max@example.com",
  ...
}
```

**3. Unser Backend verarbeitet die Daten:**

```javascript
// Schritt A: Validieren
if (!name || !email) {
  return error("Erforderliche Felder fehlen");
}

// Schritt B: Zu WooCommerce senden
const woocommerceResponse = await fetch(
  'https://www.kaffeegraf.coffee/wp-json/wc/v3/customers',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(consumerKey + ':' + consumerSecret)
    },
    body: JSON.stringify({
      email: email,
      first_name: name,
      billing: { company: company },
      meta_data: [
        { key: 'b2b_status', value: 'prospect' },
        { key: 'b2b_business_type', value: type }
      ]
    })
  }
);

// Schritt C: Antwort prüfen
if (woocommerceResponse.ok) {
  const customer = await woocommerceResponse.json();
  console.log('Kunde erstellt mit ID:', customer.id);
  return { success: true };
} else {
  return { error: 'Fehler beim Erstellen des Kunden' };
}
```

**4. Frontend zeigt Bestätigung:**
```
"Vielen Dank, Max!
Wir haben Ihre Anfrage erhalten.
Wir melden uns innerhalb von 24 Stunden bei Ihnen."
```

---

## 📧 Schritt 3: Automatische Bestätigung

### Was ist "automatische Bestätigung"?

Das ist die **Rückmeldung an den Benutzer**, dass seine Anfrage angekommen ist.

### Zwei Möglichkeiten:

#### Option A: Bestätigung nur auf der Page (Einfach)
```
Benutzer sieht sofort auf der Landing Page:
"Vielen Dank! Wir melden uns in 24h"
```

**Wie das funktioniert:**
```javascript
// Nach erfolgreichem API-Call
setSubmitted(true);  // Zeigt Bestätigungsmeldung
```

**Vorteile:**
- ✅ Sofort sichtbar
- ✅ Einfach zu implementieren
- ✅ Keine Email nötig

**Nachteile:**
- ❌ Benutzer hat keine Bestätigung in seiner Email
- ❌ Kann die Email vergessen

---

#### Option B: Bestätigung per Email + auf der Page (Empfohlen)

```
Benutzer sieht auf der Page:
"Vielen Dank! Wir melden uns in 24h"

UND

Benutzer erhält Email:
"Vielen Dank für Ihre Anfrage!
Wir haben Ihre Kontaktanfrage erhalten..."
```

**Wie das funktioniert:**

```javascript
// Nach erfolgreichem Kunden-Erstellen in WooCommerce

// Option 1: WooCommerce sendet automatisch Email
// (Wenn WooCommerce so konfiguriert ist)

// Option 2: Wir senden Email via Resend
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({
  from: 'noreply@kaffeegraf.coffee',
  to: email,
  subject: 'Vielen Dank für Ihre Anfrage – kaffeegraf',
  html: `
    <h2>Vielen Dank, ${name}!</h2>
    <p>Wir haben Ihre Kontaktanfrage erhalten...</p>
  `
});

// Dann zeige Bestätigung auf der Page
setSubmitted(true);
```

**Vorteile:**
- ✅ Benutzer hat Bestätigung in Email
- ✅ Professionell
- ✅ Benutzer kann Email als Referenz speichern

**Nachteile:**
- ❌ Braucht Email-Service (Resend)
- ❌ Etwas komplexer

---

## 🏗️ Architektur-Diagramm

```
┌─────────────────────────────────────────────────────────────┐
│ LANDING PAGE (React Frontend)                               │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Kontaktformular                                       │  │
│ │ Name, Email, Unternehmen, etc.                        │  │
│ └───────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ POST /api/contact
                         │ (mit Formular-Daten)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ BACKEND (Node.js/Express)                                   │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ 1. Daten validieren                                   │  │
│ │ 2. API-Call zu WooCommerce                            │  │
│ │ 3. Optional: Email via Resend senden                  │  │
│ │ 4. Response an Frontend                               │  │
│ └───────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API
                         │ (WooCommerce REST API)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ WOOCOMMERCE (www.kaffeegraf.coffee)                         │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ Erstellt neuen Kunden mit:                            │  │
│ │ - Name, Email, Telefon                                │  │
│ │ - Unternehmen (Billing)                               │  │
│ │ - B2B Status (Meta Data)                              │  │
│ │ - Geschäftstyp (Meta Data)                            │  │
│ │ - Priorität (Meta Data)                               │  │
│ └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Sicherheit

### Wichtig: API Keys schützen!

Die **Consumer Key + Consumer Secret** sind wie Passwörter. Sie dürfen **NICHT** im Frontend-Code sichtbar sein!

**Richtig:**
```
Frontend → Backend (sicher) → WooCommerce
```

**Falsch:**
```
Frontend → WooCommerce (API Key sichtbar!)
```

---

## 📋 Zusammenfassung

| Schritt | Was passiert | Wer macht es |
|---------|-------------|-------------|
| 1 | WooCommerce REST API wird aufgerufen | Backend |
| 2 | Formular-Daten werden zu WooCommerce gesendet | Backend |
| 3 | Bestätigung an Benutzer (Page + optional Email) | Backend + Frontend |

---

## ❓ Offene Fragen (für dich zu beantworten)

1. **WooCommerce API Keys:** Hast du diese bereits? Oder sollen wir sie generieren?
2. **Bestätigung:** Nur auf der Page (Option A) oder auch Email (Option B)?
3. **Wenn Email:** Sollen wir Resend nutzen, oder hat WooCommerce bereits eine Email-Konfiguration?
4. **Custom Fields in WooCommerce:** Wie sollen B2B-spezifische Daten gespeichert werden?
   - Als Meta Data (versteckt)?
   - Oder als sichtbare Custom Fields?

Passt diese Erklärung? Oder hast du noch Fragen?
