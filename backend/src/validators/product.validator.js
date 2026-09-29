const { z } = require("zod");

// CREATE PRODUCT VALIDATION
const createProductSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Product name must be at least 2 characters"),
    description: z.string().trim().min(5, "Product description must be at least 5 characters"),
    category: z.string().min(1, "Category is required"),
    price: z.number().min(0, "Price cannot be negative"),
    images: z.array(
      z.object({
        url: z.string().url("Invalid image URL"),
        publicId: z.string().min(1, "Image publicId is required"),
      })
    ).optional(),
    variants: z.array(
      z.object({
        size: z.string().trim().min(1, "Size is required"),
        color: z.string().trim().min(1, "Color is required"),
        stock: z.number().min(0, "Stock cannot be negative"),
      })
    ).optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

// UPDATE PRODUCT VALIDATION
const updateProductSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Product name must be at least 2 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .min(5, "Product description must be at least 5 characters")
      .optional(),

    category: z
      .string()
      .min(1, "Category is required")
      .optional(),

    price: z
      .number({
        invalid_type_error: "Price must be a number",
      })
      .min(0, "Price cannot be negative")
      .optional(),

    images: z
      .array(
        z.object({
          url: z.string().url("Invalid image URL"),

          publicId: z
            .string()
            .min(1, "Image publicId is required"),
        })
      )
      .optional(),

    variants: z
      .array(
        z.object({
          size: z
            .string()
            .trim()
            .min(1, "Size is required"),

          color: z
            .string()
            .trim()
            .min(1, "Color is required"),

          stock: z
            .number({
              invalid_type_error: "Stock must be a number",
            })
            .min(0, "Stock cannot be negative"),
        })
      )
      .optional(),
  }),

  params: z.object({
    productId: z
      .string()
      .min(1, "Product ID is required"),
  }),

  query: z.object({}),
});

// PRODUCT ID VALIDATION
const productIdSchema = z.object({
  body: z.object({}),

  params: z.object({
    productId: z
      .string()
      .min(1, "Product ID is required"),
  }),

  query: z.object({}),
});

// GET PRODUCTS QUERY VALIDATION
const getProductsQuerySchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    search: z.string().trim().optional(),

    category: z.string().min(1, "Category ID is required").optional(),

    minPrice: z
      .string()
      .regex(/^\d+(\.\d+)?$/, "Invalid minimum price")
      .optional(),

    maxPrice: z
      .string()
      .regex(/^\d+(\.\d+)?$/, "Invalid maximum price")
      .optional(),
  }),
});

// DELETE PRODUCT IMAGE VALIDATION
const deleteProductImageSchema = z.object({
  body: z.object({}),

  params: z.object({
    productId: z
      .string()
      .min(1, "Product ID is required"),

    imageId: z
      .string()
      .min(1, "Image ID is required"),
  }),

  query: z.object({}),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  deleteProductImageSchema,
  getProductsQuerySchema,
};