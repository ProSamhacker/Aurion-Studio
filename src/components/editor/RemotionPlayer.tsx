// src/components/editor/RemotionPlayer.tsx - ENHANCED VERSION
'use client';

import { Player, PlayerRef } from '@remotion/player';
import { useTimelineStore } from '@/core/stores/useTimelineStore';
import { VideoComposition } from './VideoComposition';
import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { FileWarning, Loader2 } from 'lucide-react';

export const RemotionPlayer = () => {
  const playerRef = useRef<PlayerRef>(null);
  const [playbackError, setPlaybackError] = useState<Error | null>(null);
  const [isReady, setIsReady] = useState(false);
  
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
    bufferState,
    setBufferState
  } = useTimelineStore();

  // Reset on source change
  useEffect(() => {
    setPlaybackError(null);
    setIsReady(false);
    setBufferState({ isBuffering: true, bufferProgress: 0 });
  }, [originalVideoUrl, audioUrl]);

  const inputProps = useMemo(() => ({
    videoUrl: originalVideoUrl,
    audioUrl: audioUrl,
    captions: captions.map(c => ({
        ...c,
        style: c.style || defaultCaptionStyle
    }))
  }), [originalVideoUrl, audioUrl, captions, defaultCaptionStyle]);

  // Error Handler
  const handleError = useCallback((e: Error) => {
    console.error("Remotion Playback Error:", e);
    setPlaybackError(e);
    setIsPlaying(false);
    setBufferState({ isBuffering: false, bufferProgress: 0 });
  }, [setIsPlaying, setBufferState]);

  // 1. Sync Store -> Player (Play/Pause)
  useEffect(() => {
    if (!playerRef.current || playbackError || bufferState.isBuffering) return;
    
    if (isPlaying && !playerRef.current.isPlaying()) {
      try {
        playerRef.current.play();
      } catch (e) {
        console.error('Play failed:', e);
        setIsPlaying(false);
      }
    } else if (!isPlaying && playerRef.current.isPlaying()) {
      playerRef.current.pause();
    }
  }, [isPlaying, playbackError, bufferState.isBuffering, setIsPlaying]);

  // 2. Sync Store -> Player (Seeking)
  useEffect(() => {
    if (!playerRef.current || playbackError || bufferState.isBuffering) return;
    
    const playerTime = playerRef.current.getCurrentFrame() / fps;
    const timeDiff = Math.abs(playerTime - currentTime);
    const threshold = isPlaying ? 0.25 : 0.001;

    if (timeDiff > threshold) { 
      playerRef.current.seekTo(currentTime * fps);
    }
  }, [currentTime, fps, playbackError, bufferState.isBuffering, isPlaying]);

  // 3. Sync Player -> Store (RAF Loop)
  useEffect(() => {
    let animationFrameId: number;
    let lastFrameTime = performance.now();

    const loop = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTime;
      
      // Throttle updates to ~30fps to reduce overhead
      if (deltaTime < 33) {
        animationFrameId = requestAnimationFrame(loop);
        return;
      }
      
      lastFrameTime = currentTime;

      if (playerRef.current && isPlaying && !playbackError && !bufferState.isBuffering) {
        const frame = playerRef.current.getCurrentFrame();
        const durationInFrames = Math.max(1, Math.floor(duration * fps));

        setCurrentTime(frame / fps);

        if (frame >= durationInFrames - 1) {
            setIsPlaying(false);
        }
      }
      
      animationFrameId = requestAnimationFrame(loop);
    };

    if (isPlaying && !playbackError && !bufferState.isBuffering) {
      animationFrameId = requestAnimationFrame(loop);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, fps, setCurrentTime, duration, setIsPlaying, playbackError, bufferState.isBuffering]);

  // 4. Buffer completion handler
  useEffect(() => {
    if (!bufferState.isBuffering && bufferState.videoReady && bufferState.audioReady && !isReady) {
      setIsReady(true);
    }
  }, [bufferState, isReady]);

  // Error UI
  if (playbackError) {
    return (
      <div className="w-full h-full bg-[#0a0a0a] border border-red-900/30 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-500/10 p-4 rounded-full mb-4">
          <FileWarning className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-white font-bold text-lg mb-2">Playback Error</h3>
        <p className="text-sm text-gray-400 max-w-md mb-4 leading-relaxed">
          Unable to play this media file. This may be due to an unsupported format or network issue.
        </p>
        <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-3 max-w-sm w-full">
           <p className="text-[10px] text-red-300 font-mono break-all">
             {playbackError.message}
           </p>
        </div>
      </div>
    );
  }

  // Buffering UI
  if (bufferState.isBuffering && originalVideoUrl) {
    return (
      <div className="w-full h-full bg-[#0a0a0a] border border-purple-900/30 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
        <p className="text-sm text-gray-300 mb-2">Loading media...</p>
        {bufferState.bufferProgress > 0 && (
          <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${bufferState.bufferProgress}%` }}
            />
          </div>
        )}
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
        durationInFrames={Math.max(1, Math.floor(duration * fps))}
        fps={fps}
        compositionWidth={1920}
        compositionHeight={1080}
        style={{ width: '100%', height: '100%' }}
        controls={false}
        errorFallback={({ error }) => {
          handleError(error);
          return null;
        }}
      />
    </div>
  );
};