# RIZLA BOUTIQUE — CODEBASE ISSUE & ERROR TRACKER

> Single source of truth for bugs, errors, warnings, security issues, broken integrations, regressions, and production-readiness issues across the complete RIZLA BOUTIQUE codebase.

**Rule:** Track first → Fix second → Verify third.

---

## 1. STATUS

- `OPEN` — discovered, not fixed
- `IN_PROGRESS` — being investigated/fixed
- `FIXED` — code changed, verification pending
- `VERIFIED` — fixed and tested
- `WONT_FIX` — intentionally not fixing; reason required
- `DUPLICATE` — already tracked by another issue
- `BLOCKED` — waiting for dependency/configuration

### Priority

- `P0 — CRITICAL` — security, payment/data corruption, production-breaking
- `P1 — HIGH` — major user/admin flow broken
- `P2 — MEDIUM` — important functionality/UX issue
- `P3 — LOW` — minor bug, warning, cleanup, polish

---

# 2. MASTER ISSUE TABLE

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

## RB-003 — Direct Route Blocked by Onboarding

**Status:** `VERIFIED`  
**Priority:** `P1 — HIGH`  
**Type:** `ROUTING`  
**Area:** `Frontend`  
**Environment:** `Development`  
**Date Discovered:** `2026-09-30`

### Location
- File: `frontend/src/App.jsx`
- Component: `AppFlow`

### Problem
Unauthenticated startup always showed splash/onboarding regardless of the current URL, hiding direct visits to public pages and preventing protected routes from redirecting to sign-in.

### Fix
Initialize onboarding only for `/`; allow other requested paths to render through the router.

### Verification
- Direct `/products` renders the shop.
- Direct `/profile` redirects to `/login`.
- Direct `/admin/users` redirects to `/admin/login`.
- `npm run build` succeeds.

**Verified By:** Copilot  
**Verification Date:** `2026-09-30`

## RB-004 — Razorpay Initialization Leaves an Orphaned Cart/Reservation

**Status:** `OPEN`  
**Priority:** `P1 — HIGH`  
**Type:** `PAYMENT_ERROR`  
**Area:** `Backend / Payment`  
**Environment:** `Development`  
**Date Discovered:** `2026-09-30`

### Location
- File: `frontend/src/pages/CheckoutPayment.jsx`
- Controller: `backend/src/controllers/order.controller.js`
- Routes: `POST /api/orders`, `POST /api/orders/:orderId/razorpay`, `POST /api/orders/:orderId/razorpay/fail`

### Problem
The checkout page creates an order before loading the Razorpay SDK or creating the gateway order. Backend order creation deducts variant stock and empties the cart. If SDK loading or Razorpay order creation fails, the user remains with an order but no cart; the failure endpoint only marks payment failed and does not restore the cart or stock. The Payment Failed page still offers “Return to Cart.”

### Expected Behavior
A gateway initialization or payment failure must leave a recoverable cart and must not permanently consume stock for an unpaid order.

### Verification
- Confirmed by tracing the frontend checkout sequence, order creation side effects, and payment failure handler.
- Razorpay success/failure integration was not exercised against sandbox credentials; no payment or order mutations were sent to the connected database.

### Next Step
Implement an idempotent recovery/reservation strategy and verify it using a disposable database and Razorpay test keys before marking fixed.

## RB-001 — Duplicate User Model Registration

**Status:** `VERIFIED`  
**Priority:** `P0 — CRITICAL`  
**Type:** `RUNTIME_ERROR`  
**Area:** `Backend`  
**Environment:** `Development`  
**Date Discovered:** `2026-09-30`

### Location
- File: `backend/src/controllers/notification.controller.js`

### Problem
The notification controller imported `../models/User`, while the model file and all other imports use lowercase `user.js`. Node loaded the same model source under different module paths and Mongoose threw `OverwriteModelError`.

