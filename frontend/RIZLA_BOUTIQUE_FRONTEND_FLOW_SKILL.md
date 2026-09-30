# RIZLA BOUTIQUE --- Frontend Page & Flow Management Skill

## Purpose

This skill ensures that every frontend page created for the Rizla
Boutique application is:

1.  Connected to the correct application flow.
2.  Connected to the correct backend/API functionality.
3.  Reachable through the correct navigation.
4.  Protected by the correct authentication/authorization rules.
5.  Consistent with the existing routing structure.
6.  Added to the documented application workflow.
7.  Never created as an isolated/disconnected page.

The application has two main areas:

-   USER
-   ADMIN

The frontend must follow the existing backend capabilities and must not
invent new business features.

------------------------------------------------------------------------

# 1. CORE RULE --- NEVER CREATE AN ISOLATED PAGE

Whenever a new page is created, the agent MUST determine:

-   Where the user enters the page.
-   Where the user can go from the page.
-   What API/backend functionality the page uses.
-   What authentication is required.
-   What page comes before it.
-   What page comes after it.
-   Whether the page belongs to User or Admin flow.
-   Whether the route already exists.
-   Whether the page must be added to the application's flow
    documentation.

A page is NOT considered complete until its navigation and flow
connections are complete.

### Required completion chain

``` text
Page UI
  ↓
Route
  ↓
Navigation Entry
  ↓
Previous Page Connection
  ↓
Next Page Connection
  ↓
API Integration
  ↓
Auth / Role Protection
  ↓
Loading / Error / Empty States
  ↓
Flow Documentation Update
```

------------------------------------------------------------------------

# 2. BEFORE CREATING ANY PAGE

Before writing code, inspect the existing project.

Check:

``` text
frontend/
├── src/
│   ├── pages/
│   ├── components/
│   ├── layouts/
│   ├── routes/
│   ├── services/
│   ├── hooks/
│   ├── context/
│   └── ...
```

Also inspect:

-   Existing React Router configuration.
-   Existing layouts.
-   Existing navigation components.
-   Existing API service layer.
-   Existing TanStack Query hooks.
-   Existing authentication state.
-   Existing protected-route logic.
-   Existing admin-route logic.
-   Existing page naming conventions.
-   Existing UI/design system.

Do NOT create duplicate routes, duplicate API clients, duplicate auth
logic, or duplicate components when an existing implementation can be
reused.

------------------------------------------------------------------------

# 3. PAGE CREATION WORKFLOW

For every new page follow this exact sequence.

## Step 1 --- Identify the page

Determine:

``` text
Page Name:
Area: USER / ADMIN
Route:
Purpose:
Previous Page:
Next Page:
Required Auth:
Required Role:
Backend APIs:
```

------------------------------------------------------------------------

## Step 2 --- Check route availability

Before adding a route:

-   Search the router.
-   Check whether the route already exists.
-   Check whether a dynamic route already covers it.
-   Check for conflicting route order.
-   Check protected/admin route wrappers.

Never create duplicate routes.

------------------------------------------------------------------------

## Step 3 --- Create the page

Create the page using the project's existing:

-   React structure
-   Tailwind styling
-   Components
-   Form system
-   Zod validation
-   React Hook Form
-   TanStack Query
-   Axios/API services

Do not introduce a different architecture unless the existing
architecture genuinely cannot support the page.

------------------------------------------------------------------------

# 4. ROUTE + FLOW RULE

Creating a page file alone is NOT enough.

For example, if creating:

``` text
ProductDetails.jsx
```

the agent must also verify:

``` text
/products/:productId
```

and the flow:

``` text
Products
   ↓
Product Details
   ↓
Add to Cart
   ↓
Cart
   ↓
Checkout
```

The Product Details page must therefore have working navigation to the
appropriate next actions.

------------------------------------------------------------------------

# 5. USER FLOW

The current User flow is:

``` text
HOME
  │
  ├── Login
  │     └── User Account / Shopping
  │
  └── Signup
        └── User Account / Shopping

USER SHOPPING
  ↓
Products
  ↓
Search / Filter / Category
  ↓
Product Details
  ├── Wishlist
  └── Add to Cart
        ↓
      Cart
        ↓
     Checkout
        ↓
 Address Selection / Add Address
        ↓
     Payment
      ├── Razorpay
      └── COD
        ↓
 Order Success
        ↓
    My Orders
        ↓
 Order Details
      ├── Review
      └── Receipt
```

