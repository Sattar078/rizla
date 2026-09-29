const { z } = require("zod");

// UPDATE PROFILE VALIDATION
const updateProfileSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .optional(),

    phone: z
      .string()
      .trim()
      .min(10, "Please enter a valid phone number")
      .optional(),
  }),

  params: z.object({}),
  query: z.object({}),
});

// ADD ADDRESS VALIDATION
const addAddressSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters"),

    phone: z
      .string()
      .trim()
      .min(10, "Please enter a valid phone number"),

    addressLine1: z
      .string()
      .trim()
      .min(3, "Address line 1 is required"),

    addressLine2: z
      .string()
      .trim()
      .optional(),

    city: z
      .string()
      .trim()
      .min(2, "City is required"),

    state: z
      .string()
      .trim()
      .min(2, "State is required"),

    pincode: z
      .string()
      .trim()
      .min(4, "Please enter a valid pincode"),

    isDefault: z
      .boolean()
      .optional(),
  }),

  params: z.object({}),
  query: z.object({}),
});

const addressIdSchema = z.object({
  body: z.object({}),

  params: z.object({
    addressId: z
      .string()
      .min(1, "Address ID is required"),
  }),

  query: z.object({}),
});

const updateAddressSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .optional(),

    phone: z
      .string()
      .trim()
      .min(10, "Please enter a valid phone number")
      .optional(),

    addressLine1: z
      .string()
      .trim()
      .min(3, "Address line 1 is required")
      .optional(),

    addressLine2: z
      .string()
      .trim()
      .optional(),

    city: z
      .string()
      .trim()
      .min(2, "City is required")
      .optional(),

    state: z
      .string()
      .trim()
      .min(2, "State is required")
      .optional(),

    pincode: z
      .string()
      .trim()
      .min(4, "Please enter a valid pincode")
      .optional(),

    isDefault: z
      .boolean()
      .optional(),
  }),

  params: z.object({
    addressId: z
      .string()
      .min(1, "Address ID is required"),
  }),

  query: z.object({}),
});

// WISHLIST PRODUCT ID VALIDATION
const wishlistProductIdSchema = z.object({
  body: z.object({}),
  params: z.object({
    productId: z.string().min(1, "Product ID is required"),
  }),
  query: z.object({}),
});

const userIdSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({
    userId: z.string().min(1, "User ID is required"),
  }),
  query: z.object({}).optional().default({}),
});

const changeUserRoleSchema = z.object({
  body: z.object({
    role: z.enum(["user", "admin"], {
      required_error: "Role is required",
      invalid_type_error: "Role must be 'user' or 'admin'",
    }),
  }),
  params: z.object({
    userId: z.string().min(1, "User ID is required"),
  }),
  query: z.object({}),
});

module.exports = {
  updateProfileSchema,
  addAddressSchema,
  addressIdSchema,
  updateAddressSchema,
  wishlistProductIdSchema,
  userIdSchema,
  changeUserRoleSchema,
};