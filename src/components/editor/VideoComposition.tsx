// src/components/editor/VideoComposition.tsx - ENHANCED WITH STYLING
import React from 'react';
import { AbsoluteFill, Video, Audio, useCurrentFrame, useVideoConfig } from 'remotion';

interface CaptionStyle {
  color: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  textAlign: 'left' | 'center' | 'right';
  backgroundColor: string;
  position: 'top' | 'center' | 'bottom';
  opacity: number;
}

interface Caption {
  start: number;
  end: number;
  text: string;
  style?: CaptionStyle;
}

interface VideoCompositionProps {
  videoUrl: string | null;
  audioUrl: string | null;
  captions: Caption[];
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({ 
  videoUrl, 
  audioUrl, 
  captions 
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Find active caption
  const activeCaption = Array.isArray(captions) 
    ? captions.find((c) => currentTime >= c.start && currentTime <= c.end)
    : null;

  // Default style if none specified
  const defaultStyle: CaptionStyle = {
    color: '#FFFFFF',
    fontSize: 32,
    fontFamily: 'Inter, sans-serif',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    position: 'bottom',
    opacity: 1,
  };

  if (!videoUrl) {
    return (
      <AbsoluteFill className="bg-black flex items-center justify-center">
        <h1 className="text-white text-2xl font-bold">No Video Loaded</h1>
      </AbsoluteFill>
    );
  }

  // Get caption style
  const captionStyle = activeCaption?.style || defaultStyle;
  
  // Position mapping
  const positionClasses = {
    top: 'top-0 pt-16',
    center: 'top-1/2 -translate-y-1/2',
    bottom: 'bottom-0 pb-20'
  };

  // Alignment classes
  const alignClasses = {
    left: 'items-start pl-10',
    center: 'items-center',
    right: 'items-end pr-10'
  };

  return (
    <AbsoluteFill className="bg-black">
      
      {/* LAYER 1: Video (muted if AI audio present) */}
      <Video 
        src={videoUrl} 
        className="w-full h-full object-contain"
        volume={audioUrl ? 0 : 1}
      />

      {/* LAYER 2: AI Voiceover */}
      {audioUrl && <Audio src={audioUrl} />}

      {/* LAYER 3: Styled Captions */}
      {activeCaption && (
        <AbsoluteFill 
          className={`flex ${alignClasses[captionStyle.textAlign]} ${positionClasses[captionStyle.position]}`}
          style={{ opacity: captionStyle.opacity }}
        >
          <div 
            className="px-8 py-4 rounded-2xl shadow-2xl max-w-4xl"
            style={{
              backgroundColor: captionStyle.backgroundColor,
            }}
          >
            <p 
              style={{
                color: captionStyle.color,
                fontSize: captionStyle.fontSize,
                fontFamily: captionStyle.fontFamily,
                fontWeight: captionStyle.fontWeight,
                textAlign: captionStyle.textAlign,
                margin: 0,
                lineHeight: 1.3,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {activeCaption.text}
            </p>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};