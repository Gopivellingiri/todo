import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/UserModal.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage(); // Store file in memory (needed for upload_stream)
export const upload = multer({ storage }).single("file");

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    cloudinary.uploader
      .upload_stream(
        { folder: "taskly/profile-images" },
        async (error, result) => {
          if (error) {
            return res
              .status(500)
              .json({ message: "Upload to Cloudinary failed", error });
          }

          // Find user
          const user = await User.findById(req.user._id);
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }

          // Delete old image
          if (user.profilePicture.publicId) {
            await cloudinary.uploader.destroy(user.profilePicture.publicId);
          }

          // Save new image
          user.profilePicture = {
            image: result.secure_url,
            publicId: result.public_id,
          };
          await user.save();

          res.json({
            message: "Profile picture updated successfully",
            imageUrl: result.secure_url,
          });
        }
      )
      .end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error });
  }
};
