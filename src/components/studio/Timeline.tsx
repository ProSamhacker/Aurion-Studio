// src/components/studio/Timeline.tsx - SIMPLIFIED PREVIEW VERSION
import { useRef, useEffect, useState, useCallback } from 'react';
import { Video as VideoIcon, Music, Loader2 } from 'lucide-react';
import { useTimelineStore } from '@/core/stores/useTimelineStore';
import { formatTime } from '@/core/utils/time';
import { generateVideoThumbnails } from '@/core/utils/media';

export const Timeline = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const timelineContentRef = useRef<HTMLDivElement>(null);
  
  const { 
    originalVideoUrl, audioUrl, captions, 
    duration, zoomLevel, setZoomLevel, isPlaying,
    setCurrentTime, currentTime, audioDuration,
    bufferState
  } = useTimelineStore();

  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);
  const [hoveredTime, setHoveredTime] = useState<number | null>(null);

  const START_PADDING = 40;
  const END_PADDING = 300;
  const contentDuration = Math.max(duration, audioDuration || 0, 
    captions.length > 0 ? Math.max(...captions.map(c => c.end)) : 0
  );
  const totalWidth = (contentDuration * zoomLevel) + START_PADDING + END_PADDING;

  // ========== KEYBOARD SHORTCUTS (SIMPLIFIED) ==========
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Space - Play/Pause
      if (e.code === 'Space') {
        e.preventDefault();
        useTimelineStore.setState({ isPlaying: !isPlaying });
      }
      
      // Arrow Left - Jump back 1s
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentTime(Math.max(0, currentTime - 1));
      }
      
      // Arrow Right - Jump forward 1s
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentTime(Math.min(contentDuration, currentTime + 1));
      }
      
      // Home - Go to start
      if (e.key === 'Home') {
        e.preventDefault();
        setCurrentTime(0);
      }
      
      // End - Go to end
      if (e.key === 'End') {
        e.preventDefault();
        setCurrentTime(contentDuration);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTime, contentDuration]);

  // ========== ENHANCED THUMBNAIL GENERATION ==========
  useEffect(() => {
    if (!originalVideoUrl) {
      setThumbnails([]);
      return;
    }

    setIsLoadingThumbnails(true);
    const thumbnailCount = Math.min(50, Math.max(15, Math.floor(contentDuration / 2)));
    
    generateVideoThumbnails(originalVideoUrl, thumbnailCount)
      .then((thumbs) => {
        setThumbnails(thumbs);
        setIsLoadingThumbnails(false);
      })
      .catch((error) => {
        console.error('Thumbnail generation failed:', error);
        setThumbnails([]);
        setIsLoadingThumbnails(false);
      });
  }, [originalVideoUrl, contentDuration]);

  // ========== SMOOTH PLAYHEAD ANIMATION WITH RAF ==========
  useEffect(() => {
    let rafId: number;
    let lastTime = performance.now();

    const animate = (currentTimestamp: number) => {
      const state = useTimelineStore.getState();
      const deltaTime = (currentTimestamp - lastTime) / 1000;
      lastTime = currentTimestamp;

      if (state.isPlaying && !state.bufferState.isBuffering) {
        const newTime = Math.min(state.currentTime + deltaTime, contentDuration);
        
        if (newTime >= contentDuration) {
          useTimelineStore.setState({ isPlaying: false, currentTime: contentDuration });
        } else {
          useTimelineStore.setState({ currentTime: newTime });
        }
      }

      const currentPx = (state.currentTime * state.zoomLevel) + START_PADDING;
      if (playheadRef.current) {
        playheadRef.current.style.transform = `translateX(${currentPx}px)`;
      }

      // ENHANCED: Smooth auto-scroll with playhead
      if (state.isPlaying && viewportRef.current && !isDraggingPlayhead) {
        const viewport = viewportRef.current;
        const viewportWidth = viewport.clientWidth;
        const currentScroll = viewport.scrollLeft;
        const relativePos = currentPx - currentScroll;
        const triggerPoint = viewportWidth * 0.7;

        if (relativePos > triggerPoint) {
          const targetScroll = currentPx - triggerPoint;
          const smoothFactor = 0.1; // Smooth interpolation
          viewport.scrollLeft += (targetScroll - currentScroll) * smoothFactor;
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [contentDuration, zoomLevel, isDraggingPlayhead]);

  // ========== ZOOM & SCROLL WITH MOUSE POSITION LOCK ==========
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.ctrlKey || e.metaKey) {
        // ZOOM with position lock
        const rect = viewport.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const scrollLeft = viewport.scrollLeft;
        
        const timeAtMouse = (mouseX + scrollLeft - START_PADDING) / zoomLevel;
        
        const zoomDelta = e.deltaY > 0 ? 0.85 : 1.15;
        const newZoom = Math.max(10, Math.min(300, zoomLevel * zoomDelta));
        setZoomLevel(newZoom);
        
        requestAnimationFrame(() => {
          const newScrollLeft = (timeAtMouse * newZoom) + START_PADDING - mouseX;
          viewport.scrollLeft = newScrollLeft;
        });
      } else {
        // SMOOTH HORIZONTAL SCROLL
        const scrollSpeed = e.shiftKey ? 3 : 1;
        viewport.scrollLeft += e.deltaY * scrollSpeed;
      }
    };

    viewport.addEventListener('wheel', handleWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', handleWheel);
  }, [zoomLevel, setZoomLevel]);

  // ========== MOUSE INTERACTION WITH DEBOUNCING ==========
  useEffect(() => {
    let animationFrameId: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!viewportRef.current) return;
      
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const rect = viewportRef.current!.getBoundingClientRect();
        const scrollLeft = viewportRef.current!.scrollLeft;
        const relativeX = e.clientX - rect.left + scrollLeft;
        const effectiveX = Math.max(0, relativeX - START_PADDING);
        const timeAtMouse = effectiveX / useTimelineStore.getState().zoomLevel;

        if (isDraggingPlayhead) {
          setCurrentTime(Math.max(0, Math.min(contentDuration, timeAtMouse)));
        } else {
          setHoveredTime(timeAtMouse);
        }
      });
    };

    const handleMouseUp = () => {
      setIsDraggingPlayhead(false);
    };

    if (isDraggingPlayhead) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDraggingPlayhead, contentDuration, setCurrentTime]);

  // ========== CLICK TO SEEK ==========
  const handleTimelineClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.no-seek')) return;

    if (viewportRef.current) {
      const rect = viewportRef.current.getBoundingClientRect();
      const scrollLeft = viewportRef.current.scrollLeft;
      const relativeX = e.clientX - rect.left + scrollLeft;
      
      if (relativeX < START_PADDING) return;

      const effectiveX = relativeX - START_PADDING;
      const timeAtMouse = effectiveX / zoomLevel;
      
      setCurrentTime(Math.max(0, Math.min(contentDuration, timeAtMouse)));
      setIsDraggingPlayhead(true);
    }
  };

  // ========== RULER TICKS ==========
  const tickInterval = zoomLevel > 80 ? 1 : zoomLevel > 40 ? 2 : zoomLevel > 20 ? 5 : 10;
  const ticks = [];
  for (let i = 0; i <= contentDuration; i += tickInterval) {
    ticks.push(i);
  }

  const videoTrackLeft = START_PADDING;
  const videoTrackWidth = duration * zoomLevel;
  const audioTrackWidth = audioDuration ? (audioDuration * zoomLevel) : videoTrackWidth;
  const audioTrackLeft = START_PADDING;

  if (!originalVideoUrl) {
    return (
      <div className="flex flex-col h-72 bg-[#121212] border-t border-[#1f1f1f] items-center justify-center">
        <VideoIcon className="w-12 h-12 text-gray-700 mb-3" />
        <p className="text-gray-500 text-sm">Upload a video to preview timeline</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-72 bg-[#121212] border-t border-[#1f1f1f] select-none relative shrink-0 z-0">
      
      {/* BUFFERING OVERLAY */}
      {bufferState.isBuffering && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            <p className="text-sm text-gray-300">Loading media...</p>
            {bufferState.bufferProgress > 0 && (
              <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 transition-all duration-300"
                  style={{ width: `${bufferState.bufferProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* TIMELINE VIEWPORT */}
      <div 
        ref={viewportRef} 
        className="flex-1 overflow-x-auto overflow-y-hidden relative modern-scrollbar"
        onMouseLeave={() => setHoveredTime(null)}
      >
        <div 
          ref={timelineContentRef}
          className="h-full relative" 
          style={{ width: `${totalWidth}px`, minWidth: '100%' }}
          onMouseDown={handleTimelineClick}
        >
          
          {/* RULER */}
          <div className="h-10 border-b border-gray-800 w-full pointer-events-none sticky top-0 bg-[#121212] z-20">
            {ticks.map((time) => (
              <div 
                key={time} 
                className="absolute bottom-0 h-4 border-l border-gray-600" 
                style={{ left: `${(time * zoomLevel) + START_PADDING}px` }}
              >
                <span className="absolute -top-6 -left-2 text-[10px] text-gray-400 font-mono select-none font-medium">
                  {formatTime(time)}
                </span>
              </div>
            ))}
          </div>

          {/* HOVER TIME INDICATOR */}
          {hoveredTime !== null && !isDraggingPlayhead && (
            <div 
              className="absolute top-0 bottom-0 w-px bg-white/30 pointer-events-none z-30"
              style={{ left: `${(hoveredTime * zoomLevel) + START_PADDING}px` }}
            >
              <div className="absolute -top-8 left-2 bg-white text-black text-[10px] font-mono px-2 py-0.5 rounded whitespace-nowrap">
                {formatTime(hoveredTime)}
              </div>
            </div>
          )}

          {/* PLAYHEAD */}
          <div 
            ref={playheadRef} 
            className="absolute top-0 bottom-0 w-0 z-50 cursor-ew-resize group no-seek"
            style={{ left: 0 }} 
            onMouseDown={(e) => { 
              e.stopPropagation(); 
              setIsDraggingPlayhead(true); 
            }}
          >
            <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
            <div className="absolute -top-0 -left-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-red-500 transform transition-transform group-hover:scale-125 drop-shadow-lg"></div>
            
            <div className="absolute -top-8 left-3 bg-red-500 text-white text-[10px] font-mono px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
              {formatTime(currentTime)}
            </div>
          </div>

          {/* TRACKS */}
          <div className="py-4 space-y-3 relative w-full mt-2">
            
            {/* VIDEO TRACK */}
            <div 
              className="h-24 relative group rounded-lg no-seek"
              style={{ 
                left: `${videoTrackLeft}px`, 
                width: `${Math.max(50, videoTrackWidth)}px` 
              }}
            >
              <div className="absolute inset-y-1 inset-x-0 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-lg border-2 border-purple-500/40 overflow-hidden select-none group-hover:border-purple-400 transition-all shadow-lg">
                
                {isLoadingThumbnails ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]">
                    <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                  </div>
                ) : thumbnails.length > 0 ? (
                  <div className="absolute inset-0 flex opacity-30">
                    {thumbnails.map((src, i) => (
                      <img 
                        key={i} 
                        src={src} 
                        className="h-full flex-1 object-cover" 
                        alt=""
                      />
                    ))}
                  </div>
                ) : null}
                
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-90 z-10 pointer-events-none">
                  <VideoIcon className="w-5 h-5 text-purple-300 drop-shadow-lg"/>
                  <span className="text-xs text-white font-bold tracking-wide drop-shadow-lg">
                    Main Video • {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>

            {/* AUDIO TRACK */}
            {audioUrl && audioDuration && (
              <div 
                className="h-12 relative rounded-lg bg-gradient-to-br from-[#1a2a3a] to-[#1a1a2a] border-2 border-blue-500/40 overflow-hidden group hover:border-blue-500/70 transition-all no-seek shadow-lg"
                style={{ 
                  left: `${audioTrackLeft}px`, 
                  width: `${audioTrackWidth}px` 
                }}
              >
                <div className="absolute inset-0 flex items-center px-4 gap-2 z-10 pointer-events-none">
                  <div className="bg-blue-500/30 p-1.5 rounded-lg border border-blue-400/50">
                    <Music className="w-4 h-4 text-blue-300" />
                  </div>
                  <span className="text-xs text-blue-100 font-bold tracking-wide drop-shadow">
                    AI Voiceover • {formatTime(audioDuration)}
                  </span>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-full opacity-20 flex items-end gap-1 px-3">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="bg-blue-400 flex-1 rounded-t-sm transition-all" 
                      style={{ height: `${30 + Math.random() * 70}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            )}

            {/* CAPTIONS TRACK */}
            {captions.length > 0 && (
              <div className="relative h-10 w-full">
                {captions.map((cap, i) => {
                  const capLeft = (cap.start * zoomLevel) + START_PADDING;
                  const capWidth = Math.max(30, (cap.end - cap.start) * zoomLevel);
                  
                  return (
                    <div 
                      key={i} 
                      className="no-seek absolute top-0 bottom-0 bg-gradient-to-r from-yellow-900/40 to-yellow-800/40 border-2 border-yellow-600/50 rounded-lg flex items-center px-3 overflow-hidden hover:from-yellow-800/60 hover:to-yellow-700/60 transition cursor-pointer group"
                      style={{ 
                        left: `${capLeft}px`, 
                        width: `${capWidth}px` 
                      }}
                      title={cap.text}
                    >
                      {i === 0 && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400/80"></div>
                      )}
                      <span className="text-[10px] text-yellow-50 truncate font-medium select-none group-hover:text-white drop-shadow">
                        {cap.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};