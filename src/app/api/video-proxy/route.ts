// src/app/api/video-proxy/route.ts
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return new NextResponse('Missing URL', { status: 400 });

  try {
    // 1. Extract File ID from the Drive URL
    // Matches id=XXX or /d/XXX patterns
    const idMatch = url.match(/(?:id=|\/d\/)([\w-]+)/);
    const fileId = idMatch ? idMatch[1] : null;

    if (!fileId) {
       return new NextResponse('Invalid Drive URL', { status: 400 });
    }

    // 2. Setup Auth (Reuse your existing env vars)
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

    const drive = google.drive({ version: 'v3', auth });

    // 3. Fetch the stream directly from Drive API
    // 'alt: media' tells Drive to return the file content, bypassing virus scan warnings
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    // 4. Create headers for video playback
    const headers = new Headers();
    headers.set('Content-Type', response.headers['content-type'] || 'video/mp4');
    headers.set('Content-Length', response.headers['content-length'] || '');
    
    // Critical headers for Remotion/Cross-Origin playback
    headers.set("Cross-Origin-Resource-Policy", "cross-origin");
    headers.set("Access-Control-Allow-Origin", "*");

    // 5. Return the stream
    return new NextResponse(response.data as any, { headers });

  } catch (error) {
    console.error("Proxy Error:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}