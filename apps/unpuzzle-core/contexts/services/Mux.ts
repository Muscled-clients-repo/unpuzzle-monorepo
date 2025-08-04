import { Mux } from "@mux/mux-node";
import axios from "axios";
import fs from "fs";

class MuxService {
  private videoClient: any;

  constructor(tokenId: string, tokenSecret: string) {
    const mux = new Mux({
      tokenId: tokenId,
      tokenSecret: tokenSecret,
    });

    this.videoClient = mux.video;
  }

  // Upload local video file to Mux (simplified example)
  public async uploadVideo(localFilePath: string): Promise<any> {
    try {
      const fileStream = fs.createReadStream(localFilePath);
      if (!this.videoClient)
        throw new Error("Video Uploading Failed Due Storage Connection issue");
      // Create a new upload using the Mux SDK.
      const upload = await this.videoClient.uploads.create({
        cors_origin: "*",
        new_asset_settings: {
          playback_policy: ["public"],
          video_quality: "basic",
        },
      });
      const uploadUrl = upload.url;
      await axios.put(uploadUrl, fileStream, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });
      // 3. Poll Mux REST API for asset_id
      const assetId = await this.pollForAssetId(upload.id);
      const asset = await this.videoClient.assets.retrieve(assetId);
      const playbackId = asset.playback_ids[0]?.id;
      if (!playbackId) throw new Error("Playback ID not found.");
      const publicUrl = `https://stream.mux.com/${playbackId}.m3u8`;
      return { ...upload, publicUrl, playbackId };
    } catch (error) {
      console.error("Mux upload failed:", error);
      throw error;
    }
  }
  // get teh asset id

  // Helper to poll the Mux Upload API (REST) until asset_id is ready
  private async pollForAssetId(
    uploadId: string,
    maxTries = 10,
    intervalMs = 3000
  ): Promise<string> {
    for (let i = 0; i < maxTries; i++) {
      const res = await axios.get(
        `https://api.mux.com/video/v1/uploads/${uploadId}`,
        {
          auth: {
            username: process.env.MUX_TOKEN_ID!,
            password: process.env.MUX_TOKEN_SECRET!,
          },
        }
      );

      const assetId = res.data?.data?.asset_id;
      if (assetId) return assetId;

      await new Promise((res) => setTimeout(res, intervalMs));
    }
    throw new Error("Asset ID not available after polling.");
  }

  // Delete local file
  public deleteLocalFile(filePath: string) {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting local file:", err);
      else console.log("Local file deleted:", filePath);
    });
  }
}

export default MuxService;
