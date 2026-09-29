const express = require("express");

const {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");

const protect = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const {
  productIdParamSchema,
  reviewIdParamSchema,
  addReviewSchema,
  updateReviewSchema,
} = require("../validators/review.validator");

// Merge params so we can access /products/:productId/reviews
const router = express.Router({ mergeParams: true });

// STEP 61 — Get Product Reviews (Public)
router.get(
  "/",
  validate(productIdParamSchema),
  getProductReviews
);

// STEP 60 — Add Review (Protected)
router.post(
  "/",
  protect,
  validate(addReviewSchema),
  addReview
);

// STEP 62 — Update Review (Protected)
router.patch(
  "/:reviewId",
  protect,
  validate(updateReviewSchema),
  updateReview
);

// STEP 62 — Delete Review (Protected)
router.delete(
  "/:reviewId",
  protect,
  validate(reviewIdParamSchema),
  deleteReview
);

module.exports = router;
