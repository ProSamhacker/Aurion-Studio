import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, voiceId } = await req.json();

    // 1. Load all available keys
    // You can store them as a comma-separated string in one env var: "key1,key2,key3"
    // Or grab specific ones like process.env.KEY1, process.env.KEY2, etc.
    const keysString = process.env.ELEVENLABS_API_KEYS || process.env.ELEVENLABS_API_KEY || "";
    const apiKeys = keysString.split(',').map(k => k.trim()).filter(k => k.length > 0);

    if (apiKeys.length === 0) {
      return NextResponse.json({ error: 'Server Config Error: No API Keys found' }, { status: 500 });
    }

    let lastError = null;
    let successResponse = null;

    // 2. Loop through keys until one works
    for (const apiKey of apiKeys) {
      try {
        console.log(`🎙️ Attempting generation with key ending in ...${apiKey.slice(-4)}`);
        
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
              model_id: "eleven_turbo_v2_5", // Using the Turbo model (50% cheaper)
              voice_settings: { stability: 0.5, similarity_boost: 0.75 }
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          // If error is 401 (Unauthorized) or 402/429 (Quota/Payment), we try the next key
          // We log it and continue the loop
          console.warn(`❌ Key ...${apiKey.slice(-4)} failed:`, errorData);
          lastError = errorData;
          continue; 
        }

        // If successful, stop the loop and save the response
        const audioBuffer = await response.arrayBuffer();
        successResponse = new Response(audioBuffer, {
          headers: { 'Content-Type': 'audio/mpeg' },
        });
        break; // Exit loop on success

      } catch (e) {
        console.error(`Network error with key ...${apiKey.slice(-4)}`, e);
        lastError = "Network Error";
      }
    }

    // 3. Return the result or the final error
    if (successResponse) {
      return successResponse;
    } else {
      return NextResponse.json({ 
        error: 'All API keys failed or exhausted credits.', 
        details: lastError 
      }, { status: 402 }); 
    }

  } catch (error) {
    console.error("Server Fatal Error:", error);
    return NextResponse.json({ error: 'Voice generation failed completely' }, { status: 500 });
  }
}