### Fix
Normalized the notification controller import to `../models/user`.

### Verification
- App imports successfully.
- Backend starts and connects to MongoDB.
- `GET /` returns HTTP 200 with `Rizla Boutique API is running`.

**Verified By:** Copilot  
**Verification Date:** `2026-09-30`

## RB-002 — Invalid Notification Route Middleware

**Status:** `VERIFIED`  
**Priority:** `P0 — CRITICAL`  
**Type:** `RUNTIME_ERROR`  
**Area:** `Backend`  
**Environment:** `Development`  
**Date Discovered:** `2026-09-30`

### Location
- File: `backend/src/routes/notification.routes.js`
- Middleware: `backend/src/middleware/auth.middleware.js`

### Problem
The auth middleware exports a function directly, but the notification routes destructured a `protect` property. This passed `undefined` to `router.use()` and caused Express startup to throw `argument handler is required`.

### Fix
Imported the middleware function directly.

### Verification
- App imports successfully.
- Backend starts and connects to MongoDB.
- `GET /` returns HTTP 200 with `Rizla Boutique API is running`.

**Verified By:** Copilot  
**Verification Date:** `2026-09-30`

**Never delete historical issues. Change their status instead.**

## RB-005 — Forgot-Password Account Enumeration

**Status:** `VERIFIED`  
**Priority:** `P2 — MEDIUM`  
**Type:** `SECURITY`  
**Area:** `Authentication`  
**Environment:** `Development / Production`  
**Location:** `backend/src/controllers/auth.controller.js`, `forgotPassword`

**Problem:** Unknown emails previously received HTTP 404 while known emails proceeded to email delivery.  
**Fix:** Unknown accounts now receive the same generic HTTP 200 success response as existing accounts.  
**Verification:** Stubbed an unknown-email lookup and confirmed HTTP 200 with the generic response, without database writes or email delivery.

## RB-006 — Missing Baseline API Protections

**Status:** `VERIFIED`  
**Priority:** `P2 — MEDIUM`  
**Type:** `SECURITY`  
**Area:** `Backend`  
**Environment:** `Development / Production`  
**Location:** `backend/src/app.js`, `backend/src/routes/auth.routes.js`

**Problem:** Helmet and authentication-route rate limiting were not configured although both dependencies were installed.  
**Fix:** Applied Helmet globally and bounded signup/login/password-reset request rates with standard rate-limit headers.  
**Verification:** An ephemeral app returned `X-Content-Type-Options: nosniff`; the 11th login request returned HTTP 429.

---

## RB-007 — Missing PWA Configuration, Web Manifest, and Installability

**Status:** `VERIFIED`  
**Priority:** `P1 — HIGH`  
**Type:** `CONFIGURATION`  
**Area:** `Frontend`  
**Environment:** `Development / Production`  
**Detected By:** `Gemini 3.8`  
**Date Discovered:** `2026-10-01`

### Location
- File: `frontend/vite.config.js`, `frontend/index.html`, `frontend/src/components/PWAInstallPrompt.jsx`, `frontend/src/utils/pwa.js`

### Problem
The frontend lacked a web app manifest, standard PWA icons (192x192, 512x512, maskable 512x512, 180x180), service worker precaching, and install promotion capability.

### Root Cause
Initial application setup was an unconfigured SPA without PWA support or manifest linkage.

### Fix
Integrated `vite-plugin-pwa` with branded manifest (`RIZLA BOUTIQUE`, `#17332b` theme color, `#fbfaf7` background color, `standalone` display mode), generated high-resolution brand icons, and implemented `PWAInstallPrompt` with native install prompt triggering, session dismissal, and robust `isPWAInstalled()` detection.

### Verification
- `npm run build` succeeds and produces `dist/manifest.webmanifest`, `dist/sw.js`, and icon assets.
- Chrome DevTools evaluation verifies manifest link, service worker registration at scope `/`, and persistent popup rendering.

