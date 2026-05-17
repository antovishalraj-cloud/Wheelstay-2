import { Router, Request, Response } from "express";
import { supabase } from "../config/supabase";

const router = Router();

// Increase payload size limit if needed for base64 images in index.ts
// POST /api/upload
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      res.status(400).json({ message: "No image data provided" });
      return;
    }

    // Extract base64 content type and data
    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({ message: "Invalid base64 string" });
      return;
    }

    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Generate unique filename
    const extension = contentType.split('/')[1] || 'jpeg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${extension}`;

    // Upload to Supabase Storage bucket 'uploads'
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, buffer, {
        contentType,
        upsert: false
      });

    if (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload image" });
      return;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(data.path);

    res.json({ success: true, url: publicUrlData.publicUrl });
  } catch (err) {
    console.error("Upload exception:", err);
    res.status(500).json({ message: "Server error during upload" });
  }
});

export default router;
