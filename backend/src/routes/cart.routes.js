const express = require("express");

const {
  addToCart,
  getCart,
  updateCartQuantity,
  removeCartItem,
  clearCart,
} = require("../controllers/cart.controller");
const protect = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const {
  addToCartSchema,
  updateCartQuantitySchema,
  removeCartItemSchema,
} = require("../validators/cart.validator");

const router = express.Router();

// Get Current User Cart
router.get(
  "/",
  protect,
  getCart
);

// Add Product to Cart
router.post(
  "/",
  protect,
  validate(addToCartSchema),
  addToCart
);

// Update Cart Item Quantity
router.put(
  "/:itemId",
  protect,
  validate(updateCartQuantitySchema),
  updateCartQuantity
);

// Remove Cart Item
router.delete(
  "/:itemId",
  protect,
  validate(removeCartItemSchema),
  removeCartItem
);

// Clear Cart
router.delete(
  "/",
  protect,
  clearCart
);

module.exports = router;
