const { z } = require("zod");

// ADD TO CART VALIDATION
const addToCartSchema = z.object({
  body: z
    .object({
      productId: z.string().trim().min(1, "Product ID is required").optional(),
      product: z.string().trim().min(1, "Product ID is required").optional(),
      size: z.string().trim().min(1, "Size is required"),
      color: z.string().trim().min(1, "Color is required"),
      quantity: z
        .number({
          invalid_type_error: "Quantity must be a number",
        })
        .int("Quantity must be an integer")
        .min(1, "Quantity must be at least 1")
        .default(1),
    })
    .refine((data) => Boolean(data.productId || data.product), {
      message: "Product ID is required",
      path: ["productId"],
    }),
  params: z.object({}),
  query: z.object({}),
});

// UPDATE CART ITEM QUANTITY VALIDATION
const updateCartQuantitySchema = z.object({
  body: z.object({
    quantity: z
      .number({
        required_error: "Quantity is required",
        invalid_type_error: "Quantity must be a number",
      })
      .int("Quantity must be an integer")
      .min(1, "Quantity must be at least 1"),
  }),
  params: z.object({
    itemId: z.string().min(1, "Item ID is required"),
  }),
  query: z.object({}),
});

// REMOVE CART ITEM VALIDATION
const removeCartItemSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({
    itemId: z.string().min(1, "Item ID is required"),
  }),
  query: z.object({}).optional().default({}),
});

module.exports = {
  addToCartSchema,
  updateCartQuantitySchema,
  removeCartItemSchema,
};

