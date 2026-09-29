const express = require("express");

const protect = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/admin.middleware");
const upload = require("../middleware/upload.middleware");

const {
  uploadProductImages,
} = require("../controllers/upload.controller");

const router = express.Router();

// UPLOAD PRODUCT IMAGES - ADMIN ONLY
router.post(
  "/products",
  protect,
  adminOnly,
  upload.array("images"),
  uploadProductImages
);

module.exports = router;