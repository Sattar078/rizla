# Rizla Boutique Frontend Flow

## USER AUTH FLOWS

### Standard Sign-in Flow
```text
Home
  ↓
Login (/login)
  ↓
Authenticated User (AuthContext + localStorage token)
  ↓
Intended Destination / Products (/products)
```

### Registration Flow
```text
Home
  ↓
Signup (/signup)
  ↓
Auto-Login / Authenticated User
  ↓
Products (/products)
```

### Password Recovery Flow
```text
Login (/login)
  ↓
Forgot Password (/forgot-password)
  ↓
Submit Email (API: POST /api/auth/forgot-password)
  ↓
Reset Link with Token Dispatched (via Email)
  ↓
Reset Password (/reset-password/:token)
  ↓
Submit New Password (API: POST /api/auth/reset-password/:token)
  ↓
Password Reset Success
  ↓
Login (/login)
  ↓
Authenticated User
  ↓
Products (/products)
```

## USER SHOPPING FLOW

```text
Products (/products)
   ↓
Product Details (/products/:productId)
   ├── Add to Wishlist
   ├── Remove from Wishlist
   └── Add to Cart
         Cart (/cart)
           ↓
       Checkout (/checkout)
           ↓
       Address (/checkout/address)
           ↓
       Payment (/checkout/payment)
           ├── COD / Razorpay verified
           │     ↓
           │  Order Success (/order-success/:orderId)
           │     ├── Order Details (/orders/:orderId)
           │     ├── Receipt (/orders/:orderId/receipt)
           │     └── My Orders (/orders)
           └── Payment failed / cancelled
                 ↓
             Payment Failed (/payment-failed/:orderId)
                 └── Cart / My Orders
```

```text
Wishlist (/wishlist)
   ↓
Product Details (/products/:productId)
   ↓
Add to Cart
   ↓
Cart (/cart)
```

## Route Table

| Page | Route | Access | Previous | Next |
|------|-------|--------|----------|------|
| Home | `/` | Public | — | Products / Login / Signup |
| Login | `/login` | Public | Home / Signup / Reset Password | Authenticated Flow / Forgot Password |
| Signup | `/signup` | Public | Home / Login | Authenticated Flow / Login |
| Forgot Password | `/forgot-password` | Public | Login | Email Dispatched / Login |
| Reset Password | `/reset-password/:token` | Public | Forgot Password (Email Link) | Login |
| Products (Shop) | `/products` | Public | Home / Navbar / Portal | Product Details / Cart |
| Shop (Alias) | `/shop` | Public | Home / Navbar / Portal | Product Details / Cart |
| Portal | `/portal` | Public | Home | Login / Products / Admin |
| Product Details | `/products/:productId` | Public | Products / Wishlist | Cart / Wishlist |
| Wishlist | `/wishlist` | User | Header / Product Details | Product Details / Cart |
| Cart | `/cart` | User | Header / Product Details | Checkout |
| Checkout | `/checkout` | User | Cart | Checkout Address |
| Checkout Address | `/checkout/address` | User | Checkout | Checkout Payment |
| Checkout Payment | `/checkout/payment` | User | Checkout Address | Order Success / Payment Failed |
| Checkout Success (legacy) | `/checkout/success` | User | Checkout Payment (legacy) | — |
| Order Success | `/order-success/:orderId` | User | Checkout Payment | Order Details / My Orders |
| Payment Failed | `/payment-failed/:orderId` | User | Checkout Payment (Razorpay cancel/fail) | Cart / My Orders |
| Orders (My Orders) | `/orders` | User | Navbar / Order Success | Order Details |
| Checkout Success | `/checkout/success` | User | Checkout Payment | Orders / Products |
| Profile | `/profile` | User | Navbar | — |
| Orders | `/orders` | User | Navbar | Order Details |
| Order Details | `/orders/:orderId` | User | Orders | Order Receipt / Products |
| Admin Layout | `/admin` | Admin | Portal / Navbar | Admin Dashboard |
| Admin Orders | `/admin/orders` | Admin | Admin Dashboard | Admin Order Details |
| Admin Order Details | `/admin/orders/:orderId` | Admin | Admin Orders | Admin Orders |
| Admin Receipts | `/admin/receipts` | Admin | Admin Dashboard | Admin Receipt Details |
| Admin Receipt Details | `/admin/receipts/:orderId` | Admin | Admin Receipts | Admin Receipts / Admin Order Details |
| Admin Users | `/admin/users` | Admin | Admin Dashboard | Admin User Details |
| Admin User Details | `/admin/users/:userId` | Admin | Admin Users | Admin Users |
| Admin Categories | `/admin/categories` | Admin | Admin Dashboard | Create / Edit Category |
| Admin Products | `/admin/products` | Admin | Admin Dashboard | Product Details / Create |
| Order Receipt (User) | `/orders/:orderId/receipt` | User | Order Details | My Orders |

## Status Checklist:
- [x] Home connected to Products (/products), Login (/login), Signup (/signup).
- [x] Login connects to API, updates Context, handles redirect & links to /forgot-password and /signup.
- [x] Signup connects to API, updates Context, redirects to intended flow.
- [x] Forgot Password connects to backend endpoint (`POST /api/auth/forgot-password`).
- [x] Reset Password connects to backend endpoint (`POST /api/auth/reset-password/:token`).
- [x] Products / Shop connects to backend endpoints (`GET /api/products`, `GET /api/categories`), supports search with debounce, category filters, price range filters, loading skeletons, error retry, and empty state.
- [x] Product Details (`/products/:productId`) loads actual backend data, displays image gallery with thumbnail switcher, handles variant selection (size/color/stock), stock status, add to bag mutation with live TanStack Query cache invalidation, wishlist toggle with dynamic icon state, and embedded customer reviews.
- [x] Wishlist (`/wishlist`) connects to backend (`GET /api/users/wishlist`, `DELETE /api/users/wishlist/:productId`), displays user's saved items, allows deletion, provides navigation to product details, and handles empty/loading/error states.
- [x] Cart (`/cart`) connects to backend (`GET /api/cart`, `PUT /api/cart/:itemId`, `DELETE /api/cart/:itemId`, `DELETE /api/cart`), accurately calculates subtotal, provides + / - quantity controls with backend stock limits, item removal, cart clearing with confirmation, and direct checkout link (`/checkout`).
- [x] Admin Orders (`/admin/orders`) created, loading real backend order list (GET /api/orders/admin).
- [x] Admin Order Details (`/admin/orders/:orderId`) created, displaying items, address, customer details, payment info and updating order status via PATCH /api/orders/admin/:orderId/status.
- [x] Admin Receipts (`/admin/receipts`) created, listing all orders as receipt records linked to `/admin/receipts/:orderId`.
- [x] Admin Receipt Details (`/admin/receipts/:orderId`) created — final page. Reuses `orderApi.getOrderReceipt`, same receipt layout as user OrderReceipt.jsx, Print via window.print(), admin navigation toolbar, loading/error/not-found states.
- [x] Route `/admin/receipts/:orderId` added to App.jsx under AdminRoute + AdminLayout.
- [x] Duplicate `users/:id` route removed from App.jsx — only `users/:userId` remains.
- [x] All 37 approved routes exist in App.jsx and are correctly protected by ProtectedRoute / AdminRoute.
- [x] No dummy data anywhere — all pages consume real backend APIs.
- [x] No hardcoded localhost URLs — baseURL comes from VITE_API_URL env var.
- [x] No duplicate Axios clients — single api.js instance with auth interceptor.
- [x] Admin area fully protected: AdminRoute checks user.role === 'admin', redirects to /admin/login otherwise.
