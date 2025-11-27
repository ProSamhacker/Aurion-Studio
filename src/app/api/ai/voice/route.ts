import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, voiceId } = await req.json();
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Server Config Error: Missing API Key' }, { status: 500 });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          // FIX: Changed from 'eleven_monolingual_v1' to 'eleven_multilingual_v2'
          model_id: "eleven_multilingual_v2", 
          voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ ElevenLabs API Error:", JSON.stringify(errorData, null, 2));
      return NextResponse.json({ error: errorData }, { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new Response(audioBuffer, {
      headers: { 'Content-Type': 'audio/mpeg' },
    });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: 'Voice generation failed' }, { status: 500 });
  }
}