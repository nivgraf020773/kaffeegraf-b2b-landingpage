# Tally-Integration & Auto-Reply Setup für kaffeegraf B2B Landing Page

## 📋 Übersicht

Die kaffeegraf B2B Landing Page nutzt **Tally.so** für die Verarbeitung von Kontaktanfragen. Tally ist eine DSGVO-konforme Lösung mit EU-Servern und kostenlosem Tier.

**Tally Form URL:** https://tally.so/r/NpYDJW

---

## 🔧 Aktuelle Integration

### Wie das Formular funktioniert

1. **Benutzer füllt das Formular auf der Landing Page aus** mit:
   - Name
   - Unternehmen
   - E-Mail
   - Telefon
   - Geschäftstyp (Dropdown)
   - Prioritäten (Dropdown)
   - Nachricht (optional)

2. **Beim Absenden wird der Benutzer zu Tally weitergeleitet** mit allen Formular-Daten als URL-Parameter

3. **Tally empfängt die Daten** und speichert sie in der Form

4. **Tally sendet automatisch eine E-Mail** an team@kaffeegraf.coffee

---

## 📧 Auto-Reply E-Mails einrichten

### Option 1: Tally Native Auto-Reply (Empfohlen)

1. Gehe zu https://tally.so/r/NpYDJW
2. Klicke auf **"Settings"** (Zahnrad-Icon oben rechts)
3. Navigiere zu **"Notifications"** oder **"Email"**
4. Aktiviere **"Send confirmation email to respondent"**
5. Passe die Nachricht an:

```
Betreff: Vielen Dank für Ihre Anfrage – kaffeegraf

Liebe/r [Name],

vielen Dank für Ihre Kontaktanfrage! Wir haben Ihre Anfrage erhalten und werden uns innerhalb von 24 Stunden bei Ihnen melden, um einen Termin für die kostenlose Verkostung zu vereinbaren.

Ihre Anfrage:
- Unternehmen: [Company]
- Geschäftstyp: [Type]
- Priorität: [Priority]

Sollten Sie Fragen haben, erreichen Sie uns unter:
📧 team@kaffeegraf.coffee
🌐 www.kaffeegraf.coffee

Beste Grüße,
kaffeegraf Team
```

---

### Option 2: Gmail Auto-Reply (Falls Tally nicht ausreicht)

Wenn du Gmail für team@kaffeegraf.coffee nutzt:

1. Öffne Gmail
2. Klicke auf **Einstellungen** (Zahnrad oben rechts)
3. Gehe zu **"Alle Einstellungen anzeigen"**
4. Navigiere zu **"Abwesenheit"**
5. Aktiviere **"Abwesenheitsnotiz"**
6. Setze folgende Nachricht:

```
Betreff: Automatische Antwort – Ihre kaffeegraf Anfrage

Vielen Dank für Ihre Kontaktanfrage!

Wir haben Ihre Nachricht erhalten und werden uns innerhalb von 24 Stunden bei Ihnen melden, um einen Termin für die kostenlose Verkostung zu vereinbaren.

Beste Grüße,
kaffeegraf Team
```

---

### Option 3: Gmail Filter + Vorlage (Für mehr Kontrolle)

1. Öffne Gmail
2. Klicke auf **Einstellungen** → **Filter und blockierte Adressen**
3. Klicke **Neuen Filter erstellen**
4. Setze Filter: **Von: noreply@tally.so** (oder die tatsächliche Tally-Absender-Adresse)
5. Klicke **Filter erstellen**
6. Wähle **Automatische Antwort mit Vorlage senden**
7. Erstelle eine neue Vorlage mit deiner Auto-Reply-Nachricht

---

## 🧪 Test durchführen

### Testformular abgesendet ✅

**Testdaten:**
- Name: Max Mustermann
- Unternehmen: Muster GmbH
- E-Mail: kaffeegraf.coffee@gmail.com
- Telefon: +43 1 234 5678
- Geschäftstyp: Büro / Office
- Priorität: guter Geschmack

**Ergebnis:** Formular erfolgreich zu Tally weitergeleitet

---

## 📊 Tally Dashboard verwenden

### Eingegangene Anfragen anschauen

1. Gehe zu https://tally.so/r/NpYDJW
2. Klicke auf **"Responses"** (oder "Antworten")
3. Hier siehst du alle eingegangenen Anfragen mit:
   - Zeitstempel
   - Alle Formular-Felder
   - Möglichkeit zum Exportieren (CSV, Excel)

### Daten exportieren

1. Gehe zu **"Responses"**
2. Klicke auf **"Export"** (oben rechts)
3. Wähle Format: **CSV** oder **Excel**
4. Speichere die Datei

---

## 🔐 DSGVO-Konformität

✅ **Tally erfüllt DSGVO-Anforderungen:**
- EU-Server (Datenspeicherung in der EU)
- Keine Datenübertragung in die USA
- Kostenlos bis 100 Submissions/Monat
- Datenschutz-freundlich

✅ **Landing Page:**
- DSGVO-Hinweis im Formular: "Ihre Daten werden sicher und DSGVO-konform verarbeitet."
- Keine Cookies für Tracking
- Transparente Datenverwertung

---

## 🚀 Nächste Schritte

1. **Auto-Reply einrichten** (siehe oben)
2. **Tally Dashboard bookmarken** für regelmäßige Überprüfung
3. **Testanfrage senden** von einer echten E-Mail-Adresse
4. **Deployment vorbereiten** auf b2b.kaffeegraf.coffee Subdomain

---

## 📞 Support

- **Tally Support:** https://tally.so/support
- **Tally Dokumentation:** https://tally.so/help
- **Kontakt kaffeegraf:** team@kaffeegraf.coffee

---

**Letzte Aktualisierung:** 31. März 2026
**Status:** ✅ Produktionsbereit
