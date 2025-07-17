import cloudinary from "../config/cloudinary.js";

const uploadImage = async (imagePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.log("Error uploading an image to cloudinary.", error);
    throw new Error("Error uploading an image to cloudinary.");
  }
};

const deleteImage = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log("Error deleting an image from cloudinary.", error);
    throw new Error("Error deleting an image from cloudinary.");
  }
};

export { deleteImage, uploadImage };
