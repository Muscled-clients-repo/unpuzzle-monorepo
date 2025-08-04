import multer from "multer";
import path from "path";
import fs from "fs";
import { BindMethods } from "../utility/BindMethods";
import { NextFunction, Request, Response } from "express";
import { DestinationCallback, FileNameCallback } from "../../types/multer.type";

class UploadMiddleware {
  filetypes: RegExp;
  uploadDir: string;
  storage: multer.StorageEngine;
  upload: multer.Multer;

  constructor() {
    this.filetypes = /jpeg|jpg|png|gif|mp4|mkv|avi|mp3|wav|webm|srt/;
    this.uploadDir = "./uploads";
    this.storage = multer.diskStorage({
      destination: (
        req: Request,
        file: Express.Multer.File,
        cb: DestinationCallback
      ) => this.setDestination(req, file, cb),
      filename: (
        req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
      ) => this.setFilename(req, file, cb),
    });

    this.upload = multer({
      storage: this.storage,
      limits: { fileSize: 100000000 },
      fileFilter: (req, file, cb) => this.checkFileType(file, cb),
    });
  }

  setDestination(
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    cb(null, this.uploadDir);
  }

  setFilename(req: Request, file: Express.Multer.File, cb: FileNameCallback) {
    const originalName = file.originalname.replace(/\s+/g, "_");
    const uniqueName: string = `${file.fieldname}-${Date.now()}${path.extname(
      originalName
    )}`;
    cb(null, uniqueName);
  }

  checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const extraFilesAccepted = ['audio/wav'];
    if(extraFilesAccepted.includes(file.mimetype)){
      return cb(null, true);
    }
    const extname = this.filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    // const mimetype = this.filetypes.test(file.mimetype);
    console.log(path.extname(file.originalname).toLowerCase());

    if (extname) {
      cb(null, true);
    } else {
      cb(new Error("File type not supported!"));
    }
  }

  singleFileUpload(fieldName: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (
        !req.headers["content-type"] ||
        !req.headers["content-type"].includes("multipart/form-data")
      )
        return next();
      const uploadSingle = this.upload.single(fieldName);
      uploadSingle(req, res, (err) => {
        if (err) {
          return next(err);
        }
        // if (!req.file) {
        //   return next(new Error('No files selected'));
        // }
        next();
      });
    };
  }
  formData() {
    return (req: Request, res: Response, next: NextFunction) => {
      this.upload.none()(req, res, (err) => {
        if (err) {
          next(err);
        }
        next();
      });
    };
  }
  multipleFileUpload(fieldName: string, maxCount: number) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (
        !req.headers["content-type"] ||
        !req.headers["content-type"].includes("multipart/form-data")
      )
        return next();
      const uploadMultiple = this.upload.array(fieldName, maxCount);
      uploadMultiple(req, res, (err) => {
        if (err) {
          return next(err);
        }
        // if (!req.files || req.files.length === 0) {
        //   return next(new Error('No files selected'));
        // }
        next();
      });
    };
  }

  multipleFieldsUpload(fieldsConfig: any) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (
        !req.headers["content-type"] ||
        !req.headers["content-type"].includes("multipart/form-data")
      )
        return next();
      const uploadMultiple = this.upload.fields(fieldsConfig);
      uploadMultiple(req, res, (err) => {
        if (err) {
          return next(err);
        }
        // if (!req.files || Object.keys(req.files).length === 0) {
        //   return next(new Error('No files selected'));
        // }
        next();
      });
    };
  }
}

const binding = new BindMethods(new UploadMiddleware());
export default binding.bindMethods();
