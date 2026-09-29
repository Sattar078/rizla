const cloudinary = require("../config/cloudinary");

// UPLOAD PRODUCT IMAGES
const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image",
      });
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "rizla-boutique/products",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve({
                  url: result.secure_url,
                  publicId: result.public_id,
                });
              }
            }
          )
          .end(file.buffer);
      });
    });

    const images = await Promise.all(uploadPromises);

    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      images,
    });
  } catch (error) {
    console.error("Image upload error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to upload images",
    });
  }
};

module.exports = {
  uploadProductImages,
};