const { errorHandler, notFound } = require("./middleware/error.middleware");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");

const productRoutes = require("./routes/product.routes");
const uploadRoutes = require("./routes/upload.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

const adminRoutes = require("./routes/admin.routes");
const notificationRoutes = require("./routes/notification.routes");

const connectDB = require("./config/db");

const app = express();

app.use(helmet());

// Production CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://rizla-boutique.com",
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());

// Database connection assurance middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection error in middleware:", err.message);
    next(err);
  }
});

const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    message: "Rizla Boutique API is running",
    timestamp: new Date().toISOString(),
  });
};

app.get("/", healthCheck);
app.get("/health", healthCheck);
app.get("/api/health", healthCheck);

// Auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;