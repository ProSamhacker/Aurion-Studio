'use client';

import { Player, PlayerRef } from '@remotion/player';
import { useTimelineStore } from '@/core/stores/useTimelineStore';
import { VideoComposition } from './VideoComposition';
import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { FileWarning } from 'lucide-react';

export const RemotionPlayer = () => {
  const playerRef = useRef<PlayerRef>(null);
  const [playbackError, setPlaybackError] = useState<Error | null>(null);
  
  const { 
    originalVideoUrl, 
    audioUrl, 
    captions, 
    isPlaying, 
    currentTime, 
    setIsPlaying, 
    setCurrentTime,
    duration,
    fps,
    defaultCaptionStyle,
    videoTrim // Get trim state
  } = useTimelineStore();

  // Reset error when video source changes
  useEffect(() => {
    setPlaybackError(null);
  }, [originalVideoUrl]);

  const inputProps = useMemo(() => ({
    videoUrl: originalVideoUrl,
    audioUrl: audioUrl,
    captions: captions.map(c => ({
        ...c,
        style: c.style || defaultCaptionStyle
    })),
    videoTrim: videoTrim // Pass to composition
  }), [originalVideoUrl, audioUrl, captions, defaultCaptionStyle, videoTrim]);

  // Handle Player Errors (Both Render & Media errors)
  const handleError = useCallback((e: Error) => {
    console.error("Remotion Playback Error:", e);
    setPlaybackError(e);
    setIsPlaying(false);
  }, [setIsPlaying]);

  // Component to catch Render Errors (React Error Boundary)
  const PlayerErrorFallback = useCallback(({ error }: { error: Error }) => {
    useEffect(() => {
      handleError(error);
    }, [error, handleError]);
    return null;
  }, [handleError]);

  // 1. Sync Store -> Player (Play/Pause)
  useEffect(() => {
    if (!playerRef.current || playbackError) return;
    if (isPlaying && !playerRef.current.isPlaying()) {
      playerRef.current.play();
    } else if (!isPlaying && playerRef.current.isPlaying()) {
      playerRef.current.pause();
    }
  }, [isPlaying, playbackError]);

  // 2. Sync Store -> Player (Seeking & Scrubbing)
  useEffect(() => {
    if (!playerRef.current || playbackError) return;
    
    const playerTime = playerRef.current.getCurrentFrame() / fps;
    const timeDiff = Math.abs(playerTime - currentTime);

    // FIX: Reduce threshold when not playing to allow smooth scrubbing (frame-by-frame)
    // When playing, we allow a larger drift to prevent audio stuttering
    const threshold = isPlaying ? 0.25 : 0.001;

    if (timeDiff > threshold) { 
      playerRef.current.seekTo(currentTime * fps);
    }
  }, [currentTime, fps, playbackError, isPlaying]);

  // 3. Sync Player -> Store (Polling Loop)
  useEffect(() => {
    let animationFrameId: number;

    const loop = () => {
      if (playerRef.current && isPlaying && !playbackError) {
        const frame = playerRef.current.getCurrentFrame();
        // Use video duration if available, else project duration
        const clipDuration = videoTrim ? (videoTrim.end - videoTrim.start) : duration;
        const durationInFrames = Math.max(1, Math.floor(clipDuration * fps));

        setCurrentTime(frame / fps);

        if (frame >= durationInFrames - 1) {
            setIsPlaying(false);
        } else {
            animationFrameId = requestAnimationFrame(loop);
        }
      }
    };

    if (isPlaying && !playbackError) {
      loop();
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, fps, setCurrentTime, duration, setIsPlaying, playbackError, videoTrim]);

  // Custom Error UI (Prevents White Screen of Death)
  if (playbackError) {
    return (
      <div className="w-full h-full bg-[#0a0a0a] border border-red-900/30 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-500/10 p-4 rounded-full mb-4">
          <FileWarning className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-white font-bold text-lg mb-2">Unsupported Video Format</h3>
        <p className="text-sm text-gray-400 max-w-md mb-4 leading-relaxed">
          The browser cannot play this video file directly. 
          <br />
          Common unsupported formats: <strong>.MKV, .AVI, or HEVC (H.265)</strong>.
        </p>
        <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-3 max-w-sm w-full">
           <p className="text-[10px] text-red-300 font-mono break-all">
             {playbackError.message}
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-black">
      <Player
        key={`${originalVideoUrl}-${audioUrl}`} 
        ref={playerRef}
        component={VideoComposition}
        inputProps={inputProps}
        // Calculate total duration based on the trimmed video length
        durationInFrames={Math.max(1, Math.floor((videoTrim ? (videoTrim.end - videoTrim.start) : duration) * fps))}
        fps={fps}
        compositionWidth={1920}
        compositionHeight={1080}
        style={{ width: '100%', height: '100%' }}
        controls={false}
        errorFallback={PlayerErrorFallback}
      />
    </div>
  );
};