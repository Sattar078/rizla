const { z } = require("zod");

// CREATE CATEGORY VALIDATION
const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Category name must be at least 2 characters"),
  }),

  params: z.object({}),
  query: z.object({}),
});

const updateCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Category name must be at least 2 characters"),
  }),
  params: z.object({
    categoryId: z.string().min(1, "Category ID is required"),
  }),
  query: z.object({}),
});

const categoryIdSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({
    categoryId: z.string().min(1, "Category ID is required"),
  }),
  query: z.object({}).optional().default({}),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
};