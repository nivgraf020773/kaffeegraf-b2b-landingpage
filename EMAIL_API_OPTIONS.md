# Email-API Optionen für kaffeegraf B2B Landing Page

## 🎯 Das Problem

Das aktuelle Formular leitet zu Tally weiter, aber:
- ❌ Keine automatische Empfangsbestätigung im kostenlosen Tier
- ❌ Daten landen nicht direkt im E-Mail-Postfach
- ❌ Benutzer sieht keine Bestätigung auf der Landing Page

## ✅ Die Lösung: Lokale Formularverarbeitung

Statt Tally zu nutzen, verarbeiten wir das Formular **direkt auf der Landing Page** und senden die Daten per E-Mail.

---

## 🏗️ Architektur

```
┌─────────────────────────────────────────────────────────────┐
│ Browser (Landing Page)                                      │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Benutzer füllt Formular aus                          │   │
│ │ Klickt "Verkostung anfragen"                         │   │
│ └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ POST /api/contact
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend (Node.js/Express)                                   │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 1. Validiert Formular-Daten                          │   │
│ │ 2. Sendet Email via Email-API                        │   │
│ │ 3. Speichert optional in Datenbank                   │   │
│ │ 4. Sendet Response an Frontend                       │   │
│ └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ Response (Success/Error)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Browser (Landing Page)                                      │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ Zeigt Bestätigungsmeldung:                           │   │
│ │ "Vielen Dank! Wir melden uns in 24h"                │   │
│ └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📧 Email-API Optionen (Ranked)

### 🥇 Option 1: SendGrid (Empfohlen für B2B)

**Kosten:** Kostenlos bis 100 E-Mails/Tag

**Vorteile:**
- ✅ Zuverlässig und professionell
- ✅ Kostenlos für kleine Mengen
- ✅ Gutes Deliverability (E-Mails kommen an)
- ✅ Einfache Integration
- ✅ Gutes Dashboard zur Überwachung

**Setup:**
```bash
npm install @sendgrid/mail
```

**Beispiel-Code:**
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'team@kaffeegraf.coffee',
  from: 'noreply@kaffeegraf.coffee',
  subject: `B2B Kontakt - ${form.name}; ${form.company}`,
  html: `
    <h2>Neue B2B Anfrage</h2>
    <p><strong>Name:</strong> ${form.name}</p>
    <p><strong>Unternehmen:</strong> ${form.company}</p>
    <p><strong>Email:</strong> ${form.email}</p>
    <p><strong>Telefon:</strong> ${form.phone}</p>
    <p><strong>Geschäftstyp:</strong> ${form.type}</p>
    <p><strong>Priorität:</strong> ${form.priority}</p>
    <p><strong>Nachricht:</strong> ${form.message}</p>
  `
};

await sgMail.send(msg);
```

---

### 🥈 Option 2: Resend (Modern & Developer-Friendly)

**Kosten:** Kostenlos bis 100 E-Mails/Tag

**Vorteile:**
- ✅ Sehr einfache Integration
- ✅ Speziell für React/Next.js optimiert
- ✅ Modernes API Design
- ✅ Gutes Deliverability

**Setup:**
```bash
npm install resend
```

**Beispiel-Code:**
```javascript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'noreply@kaffeegraf.coffee',
  to: 'team@kaffeegraf.coffee',
  subject: `B2B Kontakt - ${form.name}; ${form.company}`,
  html: `<h2>Neue B2B Anfrage</h2>...`
});
```

---

### 🥉 Option 3: Mailgun

**Kosten:** Kostenlos bis 100 E-Mails/Monat

**Vorteile:**
- ✅ Sehr zuverlässig
- ✅ Gutes Deliverability
- ✅ Flexible API

**Nachteile:**
- ❌ Nur 100 E-Mails/Monat kostenlos (weniger als SendGrid/Resend)

---

### ❌ Option 4: Nodemailer + Gmail (Nicht empfohlen)

**Warum nicht:**
- ❌ Gmail blockiert oft "weniger sichere Apps"
- ❌ Komplizierte Authentifizierung
- ❌ Unreliable für Production
- ❌ Gmail-Limits können schnell erreicht werden

---

## 🔧 Implementierung (Schritt-für-Schritt)

### Schritt 1: Backend-API Endpoint erstellen

**Datei:** `server/routes/contact.ts`

