import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { Readable } from 'stream';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) return NextResponse.json({ error: 'No file found' }, { status: 400 });

    // 1. Setup OAuth2 Client (Acting as YOU, not a Service Account)
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    auth.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const drive = google.drive({ version: 'v3', auth });

    // 2. Convert file to stream
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    // 3. Upload to YOUR Drive Folder
    const response = await drive.files.create({
      requestBody: {
        name: file.name, // e.g. "my-video.mp4"
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!], // Uploads into your specific folder
      },
      media: {
        mimeType: file.type,
        body: stream,
      },
      fields: 'id, webContentLink',
    });

    // 4. Make it Publicly Readable (So the Editor can play it)
    await drive.permissions.create({
      fileId: response.data.id!,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return NextResponse.json({ 
      url: response.data.webContentLink 
    });

  } catch (error) {
    console.error("Drive Upload Error:", error);
    return NextResponse.json({ error: 'Upload Failed' }, { status: 500 });
  }
}