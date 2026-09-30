# FRONTEND FLOW DOCUMENTATION

## 1. Overview
This document outlines the final, implemented frontend flows for the RIZLA BOUTIQUE MERN e-commerce application. The application strictly limits features to the approved production scope.

## 2. User Flows
### Authentication
- `Signup`: User provides details (name, email, phone, password). On success, redirected to login.
- `Login`: Standard credentials login. Token stored in localStorage. AuthContext handles state.
- `Forgot/Reset Password`: Flow via token verification.

### Shopping Experience
- `Home`: Displays landing page content, featured products.
- `Shop (/products)`: Complete product catalog. Supports searching, category filtering, and min/max price range filtering. State synced with URL parameters.
- `Product Details (/products/:productId)`: Show product images, description, size/color variant selection, and Add to Cart/Wishlist functionality.
- `Category (/category/:categoryId)`: Direct link to category-filtered shop.

### Cart & Checkout
- `Cart (/cart)`: Displays added items, quantity adjustments, item removal, and subtotal calculation.
- `Checkout Address (/checkout/address)`: User selects an existing address or adds a new one. Address validated with Zod.
- `Checkout Payment (/checkout/payment)`: Final order review and payment selection.
  - **Razorpay**: Integrated directly using the Razorpay window/modal. Backend verifies signature. Success redirects to `/order-success/:orderId`.
  - **COD**: Cash on delivery flow bypassing payment gateways. Success redirects to `/order-success/:orderId`.

### Profile & Orders
- `Profile (/profile)`: Display/edit basic user information.
- `Addresses (/profile/addresses)`: Manage saved delivery addresses.
- `Orders (/orders)`: List past orders with status.
- `Order Details (/orders/:orderId)`: Granular details about a specific order, payment method, shipping, items.
- `Receipt (/orders/:orderId/receipt)`: Digital, printable receipt view of the fulfilled order.

## 3. Admin Flows
Admin functionality is protected on the frontend (`AdminRoute`) and backend (`adminOnly` middleware).

- `Admin Login (/admin/login)`: Separate access point for admin authorization.
- `Dashboard (/admin)`: Overview metrics (Total users, products, revenue, order stats).
- `Users Management`: List all users (`/admin/users`), view user details.
- `Category Management`: List (`/admin/categories`), Create, Edit categories.
- `Product Management`: List catalog (`/admin/products`), Create new products, View details (`/admin/products/:productId`), Edit product data and upload images (via Cloudinary integration).
- `Order Management`: View all orders (`/admin/orders`), Order Details (`/admin/orders/:orderId`). Admins can update the `orderStatus` (processing, shipped, delivered, cancelled) and `paymentStatus`.
- `Receipts`: List generated receipts (`/admin/receipts`), Detailed receipt view for printing (`/admin/receipts/:orderId`).

## 4. Technical Constraints
- **TanStack Query**: Handles caching, fetching, and refetching. Mutations explicitly invalidate relevant query keys (e.g., updating a product invalidates `['product', productId]` and `['products']`).
- **Validation**: Strict schema validation using Zod and React Hook Form. Matches backend expectations perfectly.
- **Security**: No backend secrets (e.g., JWT_SECRET, Cloudinary secret, Razorpay secret) are exposed in the frontend. All API calls use environment variable `VITE_API_URL`.
- **Payment**: Razorpay key is retrieved securely during order initialization. COD relies solely on internal state and backend validation.