---

## RB-008 — Standalone Service Worker Conflict and API Route Exposure

**Status:** `VERIFIED`  
**Priority:** `P1 — HIGH`  
**Type:** `RUNTIME_ERROR`  
**Area:** `Frontend / Service Worker`  
**Environment:** `Production`  
**Detected By:** `Gemini 3.8`  
**Date Discovered:** `2026-10-01`

### Location
- File: `frontend/public/sw.js`, `frontend/public/push-sw.js`, `frontend/src/context/NotificationContext.jsx`, `frontend/vite.config.js`

### Problem
A static `public/sw.js` created file collision with the generated Workbox service worker. Additionally, service worker caching could potentially intercept sensitive API routes.

### Root Cause
Push notification handlers were placed directly in `public/sw.js` without integrating into the PWA build pipeline or defining explicit network-only rules for `/api`.

### Fix
Extracted push notification handlers to `public/push-sw.js` and imported them into Workbox via `importScripts(['/push-sw.js'])`. Configured Workbox runtime caching to strictly route `/api/*` via `NetworkOnly`. Updated `NotificationContext.jsx` to coordinate with `navigator.serviceWorker.ready`.

### Verification
- Single service worker registered at `/sw.js` with push support.
- All `/api/*` requests bypass cache with NetworkOnly.

---

## RB-009 — Deprecated Apple Mobile Web App Meta Tag Warning

**Status:** `VERIFIED`  
**Priority:** `P3 — LOW`  
**Type:** `WARNING`  
**Area:** `Frontend / HTML`  
**Environment:** `Development / Production`  
**Detected By:** `Gemini 3.8`  
**Date Discovered:** `2026-10-01`

### Location
- File: `frontend/index.html`

### Problem
Modern Chromium browsers emit a console warning: `<meta name="apple-mobile-web-app-capable" content="yes"> is deprecated. Please include <meta name="mobile-web-app-capable" content="yes">`.

### Root Cause
Only the Apple-specific mobile web app meta tag was present.

### Fix
Added `<meta name="mobile-web-app-capable" content="yes" />` in `index.html`.

### Verification
- Tested in browser console; deprecation warning resolved.

---

# 3. ISSUE TYPES

Use one of:

`BUG` · `RUNTIME_ERROR` · `BUILD_ERROR` · `API_ERROR` · `DATABASE_ERROR` · `AUTH_ERROR` · `VALIDATION_ERROR` · `PAYMENT_ERROR` · `SECURITY` · `PERFORMANCE` · `UI/UX` · `ROUTING` · `INTEGRATION` · `DEPLOYMENT` · `CONFIGURATION` · `DEPENDENCY` · `WARNING` · `REGRESSION` · `CODE_QUALITY`

---

# 4. DETAILED ISSUE TEMPLATE

## RB-XXX — [SHORT ISSUE TITLE]

**Status:** `OPEN`  
**Priority:** `P1 — HIGH`  
**Type:** `BUG`  
**Area:** `Frontend / Backend / Database / Payment / Auth / Deployment`  
**Environment:** `Development / Production`  
**Detected By:** `Gemini 3.8 / GPT-OSS / Manual / Browser / Backend / Build`  
**Date Discovered:** `YYYY-MM-DD`

### Location
- File:
- Component:
- Route:
- API Endpoint:
- Controller:
- Model:
- Middleware:
- Line/Function:

### Problem
Describe exactly what is wrong.

### Expected Behavior
What should happen?

### Actual Behavior
What currently happens?

### Reproduction Steps
1.
2.
3.
4.

### Error / Console Output
```text
Paste exact error here.
```

### Network/API Details
```text
Method:
Endpoint:
Status Code:
Request:
Response:
```

### Root Cause
Explain the technical cause once identified.

### Proposed Fix
Describe the smallest safe fix.

### Files Changed
- `path/to/file`

