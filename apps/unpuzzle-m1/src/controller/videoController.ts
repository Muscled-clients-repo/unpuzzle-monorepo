import { NextFunction, Request, Response } from "express";
import { BindMethods } from "../utility/BindMethods";
import ResponseHandler from "../utility/ResponseHandler";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

class VideoController {
    private apiUrl: string;
    private uploadsDir: string;

  constructor() {
    this.apiUrl = process.env.APP_URL_ENDPOINT || "http://localhost:3000";
    this.uploadsDir = path.join(__dirname, "..", "uploads");
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  getUploadId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const responseHandler = new ResponseHandler(res, next);
    const fileId = uuidv4();
    return responseHandler.success({ fileId });
  };

  streamUpload = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const responseHandler = new ResponseHandler(res, next);
    try {
        let { fileId, chunkIndex, status } = req.body;
        const { originalname, path: tempPath } = req.file;

        console.log(req.body);
        
        if (!fileId) {
            fileId = uuidv4();
        }

        if (!req.file) {
            return responseHandler.error(new Error("No file uploaded"));
        }

        const targetPath = path.join(this.uploadsDir, `${fileId}.webm`);
        
        // Use streams to append the chunk
        await new Promise<void>((resolve, reject) => {
            const readStream = fs.createReadStream(tempPath);
            const writeStream = fs.createWriteStream(targetPath, { flags: 'a' });
            readStream.on('error', reject);
            writeStream.on('error', reject);
            writeStream.on('finish', resolve);
            readStream.pipe(writeStream);
        });
        
        // Clean up temporary file
        fs.unlinkSync(tempPath);

        console.log(`Chunk ${chunkIndex} appended to ${fileId}.webm`);

        if (status === "completed") {
            // Get file stats for response
            const stats = fs.statSync(targetPath);
            
            // TODO: Upload to cloud storage here
            // TODO: Create file record in database here
            
            console.log(`Video upload completed: ${fileId}.webm (${stats.size} bytes)`);
            
            // For now, keep the file in uploads directory
            // In production, you'd upload to cloud storage and delete local file
            
            return responseHandler.success({
                message: "Video upload completed successfully",
                fileId: fileId,
                fileSize: stats.size,
                chunks: parseInt(chunkIndex) + 1
            });
        }

        return responseHandler.success({
            message: "Video chunk uploaded successfully",
            fileId: fileId,
            chunkIndex: parseInt(chunkIndex),
            status: "uploading"
        });
    } catch (error: any) {
        console.error("Video upload error:", error);
        return responseHandler.error(error);
    }
  };

  // Get upload status
  getUploadStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const responseHandler = new ResponseHandler(res, next);
    try {
        const { fileId } = req.params;
        const filePath = path.join(this.uploadsDir, `${fileId}.webm`);
        
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            return responseHandler.success({
                fileId: fileId,
                exists: true,
                fileSize: stats.size,
                lastModified: stats.mtime
            });
        } else {
            return responseHandler.success({
                fileId: fileId,
                exists: false
            });
        }
    } catch (error: any) {
        return responseHandler.error(error);
    }
  };
}

const binding = new BindMethods(new VideoController());
export default binding.bindMethods();
