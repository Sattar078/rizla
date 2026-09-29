const mongoose = require("mongoose");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/user");

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { addressId, shippingAddress, paymentMethod } = req.body;

    // 1. Verify user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2. Resolve shipping address
    let resolvedAddress;

    if (addressId) {
      // Use a saved address by ID
      const savedAddress = user.addresses.id(addressId);

      if (!savedAddress) {
        return res.status(404).json({
          success: false,
          message: "Address not found",
        });
      }

      resolvedAddress = {
        fullName: savedAddress.fullName,
        phone: savedAddress.phone,
        addressLine1: savedAddress.addressLine1,
        addressLine2: savedAddress.addressLine2 || "",
        city: savedAddress.city,
        state: savedAddress.state,
        pincode: savedAddress.pincode,
      };
    } else if (shippingAddress) {
      resolvedAddress = shippingAddress;
    } else {
      // Fall back to default saved address
      const defaultAddress = user.addresses.find((a) => a.isDefault);

      if (!defaultAddress) {
        return res.status(400).json({
          success: false,
          message: "Shipping address is required",
        });
      }

      resolvedAddress = {
        fullName: defaultAddress.fullName,
        phone: defaultAddress.phone,
        addressLine1: defaultAddress.addressLine1,
        addressLine2: defaultAddress.addressLine2 || "",
        city: defaultAddress.city,
        state: defaultAddress.state,
        pincode: defaultAddress.pincode,
      };
    }

    // 3. Find cart
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // 4. Validate all cart items and calculate totals
    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of cart.items) {
      // Verify product still exists
      if (!mongoose.Types.ObjectId.isValid(cartItem.product)) {
        return res.status(404).json({
          success: false,
          message: "One or more products in your cart no longer exist",
        });
      }

      const product = await Product.findById(cartItem.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product "${cartItem.product}" no longer exists`,
        });
      }

      // Verify variant still exists
      const variant = (product.variants || []).find(
        (v) =>
          v.size.trim().toLowerCase() === cartItem.size.trim().toLowerCase() &&
          v.color.trim().toLowerCase() === cartItem.color.trim().toLowerCase()
      );

      if (!variant) {
        return res.status(404).json({
          success: false,
          message: `Variant (${cartItem.size}/${cartItem.color}) for "${product.name}" is no longer available`,
        });
      }

      // Verify sufficient stock
      if (cartItem.quantity > variant.stock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}" (${cartItem.size}/${cartItem.color}). Available: ${variant.stock}`,
        });
      }

      // Use server-side price, not client price
      const itemPrice = product.price;
      const itemSubtotal = itemPrice * cartItem.quantity;
      subtotal += itemSubtotal;

      // Build order item snapshot (price captured at order time)
      const image =
        product.images && product.images.length > 0
          ? product.images[0].url
          : "";

      orderItems.push({
        product: product._id,
        name: product.name,
        image,
        size: cartItem.size,
        color: cartItem.color,
        price: itemPrice,
        quantity: cartItem.quantity,
        // Save a reference to the variant for stock deduction
        _variantId: variant._id,
      });
    }

    const totalAmount = subtotal; // Can add shipping/tax logic here later

    // 5. All validations passed — now create the order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems.map(({ _variantId, ...item }) => item), // remove internal field
      shippingAddress: resolvedAddress,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: paymentMethod === "cod" ? "confirmed" : "pending",
      subtotal,
      totalAmount,
    });

    // 6. Deduct stock for each item (only after order is saved)
    for (const item of orderItems) {
      await Product.updateOne(
        {
          _id: item.product,
          "variants._id": item._variantId,
        },
        {
          $inc: { "variants.$.stock": -item.quantity },
        }
      );
    }

    // 7. Clear user's cart
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create order",
    });
  }
};

// GET CURRENT USER ORDERS
const getMyOrders = async (req, res) => {
  try {
    // Verify user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders",
    });
  }
};


