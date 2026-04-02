# BMF UID-Abfrage Webservice Spezifikationen

## Übersicht
Das BMF (Bundesministerium für Finanzen) bietet einen Webservice zur Validierung von österreichischen UID-Nummern (Umsatzsteuer-Identifikationsnummern).

**WSDL Endpoint:** `https://finanzonline.bmf.gv.at/fonuid/ws/uidAbfrageService.wsdl`

## Voraussetzungen
- Der Übermittler muss FinanzOnline Teilnehmer sein
- Der Teilnehmer muss in der Benutzerverwaltung einen Benutzer für 'Webservices' anlegen
- Der Webservice muss mit diesem Benutzer verwendet werden

## Ablauf

### 1. Session-Webservice (login)
Zuerst muss eine Session mit dem FinanzOnline Benutzer erstellt werden.

### 2. UID-Abfrage-Webservice (uidAbfrage)
Methode: `uidAbfrage`

**Parameter:**
- `tid` - Teilnehmer-Identifikation
- `benid` - Benutzer-Identifikation des Webservice-Benutzers
- `id` - Session ID (von login erhalten)
- `uid_tn` - UID-Nummer des Antragstellers (eigene UID), beginnend mit ATU
- `uid` - UID-Nummer des Erwerbers (zu prüfende UID)
- `stufe` - Stufe der UID-Abfrage:
  - `1` = Stufe 1 (gültig oder nicht gültig)
  - `2` = Stufe 2 (gültig oder nicht gültig; wenn gültig, zusätzlich Name und Anschrift)

**Rückgabe:**
- Returncode (siehe unten)
- Bei Stufe 2: zusätzlich Name und 6 Adresszeilen

### 3. Session-Webservice (logout)
Session beenden.

## Returncodes

| Code | Bedeutung |
|------|-----------|
| 0 | Die UID des Erwerbers ist gültig |
| -1 | Die Session ID ist ungültig oder abgelaufen |
| -2 | Der Aufruf des Webservices ist derzeit wegen Wartungsarbeiten nicht möglich |
| -3 | Es ist ein technischer Fehler aufgetreten |
| -4 | Dieser Teilnehmer ist für diese Funktion nicht berechtigt |
| 1 | Die UID des Erwerbers ist nicht gültig |
| 4 | Die UID-Nummer des Erwerbers ist falsch |
| 5 | Die UID-Nummer des Antragstellers ist ungültig |
| 10 | Der angegebene Mitgliedstaat verbietet diese Abfrage |
| 11 | Für die UID-Abfrage für diesen Antragsteller sind sie nicht berechtigt |
| 12 | Die UID-Nummer des Erwerbers ist (noch) nicht abfragbar |
| 101 | UID beginnt nicht mit ATU |
| 103 | Die angefragte UID-Nummer kann im FinanzOnline nur in Stufe 1 bestätigt werden (Unternehmensgruppe) |
| 104 | Die angefragte UID-Nummer kann im FinanzOnline nur in Stufe 1 bestätigt werden (Slowakei) |
| 105 | Die UID-Nummer ist über FinanzOnline einzeln abzufragen |
| 1511 | Die Funktion steht derzeit nicht zur Verfügung |
| 1512 | Die UID-Abfrage ist auf Grund der hohen Anzahl an Abfragen derzeit nicht möglich |
| 1513 | Die UID-Abfrage für die angegebene UID-Nummer des Erwerbers wurde an diesem Tag bereits zweimal durchgeführt |
| 1514 | Die UID-Abfrage für die angegebene UID-Nummer des Antragstellers wurde an diesem Tag bereits mehrfach durchgeführt |

## Wichtige Einschränkungen

### Rate Limiting (ab 6. April 2023)
- Jede UID-Nummer pro Teilnehmer: max. 2x pro Tag mittels Webservice abfragbar
- Bei Überschreitung: Returncode 1513 oder 1514
- Returncode 1513: UID des Erwerbers bereits 2x heute abgefragt
- Returncode 1514: UID des Antragstellers bereits mehrfach heute abgefragt

### Stufe 2 Einschränkungen
- Nicht alle UIDs können in Stufe 2 abgefragt werden
- Manche UIDs sind nur in Stufe 1 verfügbar (Unternehmensgruppen, Slowakei)
- Returncode 103 oder 104 zeigt diese Einschränkung an

## Implementierungshinweise

1. **Session-Management:** Session muss vor jeder Abfrage erstellt und danach beendet werden
2. **Error Handling:** Alle Returncodes müssen korrekt behandelt werden
3. **Rate Limiting:** Implementierung sollte Rate-Limit-Fehler (1513, 1514) beachten
4. **Timeout:** Webservice kann zeitweise nicht verfügbar sein (Returncode -2, 1511, 1512)
5. **Berechtigungen:** Benutzer muss in FinanzOnline für diese Funktion berechtigt sein

## Bestätigung
Die ausgedruckte Bestätigung gilt als Nachweis für die erfolgte Abfrage der Gültigkeit einer Umsatzsteuer-Identifikationsnummer und ist gemäß § 132 BAO aufzubewahren.
