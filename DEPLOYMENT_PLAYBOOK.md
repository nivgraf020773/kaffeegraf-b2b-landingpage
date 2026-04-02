# Deployment Playbook für kaffeegraf B2B App

**WICHTIG:** Dieses Vorgehen MUSS für alle zukünftigen Deployments befolgt werden!

---

## 🎯 Ziele & Kontext

- **Projekt:** kaffeegraf-b2b-landingpage (B2B Landing Page mit WooCommerce Integration)
- **Hostinger Domain:** `b2b-app.kaffeegraf.coffee` (NICHT `www.kaffeegraf.coffee`!)
- **GitHub Repo:** https://github.com/nivgraf020773/kaffeegraf-b2b-landingpage
- **Hostinger Pfad:** `/home/u161781533/domains/b2b-app.kaffeegraf.coffee/nodejs/`
- **App Manager:** lsnode (Hostinger Node.js Manager)

---

## 📋 Deployment-Schritte (EXAKT in dieser Reihenfolge!)

### Schritt 1: Code lokal committen
```bash
cd /home/ubuntu/kaffeegraf-landingpage
git add -A
git commit -m "Feature: [Beschreibung der Änderung]"
```

### Schritt 2: Zu GitHub pushen (SSH)
```bash
# SSH-Key Setup (einmalig):
git remote remove github 2>/dev/null
git remote add github git@github.com:nivgraf020773/kaffeegraf-b2b-landingpage.git
git config user.email "manus@kaffeegraf.coffee"
git config user.name "Manus Agent"

# Push:
GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no" git push github main
```

### Schritt 3: Auf Hostinger deployen
```bash
# SSH-Verbindung zu Hostinger
sshpass -p ';7K3;G9}Yf("8EDe_t' ssh -o StrictHostKeyChecking=no -p 65002 u161781533@46.202.156.196

# Im SSH-Terminal:
cd /home/u161781533/domains/b2b-app.kaffeegraf.coffee/nodejs
git fetch origin
git reset --hard origin/main
git log --oneline | head -5  # Verifizieren, dass neuer Code da ist
```

---

## 🔐 Credentials (SPEICHERN!)

### Hostinger SSH
- **Host:** 46.202.156.196
- **Port:** 65002
- **User:** u161781533
- **Password:** `;7K3;G9}Yf("8EDe_t`

### GitHub SSH
- **Repo:** https://github.com/nivgraf020773/kaffeegraf-b2b-landingpage
- **Auth:** SSH-Key (automatisch vom Manus-System)
- **Fallback:** GitHub PAT (falls SSH nicht funktioniert)

---

## ⚠️ HÄUFIGE FEHLER (VERMEIDEN!)

### ❌ FALSCH: Auf WordPress-Domain deployen
```bash
# FALSCH!
/home/u161781533/domains/kaffeegraf.coffee/public_html
```

### ✅ RICHTIG: Auf B2B App-Domain deployen
```bash
# RICHTIG!
/home/u161781533/domains/b2b-app.kaffeegraf.coffee/nodejs
```

### ❌ FALSCH: Passwort-Auth für GitHub
```bash
# FALSCH! GitHub akzeptiert keine Passwörter mehr
git push https://username:password@github.com/...
```

### ✅ RICHTIG: SSH-Auth für GitHub
```bash
# RICHTIG!
GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no" git push github main
```

---

## 🧪 Verifikation nach Deployment

1. **Code auf Hostinger verifizieren:**
   ```bash
   ssh -p 65002 u161781533@46.202.156.196
   cd /home/u161781533/domains/b2b-app.kaffeegraf.coffee/nodejs
   git log --oneline | head -5
   ```

2. **App läuft:** https://b2b-app.kaffeegraf.coffee

3. **Kontaktformular testen:**
   - Formular öffnen
   - UID eingeben (z.B. ATU12345678)
   - Validierung sollte laufen
   - Submit sollte funktionieren

---

## 📝 Deployment-Checkliste

- [ ] Code lokal committet
- [ ] Zu GitHub gepusht (SSH)
- [ ] Auf Hostinger gepullt
- [ ] `git log` zeigt neuen Commit
- [ ] App läuft auf b2b-app.kaffeegraf.coffee
- [ ] Kontaktformular funktioniert
- [ ] UID-Validierung funktioniert

---

## 🔄 Automatisiertes Deployment-Skript

Für zukünftige Deployments kann dieses Bash-Skript verwendet werden:

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Deployment gestartet..."

# Schritt 1: GitHub Push
echo "📤 Pushing to GitHub..."
cd /home/ubuntu/kaffeegraf-landingpage
GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no" git push github main

# Schritt 2: Hostinger Pull
echo "📥 Pulling on Hostinger..."
sshpass -p ';7K3;G9}Yf("8EDe_t' ssh -o StrictHostKeyChecking=no -p 65002 u161781533@46.202.156.196 \
  "cd /home/u161781533/domains/b2b-app.kaffeegraf.coffee/nodejs && \
   git fetch origin && \
   git reset --hard origin/main && \
   echo '✅ Deployment erfolgreich!' && \
   git log --oneline | head -3"

echo "🎉 Deployment abgeschlossen!"
```

Verwendung:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📞 Support & Troubleshooting

### Problem: SSH-Verbindung zu Hostinger fehlgeschlagen
- Port 65002 verwenden (nicht 22!)
- Passwort korrekt? `;7K3;G9}Yf("8EDe_t`
- `sshpass` installiert? `sudo apt-get install sshpass`

### Problem: GitHub Push fehlgeschlagen
- SSH-Key vorhanden? `ls ~/.ssh/id_rsa`
- GitHub SSH konfiguriert? `ssh -T git@github.com`
- Fallback: GitHub PAT verwenden

### Problem: Code auf Hostinger nicht aktualisiert
- `git fetch origin` ausführen
- `git reset --hard origin/main` (VORSICHT: lokale Änderungen werden gelöscht!)
- `git log` prüfen

---

## 📅 Letzte Deployments

| Datum | Commit | Beschreibung |
|-------|--------|-------------|
| 2026-04-02 | 86c56a4 | Feature: B2B UID/VAT validation with VIES API |
| 2026-03-31 | 00e1c77 | CRITICAL FIX: WooCommerce REST API nonce_error |
| 2026-03-31 | 69b8ca9 | Add detailed logging to WooCommerce API |

---

**Zuletzt aktualisiert:** 2026-04-02
**Erstellt von:** Manus Agent
**Status:** ✅ AKTIV
