const express = require("express");

const { getDashboardStats } = require("../controllers/admin.controller");

const protect = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/admin.middleware");

const router = express.Router();

// GET ADMIN DASHBOARD - ADMIN ONLY
router.get(
  "/dashboard",
  protect,
  adminOnly,
  getDashboardStats
);

module.exports = router;
