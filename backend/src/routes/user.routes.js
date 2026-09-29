const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getAllUsers,
  getSingleUser,
  changeUserRole,
} = require("../controllers/user.controller");

const protect = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/admin.middleware");
const validate = require("../middleware/validate.middleware");

const {
  updateProfileSchema,
  addAddressSchema,
  updateAddressSchema,
  addressIdSchema,
  wishlistProductIdSchema,
  userIdSchema,
  changeUserRoleSchema,
} = require("../validators/user.validator");

const router = express.Router();

// ─── ADMIN ROUTES (Must precede dynamic routes if any) ─────────
router.get("/admin", protect, adminOnly, getAllUsers);
router.get("/admin/:userId", protect, adminOnly, validate(userIdSchema), getSingleUser);
router.patch("/admin/:userId/role", protect, adminOnly, validate(changeUserRoleSchema), changeUserRole);


// Get My Profile
router.get(
  "/profile",
  protect,
  getMyProfile
);

// Update My Profile
router.put(
  "/profile",
  protect,
  validate(updateProfileSchema),
  updateMyProfile
);

// Add Address
router.post(
  "/addresses",
  protect,
  validate(addAddressSchema),
  addAddress
);

// Get All Addresses
router.get(
  "/addresses",
  protect,
  getAddresses
);

// Update Address
router.put(
  "/addresses/:addressId",
  protect,
  validate(updateAddressSchema),
  updateAddress
);

// Delete Address
router.delete(
  "/addresses/:addressId",
  protect,
  validate(addressIdSchema),
  deleteAddress
);

// Get Current User Wishlist
router.get(
  "/wishlist",
  protect,
  getWishlist
);

// Add Product to Wishlist
router.post(
  "/wishlist/:productId",
  protect,
  validate(wishlistProductIdSchema),
  addToWishlist
);

// Remove Product from Wishlist
router.delete(
  "/wishlist/:productId",
  protect,
  validate(wishlistProductIdSchema),
  removeFromWishlist
);

module.exports = router;