### Verification
- [ ] Issue reproduced before fix
- [ ] Fix implemented
- [ ] App starts successfully
- [ ] Relevant API tested
- [ ] Relevant route tested
- [ ] Regression test/manual test completed
- [ ] Console checked
- [ ] Network requests checked
- [ ] Mobile/responsive checked if applicable

**Verified By:**  
**Verification Date:**

---

# 5. FRONTEND AUDIT CHECKLIST

## Authentication
- [ ] Signup
- [ ] Login/logout
- [ ] Invalid credentials
- [ ] JWT/token handling
- [ ] Expired token
- [ ] Protected routes
- [ ] Admin route protection
- [ ] Forgot password
- [ ] Reset password
- [ ] Change password

## Products
- [ ] Product list
- [ ] Product details
- [ ] Search
- [ ] Category
- [ ] Filters
- [ ] Product images
- [ ] Wishlist add/remove
- [ ] Loading/error/empty states

## Cart
- [ ] Add product
- [ ] Update quantity
- [ ] Remove item
- [ ] Clear cart
- [ ] Correct totals
- [ ] Stock/variant handling
- [ ] Empty cart

## Checkout & Payments
- [ ] Checkout
- [ ] Address selection/validation
- [ ] COD
- [ ] Razorpay
- [ ] Payment success
- [ ] Payment failure
- [ ] Duplicate submission prevention
- [ ] Correct order navigation

## Orders & Receipts
- [ ] Order list
- [ ] Order details
- [ ] Cancellation where supported
- [ ] Correct order/payment status
- [ ] User receipt
- [ ] Admin receipt
- [ ] Print/download where implemented

## Profile
- [ ] Profile view/update
- [ ] Add/update/delete address
- [ ] Default address
- [ ] Change password

## Admin
- [ ] Admin login
- [ ] Dashboard
- [ ] Users/user details
- [ ] Categories/create/edit/delete
- [ ] Products/create/edit/details/delete
- [ ] Image upload/delete
- [ ] Orders/order details/status
- [ ] Receipts/receipt details

---

# 6. BACKEND AUDIT CHECKLIST

## Server
- [ ] Server starts
- [ ] Production mode
- [ ] Environment variables
- [ ] Global error handler
- [ ] 404 handling
- [ ] Async errors
- [ ] Graceful shutdown
- [ ] Health endpoint

## Authentication
- [ ] Password hashing
- [ ] JWT generation/verification
- [ ] Token expiration
- [ ] Protected middleware
- [ ] Admin middleware
- [ ] Ownership checks
- [ ] Sensitive fields excluded

## Validation
- [ ] Body
- [ ] Params
- [ ] Query
- [ ] ObjectIds
- [ ] Products
- [ ] Addresses
- [ ] Cart
- [ ] Orders
- [ ] Payments

## Database
- [ ] MongoDB connection
- [ ] Connection failure handling
- [ ] Models
- [ ] Useful indexes
- [ ] Duplicate indexes
- [ ] Query efficiency
- [ ] Populate usage

## APIs
- [ ] Auth
- [ ] Profile
- [ ] Addresses
- [ ] Categories
- [ ] Products
- [ ] Search/filter
- [ ] Wishlist
- [ ] Cart
- [ ] Orders
- [ ] Reviews
- [ ] Admin users/categories/products/orders
- [ ] Receipts
- [ ] Upload

---

# 7. PAYMENT AUDIT

## Razorpay
- [ ] Secret key backend-only
- [ ] Order creation
- [ ] Server-side amount
- [ ] Signature verification
- [ ] Payment/order ID validation
- [ ] Duplicate payment handling
- [ ] Success/failure handling
- [ ] Order/payment status consistency
- [ ] No secrets in frontend
- [ ] Test keys removed before production

## COD
- [ ] COD order creation
- [ ] Correct payment method
- [ ] Correct payment status
- [ ] Correct order status
- [ ] No accidental online-paid state

