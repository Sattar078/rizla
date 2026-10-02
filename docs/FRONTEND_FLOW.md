# FRONTEND FLOW DOCUMENTATION
## Scope and Verification

This document covers the 37 approved user/admin pages. Routes are defined in `frontend/src/App.jsx`; user pages use `ProtectedRoute`, and admin pages use `AdminRoute` plus the backend's `protect` and `adminOnly` middleware. API requests share the Axios client in `frontend/src/services/api.js`, which uses `VITE_API_URL` (default `http://localhost:5000`) and attaches the stored JWT.

**Verified in this audit:** the production frontend build succeeds; direct `/products` renders; logged-out `/profile` redirects to `/login`; logged-out `/admin/users` redirects to `/admin/login`; backend health, product, and category reads return HTTP 200; unauthenticated profile/admin-dashboard reads return HTTP 401. The remaining page flows are code-mapped below, not claimed as end-to-end tested.

## PWA Entry and Installation Lifecycle

```
Website Load
↓
Check PWA Installed
├── YES → Normal App / No Install Popup
└── NO → Show Install Popup
             ├── INSTALL → Native Install Prompt
             │                  ↓
             │              Installed
             │                  ↓
             │             Hide Popup
             │
             └── X → Hide Popup For Current Session
```

The PWA install prompt is persistent while the user browses the application until explicitly closed or successfully installed. On iOS Safari, actionable step-by-step guidance is presented. If the application is launched from the home screen or running in standalone mode, the install prompt is automatically suppressed.

## User Pages

| Page | Route | Purpose, access, and API | Entry → next / navigation | Loading, empty, error, success |
|---|---|---|---|---|
| Home | `/` | Public entry and featured catalog; `GET /api/products` | Onboarding or home link → products, search, login, product details | Product loading; no-featured-products fallback; catalog error handling; product cards on success |
| Login | `/login` | Authenticate; `POST /api/auth/login` | Navbar, checkout guard, signup, forgot password → saved destination or home | Submit loading; field/API errors; success stores JWT and user |
| Signup | `/signup` | Create account; `POST /api/auth/signup` | Login/navbar → authenticated home | Submit loading; validation/API errors; success stores JWT and user, then home |
| Forgot Password | `/forgot-password` | Request reset link; `POST /api/auth/forgot-password` | Login → reset confirmation or login | Submit loading; validation/API errors; success confirmation; no list empty state |
| Reset Password | `/reset-password/:token` | Change password with reset token; `POST /api/auth/reset-password/:token` | Email reset link → login | Submit loading; invalid/expired-token and validation errors; success confirmation |
| Products | `/products` | Browse/filter catalog; `GET /api/products` with search/category/price query; `GET /api/categories` | Home, navbar, category/search → product details | Query loading; empty catalog/filter result; query error/retry; product grid on success |
| Product Details | `/products/:productId` | View product/variants, wishlist, cart, reviews; `GET /api/products/:productId`, product reviews endpoints, wishlist endpoints, `POST /api/cart` | Products/search/category/wishlist → wishlist, cart, reviews, products | Product/review loading; invalid/missing product and empty reviews; API errors; product and actions on success |
| Search | `/search` | Search catalog; `GET /api/products?search=...` | Navbar/home/products → product details or products | Query loading; initial prompt/no results; error with retry; matching cards on success |
| Category | `/category/:categoryId` | Resolve category and list products; `GET /api/categories`, `GET /api/products?category=...` | Category links/products → product details or all products | Category/product loading; invalid category/no products; API error/retry; filtered grid on success |
| Wishlist | `/wishlist` | View/remove saved products; `GET /api/users/wishlist`, `DELETE /api/users/wishlist/:productId` | Product details/navbar → product details/cart/products | Query loading; empty wishlist; query/mutation errors; updated list on success |
| Cart | `/cart` | Review items, update quantity, remove/clear; `/api/cart` GET/POST/PUT/DELETE | Product details/navbar → checkout or products | Query loading; empty cart; query/mutation errors; refreshed totals on success |
| Checkout | `/checkout` | Confirm cart contents; `GET /api/cart` | Cart → checkout address or cart/products if empty | Cart loading; empty-cart state; query failure; summary on success |
| Checkout Address | `/checkout/address` | Select/add delivery address; `GET/POST/PUT /api/users/addresses`, `GET /api/cart` | Checkout/profile → checkout payment or address form | Address/cart loading; empty saved addresses; API/validation errors; selected address passed in navigation state |
| Checkout Payment | `/checkout/payment` | Create COD/Razorpay order; cart/address reads; `POST /api/orders`, Razorpay create/verify/fail endpoints | Checkout address → order success or payment failed | Cart/address loading; empty cart/invalid address redirects; payment/API errors; success route after COD or verified payment |
| Order Success | `/order-success/:orderId` | Show placed order; `GET /api/orders/:orderId` | COD/verified payment → order details, orders, receipt, products | Order loading; inaccessible/missing order error; order summary on success |
| Payment Failed | `/payment-failed/:orderId` | Show failed payment order; `GET /api/orders/:orderId`; failure callback uses `POST /api/orders/:orderId/razorpay/fail` | Razorpay failure/dismissal → cart, order details, orders, products | Order loading; inaccessible/missing order error; order/payment state on success. **Known recovery gap:** cart and stock are not restored after initialization/payment failure (RB-004). |
| Profile | `/profile` | View/update account; `GET/PUT /api/users/profile`, `GET /api/users/addresses` | Navbar/account menu → addresses, change password, orders | Profile loading; API errors; profile form on success |
| Addresses | `/profile/addresses` | Add/update/delete saved addresses; `GET/POST/PUT/DELETE /api/users/addresses` | Profile/checkout address → profile or checkout address | Query loading; empty address list; API/validation errors; updated list on success |
| Change Password | `/profile/change-password` | Update authenticated password; `PUT /api/auth/change-password` | Profile → profile/login | Submit loading; validation/API errors; success confirmation |
| My Orders | `/orders` | List current user's orders; `GET /api/orders` | Profile, order success, navbar → order details | Query loading; no-orders state; API error; newest-first list on success |
| Order Details | `/orders/:orderId` | View/cancel own order and review; `GET /api/orders/:orderId`, `PATCH /api/orders/:orderId/cancel`, review endpoints | My orders/order success → receipt, review, orders | Order/review loading; missing/unauthorized order; API/mutation errors; order details on success |
| Receipt | `/orders/:orderId/receipt` | Render/print own receipt; `GET /api/orders/:orderId/receipt` | Order details/order success → order details/orders | Receipt loading; missing/unauthorized receipt; API error; receipt/print on success |

