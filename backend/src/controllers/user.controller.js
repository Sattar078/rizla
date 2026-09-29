const User = require("../models/user");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");

// GET MY PROFILE
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch profile",
    });
  }
};

// UPDATE MY PROFILE
const updateMyProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update profile",
    });
  }
};

// ADD ADDRESS
const addAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      isDefault,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If this is the user's first address,
    // automatically make it default
    if (user.addresses.length === 0) {
      user.addresses.push({
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        isDefault: true,
      });
    } else {
      // If new address is selected as default,
      // remove default from all existing addresses
      if (isDefault === true) {
        user.addresses.forEach((address) => {
          address.isDefault = false;
        });
      }

      user.addresses.push({
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        isDefault: isDefault || false,
      });
    }

    await user.save();

    const newAddress =
      user.addresses[user.addresses.length - 1];

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    console.error("Add address error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to add address",
    });
  }
};

// GET ALL ADDRESSES
const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Addresses fetched successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Get addresses error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch addresses",
    });
  }
};

// UPDATE ADDRESS
const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find address inside user's addresses array
    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      isDefault,
    } = req.body;

    // Update only provided fields
    if (fullName !== undefined) {
      address.fullName = fullName;
    }

    if (phone !== undefined) {
      address.phone = phone;
    }

    if (addressLine1 !== undefined) {
      address.addressLine1 = addressLine1;
    }

    if (addressLine2 !== undefined) {
      address.addressLine2 = addressLine2;
    }

    if (city !== undefined) {
      address.city = city;
    }

    if (state !== undefined) {
      address.state = state;
    }

    if (pincode !== undefined) {
      address.pincode = pincode;
    }

    // Handle default address
    if (isDefault === true) {
      user.addresses.forEach((item) => {
        item.isDefault = false;
      });

      address.isDefault = true;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    console.error("Update address error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update address",
    });
  }
};

// DELETE ADDRESS
const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find address
    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Remove address
    user.addresses.pull(addressId);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to delete address",
    });
  }
};

// ADD PRODUCT TO WISHLIST
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyInWishlist = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (alreadyInWishlist) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    user.wishlist.push(productId);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Add to wishlist error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to add product to wishlist",
    });
  }
};

// REMOVE PRODUCT FROM WISHLIST
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const productExists = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist",
      });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to remove product from wishlist",
    });
  }
};

// GET CURRENT USER WISHLIST
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "wishlist",
      populate: {
        path: "category",
        select: "name",
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const wishlist = (user.wishlist || []).filter(Boolean);

    return res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error("Get wishlist error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch wishlist",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// STEP 64 — ADMIN USER MANAGEMENT
// ─────────────────────────────────────────────────────────────

// GET ALL USERS (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -resetPasswordToken -resetPasswordExpire");

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch users",
    });
  }
};

// GET SINGLE USER (Admin)
const getSingleUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password -resetPasswordToken -resetPasswordExpire").lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const orderCount = await Order.countDocuments({ user: userId });
    user.orderCount = orderCount;

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get single user error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch user",
    });
  }
};

// CHANGE USER ROLE (Admin)
const changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from removing their own admin access
    if (user._id.toString() === req.user._id.toString() && user.role === "admin" && role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "You cannot remove your own admin privileges",
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Change user role error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update user role",
    });
  }
};

module.exports = {
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
};