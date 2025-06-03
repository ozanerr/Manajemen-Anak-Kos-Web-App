import cloudinary from "cloudinary";

const uploadImageFromUrlToCloudinary = async (req, res) => {
    const { imageProfile } = req.body;

    if (!imageProfile) {
        return res.status(400).json({
            message: "External Image URL is required in the request body",
        });
    }

    try {
        const uploadResult = await cloudinary.v2.uploader.upload(imageProfile);

        const newCloudinaryUrl = uploadResult.secure_url;
        res.status(200).json({
            message: "Image uploaded to Cloudinary successfully!",
            cloudinaryUrl: newCloudinaryUrl, // URL yang sudah diproses dari Cloudinary
        });
    } catch (error) {
        console.error("Error uploading image to Cloudinary from URL:", error);
        res.status(500).json({
            message: "Failed to upload image to Cloudinary",
            error: error.message,
        });
    }
};

export { uploadImageFromUrlToCloudinary };
