const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  adminGetAllOrders,
  adminGetOrderById,
  adminUpdateOrderStatus,
  createRazorpayOrder,
  verifyRazorpayPayment,
  handlePaymentFailure,
  getOrderReceipt,
} = require("../controllers/order.controller");
const protect = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/admin.middleware");
const validate = require("../middleware/validate.middleware");
const {
  createOrderSchema,
  orderIdParamSchema,
  updateOrderStatusSchema,
  verifyRazorpaySchema,
} = require("../validators/order.validator");

const router = express.Router();

// ─── ADMIN ROUTES (must be registered before /:orderId) ──────────────────────

// STEP 52 — Admin: Get All Orders
router.get(
  "/admin",
  protect,
  adminOnly,
  adminGetAllOrders
);

// STEP 53 — Admin: Get Single Order by ID
router.get(
  "/admin/:orderId",
  protect,
  adminOnly,
  validate(orderIdParamSchema),
  adminGetOrderById
);

// STEP 54 — Admin: Update Order Status
router.patch(
  "/admin/:orderId/status",
  protect,
  adminOnly,
  validate(updateOrderStatusSchema),
  adminUpdateOrderStatus
);

// ─── USER ROUTES ──────────────────────────────────────────────────────────────

// STEP 49 — Get Current User Orders
router.get(
  "/",
  protect,
  getMyOrders
);

// STEP 48 — Create Order
router.post(
  "/",
  protect,
  validate(createOrderSchema),
  createOrder
);

// STEP 55 — Create Razorpay Order
router.post(
  "/:orderId/razorpay",
  protect,
  validate(orderIdParamSchema),
  createRazorpayOrder
);

// STEP 56 — Verify Razorpay Payment
router.post(
  "/:orderId/razorpay/verify",
  protect,
  validate(verifyRazorpaySchema),
  verifyRazorpayPayment
);

// STEP 57 — Handle Razorpay Payment Failure
router.post(
  "/:orderId/razorpay/fail",
  protect,
  validate(orderIdParamSchema),
  handlePaymentFailure
);

// STEP 50 — Get Single Order (user — own only)
router.get(
  "/:orderId",
  protect,
  validate(orderIdParamSchema),
  getOrderById
);

// STEP 51 — Cancel Order (user — own only)
router.patch(
  "/:orderId/cancel",
  protect,
  validate(orderIdParamSchema),
  cancelOrder
);

// STEP 70 & 71 — Get Order Receipt
router.get(
  "/:orderId/receipt",
  protect,
  validate(orderIdParamSchema),
  getOrderReceipt
);

module.exports = router;
