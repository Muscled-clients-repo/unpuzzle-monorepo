import fs from "fs";
import path from "path";
import { NextFunction, Request, Response } from "express";
import { BindMethods } from "../../utility/BindMethods";
import { BaseAgent } from "../../../contexts/agents/BaseAgent";
import supabase from "../../../models/supabase/client";
import fileModel from "../../../models/supabase/file.model";
import puzzleReflectModel from "../../../models/supabase/puzzleReflect.model";
import ResponseHandler from "../../utility/ResponseHandler";
import ClerkUserService from "../../../contexts/services/ClerkUserService";

class PuzzleReflectsController extends BaseAgent {
  private bucket;
  constructor(bucket = "unpuzzlereflect") {
    super();
    this.bucket = bucket;
  }
  async uploadToSupabase(folder: string, file: any, next: NextFunction) {
    try {
      // Validate file path to prevent directory traversal
      if (!file.path || typeof file.path !== "string") {
        throw new Error("Invalid file path");
      }

      // Ensure the file path is within the expected upload directory
      const uploadDir = path.resolve(process.cwd(), "uploads");
      const resolvedFilePath = path.resolve(file.path);

      if (!resolvedFilePath.startsWith(uploadDir)) {
        throw new Error("Invalid file path: Access denied");
      }

      // Use the safe, resolved path
      const buffer = await fs.promises.readFile(resolvedFilePath);
      let { data, error } = await supabase.storage
        .from(this.bucket)
        .upload(`${Date.now()}-${file.originalname}`, buffer, {
          contentType: file.mimetype,
        });
      if (error || !data)
        return next(
          new Error(
            `Supabase upload failed: ${error?.message || "Unknown error"}`
          )
        );
      const { data: publicUrlData } = supabase.storage
        .from(this.bucket)
        .getPublicUrl(data.fullPath);
      return {
        path: data.path,
        fullPath: data.fullPath,
        id: data.id, // or any custom identifier you use
        url: publicUrlData.publicUrl,
      };
    } catch (err) {
      return next(err);
    } finally {
      // Always delete temp file
      try {
        if (file.path && typeof file.path === "string") {
          const uploadDir = path.resolve(process.cwd(), "uploads");
          const resolvedFilePath = path.resolve(file.path);

          // Only delete if file is within upload directory
          if (resolvedFilePath.startsWith(uploadDir)) {
            await fs.promises.unlink(resolvedFilePath);
          }
        }
      } catch (cleanupErr) {
        // Log error but don't throw - file cleanup is not critical
        if (process.env.NODE_ENV !== "production") {
          console.error("Failed to delete temp file:", cleanupErr);
        }
      }
    }
  }

  createAudioReflect = async (req: any, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler(res, next);
    const file = req.file as Express.Multer.File;
    const { video_id, timestamp } = req.body;
    const user_id = req.user.id;

    try {
      if (!file || !video_id) {
        return responseHandler.error(
          new Error("Audio file and video_id are required")
        );
      }

      // Step 1: Create puzzle reflect entry
      const puzzleReflectResponse =
        await puzzleReflectModel.createPuzzleReflect({
          type: "audio",
          loom_link: null,
          user_id,
          video_id,
          title: "Puzzle Reflect Audio",
          timestamp: timestamp ? Number(timestamp) : null,
        });

      if (!puzzleReflectResponse) {
        return responseHandler.error(
          new Error("Puzzle reflect creation failed")
        );
      }

      const puzzle_reflect_id = puzzleReflectResponse.id;

      // Step 2: Upload to Supabase
      const result = await this.uploadToSupabase("files", file, next);
      if (!result) {
        return responseHandler.error(new Error("File upload failed"));
      }

      // Step 3: Save file record in DB
      const filePayload = {
        mime_type: file.mimetype,
        puzzle_reflect_id,
        name: result.path || null,
        stoarge_path: result.fullPath || null,
        file_id: result.id || null,
        loom_link: null,
        original_file_name: file.originalname || null,
        url: result?.url,
        file_size: file.size?.toString() || null,
        check_sum: null,
        updated_at: null,
      };
      const response = await fileModel.createFile(filePayload);
      if (!response) {
        console.error("File DB save failed, rolling back uploaded file...");
        await supabase.storage.from(this.bucket).remove([result.path]);
        return responseHandler.error(new Error("DB save failed"));
      }

      return responseHandler.success({
        puzzle_reflect_id,
        file: response,
      });
    } catch (error) {
      return responseHandler.error(
        error instanceof Error ? error : new Error(String(error))
      );
    }
  };

