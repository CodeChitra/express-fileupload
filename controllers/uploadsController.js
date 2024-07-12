const { StatusCodes } = require("http-status-codes");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { BadRequestError } = require("../errors");
const uploadImageLocal = async (req, res) => {
  // file exists
  if (!req.files) {
    throw new BadRequestError("Please upload the image");
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please upload the image");
  }

  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new BadRequestError("Image is too big.");
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res
    .status(StatusCodes.OK)
    .json({ image: { src: "/uploads/" + productImage.name } });
};

const uploadImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "file-upload",
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath);
  res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};
module.exports = {
  uploadImage,
};
