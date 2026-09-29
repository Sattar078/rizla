const express = require("express");

const {
  createProduct,
  updateProduct,
  deleteProductImage,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
} = require("../controllers/product.controller");

const protect = require("../middleware/auth.middleware");

const adminOnly = require("../middleware/admin.middleware");

const validate = require("../middleware/validate.middleware");


const {
  createProductSchema,
  updateProductSchema,
  deleteProductImageSchema,
  deleteProductSchema,
   productIdSchema,
  getProductsQuerySchema,
} = require("../validators/product.validator");


const router = express.Router();
const reviewRoutes = require("./review.routes");

// Mount review routes
router.use("/:productId/reviews", reviewRoutes);

router.get(
  "/",
  validate(getProductsQuerySchema),
  getAllProducts
);
router.get(
  "/:productId",
  validate(productIdSchema),
  getSingleProduct
);

// CREATE PRODUCT - ADMIN ONLY
router.post(
  "/",
  protect,
  adminOnly,
  validate(createProductSchema),
  createProduct
);

// UPDATE PRODUCT - ADMIN ONLY
router.put(
  "/:productId",
  protect,
  adminOnly,
  validate(updateProductSchema),
  updateProduct
);
  
// DELETE SINGLE PRODUCT IMAGE - ADMIN ONLY
router.delete(
  "/:productId/images/:imageId",
  protect,
  adminOnly,
  validate(deleteProductImageSchema),
  deleteProductImage
);
  
// DELETE PRODUCT - ADMIN ONLY
router.delete(
  "/:productId",
  protect,
  adminOnly,
  validate(deleteProductSchema),
  deleteProduct
);




module.exports = router;