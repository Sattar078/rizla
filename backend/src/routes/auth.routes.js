const express = require("express");


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


router.post("/signup", validate(signupSchema), signup);

router.post("/login", validate(loginSchema), login);

// Change Password
router.put(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  changePassword
);

module.exports = router;