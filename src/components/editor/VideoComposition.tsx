// src/components/editor/VideoComposition.tsx - ENHANCED WITH BUFFERING
import React, { useState, useEffect } from 'react';
import { AbsoluteFill, Audio, useCurrentFrame, useVideoConfig, OffthreadVideo, Img } from 'remotion';

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
  const [videoError, setVideoError] = useState(false);
  const [audioError, setAudioError] = useState(false);
  
  const compositionTime = frame / fps;

  // Find active caption
  const activeCaption = Array.isArray(captions) 
    ? captions.find((c) => compositionTime >= c.start && compositionTime <= c.end)
    : null;

  const defaultStyle: CaptionStyle = {
    color: '#FFFFFF',
    fontSize: 42,
    fontFamily: 'Inter, sans-serif',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    position: 'bottom',
    opacity: 1,
  };

  const captionStyle = activeCaption?.style || defaultStyle;

  const verticalMap = {
    top: 'justify-start pt-16',
    center: 'justify-center',
    bottom: 'justify-end pb-20'
  };

  const horizontalMap = {
    left: 'items-start pl-16',
    center: 'items-center',
    right: 'items-end pr-16'
  };

  // Caption animation based on position in duration
  const captionProgress = activeCaption 
    ? (compositionTime - activeCaption.start) / (activeCaption.end - activeCaption.start)
    : 0;
  
  const captionOpacity = Math.min(
    1,
    captionProgress < 0.1 ? captionProgress * 10 : // Fade in first 10%
    captionProgress > 0.9 ? (1 - captionProgress) * 10 : // Fade out last 10%
    1
  );

  return (
    <AbsoluteFill className="bg-black">
      
      {/* LAYER 1: Video */}
      {videoUrl && !videoError ? (
        <AbsoluteFill>
          <OffthreadVideo
            src={videoUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
            volume={audioUrl ? 0 : 1}
            onError={() => setVideoError(true)}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill className="bg-[#111] flex items-center justify-center">
          <span className="text-gray-500 font-mono text-lg">
            {videoError ? 'Video Load Error' : 'No Video Source'}
          </span>
        </AbsoluteFill>
      )}

      {/* LAYER 2: AI Voiceover */}
      {audioUrl && !audioError && (
        <Audio 
          src={audioUrl} 
          volume={1}
          onError={() => setAudioError(true)}
        />
      )}

      {/* LAYER 3: Animated Captions */}
      {activeCaption && (
        <AbsoluteFill 
          className={`flex flex-col ${verticalMap[captionStyle.position]} ${horizontalMap[captionStyle.textAlign]}`}
          style={{ opacity: captionStyle.opacity * captionOpacity }}
        >
          <div 
            className="px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-sm max-w-[90%] transition-all duration-200"
            style={{
              backgroundColor: captionStyle.backgroundColor,
              transform: `scale(${0.95 + (captionOpacity * 0.05)}) translateY(${(1 - captionOpacity) * 10}px)`,
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
                lineHeight: 1.4,
                textShadow: '0px 3px 6px rgba(0,0,0,0.9), 0px 1px 3px rgba(0,0,0,0.8)',
                letterSpacing: '0.02em'
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