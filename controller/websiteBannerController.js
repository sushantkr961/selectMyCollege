const Banner = require("../model/websiteBannerModel");
const imageSize = require("image-size");
const fs = require("fs");

const uploadBannerImage = async (req, res) => {
  const files = req.files;
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const dimensions = imageSize(file.path);

      // Example validation: Check if resolution is less than 1920x1080
      const targetWidth = 1920;
      const targetHeight = 1080;
      if (dimensions.width < targetWidth || dimensions.height < targetHeight) {
        // Delete the uploaded file
        fs.unlinkSync(file.path);
        req.session.message = {
          type: "danger",
          message:
            "Invalid image resolution. Please select an image with a minimum resolution of 1920x1080.",
        };
        return res.redirect(`/admin/banner`);
      }

      // Example validation: Check if file size is greater than 2MB
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > maxSize) {
        // Delete the uploaded file
        fs.unlinkSync(file.path);
        req.session.message = {
          type: "danger",
          message:
            "Invalid file size. Please select an image with a maximum size of 2MB.",
        };
        return res.redirect(`/admin/banner`);
      }
    }

    const galleryImages = files.map((file) => ({
      image: "uploads/" + file.filename,
    }));

    const createdImages = await Banner.create(galleryImages);
    console.log(createdImages);

    res.redirect(`/admin/banner`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// Controller for rendering the banner upload view

const UploadBannerView = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.render("admin/addWebsiteBanner", {
      title: "selectmycollege",
      banners,
    });
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    return res.redirect("/admin/banner");
  }
};

const deleteGalleryImage = async (req, res) => {
  const imageId = req.params.id;
  console.log(imageId);
  try {
    // Find the gallery image by its ID
    const galleryImage = await Banner.findById(imageId);

    if (!galleryImage) {
      return res.status(404).json({ message: "Gallery image not found" });
    }

    // Delete the gallery image from the database
    await Banner.deleteOne({ _id: imageId });

    res.status(200).json({ message: "Gallery image deleted successfully" });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    res.status(500).json({ error: "Error deleting gallery image" });
  }
};

module.exports = {
  uploadBannerImage,
  UploadBannerView,
  deleteGalleryImage,
};