  createFileReflect = async (req: any, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler(res, next);
    const { video_id, timestamp } = req.body;
    const user_id = req.user.id;
    const files = req.files as Express.Multer.File[];

    try {
      if (!files || files.length === 0) {
        return responseHandler.error(new Error("No files provided"));
      }

      // Step 1: Create one puzzle reflect entry
      const puzzleReflectResponse =
        await puzzleReflectModel.createPuzzleReflect({
          type: "images",
          loom_link: null,
          user_id: user_id,
          video_id: video_id,
          title: "Puzzle Reflect Agent",
          timestamp: timestamp ? Number(timestamp) : null,
        });
      if (!puzzleReflectResponse || !puzzleReflectResponse?.id) {
        return responseHandler.error(
          puzzleReflectResponse?.error ||
            new Error("Puzzle reflect creation failed")
        );
      }

      const puzzle_reflect_id = puzzleReflectResponse.id;
      const uploadResults = [];

      // Step 2: Upload files to Supabase and store each in DB using puzzle_reflect_id
      for (const file of files) {
        const result = await this.uploadToSupabase("files", file, next);
        if (result) {
          const filePayload = {
            mime_type: file.mimetype,
            puzzle_reflect_id: puzzle_reflect_id,
            name: result.path || null,
            stoarge_path: result.fullPath || null,
            file_id: result.id || null,
            loom_link: null,
            original_file_name: file.originalname || null,
            url: `https://${result.id}.supabase.co/storage/v1/object/public/unpuzzlereflect/${result.path}`,
            file_size: file.size.toString() || null,
            check_sum: null,
            updated_at: null,
          };

          const fileResponse = await fileModel.createFile(filePayload);

          if (!fileResponse?.success) {
            await supabase.storage.from(this.bucket).remove([result.path]);
            continue;
          }

          uploadResults.push({
            path: result.path,
            full_path: result.fullPath,
            file_id: result.id,
          });
        }
      }

      return responseHandler.success({
        puzzle_reflect_id,
        uploadResults,
      });
    } catch (error) {
      return responseHandler.error(
        error instanceof Error ? error : new Error(String(error))
      );
    }
  };

  createLoomLinkReflect = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      console.log("req.body: ", req.body);
      const { loom_link, video_id, timestamp } = req.body;
      const user_id = req.user.id;
      if (!loom_link || !loom_link.startsWith("https://www.loom.com/")) {
        return responseHandler.error(new Error("Invalid Loom link"));
      }

      if (!video_id) {
        return responseHandler.error(new Error("No Video ID is provided"));
      }

      // Step 1: Create PuzzleReflect
      const puzzleReflectResponse =
        await puzzleReflectModel.createPuzzleReflect({
          type: null,
          loom_link,
          user_id,
          video_id,
          title: "Puzzle Reflect Loom Link",
          timestamp: timestamp ? Number(timestamp) : null,
        });

      // Log response in development only
      if (process.env.NODE_ENV === "development") {
        console.log("Puzzle reflect response:", puzzleReflectResponse);
      }

      if (!puzzleReflectResponse || !puzzleReflectResponse?.id) {
        return responseHandler.error(
          puzzleReflectResponse?.error ||
            new Error("Puzzle reflect creation failed")
        );
      }
      return responseHandler.success({
        puzzle_reflect_id: puzzleReflectResponse?.id,
      });
    } catch (error) {
      return responseHandler.error(
        error instanceof Error ? error : new Error(String(error))
      );
    }
  };

  getPuzzleReflects = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { video_id } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const includeUser =
        req.query.includeUser !== undefined
          ? req.query.includeUser === "true"
          : true;

      if (!video_id) {
        return responseHandler.error(new Error("Video ID is required"));
      }

      const result = await puzzleReflectModel.getAllPuzzleReflects(
        video_id as string,
        page,
        limit
      );
      if (!result) {
        return responseHandler.error(new Error("No puzzle reflects found"));
      }

      // If includeUser is true, enrich with Clerk data
      if (includeUser && result.data) {
        const enrichedData = await ClerkUserService.enrichRecordsWithUserData(
          result.data
        );
        return responseHandler.success({
          data: enrichedData,
          count: result.count,
          total_page: result.total_page,
        });
      }

      return responseHandler.success({
        data: result.data,
        count: result.count,
        total_page: result.total_page,
      });
    } catch (error: any) {
      return responseHandler.error(
        error instanceof Error ? error : new Error(String(error))
      );
    }
  };

  getPuzzleReflectById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { id } = req.params;
      const result = await puzzleReflectModel.getPuzzleReflectById(id);
      if (!result) {
        return responseHandler.error(new Error("No puzzle reflect found"));
      }
      return responseHandler.success(result);
    } catch (error: any) {
      return responseHandler.error(
        error instanceof Error ? error : new Error(String(error))
      );
    }
  };
}

const binding = new BindMethods(new PuzzleReflectsController());
export default binding.bindMethods();
