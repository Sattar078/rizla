const User = require("../models/user");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const Review = require("../models/Review");

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalReviews = await Review.countDocuments();

    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const revenueData = await Order.aggregate([
      {
        $match: { orderStatus: "delivered" },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    const codOrdersCount = await Order.countDocuments({ paymentMethod: "cod" });
    const razorpayOrdersCount = await Order.countDocuments({ paymentMethod: "razorpay" });

    const orderStatusCounts = ordersByStatus.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      data: {
        users: { totalUsers },
        products: { totalProducts, totalCategories },
        orders: { totalOrders, orderStatusCounts },
        revenue: { totalRevenue },
        reviews: { totalReviews },
        payments: { codOrdersCount, razorpayOrdersCount },
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch dashboard statistics",
    });
  }
};

module.exports = {
  getDashboardStats,
};
