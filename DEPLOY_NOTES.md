# Deployment Notes - kaffeegraf B2B Landing Page

## Recovery Status
✅ **Footer Recovery Complete** - Copyright and legal links restored

**Date:** April 3, 2026  
**Version:** 1d2bd43d  
**Change:** Added missing copyright text to bottom legal footer bar

---

## Build & Deployment Commands

### Prerequisites
```bash
# Install dependencies
pnpm install

# Ensure database migrations are applied
pnpm db:push
```

### Development Server
```bash
# Start dev server with hot-reload
pnpm dev

# Dev server runs on: http://localhost:3000
```

### Production Build
```bash
# Build for production
pnpm build

# Output directory: dist/
# - dist/public/index.html (main app)
# - dist/public/assets/ (CSS, JS bundles)
# - dist/server.js (Node.js backend)
```

### Production Start
```bash
# Start production server
node dist/server.js

# Server runs on port specified by environment (default: 3000)
```

---

## Environment Variables Required

### OAuth & Authentication
```
VITE_APP_ID=<Manus OAuth App ID>
OAUTH_SERVER_URL=<Manus OAuth Server URL>
VITE_OAUTH_PORTAL_URL=<Manus OAuth Portal URL>
OWNER_OPEN_ID=<Owner OpenID>
OWNER_NAME=<Owner Name>
JWT_SECRET=<Session signing secret>
```

### Database
```
DATABASE_URL=<MySQL/TiDB connection string>
```

### Email (Optional - for form submissions)
```
MAIL_HOST=<SMTP host>
MAIL_PORT=<SMTP port>
MAIL_USER=<SMTP username>
MAIL_PASSWORD=<SMTP password>
MAIL_FROM=<From email address>
```

### Manus Built-in APIs
```
BUILT_IN_FORGE_API_URL=<Manus API URL>
BUILT_IN_FORGE_API_KEY=<Manus API Key>
VITE_FRONTEND_FORGE_API_URL=<Frontend API URL>
VITE_FRONTEND_FORGE_API_KEY=<Frontend API Key>
```

### WooCommerce Integration (if enabled)
```
WOOCOMMERCE_URL=<WooCommerce store URL>
WOOCOMMERCE_CONSUMER_KEY=<API key>
WOOCOMMERCE_CONSUMER_SECRET=<API secret>
```

---

## Deployment to Hostinger

### Via SCP (Recommended)
```bash
# Build locally
pnpm build

# Create tar archive
tar -czf kaffeegraf-build.tar.gz dist/

# Upload to Hostinger
scp -P 65002 kaffeegraf-build.tar.gz u161781533@46.202.156.196:~/

# SSH into Hostinger
ssh -p 65002 u161781533@46.202.156.196

# Extract and replace
cd ~
rm -rf dist/
tar -xzf kaffeegraf-build.tar.gz
```

### Via Git (Requires GitHub Integration)
```bash
# Push to GitHub
git add .
git commit -m "Footer recovery: added copyright to legal footer bar"
git push origin main

# On Hostinger server
cd ~/project
git pull origin main
pnpm install
pnpm build
```

---

## Testing Checklist

### Desktop (1920x1080)
- [ ] Footer visible at bottom of page
- [ ] Copyright text: "© 2026 Kaffeegraf. Alle Rechte vorbehalten."
- [ ] Legal links visible: Impressum | Datenschutz | AGB | Cookie-Einstellungen
- [ ] All links clickable and functional
- [ ] No duplicate content

### Mobile (375x667)
- [ ] Footer responsive and readable
- [ ] Copyright text wraps correctly
- [ ] Legal links stack vertically or wrap appropriately
- [ ] All links accessible and clickable

### Functionality
- [ ] Form submission works
- [ ] Email notification sent to b2b@kaffeegraf.coffee
- [ ] Cookie banner displays correctly
- [ ] Navigation links scroll to sections

---

## Troubleshooting

### Footer Not Showing Copyright
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh page (Ctrl+Shift+R)
3. Verify `dist/public/index.html` contains `© 2026`
4. Check that `Footer.tsx` was included in build

### Build Fails
```bash
# Clean and rebuild
rm -rf dist/ node_modules/
pnpm install
pnpm build
```

### Database Connection Issues
```bash
# Verify DATABASE_URL is correct
# Check MySQL/TiDB connection
# Run migrations
pnpm db:push
```

---

## File Structure

```
kaffeegraf-landingpage/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── Footer.tsx (MODIFIED - added copyright)
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   └── index.html
├── server/
│   ├── routers.ts
│   ├── db.ts
│   └── _core/
├── drizzle/
│   ├── schema.ts
│   └── migrations/
├── dist/ (generated)
├── package.json
├── pnpm-lock.yaml
└── DEPLOY_NOTES.md (this file)
```

---

## Support & Rollback

### If Issues Occur
1. Check `.manus-logs/devserver.log` for errors
2. Review browser console for client-side errors
3. Verify environment variables are set correctly
4. Rollback to previous version if needed

### Rollback Command
```bash
# Revert to previous commit
git reset --hard <previous-commit-hash>
pnpm build
```

---

## Notes

- **Footer Recovery:** Only the copyright text was added to the legal footer bar. No other changes made.
- **No Breaking Changes:** All existing functionality remains intact.
- **Responsive Design:** Footer adapts to desktop and mobile viewports.
- **Legal Compliance:** Footer now includes required legal links and copyright notice.
