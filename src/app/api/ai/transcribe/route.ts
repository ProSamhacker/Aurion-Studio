import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { mediaData, mimeType } = await req.json();

    const schema = z.object({
      captions: z.array(z.object({
        start: z.string().describe("Start time in seconds (e.g. 0.5)"),
        end: z.string().describe("End time in seconds (e.g. 2.5)"),
        // UPDATE: Added constraint to description
        text: z.string().describe("The spoken words (short phrase, max 5-7 words)"),
      }))
    });

    const result = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: schema,
      messages: [
        {
          role: 'user',
          content: [
            // UPDATE: Modified prompt to enforce short, dynamic segments
            { type: 'text', text: "Transcribe ONLY the spoken audio. **Split the text into short, rapid-fire segments (maximum 3-7 words per segment)** to mimic real-time dynamic subtitles. Do NOT output full long sentences in a single block. Do not describe visuals, background noise, or silence. Do not transcribe on-screen text/numbers unless explicitly spoken. Return precise timestamps." },
            { 
              type: 'file', 
              data: mediaData, 
              mediaType: mimeType || 'video/mp4' 
            },
          ],
        },
      ],
    });

    return Response.json(result.object);

  } catch (error) {
    console.error("Transcription Error:", error);
    return new Response(JSON.stringify({ error: "Failed to transcribe" }), { status: 500 });
  }
}