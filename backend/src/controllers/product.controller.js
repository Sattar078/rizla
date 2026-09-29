const Product = require("../models/Product");
const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary");

// CREATE PRODUCT - ADMIN ONLY
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      images,
      variants,
    } = req.body;

    // Check if category exists
    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      category,
      price,
      images,
      variants,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create product",
    });
  }
};

// UPDATE PRODUCT - ADMIN ONLY
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const {
      name,
      description,
      category,
      price,
      images,
      variants,
    } = req.body;

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // If category is being updated, check if it exists
    if (category !== undefined) {
      const existingCategory = await Category.findById(category);

      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      product.category = category;
    }

    // Update only provided fields
    if (name !== undefined) {
      product.name = name;
    }

    if (description !== undefined) {
      product.description = description;
    }

    if (price !== undefined) {
      product.price = price;
    }

    if (variants !== undefined) {
      product.variants = variants;
    }

    // Images update
    if (images !== undefined) {
      product.images = images;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update product",
    });
  }
};

// DELETE SINGLE PRODUCT IMAGE - ADMIN ONLY
const deleteProductImage = async (req, res) => {
  try {
    const { productId, imageId } = req.params;

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find image inside product
    const image = product.images.id(imageId);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Product image not found",
      });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    // Remove image from MongoDB
    product.images.pull(imageId);

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product image deleted successfully",
    });
  } catch (error) {
    console.error("Delete product image error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to delete product image",
    });
  }
};

// DELETE PRODUCT - ADMIN ONLY
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete all product images from Cloudinary
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map((image) =>
        cloudinary.uploader.destroy(image.publicId)
      );

      await Promise.all(deletePromises);
    }

    // Delete product from MongoDB
    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to delete product",
    });
  }
};

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;

    const filter = {};

    // SEARCH BY PRODUCT NAME
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    // FILTER BY CATEGORY
    if (category) {
      filter.category = category;
    }

    // FILTER BY PRICE RANGE
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const products = await Product.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get all products error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch products",
    });
  }
};

// GET SINGLE PRODUCT
const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId)
      .populate("category", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get single product error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch product",
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProductImage,
  getAllProducts,
  deleteProduct,
  getSingleProduct,

};