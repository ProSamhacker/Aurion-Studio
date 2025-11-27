import React from 'react';
import { AbsoluteFill, Video, Audio, useVideoConfig } from 'remotion';

interface VideoCompositionProps {
  videoUrl: string | null;
  audioUrl: string | null;
  captions: string | null; // We will add logic for this later
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({ videoUrl, audioUrl, captions }) => {
  const { fps } = useVideoConfig();

  if (!videoUrl) {
    return (
      <AbsoluteFill className="bg-black flex items-center justify-center">
        <h1 className="text-white text-2xl font-bold">No Video Loaded</h1>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill className="bg-black">
      {/* LAYER 1: The Main Video */}
      <Video src={videoUrl} className="w-full h-full object-cover" />

      {/* LAYER 2: The AI Voiceover (Hidden Audio) */}
      {audioUrl && <Audio src={audioUrl} />}

      {/* LAYER 3: Overlay Text / Captions */}
      {captions && (
        <AbsoluteFill className="justify-end items-center pb-20">
           <div className="bg-black/70 px-6 py-3 rounded-xl">
              <p className="text-white text-2xl font-bold font-sans text-center leading-relaxed">
                {captions}
              </p>
           </div>
        </AbsoluteFill>
      )}
      
      {/* LAYER 4: Watermark (Example) */}
      <div className="absolute top-10 right-10 opacity-50">
        <p className="text-white font-bold tracking-widest">AURA STUDIO</p>
      </div>
    </AbsoluteFill>
  );
};