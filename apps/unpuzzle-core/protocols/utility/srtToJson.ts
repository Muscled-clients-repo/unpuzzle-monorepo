import { promises as fs } from "fs";
import * as path from "path";

type SrtBlock = {
  id: number;
  start: string;
  end: string;
  text: string;
};

type SrtBlockWithVideoId = {
  video_id: string;
  start_time_sec: number;
  end_time_sec: number;
  content: string;
};

export class SrtToJson {
  static async fromFile(filePath: string, videoId: string): Promise<SrtBlockWithVideoId[]> {
    const absPath = path.resolve(filePath);
    const srtContent = await fs.readFile(absPath, "utf-8");
    const jsonOutput = this.parse(srtContent, videoId);
    await fs.unlink(absPath);
    return jsonOutput;
  }

  static srtTimeToSeconds(srtTimeString: string) {
    const parts = srtTimeString.split(':');
    const secondsAndMs = parts[2].split(',');
  
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(secondsAndMs[0], 10);
    const milliseconds = parseInt(secondsAndMs[1], 10);
  
    return (hours * 3600) + (minutes * 60) + seconds + (milliseconds / 1000);
  }

  private static parse(srt: string, videoId: string): SrtBlockWithVideoId[] {
    const lines = srt.trim().split('\n');
    const jsonOutput: SrtBlockWithVideoId[] = [];
    let currentBlock: Partial<SrtBlock> = {};
    let lineIndex = 0;

    while (lineIndex < lines.length) {
      const line = lines[lineIndex].trim();

      if (line === '') { // End of a block
        if (Object.keys(currentBlock).length > 0) {
          if (
            typeof currentBlock.id === "number" &&
            currentBlock.start &&
            currentBlock.end &&
            currentBlock.text
          ) {
            jsonOutput.push({
              video_id: videoId,
              start_time_sec: this.srtTimeToSeconds(currentBlock.start),
              end_time_sec: this.srtTimeToSeconds(currentBlock.end),
              content: currentBlock.text,
            });
          }
        }
        currentBlock = {};
        lineIndex++;
        continue;
      }

      // Try to parse ID (first line of a block)
      if (Object.keys(currentBlock).length === 0 && !isNaN(parseInt(line, 10))) {
        currentBlock.id = parseInt(line, 10);
      } else if (line.includes('-->')) { // Parse timestamps
        const [start, end] = line.split(' --> ');
        currentBlock.start = start.trim();
        currentBlock.end = end.trim();
      } else { // Accumulate text
        if (currentBlock.text) {
          currentBlock.text += ' ' + line; // Append to existing text
        } else {
          currentBlock.text = line;
        }
      }
      lineIndex++;
    }

    // Push the last block if it exists
    if (
      Object.keys(currentBlock).length > 0 &&
      typeof currentBlock.id === "number" &&
      currentBlock.start &&
      currentBlock.end &&
      currentBlock.text
    ) {
      jsonOutput.push({
        video_id: videoId,
        start_time_sec: this.srtTimeToSeconds(currentBlock.start),
        end_time_sec: this.srtTimeToSeconds(currentBlock.end),
        content: currentBlock.text,
      });
    }

    return jsonOutput;
  }
}

// Example usage (uncomment to test):
// (async () => {
//   const jsonResult = await SrtToJson.fromFile("path/to/your/file.srt");
//   console.log(JSON.stringify(jsonResult, null, 2));
// })();