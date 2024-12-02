import ImageKit from "imagekit";
import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";

// Initialize ImageKit with API keys and endpoint
const imagekit = new ImageKit({
    publicKey: process.env.IMGAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMGAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMGAGEKIT_ENDPOINT!, // Ensure this points to your actual ImageKit endpoint
});


export const uploadFileSingle = async (req: Request, res: Response): Promise<void> => {
    try {
        // Access the uploaded file
        const file = req.file; // Use req.file for single file
        if (!file) {
            res.status(400).json({ success: false, msg: "No file uploaded." });
            return;
        }

        // Upload the file to ImageKit
        const result = await imagekit.upload({
            file: file.buffer, // Use the file buffer
            fileName: file.originalname,
        });

        // Send success response with uploaded file URL
        res.status(200).json({
            success: true,
            msg: "File uploaded successfully.",
            url: result.url, // Return the uploaded file URL
        });
    } catch (error) {
        const errMsg = (error as Error).message;
        res.status(500).json({
            success: false,
            msg: "Server error during file upload.",
            error: errMsg,
        });
    }
};

// Controller to handle file uploads
export const uploadFileMultiple = async (req: Request, res: Response): Promise<void> => {
    try {
        // Cast to appropriate type (Multer memory storage stores files in memory)
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            res.status(400).json({ success: false, msg: "No files uploaded." });
            return;
        }

        // Store the URLs of uploaded files
        const urls: string[] = [];

        // Process each file
        for (const file of files) {
            // Directly upload the file buffer (since memoryStorage is used)
            const result = await imagekit.upload({
                file: file.buffer, // File buffer from Multer
                fileName: file.originalname, // Original file name
            });

            // Add the uploaded file URL to the array
            urls.push(result.url);
        }

        // Send success response with uploaded file URLs
        res.status(200).json({
            success: true,
            msg: "Files uploaded successfully.",
            urls,
        });
    } catch (error) {
        const errMsg = (error as Error).message;
        console.error("Error uploading files:", errMsg);
        res.status(500).json({
            success: false,
            msg: "Server error during file upload.",
            error: errMsg,
        });
    }
};
