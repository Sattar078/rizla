const { z } = require("zod");

const productIdParamSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({
    productId: z.string().min(1, "Product ID is required"),
  }),
  query: z.object({}).optional().default({}),
});

const reviewIdParamSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({
    reviewId: z.string().min(1, "Review ID is required"),
  }),
  query: z.object({}).optional().default({}),
});

const addReviewSchema = z.object({
  body: z.object({
    rating: z.number({
      required_error: "Rating is required",
      invalid_type_error: "Rating must be a number",
    })
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be more than 5"),
    comment: z.string({
      required_error: "Review comment is required",
      invalid_type_error: "Comment must be a string",
    })
    .trim()
    .min(1, "Review comment is required")
    .max(1000, "Review cannot exceed 1000 characters"),
  }),
  params: z.object({
    productId: z.string().min(1, "Product ID is required"),
  }),
  query: z.object({}).optional().default({}),
});

const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number({
      invalid_type_error: "Rating must be a number",
    })
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be more than 5")
    .optional(),
    comment: z.string({
      invalid_type_error: "Comment must be a string",
    })
    .trim()
    .max(1000, "Review cannot exceed 1000 characters")
    .optional(),
  }).refine((data) => data.rating !== undefined || data.comment !== undefined, {
    message: "At least one field (rating or comment) must be provided to update",
    path: ["body"],
  }),
  params: z.object({
    reviewId: z.string().min(1, "Review ID is required"),
  }),
  query: z.object({}).optional().default({}),
});

module.exports = {
  productIdParamSchema,
  reviewIdParamSchema,
  addReviewSchema,
  updateReviewSchema,
};
