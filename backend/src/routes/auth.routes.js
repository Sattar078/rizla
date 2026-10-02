const express = require("express");
const rateLimit = require("express-rate-limit");


const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/auth.controller");

const validate = require("../middleware/validate.middleware");

const protect = require("../middleware/auth.middleware");

const {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require("../validators/auth.validator");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/signup", loginLimiter, validate(signupSchema), signup);

router.post("/login", loginLimiter, validate(loginSchema), login);

router.post(
  "/forgot-password",
  passwordResetLimiter,
  validate(forgotPasswordSchema),
  forgotPassword
);

router.post(
  "/reset-password/:token",
  passwordResetLimiter,
  validate(resetPasswordSchema),
  resetPassword
);

// Change Password
router.put(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  changePassword
);

module.exports = router;