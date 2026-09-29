const mongoose = require("mongoose");
const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

// ─────────────────────────────────────────────────────────────
// RATING AGGREGATION UTILITY
// ─────────────────────────────────────────────────────────────
const recalculateProductRating = async (productId) => {
  // Aggregate reviews to find average rating and total reviews
  const stats = await Review.aggregate([
    {
      $match: { product: new mongoose.Types.ObjectId(productId) },
    },
    {
      $group: {
        _id: "$product",
        totalReviews: { $sum: 1 },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      totalReviews: stats[0].totalReviews,
      averageRating: Math.round(stats[0].averageRating * 10) / 10, // Round to 1 decimal place
    });
  } else {
    // If no reviews remain
    await Product.findByIdAndUpdate(productId, {
      totalReviews: 0,
      averageRating: 0,
    });
  }
};

// ─────────────────────────────────────────────────────────────
// STEP 60 — ADD REVIEW
// ─────────────────────────────────────────────────────────────
const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(404).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check eligibility: user must have purchased the product and it must be delivered
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      orderStatus: "delivered",
      "items.product": productId,
    });

    if (!hasPurchased) {
      return res.status(400).json({
        success: false,
        message: "You can only review products that have been delivered to you.",
      });
    }

    // Prevent duplicate review (also guarded by DB unique index)
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product.",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment,
    });

    // Step 63: Recalculate
    await recalculateProductRating(productId);

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error("Add review error:", error.message);
    
    // Handle mongoose validation/duplicate errors
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "You have already reviewed this product." });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to add review",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// STEP 61 — GET PRODUCT REVIEWS
// ─────────────────────────────────────────────────────────────
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(404).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "name") // Safe public fields only
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get product reviews error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch reviews",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// STEP 62 — UPDATE REVIEW
// ─────────────────────────────────────────────────────────────
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(404).json({ success: false, message: "Invalid review ID" });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Ensure ownership
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this review" });
    }

    if (rating !== undefined) review.rating = Number(rating);
    if (comment !== undefined) review.comment = comment;

    await review.save();

    // Step 63: Recalculate
    await recalculateProductRating(review.product);

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error("Update review error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to update review",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// STEP 62 — DELETE REVIEW
// ─────────────────────────────────────────────────────────────
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(404).json({ success: false, message: "Invalid review ID" });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Ensure ownership or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this review" });
    }

    const productId = review.product;

    await review.deleteOne();

    // Step 63: Recalculate
    await recalculateProductRating(productId);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to delete review",
    });
  }
};

module.exports = {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
};
