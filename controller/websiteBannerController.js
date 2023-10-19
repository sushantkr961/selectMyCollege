const Banner = require("../model/bannerModel");
const imageSize = require("image-size");
const fs = require("fs");

const uploadBannerImage = async (req, res) => {
  const files = req.files;
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const dimensions = imageSize(file.path);
      const targetWidth = 1920;
      const targetHeight = 1080;
      if (dimensions.width < targetWidth || dimensions.height < targetHeight) {
        fs.unlinkSync(file.path);
        req.session.message = {
          type: "danger",
          message:
            "Invalid image resolution. Please select an image with a minimum resolution of 1920x1080.",
        };
        return res.redirect(`/admin/banner`);
      }

      const maxSize = 4 * 1024 * 1024;
      if (file.size > maxSize) {
        fs.unlinkSync(file.path);
        req.session.message = {
          type: "danger",
          message:
            "Invalid file size. Please select an image with a maximum size of 4MB.",
        };
        return res.redirect(`/admin/banner`);
      }
    }

    const galleryImages = files.map((file) => ({
      image: "uploads/" + file.filename,
    }));

    const createdImages = await Banner.create(galleryImages);
    res.redirect(`/admin/banner`);
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    return res.redirect("/admin/banner");
  }
};

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
  try {
    const galleryImage = await Banner.findById(imageId);
    if (!galleryImage) {
      req.session.message = {
        type: "danger",
        message: "Gallery image not found",
      };
      return res.redirect("/admin/banner");
    }
    await Banner.deleteOne({ _id: imageId });

    req.session.message = {
      type: "success",
      message: "Gallery image deleted successfully",
    };
    return res.redirect("/admin/banner");
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    req.session.message = {
      type: "danger",
      message: "Error deleting gallery image",
    };
    return res.redirect("/admin/banner");
  }
};

module.exports = {
  uploadBannerImage,
  UploadBannerView,
  deleteGalleryImage,
};