## Admin Pages

| Page | Route | Purpose, access, and API | Entry → next / navigation | Loading, empty, error, success |
|---|---|---|---|---|
| Admin Login | `/admin/login` | Shared credential login plus admin-role check; `POST /api/auth/login` | Admin entry/protected-route redirect → dashboard or requested admin page | Submit loading; credentials/role errors; success stores JWT and navigates |
| Admin Dashboard | `/admin` | Store overview; `GET /api/admin/dashboard` | Admin login/sidebar → users, categories, products, orders, receipts | Query loading; zero-stat values; API error; metrics on success |
| Admin Users | `/admin/users` | List users; `GET /api/users/admin` | Dashboard/sidebar → user details | Query loading; empty user list; API error; user list on success |
| Admin User Details | `/admin/users/:userId` | View/change user role; `GET /api/users/admin/:userId`, `PATCH /api/users/admin/:userId/role` | User list → users | Query/mutation loading; missing user; API error; user detail on success |
| Admin Categories | `/admin/categories` | List/delete categories; `GET /api/categories`, `DELETE /api/categories/:categoryId` | Dashboard/sidebar → create/edit category | Query loading; empty categories; API/mutation error; category list on success |
| Create Category | `/admin/categories/create` | Create category; `POST /api/categories` | Category list → category list/edit | Submit loading; validation/API errors; success navigates to category list |
| Edit Category | `/admin/categories/:categoryId/edit` | Update category; category read and `PUT /api/categories/:categoryId` | Category list → category list | Category/form loading; missing category; validation/API errors; success navigates to category list |
| Admin Products | `/admin/products` | List/filter/delete products; `GET /api/products`, `DELETE /api/products/:productId` | Dashboard/sidebar → create/details/edit | Query loading; empty catalog; API error; product table/grid on success |
| Create Product | `/admin/products/create` | Create product/upload images; categories read, `POST /api/products`, `POST /api/upload/products` | Product list → product details/list | Categories/upload/submit loading; no categories; validation/API/upload errors; success navigates to products |
| Admin Product Details | `/admin/products/:productId` | Inspect one product; `GET /api/products/:productId` | Product list → edit/list | Query loading; missing product; API error; product detail on success |
| Edit Product | `/admin/products/:productId/edit` | Update product/images; product/category reads, `PUT /api/products/:productId`, image upload/delete endpoints | Product details/list → product details/list | Form/data loading; missing product; validation/API/upload errors; updated product on success |
| Admin Orders | `/admin/orders` | List all orders; `GET /api/orders/admin` | Dashboard/sidebar → order details | Query loading; empty orders; API error; order list on success |
| Admin Order Details | `/admin/orders/:orderId` | View order/update status; `GET /api/orders/admin/:orderId`, `PATCH /api/orders/admin/:orderId/status` | Order list → orders/receipt details | Query/mutation loading; missing order; API/status-transition errors; updated order on success |
| Admin Receipts | `/admin/receipts` | List order receipt records; `GET /api/orders/admin` | Dashboard/sidebar → receipt details | Query loading; empty receipts; API error; receipt list on success |
| Admin Receipt Details | `/admin/receipts/:orderId` | Render/print receipt; `GET /api/orders/:orderId/receipt` (backend allows admin or owner) | Receipts/order details → receipts/order details | Receipt loading; missing/unauthorized receipt with retry; receipt/print on success |

## Shared Flow and Known Limits

- Authentication restores the JWT by calling `GET /api/users/profile`; `ProtectedRoute` redirects logged-out users to `/login`, and `AdminRoute` redirects non-admin users to `/admin/login`. Backend APIs independently enforce the same access rules.
- Backend responses use Helmet security headers; signup/login are limited to 10 requests per 15 minutes per IP, and password-reset requests are limited to 5 per 15 minutes per IP. Forgot-password responses are generic to avoid disclosing account existence.
- Product, cart, order, review, and user hooks use TanStack Query. Mutations invalidate the corresponding existing query keys.
- RB-005 and RB-006 are verified mitigations for email enumeration and baseline API protections; this does not constitute a full penetration test.
- Forms use React Hook Form/Zod where implemented. Errors and loading states are page-specific; see the page notes above rather than assuming a uniform handler.
- Razorpay secrets remain backend-only; the frontend receives the public key ID from order initialization. Gateway success/failure still requires a sandbox test.
- RB-004 remains open: Razorpay failures can strand an order while cart contents and reserved stock are not restored. Do not treat the payment flow as verified until fixed and tested against disposable data/test keys.
- The route smoke test did not submit signup/login, mutate user data, create/cancel orders, upload to Cloudinary, or perform admin CRUD. These require dedicated test accounts/data and, for payment/upload, sandbox credentials.
- Existing non-approved routes/features (`/portal`, `/shop`, `/checkout/success`, and notification broadcast controls) remain in the codebase; this audit did not remove or redesign them.
