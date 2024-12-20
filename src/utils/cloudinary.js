import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import path from 'path';


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return "Could not find. File Path !!";
        // upload the file on cloudinary
        const filePath = path.resolve(localFilePath);
        console.log('Resolved file path:', filePath);
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
            transformation: [
                { width: 1200, crop: "limit" }, // Limit to 1200px width
                { quality: "auto:good" },   // Initial dynamic compression
                { fetch_format: "auto" } // Convert to efficient formats
            ]
        });
        const fileSizeInMB = response.bytes / (1024 * 1024); // Use response instead of result

        if (fileSizeInMB > 2.5) {
            console.log(`File is too large ${fileSizeInMB.toFixed(2)} MB, applying transformations ✨...`);
            const compressedResult = cloudinary.url(response.public_id, {
                transformation: [
                    { width: 1000, crop: "limit" },  // Further reduce resolution
                    { quality: 60 },                // Stricter compression
                    { fetch_format: "auto" }
                ]
            });
            console.log(`Optimized URL:`, compressedResult);
            return compressedResult;
        }

        // file has been uploaded successfully if file size already <= 2.5 MB
        console.log(`File is uploaded on Cloudinary:`, response.url);
        return response;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error); // Log the error
        fs.unlinkSync(localFilePath); // Remove locally saved temp file as upload got failed
        return null;
    }
}

export { uploadOnCloudinary }