Additional account flow:

``` text
Profile
 ├── Update Profile
 ├── Addresses
 │    ├── Add
 │    ├── Update
 │    └── Delete
 └── Change Password
```

Wishlist flow:

``` text
Products
   ↓
Product Details
   ↓
Wishlist
   ↓
Product Details
   ↓
Cart
```

Reviews flow:

``` text
Product Details
   ↓
View Reviews
   ↓
Write Review
   ↓
Edit Review
```

Reviews must remain integrated into existing relevant pages unless the
project explicitly requires a separate page.

------------------------------------------------------------------------

# 6. ADMIN FLOW

The current Admin flow is:

``` text
Admin Login
    ↓
Admin Dashboard
    │
    ├── Users
    │    └── User Details
    │         └── Manage Role
    │
    ├── Categories
    │    ├── Category List
    │    ├── Create Category
    │    └── Edit Category
    │
    ├── Products
    │    ├── Product List
    │    ├── Create Product
    │    ├── Product Details
    │    └── Edit Product
    │         └── Cloudinary Images
    │
    ├── Orders
    │    ├── Order List
    │    └── Order Details
    │         └── Update Order Status
    │
    └── Receipts
         ├── Receipt List
         └── Receipt Preview
              ├── Print
              └── Download
```

Admin pages MUST be protected by admin authorization.

Never expose admin functionality to normal users.

------------------------------------------------------------------------

# 7. PAGE → FLOW CONNECTION RULE

Every page must define its connections.

Use this mental model:

``` text
CURRENT PAGE
     │
     ├── ENTRY POINTS
     │
     ├── PRIMARY ACTION
     │
     ├── SECONDARY ACTIONS
     │
     └── EXIT / NEXT PAGE
```

Example:

``` text
Cart
 │
 ├── ← Continue Shopping → Products
 │
 ├── Remove Item
 │
 ├── Update Quantity
 │
 └── Proceed to Checkout
              ↓
           Checkout
```

Do not create buttons that lead nowhere.

Do not create navigation links to nonexistent routes.

Do not leave required flow transitions unfinished.

------------------------------------------------------------------------

# 8. API CONNECTION RULE

A page that depends on backend data must use the existing API/service
architecture.

Preferred architecture:

``` text
Page
 ↓
Hook / TanStack Query
 ↓
API Service
 ↓
Axios Client
 ↓
Backend API
 ↓
Database
```

Do NOT:

-   Put raw Axios requests everywhere.
-   Create duplicate API clients.
-   Hardcode production URLs.
-   Use dummy data when the backend endpoint already exists.
-   Bypass authentication.
-   Store sensitive secrets in frontend code.

------------------------------------------------------------------------

# 9. AUTHENTICATION RULE

Before connecting a page, determine its access level.

Use:

``` text
PUBLIC
AUTHENTICATED USER
ADMIN ONLY
```

Examples:

``` text
/
      → PUBLIC

/products
      → PUBLIC

/cart
      → USER

/checkout
      → USER

/orders
      → USER

/admin
      → ADMIN ONLY

/admin/products
      → ADMIN ONLY
```

If an unauthenticated user attempts to access a protected page:

``` text
Protected Page
      ↓
Authentication Check
      ↓
Not Logged In
      ↓
Login
```

After successful login, preserve the intended destination when the
existing authentication architecture supports it.

------------------------------------------------------------------------

# 10. NAVIGATION RULE

When creating a page, inspect all navigation surfaces:

-   Header
-   Navbar
-   Sidebar
-   Mobile navigation
-   Footer
-   Breadcrumbs
-   Cards
-   CTA buttons
-   Account menu
-   Admin sidebar
-   Empty-state buttons

A page is incomplete if it exists in the router but users have no
appropriate way to reach it.

However, do not add unnecessary navigation links. Only add links
required by the existing application flow.

------------------------------------------------------------------------

# 11. DYNAMIC ROUTE RULE

Use dynamic routes where appropriate.

Examples:

``` text
/products/:productId
/orders/:orderId
/admin/users/:userId
/admin/products/:productId
/admin/orders/:orderId
```

The page must obtain the ID from the route and fetch the corresponding
backend resource.

Never hardcode IDs.

------------------------------------------------------------------------

# 12. FORM PAGE RULE

For pages containing forms:

``` text
UI Form
 ↓
React Hook Form
 ↓
Zod Validation
 ↓
API Service
 ↓
TanStack Query Mutation
 ↓
Success
 ↓
Update UI / Navigate
```