---

# 8. SECURITY AUDIT

- [ ] `.env` not committed
- [ ] No secrets in source
- [ ] No secrets in frontend
- [ ] JWT secret protected
- [ ] MongoDB credentials protected
- [ ] Cloudinary secret protected
- [ ] Razorpay secret protected
- [ ] Email credentials protected
- [ ] Password hashes never returned
- [ ] Reset tokens never exposed
- [ ] Admin APIs protected
- [ ] User ownership enforced
- [ ] Server-side validation
- [ ] CORS reviewed
- [ ] Security headers reviewed
- [ ] Rate limiting reviewed
- [ ] Upload restrictions reviewed
- [ ] Production errors sanitized
- [ ] Sensitive logs removed

---

# 9. ROUTING AUDIT

## User
- [ ] `/`
- [ ] `/login`
- [ ] `/signup`
- [ ] `/forgot-password`
- [ ] `/reset-password/:token`
- [ ] `/products`
- [ ] `/products/:productId`
- [ ] `/search`
- [ ] `/category/:categoryId`
- [ ] `/wishlist`
- [ ] `/cart`
- [ ] `/checkout`
- [ ] `/checkout/address`
- [ ] `/checkout/payment`
- [ ] `/order-success/:orderId`
- [ ] `/payment-failed/:orderId`
- [ ] `/profile`
- [ ] `/profile/addresses`
- [ ] `/profile/change-password`
- [ ] `/orders`
- [ ] `/orders/:orderId`
- [ ] `/orders/:orderId/receipt`

## Admin
- [ ] `/admin/login`
- [ ] `/admin`
- [ ] `/admin/users`
- [ ] `/admin/users/:userId`
- [ ] `/admin/categories`
- [ ] `/admin/categories/create`
- [ ] `/admin/categories/:categoryId/edit`
- [ ] `/admin/products`
- [ ] `/admin/products/create`
- [ ] `/admin/products/:productId`
- [ ] `/admin/products/:productId/edit`
- [ ] `/admin/orders`
- [ ] `/admin/orders/:orderId`
- [ ] `/admin/receipts`
- [ ] `/admin/receipts/:orderId`

---

# 10. DEPLOYMENT AUDIT

## Backend
- [ ] `NODE_ENV=production`
- [ ] Production MongoDB URI
- [ ] JWT secret
- [ ] Cloudinary credentials
- [ ] Razorpay credentials
- [ ] Email configuration
- [ ] Frontend production URL
- [ ] Production CORS
- [ ] Health endpoint
- [ ] Safe production errors
- [ ] Logs reviewed

## Frontend
- [ ] Production API URL
- [ ] Production environment variables
- [ ] No localhost API URLs
- [ ] No backend secrets
- [ ] Production build succeeds
- [ ] SPA fallback
- [ ] Images load
- [ ] API requests work
- [ ] Authentication works

## Domain / HTTPS
- [ ] Custom domain
- [ ] HTTPS
- [ ] Frontend domain
- [ ] Backend/API domain
- [ ] CORS updated
- [ ] Payment origin/config checked

---

# 11. REGRESSION TEST MATRIX

| Flow | Result | Issue ID | Notes |
|---|---|---|---|
| Signup → Login | ⬜ | — | |
| Login → Products | ⬜ | — | |
| Search → Product | ⬜ | — | |
| Product → Wishlist | ⬜ | — | |
| Product → Cart | ⬜ | — | |
| Cart → Checkout | ⬜ | — | |
| Checkout → COD | ⬜ | — | |
| Checkout → Razorpay | ⬜ | — | |
| Payment → Order Success | ⬜ | — | |
| Payment Failure | ⬜ | — | |
| Orders → Order Details | ⬜ | — | |
| Order → Receipt | ⬜ | — | |
| Admin Login | ⬜ | — | |
| Admin → Users | ⬜ | — | |
| Admin → Categories | ⬜ | — | |
| Admin → Products | ⬜ | — | |
| Admin → Orders | ⬜ | — | |
| Admin → Receipts | ⬜ | — | |

