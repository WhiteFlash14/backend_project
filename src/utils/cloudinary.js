import {v2 as cloudinary} from "cloudinary";
import fs from "fs";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) {
            throw new Error("Local file path is required for upload.");
        }

        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // Automatically detect the resource type (image, video, etc.)
        } );
        
        // console.log("File uploaded successfully:", result.url);
        fs.unlinkSync(localFilePath); // Clean up the local file after upload
        return result;
    } catch (error) {
        fs.unlinkSync(localFilePath); // Clean up the local file if upload fails
        return null;
    }
}

export {uploadOnCloudinary}