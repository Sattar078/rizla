# RIZLA BOUTIQUE — CODEBASE ISSUE & ERROR TRACKER

> Single source of truth for bugs, errors, warnings, security issues, broken integrations, regressions, and production-readiness issues across the complete RIZLA BOUTIQUE codebase.

**Rule:** Track first → Fix second → Verify third.

---

## 1. MASTER ISSUE TABLE

| ID | Area | Type | Priority | Status | Description | File/Route | Agent | Discovered | Fixed | Verified |
|---|---|---|---|---|---|---|---|---|---|---|
| RB-001 | Backend startup | RUNTIME_ERROR | P0 — CRITICAL | VERIFIED | App startup failed with Mongoose OverwriteModelError because User was imported with inconsistent filename casing. | backend/src/controllers/notification.controller.js | Copilot | 2026-09-30 | 2026-09-30 | 2026-09-30 |
| RB-002 | Backend startup | RUNTIME_ERROR | P0 — CRITICAL | VERIFIED | Express route registration failed because notification routes destructured a middleware export that is a function. | backend/src/routes/notification.routes.js | Copilot | 2026-09-30 | 2026-09-30 | 2026-09-30 |
| RB-003 | Frontend routing | ROUTING | P1 — HIGH | VERIFIED | Unauthenticated direct visits to non-root URLs rendered onboarding and hid the requested route. | frontend/src/App.jsx | Copilot | 2026-09-30 | 2026-09-30 | 2026-09-30 |
| RB-004 | Checkout/payment | PAYMENT_ERROR | P1 — HIGH | OPEN | Razorpay initialization can fail after order creation clears the cart and deducts stock; failure recovery marks payment failed but does not restore cart or stock. | frontend/src/pages/CheckoutPayment.jsx; backend/src/controllers/order.controller.js | Copilot | 2026-09-30 | — | — |
| RB-005 | Authentication | SECURITY | P2 — MEDIUM | VERIFIED | Forgot-password endpoint returned different responses for known and unknown email addresses, enabling account enumeration. | backend/src/controllers/auth.controller.js | Copilot | 2026-09-30 | 2026-09-30 | 2026-09-30 |
| RB-006 | Backend security | SECURITY | P2 — MEDIUM | VERIFIED | Auth endpoints had no request throttling and the Express app did not apply the installed Helmet security headers. | backend/src/routes/auth.routes.js; backend/src/app.js | Copilot | 2026-09-30 | 2026-09-30 | 2026-09-30 |
| RB-007 | Frontend PWA | FEATURE / PWA | P1 — HIGH | VERIFIED | Missing PWA configuration, web app manifest, app icons, and installable PWA behavior. | frontend/vite.config.js; frontend/src/components/PWAInstallPrompt.jsx | Gemini 3.8 | 2026-10-01 | 2026-10-01 | 2026-10-01 |
| RB-008 | Frontend / Service Worker | RUNTIME_ERROR / SECURITY | P1 — HIGH | VERIFIED | Standalone public/sw.js conflicted with PWA build and lacked explicit NetworkOnly isolation for sensitive API endpoints. | frontend/public/push-sw.js; frontend/vite.config.js; frontend/src/context/NotificationContext.jsx | Gemini 3.8 | 2026-10-01 | 2026-10-01 | 2026-10-01 |
| RB-009 | Frontend / HTML | WARNING | P3 — LOW | VERIFIED | Deprecation warning for apple-mobile-web-app-capable meta tag without mobile-web-app-capable. | frontend/index.html | Gemini 3.8 | 2026-10-01 | 2026-10-01 | 2026-10-01 |

---

## 2. PWA DETAILED ISSUE RECORDS

### RB-007 — Missing PWA Configuration, Web Manifest, and Installability

- **Issue:** Web application was not installable as a Progressive Web App (PWA) and lacked Web App Manifest, branded icons, and service worker shell caching.
- **Page/File:** `frontend/vite.config.js`, `frontend/index.html`, `frontend/src/components/PWAInstallPrompt.jsx`, `frontend/src/utils/pwa.js`
- **Root Cause:** Application was created as standard SPA without PWA plugin or manifest metadata.
- **Priority:** `P1 — HIGH`
- **Fix:** Configured `vite-plugin-pwa` with branded manifest (`RIZLA BOUTIQUE`, `#17332b` theme color, `#fbfaf7` background color, `standalone` display mode), generated 192x192, 512x512, maskable 512x512, and 180x180 icons, implemented `PWAInstallPrompt` with native install prompt triggering, session dismissal, and robust `isPWAInstalled()` detection.
- **Verification:** Production build succeeds; `dist/manifest.webmanifest` and `dist/sw.js` generated; tested in browser via DevTools showing valid manifest, service worker registration at scope `/`, and persistent popup rendering.
- **Status:** `VERIFIED`

---

### RB-008 — Standalone Service Worker Conflict and API Route Exposure

- **Issue:** A static `public/sw.js` created file collision with generated Workbox service worker, and runtime caching could inadvertently intercept sensitive API routes.
- **Page/File:** `frontend/public/sw.js`, `frontend/public/push-sw.js`, `frontend/src/context/NotificationContext.jsx`, `frontend/vite.config.js`
- **Root Cause:** Push notifications were implemented as a standalone static file in `public/sw.js` without integration into build pipeline Workbox configuration.
- **Priority:** `P1 — HIGH`
- **Fix:** Extracted push notification handlers to `public/push-sw.js` and imported them into Workbox via `importScripts(['/push-sw.js'])`. Configured Workbox runtime caching to strictly route `/api/*` via `NetworkOnly`. Updated `NotificationContext.jsx` to coordinate with `navigator.serviceWorker.ready`.
- **Verification:** Verified 1 active service worker registration at `/sw.js` with push handlers; `/api/*` requests bypass cache with NetworkOnly.
- **Status:** `VERIFIED`

---

### RB-009 — Deprecated Apple Mobile Web App Meta Tag Warning

- **Issue:** Console warning `<meta name="apple-mobile-web-app-capable" content="yes"> is deprecated. Please include <meta name="mobile-web-app-capable" content="yes">`.
- **Page/File:** `frontend/index.html`
- **Root Cause:** Only legacy Apple meta tag was provided.
- **Priority:** `P3 — LOW`
- **Fix:** Added standard `<meta name="mobile-web-app-capable" content="yes" />` in `index.html`.
- **Verification:** Verified in browser DevTools; deprecation warning cleared.
- **Status:** `VERIFIED`
