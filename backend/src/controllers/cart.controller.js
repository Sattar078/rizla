const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/user");

// ADD PRODUCT TO CART
const addToCart = async (req, res) => {
  try {
    const productId = req.body.productId || req.body.product;
    const { size, color, quantity = 1 } = req.body;

    // 1. Verify authenticated user exists
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2. Validate quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity",
      });
    }

    // 3. Verify product exists
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 4. Verify requested variant exists on product
    const matchingVariant = (product.variants || []).find(
      (v) =>
        v.size.trim().toLowerCase() === size.trim().toLowerCase() &&
        v.color.trim().toLowerCase() === color.trim().toLowerCase()
    );

    if (!matchingVariant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    // 5. Find or initialize user's cart
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    // 6. Check if same product + same variant already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === product._id.toString() &&
        item.size.trim().toLowerCase() === matchingVariant.size.trim().toLowerCase() &&
        item.color.trim().toLowerCase() === matchingVariant.color.trim().toLowerCase()
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;

      // Verify stock availability for cumulative quantity
      if (newQuantity > matchingVariant.stock) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock",
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Verify stock availability for new item
      if (quantity > matchingVariant.stock) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock",
        });
      }

      cart.items.push({
        product: product._id,
        size: matchingVariant.size,
        color: matchingVariant.color,
        quantity,
      });
    }

    // 7. Save cart
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to add product to cart",
    });
  }
};

// GET CURRENT USER CART
const getCart = async (req, res) => {
  try {
    // 1. Verify authenticated user exists
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2. Find cart belonging to authenticated user
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "items.product",
      populate: {
        path: "category",
        select: "name",
      },
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: {
          user: req.user._id,
          items: [],
        },
      });
    }

    // Filter out items whose referenced product was deleted
    if (cart.items && cart.items.length > 0) {
      cart.items = cart.items.filter((item) => item.product != null);
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get cart error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch cart",
    });
  }
};

// UPDATE CART ITEM QUANTITY
const updateCartQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    // 1. Verify user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2. Find cart
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // 3. Find the cart item
    const cartItem = cart.items.id(itemId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // 4. Fetch product to verify variant + stock
    if (!mongoose.Types.ObjectId.isValid(cartItem.product)) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = await Product.findById(cartItem.product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 5. Find matching variant
    const matchingVariant = (product.variants || []).find(
      (v) =>
        v.size.trim().toLowerCase() === cartItem.size.trim().toLowerCase() &&
        v.color.trim().toLowerCase() === cartItem.color.trim().toLowerCase()
    );

    if (!matchingVariant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    // 6. Verify stock
    if (quantity > matchingVariant.stock) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    // 7. Update quantity
    cartItem.quantity = quantity;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart item quantity updated",
      cart,
    });
  } catch (error) {
    console.error("Update cart quantity error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update cart item",
    });
  }
};

// REMOVE CART ITEM
const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    // 1. Verify user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2. Find cart
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // 3. Find the cart item
    const cartItem = cart.items.id(itemId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // 4. Remove the item
    cart.items.pull(itemId);

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart item removed",
      cart,
    });
  } catch (error) {
    console.error("Remove cart item error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to remove cart item",
    });
  }
};

// CLEAR CART
const clearCart = async (req, res) => {
  try {
    // 1. Verify user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2. Find cart
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is already empty",
        cart: {
          user: req.user._id,
          items: [],
        },
      });
    }

    // 3. Empty the cart items
    cart.items = [];

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart,
    });
  } catch (error) {
    console.error("Clear cart error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to clear cart",
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeCartItem,
  clearCart,
};
