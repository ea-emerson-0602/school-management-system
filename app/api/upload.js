import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const readableStream = Readable.from(req.file.buffer);
      const uploadResponse = await cloudinary.uploader.upload_stream(
        { folder: "school-management" },
        (error, result) => {
          if (error) return res.status(500).json({ error });
          res.status(200).json(result);
        }
      );
      readableStream.pipe(uploadResponse);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default upload.single("file")(handler);
