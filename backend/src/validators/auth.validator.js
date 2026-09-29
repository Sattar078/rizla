const { z } = require("zod");

// SIGNUP VALIDATION
const signupSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters"),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    phone: z
      .string()
      .trim()
      .min(10, "Please enter a valid phone number"),
  }),

  params: z.object({}),
  query: z.object({}),
});

// LOGIN VALIDATION
const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(1, "Password is required"),
  }),

  params: z.object({}),
  query: z.object({}),
});

// FORGOT PASSWORD VALIDATION
const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address"),
  }),

  params: z.object({}),
  query: z.object({}),
});

// RESET PASSWORD VALIDATION
const resetPasswordSchema = z.object({
  body: z.object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  }),

  params: z.object({
    token: z
      .string()
      .min(1, "Reset token is required"),
  }),

  query: z.object({}),
});

// CHANGE PASSWORD VALIDATION
const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string()
      .min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
  }),

  params: z.object({}),
  query: z.object({}),
});

module.exports = {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};