const Category = require("../models/Category");

// CREATE CATEGORY
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name,
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create category",
    });
  }
};

// GET ALL CATEGORIES
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch categories",
    });
  }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;

    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const duplicateCategory = await Category.findOne({ name, _id: { $ne: categoryId } });
    if (duplicateCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    existingCategory.name = name;
    await existingCategory.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: existingCategory,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }
    console.error("Update category error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to update category",
    });
  }
};

const Product = require("../models/Product");

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const productsUsingCategory = await Product.countDocuments({ category: categoryId });
    if (productsUsingCategory > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${productsUsingCategory} product(s) reference it.`,
      });
    }

    await Category.findByIdAndDelete(categoryId);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to delete category",
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};