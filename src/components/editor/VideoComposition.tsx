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

  // Default style fallback
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

  // FLEXBOX POSITIONING LOGIC
  // Vertical Position (controlled by justify-content in flex-col)
  const verticalMap = {
    top: 'justify-start pt-16',
    center: 'justify-center',
    bottom: 'justify-end pb-20'
  };

  // Horizontal Alignment (controlled by align-items in flex-col)
  const horizontalMap = {
    left: 'items-start pl-16',
    center: 'items-center',
    right: 'items-end pr-16'
  };

  return (
    <AbsoluteFill className="bg-black">
      
      {/* LAYER 1: Video */}
      {videoUrl ? (
        <Video 
          src={videoUrl} 
          className="w-full h-full object-contain"
          // Mute video track if AI audio exists to prevent audio clashes
          volume={audioUrl ? 0 : 1}
        />
      ) : (
        <AbsoluteFill className="bg-[#111] flex items-center justify-center">
           <span className="text-gray-500 font-mono">No Video Source</span>
        </AbsoluteFill>
      )}

      {/* LAYER 2: AI Voiceover - Explicitly rendered with Key */}
      {audioUrl && (
        <Audio 
            src={audioUrl} 
            volume={1}
            // Key forces Remotion to reload the audio element if URL changes
            key={audioUrl} 
        />
      )}

      {/* LAYER 3: Styled Captions */}
      {activeCaption && (
        <AbsoluteFill 
          className={`flex flex-col ${verticalMap[captionStyle.position]} ${horizontalMap[captionStyle.textAlign]}`}
          style={{ opacity: captionStyle.opacity }}
        >
          <div 
            className="px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm max-w-[85%] transition-all duration-200 origin-center"
            style={{
              backgroundColor: captionStyle.backgroundColor,
              // Subtle scale down for very long text to prevent edge clipping
              transform: `scale(${1 + (activeCaption.text.length > 50 ? -0.1 : 0)})`
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
                textShadow: '0px 2px 4px rgba(0,0,0,0.8)',
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