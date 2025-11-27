// src/core/ffmpeg/client.ts
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

export class FFmpegClient {
  private static instance: FFmpeg;
  private static loaded: boolean = false;

  public static async getInstance(): Promise<FFmpeg> {
    if (!FFmpegClient.instance) {
      FFmpegClient.instance = new FFmpeg();
    }

    const ffmpeg = FFmpegClient.instance;

    if (!FFmpegClient.loaded) {
      // REVERT TO STANDARD CORE (Stable & Reliable)
      // We removed "core-mt" because it causes deadlocks
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      
      FFmpegClient.loaded = true;
      console.log("✅ FFmpeg Engine Loaded (Stable Mode)");
    }

    return ffmpeg;
  }
}