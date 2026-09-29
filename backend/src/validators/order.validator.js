const { z } = require("zod");

// ORDER STATUS ENUM — mirrors Order model exactly
const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
];

// CREATE ORDER VALIDATION
const createOrderSchema = z.object({
  body: z.object({
    // Option 1: addressId from user's saved addresses
    addressId: z.string().trim().min(1).optional(),

    // Option 2: inline shipping address
    shippingAddress: z
      .object({
        fullName: z.string().trim().min(2, "Full name is required"),
        phone: z.string().trim().min(10, "Valid phone number is required"),
        addressLine1: z.string().trim().min(3, "Address line 1 is required"),
        addressLine2: z.string().trim().optional().default(""),
        city: z.string().trim().min(2, "City is required"),
        state: z.string().trim().min(2, "State is required"),
        pincode: z.string().trim().min(4, "Valid pincode is required"),
      })
      .optional(),

    paymentMethod: z.enum(["razorpay", "cod"], {
      required_error: "Payment method is required",
      invalid_type_error: "Payment method must be 'razorpay' or 'cod'",
    }),
  }),
  params: z.object({}),
  query: z.object({}),
});

// GET / CANCEL SINGLE ORDER VALIDATION (user)
const orderIdParamSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({
    orderId: z.string().min(1, "Order ID is required"),
  }),
  query: z.object({}).optional().default({}),
});

// ADMIN UPDATE ORDER STATUS VALIDATION
const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(ORDER_STATUSES, {
      required_error: "Status is required",
      invalid_type_error: `Status must be one of: ${ORDER_STATUSES.join(", ")}`,
    }),
  }),
  params: z.object({
    orderId: z.string().min(1, "Order ID is required"),
  }),
  query: z.object({}).optional().default({}),
});

// RAZORPAY VERIFICATION VALIDATION
const verifyRazorpaySchema = z.object({
  body: z.object({
    razorpay_order_id: z.string().min(1, "Razorpay Order ID is required"),
    razorpay_payment_id: z.string().min(1, "Razorpay Payment ID is required"),
    razorpay_signature: z.string().min(1, "Razorpay Signature is required"),
  }),
  params: z.object({
    orderId: z.string().min(1, "Order ID is required"),
  }),
  query: z.object({}).optional().default({}),
});

module.exports = {
  ORDER_STATUSES,
  createOrderSchema,
  orderIdParamSchema,
  updateOrderStatusSchema,
  verifyRazorpaySchema,
};