```typescript
import { Router } from 'express';
import sgMail from '@sendgrid/mail';

const router = Router();

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

router.post('/api/contact', async (req, res) => {
  try {
    const { name, company, email, phone, type, priority, priorityOther, message } = req.body;

    // Validierung
    if (!name || !company || !email || !type || !priority) {
      return res.status(400).json({ error: 'Erforderliche Felder fehlen' });
    }

    // Email an kaffeegraf Team
    const msg = {
      to: 'team@kaffeegraf.coffee',
      from: 'noreply@kaffeegraf.coffee',
      subject: `B2B Kontakt - ${name}; ${company}`,
      html: `
        <h2>Neue B2B Anfrage</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Unternehmen:</strong> ${company}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone || 'nicht angegeben'}</p>
        <p><strong>Geschäftstyp:</strong> ${type}</p>
        <p><strong>Priorität:</strong> ${priority}</p>
        ${priorityOther ? `<p><strong>Weitere Details:</strong> ${priorityOther}</p>` : ''}
        ${message ? `<p><strong>Nachricht:</strong> ${message}</p>` : ''}
      `
    };

    await sgMail.send(msg);

    // Optional: Bestätigungsemail an Benutzer
    const confirmationMsg = {
      to: email,
      from: 'noreply@kaffeegraf.coffee',
      subject: 'Vielen Dank für Ihre Anfrage – kaffeegraf',
      html: `
        <h2>Vielen Dank für Ihre Anfrage!</h2>
        <p>Liebe/r ${name},</p>
        <p>wir haben Ihre Kontaktanfrage erhalten und werden uns innerhalb von 24 Stunden bei Ihnen melden, um einen Termin für die kostenlose Verkostung zu vereinbaren.</p>
        <p>Beste Grüße,<br>kaffeegraf Team</p>
      `
    };

    await sgMail.send(confirmationMsg);

    res.json({ success: true, message: 'Anfrage erfolgreich gesendet' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Fehler beim Senden der Anfrage' });
  }
});

export default router;
```

### Schritt 2: Frontend-Formular anpassen

**Datei:** `client/src/components/KontaktSection.tsx`

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (response.ok) {
      toast.success('Ihre Anfrage wurde gesendet! Wir melden uns in 24h.');
      setSubmitted(true);
      setForm({ name: '', company: '', email: '', phone: '', type: '', priority: '', priorityOther: '', message: '' });
    } else {
      toast.error('Fehler beim Senden. Bitte versuchen Sie es später.');
    }
  } catch (error) {
    console.error('Form error:', error);
    toast.error('Fehler beim Senden. Bitte versuchen Sie es später.');
  }
};
```

### Schritt 3: Environment Variables setzen

**Datei:** `.env.local`

```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxx
```

---

## 🚀 Deployment auf Manus

Das Projekt muss zu **web-db-user** upgraded werden, um Backend-Funktionalität zu haben:

```bash
# Das würde ich für dich machen:
webdev_add_feature web-db-user
```

Das fügt hinzu:
- ✅ Node.js Express Backend
- ✅ Datenbank (optional)
- ✅ Environment Variables Support
- ✅ API Routes

---

## 📊 Vergleich der Optionen

| Feature | SendGrid | Resend | Mailgun |
|---------|----------|--------|---------|
| Kostenlos/Monat | 100/Tag | 100/Tag | 100/Monat |
| Setup-Komplexität | Einfach | Sehr Einfach | Mittel |
| Deliverability | Sehr Gut | Sehr Gut | Sehr Gut |
| Support | Gut | Sehr Gut | Gut |
| Für B2B | ✅ | ✅ | ✅ |

---

## 🎯 Empfehlung

**Für kaffeegraf:** SendGrid + Backend-Upgrade

**Warum:**
1. Kostenlos bis 100 E-Mails/Tag (mehr als genug für B2B)
2. Professionell und zuverlässig
3. Einfache Integration
4. Gutes Deliverability (E-Mails kommen an)
5. Dashboard zur Überwachung

---

## ✅ Nächste Schritte

1. **Backend-Upgrade:** `webdev_add_feature web-db-user`
2. **SendGrid Account:** https://sendgrid.com (kostenlos)
3. **API Key generieren** in SendGrid Dashboard
4. **Environment Variable** setzen
5. **Backend-API** implementieren
6. **Frontend-Formular** anpassen
7. **Testen** mit echtem Formular

Sollen wir das so machen?
