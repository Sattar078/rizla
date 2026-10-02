# RIZLA BOUTIQUE — Progressive Web App (PWA) Setup & Architecture

## Overview
RIZLA BOUTIQUE is equipped with a production-grade, installable Progressive Web App (PWA) architecture built using `vite-plugin-pwa` and Google Workbox. The application shell is precached for rapid loading, API requests and sensitive user/transaction data are strictly isolated using `NetworkOnly` routing, and a custom `PWAInstallPrompt` provides seamless native installation with intelligent installed-state detection and iOS Safari fallbacks.

---

## 1. Web App Manifest Configuration
The Web App Manifest is generated via `vite-plugin-pwa` in `frontend/vite.config.js` and emitted to `dist/manifest.webmanifest`.

- **Application Name:** `RIZLA BOUTIQUE`
- **Short Name:** `RIZLA`
- **Description:** `RIZLA BOUTIQUE online shopping application`
- **Display Mode:** `standalone`
- **Orientation:** `portrait-primary`
- **Start URL:** `/`
- **Scope:** `/`
- **Theme Color:** `#17332b` (Deep luxury pine green brand color)
- **Background Color:** `#fbfaf7` (Warm cream application background)
- **Icons:**
  - `pwa-192x192.png` (192x192, image/png)
  - `pwa-512x512.png` (512x512, image/png)
  - `maskable-icon-512x512.png` (512x512, image/png, purpose: maskable)
  - `apple-touch-icon-180x180.png` (180x180, image/png)

---

## 2. Service Worker & Caching Strategy
The service worker is built using Workbox (`dist/sw.js`) with automatic registration (`registerType: 'autoUpdate'`).

### App Shell & Static Assets
- **Precaching:** HTML, CSS, JavaScript chunks, SVGs, and brand icons are precached and served instantly.
- **SPA Navigation Fallback:** Navigation fallback routes all page views to `/index.html` while denylisting `/api/*`.
- **Google Fonts:** Cached via `StaleWhileRevalidate` with long-term expiration (1 year).
- **Static Images:** Cached via `StaleWhileRevalidate` with an expiration limit of 60 entries / 30 days.

### Security & Sensitive API Isolation
**CRITICAL:** Under NO circumstances are API responses cached by the service worker.
- All `/api/*` endpoints (authentication, profile, cart, checkout, payments, Razorpay tokens, orders, receipts, admin routes) are routed strictly through `NetworkOnly`.
- Service worker ignores authentication tokens, credentials, and payment data.

### Web Push Integration
- The push notification event handlers are maintained in `frontend/public/push-sw.js` and imported directly into the service worker bundle via `workbox.importScripts(['/push-sw.js'])`.
- `NotificationContext.jsx` acquires the active registration through `navigator.serviceWorker.ready` without duplicating service worker registrations.

---

## 3. PWA Installation Prompt (`PWAInstallPrompt`)
The `PWAInstallPrompt` component (`frontend/src/components/PWAInstallPrompt.jsx`) handles install promotion and user onboarding.

### Display Rules
1. **When Website Loads:** Appears automatically if the app is NOT already installed.
2. **Persistent Visibility:** Remains visible on screen until the user explicitly clicks the Close ("X" / "Not now") button or installs the application. No arbitrary timeouts.
3. **Session Dismissal:** Clicking Close ("X") dismisses the popup for the current browsing session across SPA route changes.
4. **Already-Installed Suppression:** If the user opens the application in installed mode (standalone/PWA), the popup is completely suppressed and never shown.

### Installed-State Detection (`isPWAInstalled`)
Defined in `frontend/src/utils/pwa.js`, detecting:
- iOS Safari standalone mode (`window.navigator.standalone === true`)
- Display mode media queries (`(display-mode: standalone)`, `minimal-ui`, `fullscreen`, `window-controls-overlay`)
- Android Trusted Web Activity (`document.referrer.startsWith('android-app://')`)
- `navigator.getInstalledRelatedApps()` asynchronous check

### Re-evaluation Triggers
The install state is continuously rechecked on:
- Initial mount
- `appinstalled` event
- `visibilitychange` event (when returning to the tab)
- `focus` event
- `(display-mode: standalone)` media query change events

---

## 4. Platform & Browser Compatibility
- **Chromium (Chrome, Edge, Samsung Internet, Android Chrome):**
  - Captures `beforeinstallprompt` event.
  - Prompts native browser install dialog upon clicking "Install".
  - Listens to `appinstalled` event to instantly update state and hide the prompt.
- **iOS Safari (iPhone & iPad):**
  - Identifies iOS WebKit environment without `beforeinstallprompt`.
  - Replaces broken install action with visual step-by-step guidance:
    1. Tap the **Share** button.
    2. Scroll and tap **Add to Home Screen**.
  - Respects `window.navigator.standalone` when launched from Home Screen.
- **Desktop Browsers without Native BIP (Firefox Desktop, etc.):**
  - Provides clear instructions to install via browser menu (`⋮` / `⊕`).
  - Never throws errors or fakes installation.

---

## 5. Development & Production Testing

### Development Verification
```bash
cd frontend
npm run dev
```

### Production Build & Preview
```bash
cd frontend
npm run build
npm run preview -- --port 4173
```

### Verification Checklist
- [x] `dist/manifest.webmanifest` generated with correct branding, colors, icons, and display mode.
- [x] `dist/sw.js` generated with Workbox precaching and `importScripts('/push-sw.js')`.
- [x] Icons generated at 192x192, 512x512, maskable 512x512, and 180x180.
- [x] Application registered exactly 1 service worker at scope `/`.
- [x] Install popup persists on page until dismissed or installed.
- [x] Popup closes upon clicking "X" for the session.
- [x] Popup never appears when running in standalone mode.
- [x] All 37 user and admin routes function without regression.
