const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (isConnected) {
    return mongoose.connection;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(
      `MongoDB Connected: ${connection.connection.host}`
    );
    return connection;
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;