Every form must handle:

-   Initial state
-   Validation
-   Field errors
-   Submit loading state
-   API error
-   Success state
-   Correct next-page navigation

Do not navigate before a required backend operation succeeds.

------------------------------------------------------------------------

# 13. LOADING / ERROR / EMPTY STATES

Every data-driven page must handle:

### Loading

``` text
Loading...
```

Use the project's existing skeleton/spinner components when available.

### Error

``` text
Something went wrong.
Retry
```

### Empty

Example:

``` text
No products found.
Continue Shopping
```

The empty-state CTA must connect to the appropriate next page.

------------------------------------------------------------------------

# 14. SUCCESS NAVIGATION RULE

After a successful action, navigate according to the existing business
flow.

Examples:

``` text
Login success
→ Home / intended page

Signup success
→ Login or authenticated destination

Add to Cart
→ Remain on Product Details unless existing UX specifies otherwise

Create Order success
→ Order Success

Order cancellation success
→ Order Details / Orders

Create Product success
→ Product List / existing admin flow

Create Category success
→ Category List
```

Do not invent a different navigation flow without a project requirement.

------------------------------------------------------------------------

# 15. BACK BUTTON / BREADCRUMB RULE

For nested pages, provide an appropriate way to return to the parent
page where useful.

Examples:

``` text
Product Details
← Back to Products

Order Details
← Back to Orders

Admin Product Details
← Back to Products

Admin User Details
← Back to Users
```

Do not add unnecessary navigation UI to simple pages.

------------------------------------------------------------------------

# 16. FLOW DOCUMENTATION

Whenever a page is created, updated, renamed, removed, or its navigation
changes, update the project's flow documentation.

Maintain a file such as:

``` text
docs/
└── FRONTEND_FLOW.md
```

The document must contain:

``` text
# Rizla Boutique Frontend Flow

## User Flow

Home
→ Products
→ Product Details
→ Cart
→ Checkout
→ Address
→ Payment
→ Order Success
→ Orders
→ Order Details
→ Receipt

## Admin Flow

Admin Login
→ Dashboard
→ Users
→ Categories
→ Products
→ Orders
→ Receipts
```

Also maintain a route table:

``` text
| Page | Route | Access | Previous | Next |
|------|-------|--------|----------|------|
```

Whenever a page changes, keep this table synchronized with the actual
React Router configuration.

------------------------------------------------------------------------

# 17. FLOW DOCUMENT MUST MATCH CODE

The documentation is NOT the source of truth by itself.

The following must stay consistent:

``` text
React Router
      ↕
Navigation
      ↕
Page Components
      ↕
API Services
      ↕
Backend Routes
      ↕
FRONTEND_FLOW.md
```

If a route is removed, remove it from the flow documentation.

If a route is renamed, update all references.

If a page is moved, update its navigation and flow.

------------------------------------------------------------------------

# 18. NO DEAD LINKS

After creating or modifying a page, search the frontend for:

-   Links to the page.
-   Navigate calls to the page.
-   Buttons intended to open the page.
-   Breadcrumb links.
-   Sidebar links.
-   Header links.

Verify that every target route exists.

Also verify that the new page's important outgoing routes exist.

------------------------------------------------------------------------

# 19. NO UNREQUESTED FEATURES

This is critical.

Do NOT add:

-   Extra pages
-   Extra business features
-   Extra payment methods
-   Extra dashboards
-   Extra user roles
-   Extra workflows
-   Extra database fields
-   Extra backend APIs

unless explicitly requested.

The purpose of this skill is to maintain and connect the existing
application, not expand its scope.

------------------------------------------------------------------------

# 20. PAGE COMPLETION CHECKLIST

Before declaring any page complete, verify:

``` text
[ ] Page component created
[ ] Correct route created/verified
[ ] Correct layout used
[ ] Correct authentication applied
[ ] Correct role protection applied
[ ] Backend API connected if required
[ ] TanStack Query used where appropriate
[ ] Existing API service reused
[ ] Form validation implemented if required
[ ] Loading state implemented
[ ] Error state implemented
[ ] Empty state implemented if required
[ ] Previous page can reach this page
[ ] Primary next action works
[ ] Important navigation links work
[ ] No dead links
[ ] No duplicate routes
[ ] Responsive UI verified
[ ] Flow documentation updated
[ ] Route table updated
[ ] No unrequested feature added
```