// ─────────────────────────────────────────────────────────────
// STEP 50 — GET SINGLE ORDER (user — own order only)
// ─────────────────────────────────────────────────────────────
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify user exists
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find order that belongs to this user only
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      // Return 404 whether order doesn't exist OR belongs to someone else
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order by ID error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch order",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// STEP 51 — CANCEL ORDER (user — own order only)
// Cancellable states: pending, confirmed, packed
// Non-cancellable: shipped, delivered, cancelled
// Stock was deducted at order creation — restore it on cancel
// ─────────────────────────────────────────────────────────────
const CANCELLABLE_STATUSES = ["pending", "confirmed", "packed"];

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify user exists
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find order belonging to this user
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if already cancelled
    if (order.orderStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled",
      });
    }

    // Check if order is in a cancellable state
    if (!CANCELLABLE_STATUSES.includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled. Current status: ${order.orderStatus}`,
      });
    }

    // Restore stock for each ordered item
    for (const item of order.items) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) continue;

      // Find variant by size + color (no _variantId in snapshot)
      const product = await Product.findById(item.product);

      if (!product) continue; // Product deleted — skip stock restore

      const variant = (product.variants || []).find(
        (v) =>
          v.size.trim().toLowerCase() === item.size.trim().toLowerCase() &&
          v.color.trim().toLowerCase() === item.color.trim().toLowerCase()
      );

      if (!variant) continue; // Variant removed — skip

      await Product.updateOne(
        {
          _id: item.product,
          "variants._id": variant._id,
        },
        {
          $inc: { "variants.$.stock": item.quantity },
        }
      );
    }

    // Mark order as cancelled
    order.orderStatus = "cancelled";
    order.cancellationReason = "Cancelled by user";
    order.cancelledAt = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to cancel order",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// STEP 52 — ADMIN GET ALL ORDERS
// ─────────────────────────────────────────────────────────────
const adminGetAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Admin get all orders error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// STEP 53 — ADMIN GET SINGLE ORDER
// ─────────────────────────────────────────────────────────────
const adminGetOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = await Order.findById(orderId).populate(
      "user",
      "name email phone"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Admin get order error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch order",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// STEP 54 — ADMIN UPDATE ORDER STATUS
// Transition guards:
//   - Cannot move FROM delivered (terminal success state)
//   - Cannot move FROM cancelled TO delivered
// Stock is NOT touched here (already handled at create/cancel)
// ─────────────────────────────────────────────────────────────
const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const current = order.orderStatus;

    // Guard: delivered is a terminal success state
    if (current === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Cannot change status of a delivered order",
      });
    }

    // Guard: cancelled orders cannot be marked delivered
    if (current === "cancelled" && status === "delivered") {
      return res.status(400).json({
        success: false,
        message: "A cancelled order cannot be marked as delivered",
      });
    }

    // Guard: cancelled orders should not be reactivated to in-progress statuses
    if (
      current === "cancelled" &&
      ["confirmed", "packed", "shipped"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "A cancelled order cannot be reactivated",
      });
    }

    order.orderStatus = status;

    // If admin sets to cancelled, record the cancellation metadata
    if (status === "cancelled" && !order.cancelledAt) {
      order.cancellationReason = "Cancelled by admin";
      order.cancelledAt = new Date();

      // Restore stock when admin cancels (only if not already cancelled)
      for (const item of order.items) {
        if (!mongoose.Types.ObjectId.isValid(item.product)) continue;

        const product = await Product.findById(item.product);

        if (!product) continue;

        const variant = (product.variants || []).find(
          (v) =>
            v.size.trim().toLowerCase() === item.size.trim().toLowerCase() &&
            v.color.trim().toLowerCase() === item.color.trim().toLowerCase()
        );

        if (!variant) continue;

        await Product.updateOne(
          { _id: item.product, "variants._id": variant._id },
          { $inc: { "variants.$.stock": item.quantity } }
        );
      }
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Admin update order status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update order status",
    });
  }
};

const crypto = require("crypto");
const razorpay = require("../config/razorpay");

// ─────────────────────────────────────────────────────────────
// STEP 55 — CREATE RAZORPAY ORDER
// ─────────────────────────────────────────────────────────────
const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: "Razorpay is not configured on the server",
      });
    }

    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.paymentMethod !== "razorpay") {
      return res.status(400).json({ success: false, message: "Order payment method is not Razorpay" });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ success: false, message: "Order is already paid" });
    }

    const amountInPaise = Math.round(order.totalAmount * 100);

    // Reuse if already created to prevent duplicates
    if (order.razorpay && order.razorpay.orderId) {
       return res.status(200).json({
          success: true,
          razorpayOrderId: order.razorpay.orderId,
          amount: amountInPaise,
          currency: "INR",
          keyId: process.env.RAZORPAY_KEY_ID,
          orderId: order._id
       });
    }

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: order._id.toString(),
    };

    const rzpOrder = await razorpay.orders.create(options);

    order.razorpay = {
      orderId: rzpOrder.id
    };
    await order.save();

    return res.status(200).json({
      success: true,
      razorpayOrderId: rzpOrder.id,
      amount: amountInPaise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order._id
    });

  } catch (error) {
     console.error("Create razorpay order error:", error);
     return res.status(500).json({ success: false, message: "Unable to create Razorpay order" });
  }
};

// ─────────────────────────────────────────────────────────────
// STEP 56 — VERIFY RAZORPAY PAYMENT
// ─────────────────────────────────────────────────────────────
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) {
       return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Idempotency: if already paid, return success
    if (order.paymentStatus === "paid") {
       return res.status(200).json({ success: true, message: "Payment already verified", order });
    }

    if (!order.razorpay || order.razorpay.orderId !== razorpay_order_id) {
       return res.status(400).json({ success: false, message: "Invalid Razorpay order ID" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
       .update(body.toString())
       .digest("hex");

    if (expectedSignature !== razorpay_signature) {
       return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    order.paymentStatus = "paid";
    if (order.orderStatus === "pending") {
       order.orderStatus = "confirmed";
    }
    
    order.razorpay.paymentId = razorpay_payment_id;
    order.razorpay.signature = razorpay_signature;

    await order.save();

    return res.status(200).json({
       success: true,
       message: "Payment verified successfully",
       order
    });

  } catch (error) {
     console.error("Verify razorpay error:", error);
     return res.status(500).json({ success: false, message: "Unable to verify payment" });
  }
};

// ─────────────────────────────────────────────────────────────
// STEP 57 — HANDLE PAYMENT FAILURE
// ─────────────────────────────────────────────────────────────
const handlePaymentFailure = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) {
       return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.paymentStatus === "paid") {
       return res.status(400).json({ success: false, message: "Order is already paid" });
    }

    order.paymentStatus = "failed";
    await order.save();

    return res.status(200).json({
       success: true,
       message: "Payment marked as failed. You can retry.",
       order
    });

  } catch (error) {
     console.error("Handle payment fail error:", error);
     return res.status(500).json({ success: false, message: "Unable to handle payment failure" });
  }
};



// ─────────────────────────────────────────────────────────────
// STEP 70 & 71 — GET ORDER RECEIPT (Digital)
// ─────────────────────────────────────────────────────────────
const getOrderReceipt = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = await Order.findById(orderId).populate("user", "name email phone");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Authorization: Must be admin OR the owner of the order
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to access this receipt" });
    }

    const receipt = {
      storeName: "RIZLA BOUTIQUE",
      orderId: order._id,
      orderDate: order.createdAt,
      customerName: order.user?.name || order.shippingAddress.fullName,
      customerEmail: order.user?.email || "",
      customerPhone: order.shippingAddress.phone || "",
      shippingAddress: order.shippingAddress,
      items: order.items.map((item) => ({
        productName: item.name,
        variant: `${item.size} / ${item.color}`,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      })),
      subtotal: order.subtotal,
      shippingAmount: 0, // Currently no shipping logic
      discount: 0,       // Currently no discount logic
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
    };

    return res.status(200).json({
      success: true,
      receipt,
      message: "Note: PDF generation is currently unsupported by the backend architecture without third-party tools. Please use this digital receipt.",
    });
  } catch (error) {
    console.error("Get order receipt error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to generate receipt" });
  }
};

module.exports = {
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
};

