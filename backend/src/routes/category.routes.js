const express = require("express");

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

const protect = require("../middleware/auth.middleware");

const adminOnly = require("../middleware/admin.middleware");

const validate = require("../middleware/validate.middleware");

const {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} = require("../validators/category.validator");

const router = express.Router();

// CREATE CATEGORY - ADMIN ONLY
router.post(
  "/",
  protect,
  adminOnly,
  validate(createCategorySchema),
  createCategory
);

// UPDATE CATEGORY - ADMIN ONLY
router.put(
  "/:categoryId",
  protect,
  adminOnly,
  validate(updateCategorySchema),
  updateCategory
);

// DELETE CATEGORY - ADMIN ONLY
router.delete(
  "/:categoryId",
  protect,
  adminOnly,
  validate(categoryIdSchema),
  deleteCategory
);

// GET ALL CATEGORIES - PUBLIC
router.get(
  "/",
  getCategories
);

module.exports = router;