------------------------------------------------------------------------

# 21. WHEN USER SAYS "CREATE THIS PAGE"

Follow this process automatically:

``` text
1. Inspect existing project
2. Identify the page's position in the flow
3. Identify its route
4. Identify access level
5. Identify backend/API dependency
6. Check existing components/services/hooks
7. Create the page
8. Connect route
9. Connect navigation
10. Connect API
11. Connect previous/next flow
12. Test important transitions
13. Update FRONTEND_FLOW.md
14. Check for dead links
15. Report exactly what was changed
```

Do NOT stop after creating only the UI.

------------------------------------------------------------------------

# 22. WHEN USER SAYS "CREATE 5 PAGES"

Treat the five pages as one connected workflow.

Before implementation:

``` text
Page 1
  ↓
Page 2
  ↓
Page 3
  ↓
Page 4
  ↓
Page 5
```

Then determine how those pages connect to existing application flows.

After implementation:

``` text
5 Page UI
+
Routes
+
Navigation
+
API
+
Auth
+
Flow Documentation
=
Complete Batch
```

Do not create five isolated pages.

------------------------------------------------------------------------

# 23. FINAL VERIFICATION AFTER EVERY BATCH

After implementing any group of pages, perform:

### Route verification

Check:

``` text
No duplicate routes
No missing routes
No conflicting dynamic routes
```

### Navigation verification

Check:

``` text
Header
Navbar
Sidebar
Buttons
Cards
Breadcrumbs
Mobile navigation
```

### Flow verification

Check:

``` text
Previous page → Current page
Current page → Next page
```

### API verification

Check:

``` text
Correct endpoint
Correct HTTP method
Correct payload
Correct authentication
Correct response handling
```

### Documentation verification

Check:

``` text
FRONTEND_FLOW.md
Route table
User flow
Admin flow
```

must match the actual implementation.

------------------------------------------------------------------------

# 24. DEFINITION OF DONE

A page is considered DONE only when:

``` text
UI
✓

Route
✓

Navigation
✓

API
✓

Authentication
✓

Authorization
✓

Loading/Error/Empty states
✓

Previous/Next flow
✓

Responsive behavior
✓

Flow documentation
✓

No dead links
✓
```

If any required item is missing, the page is NOT fully complete.

------------------------------------------------------------------------

# 25. PROJECT'S LOCKED PAGE STRUCTURE

## USER

``` text
/
 /login
 /signup
 /forgot-password
 /reset-password/:token

 /products
 /products/:productId
 /search
 /category/:categoryId
 /wishlist
 /cart

 /checkout
 /checkout/address
 /checkout/payment
 /order-success/:orderId
 /payment-failed/:orderId

 /profile
 /profile/addresses
 /profile/change-password

 /orders
 /orders/:orderId
 /orders/:orderId/receipt
```

## ADMIN

``` text
/admin/login
/admin

/admin/users
/admin/users/:userId

/admin/categories
/admin/categories/create
/admin/categories/:categoryId/edit

/admin/products
/admin/products/create
/admin/products/:productId
/admin/products/:productId/edit

/admin/orders
/admin/orders/:orderId

/admin/receipts
/admin/receipts/:orderId
```

These routes are the current reference structure. If the existing
codebase uses a different already-working route, inspect it first and
preserve working conventions rather than blindly duplicating routes.

------------------------------------------------------------------------

# 26. IMPORTANT AGENT BEHAVIOR

When working on Rizla Boutique:

-   Think in terms of complete user journeys, not isolated screens.
-   Reuse existing architecture.
-   Inspect before modifying.
-   Make the smallest required change.
-   Keep frontend and backend contracts aligned.
-   Keep User and Admin flows separate.
-   Never bypass auth.
-   Never create dead-end pages.
-   Never create dead links.
-   Never add unrequested features.
-   Always update the flow documentation after a page/route flow change.
-   Always verify the page can be reached and exited through the
    intended workflow.

The final goal is:

``` text
EVERY PAGE
    ↓
HAS A ROUTE
    ↓
HAS A PURPOSE
    ↓
HAS AN ENTRY
    ↓
HAS AN EXIT / NEXT ACTION
    ↓
USES THE CORRECT BACKEND
    ↓
IS PROPERLY PROTECTED
    ↓
IS DOCUMENTED IN THE FLOW
```

This rule applies to every future frontend page created for Rizla
Boutique.
