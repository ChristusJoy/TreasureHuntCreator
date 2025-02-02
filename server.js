import express from "express";
import multer from "multer";
import { google } from "googleapis";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";

// Load environment variables from .env file
dotenv.config();

const app = express();
const upload = multer({ dest: "uploads/" });

// Enable CORS for all origins (you can restrict this if necessary)
app.use(cors());

// Google Drive Authentication
const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json", // Ensure this path is correct
    scopes: ["https://www.googleapis.com/auth/drive.file"],
});
const drive = google.drive({ version: "v3", auth });

// Upload to Google Drive
app.post("/upload", upload.single("image"), async (req, res) => {
    try {
        console.log("Received upload request");
        // Check if file is uploaded
        if (!req.file) {
            console.log("No file uploaded");
            return res.status(400).json({ success: false, error: "No file uploaded" });
        }

        console.log("File uploaded:", req.file);

        // File metadata and media setup for upload
        const fileMetadata = { name: req.file.originalname };
        const media = { mimeType: req.file.mimetype, body: fs.createReadStream(req.file.path) };

        // Upload to Google Drive
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: "id",
        });

        console.log("File uploaded to Google Drive:", response.data);

        // Delete the file from local storage after uploading
        fs.unlinkSync(req.file.path);

        // Respond with the URL of the uploaded file on Google Drive
        res.json({ success: true, url: `https://drive.google.com/uc?id=${response.data.id}` });

    } catch (error) {
        console.error("Error uploading to Google Drive:", error);
        res.status(500).json({ success: false, error: "Upload failed" });
    }
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