Use: `PASS` / `FAIL` / `BLOCKED` / `NOT TESTED`

---

# 12. AI AGENT DISCOVERY PROMPT

Use this before asking an agent to modify code:

```text
Do not immediately modify the code.

First inspect the complete relevant codebase and identify:
1. Runtime errors
2. Build errors
3. API integration errors
4. Authentication errors
5. Authorization errors
6. Database errors
7. Validation errors
8. Payment errors
9. Routing errors
10. Security vulnerabilities
11. Performance issues
12. UI/UX bugs
13. Deployment/configuration problems
14. Regression risks

For every issue:
- assign a unique RB issue ID
- record exact file/location
- record severity
- record reproduction steps
- record expected behavior
- record actual behavior
- record root cause if known

Do not fix issues during discovery unless explicitly instructed.

After discovery, update the issue tracker and present the issue list.
```

---

# 13. AI AGENT FIX PROMPT

```text
You are fixing tracked RIZLA BOUTIQUE issue: RB-XXX.

Before modifying code:
1. Read the issue details.
2. Inspect the relevant implementation.
3. Reproduce the issue if possible.
4. Identify the root cause.

Then:
5. Make the smallest safe fix.
6. Do not rewrite unrelated code.
7. Do not add unrequested features.
8. Do not change API contracts unnecessarily.
9. Test the affected flow.
10. Check for regressions.

After fixing:
- update RB-XXX to FIXED
- document files changed
- document what was fixed
- document verification performed

Do not mark VERIFIED unless the fix was actually tested.
```

---

# 14. ISSUE ID RULE

Always increment:

`RB-001`, `RB-002`, `RB-003` ...

Never reuse an old ID.

For duplicates:

```text
Status: DUPLICATE
Duplicate Of: RB-XXX
```

For intentional non-fixes:

```text
Status: WONT_FIX
Reason: ...
```

---

# 15. CURRENT PROJECT STATUS

## Backend
- [ ] Production hardening
- [ ] Security audit
- [ ] Payment audit
- [ ] Database audit
- [ ] Deployment preparation

## Frontend
- [ ] Production hardening
- [ ] API integration audit
- [ ] Responsive audit
- [ ] Build verification
- [ ] Deployment preparation

## Infrastructure
- [ ] MongoDB production configuration
- [ ] Cloudinary production configuration
- [ ] Razorpay production configuration
- [ ] Backend deployment
- [ ] Frontend deployment
- [ ] Domain
- [ ] HTTPS

## Final
- [ ] Full regression testing
- [ ] Security verification
- [ ] Payment verification
- [ ] Mobile verification
- [ ] Production smoke test
- [ ] Launch

---

# 16. DEFINITION OF DONE

RIZLA BOUTIQUE is production-ready only when:

- [ ] No P0 issues remain OPEN
- [ ] No P1 issues remain OPEN
- [ ] Critical security issues are VERIFIED
- [ ] Payment flow is VERIFIED
- [ ] Authentication is VERIFIED
- [ ] Admin authorization is VERIFIED
- [ ] Main purchase flow is VERIFIED
- [ ] Main admin flow is VERIFIED
- [ ] Production builds succeed
- [ ] Production environment variables are configured
- [ ] No secrets are exposed
- [ ] Frontend connects to production backend
- [ ] Backend connects to production database
- [ ] Mobile flow is tested
- [ ] Production smoke test passes

---

# 17. CORE RULE

Never:

- mark VERIFIED without testing
- delete fixed issues
- reuse issue IDs
- combine unrelated bugs
- mark fixed only because code changed
- ignore security/payment issues
- create fake test results

Workflow:

**DISCOVER → TRACK → FIX → TEST → VERIFY**
