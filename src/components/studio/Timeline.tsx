import { useRef, useEffect, useState } from 'react';
import { Video as VideoIcon, Music, GripVertical, Loader2 } from 'lucide-react';
import { useTimelineStore } from '@/core/stores/useTimelineStore';
import { formatTime } from '@/core/utils/time';
import { generateVideoThumbnails } from '@/core/utils/media';

export const Timeline = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  
  const { 
    originalVideoUrl, audioUrl, captions, 
    duration, zoomLevel, setZoomLevel, isPlaying,
    videoTrim, setVideoTrim, setCurrentTime, setOriginalVideo
  } = useTimelineStore();

  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [isTrimming, setIsTrimming] = useState<'start' | 'end' | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);

  // --- CONFIG ---
  const START_PADDING = 20; 
  const END_PADDING = 200;
  
  // Safe duration calculation
  const safeDuration = Math.max(duration, videoTrim.end - videoTrim.start);
  const totalWidth = (safeDuration * zoomLevel) + START_PADDING + END_PADDING; 

  // --- THUMBNAIL GENERATION ---
  useEffect(() => {
    if (!originalVideoUrl) {
      setThumbnails([]);
      return;
    }

    setIsLoadingThumbnails(true);
    const thumbnailCount = Math.min(30, Math.max(10, Math.floor(duration / 2)));
    
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
  }, [originalVideoUrl, duration]);

  // --- 1. PLAYHEAD ANIMATION LOOP ---
  useEffect(() => {
    let animationFrameId: number;

    const loop = () => {
      const state = useTimelineStore.getState();
      const currentPx = (state.currentTime * state.zoomLevel) + START_PADDING;

      if (playheadRef.current) {
        playheadRef.current.style.transform = `translateX(${currentPx}px)`;
      }

      if (state.isPlaying && viewportRef.current) {
        const viewport = viewportRef.current;
        const viewportWidth = viewport.clientWidth;
        const currentScroll = viewport.scrollLeft;
        const relativePos = currentPx - currentScroll;
        const triggerPoint = viewportWidth * 0.75;

        if (relativePos > triggerPoint) {
          viewport.scrollLeft = currentPx - triggerPoint;
        }
      }
      
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [zoomLevel]); 

  // --- 2. SCROLL & ZOOM ---
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault(); 
      e.stopPropagation();

      if (e.ctrlKey || e.metaKey) {
        const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(10, Math.min(200, useTimelineStore.getState().zoomLevel * zoomDelta));
        setZoomLevel(newZoom);
      } else {
        viewport.scrollLeft += e.deltaY;
      }
    };

    viewport.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => viewport.removeEventListener('wheel', handleWheelNative);
  }, [setZoomLevel]);

  // --- 3. MOUSE INTERACTION ---
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!viewportRef.current) return;
      
      const rect = viewportRef.current.getBoundingClientRect();
      const scrollLeft = viewportRef.current.scrollLeft;
      const relativeX = e.clientX - rect.left + scrollLeft;
      
      const effectiveX = Math.max(0, relativeX - START_PADDING);
      const timeAtMouse = effectiveX / useTimelineStore.getState().zoomLevel;

      if (isDraggingPlayhead) {
        setCurrentTime(Math.max(0, Math.min(duration, timeAtMouse)));
      }

      if (isTrimming) {
        if (isTrimming === 'start') {
          const newStart = Math.min(timeAtMouse, videoTrim.end - 0.5);
          setVideoTrim(Math.max(0, newStart), videoTrim.end);
        } else {
          const newDuration = Math.max(0.5, timeAtMouse);
          const newEnd = videoTrim.start + newDuration;
          setVideoTrim(videoTrim.start, newEnd);
        }
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDraggingPlayhead(false);
      setIsTrimming(null);
    };

    if (isDraggingPlayhead || isTrimming) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDraggingPlayhead, isTrimming, videoTrim, setCurrentTime, setVideoTrim, duration]);

  // --- FIX: HANDLE CLICK-TO-SEEK ---
  const handleTimelineMouseDown = (e: React.MouseEvent) => {
    // 1. Check if clicking on an interactive element (like trim handles or clips)
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('.cursor-ew-resize') || target.closest('.cursor-grab');
    
    if (isInteractive) return;

    // 2. Calculate position
    if (viewportRef.current) {
        const rect = viewportRef.current.getBoundingClientRect();
        const scrollLeft = viewportRef.current.scrollLeft;
        const relativeX = e.clientX - rect.left + scrollLeft;
        
        // 3. Prevent clicking in the padding area before 0s
        if (relativeX < START_PADDING) return;

        const effectiveX = relativeX - START_PADDING;
        const timeAtMouse = effectiveX / zoomLevel;
        
        // 4. Update Time Immediately (Jump)
        setCurrentTime(Math.max(0, Math.min(duration, timeAtMouse)));
        
        // 5. Start Dragging (Scrub)
        setIsDraggingPlayhead(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const url = e.dataTransfer.getData('video/url');
    if (url) {
        setOriginalVideo(url);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const tickInterval = zoomLevel > 60 ? 1 : zoomLevel > 30 ? 5 : 10;
  const ticks = [];
  for (let i = 0; i <= safeDuration; i += tickInterval) { 
    ticks.push(i); 
  }

  const videoTrackLeft = START_PADDING;
  const videoDuration = videoTrim.end - videoTrim.start;
  const videoTrackWidth = videoDuration * zoomLevel;

  if (!originalVideoUrl) {
    return (
      <div className="flex flex-col h-72 bg-[#121212] border-t border-[#1f1f1f] items-center justify-center">
        <p className="text-gray-500 text-sm">Upload a video or drag from library to start</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-72 bg-[#121212] border-t border-[#1f1f1f] select-none relative shrink-0 pr-6 transition-all z-0">
      <div 
        ref={viewportRef} 
        className="flex-1 overflow-x-auto overflow-y-hidden relative modern-scrollbar rounded-xl"
      >
        <div 
          className="h-full relative" 
          style={{ width: `${totalWidth}px`, minWidth: '100%' }}
          // Attach the corrected mouse down handler here
          onMouseDown={handleTimelineMouseDown}
        >
          {/* RULER */}
          <div className="h-8 border-b border-gray-800 w-full pointer-events-none sticky top-0 bg-[#121212] z-20">
            {ticks.map((time) => (
              <div 
                key={time} 
                className="absolute bottom-0 h-3 border-l border-gray-600" 
                style={{ left: `${(time * zoomLevel) + START_PADDING}px` }}
              >
                <span className="absolute -top-5 -left-1 text-[10px] text-gray-500 font-mono select-none">
                  {formatTime(time)}
                </span>
              </div>
            ))}
          </div>

          {/* PLAYHEAD */}
          <div 
            ref={playheadRef} 
            className="absolute top-0 bottom-0 w-0 z-50 cursor-ew-resize group"
            style={{ left: 0, top: 0 }} 
            onMouseDown={(e) => { 
              e.stopPropagation(); 
              setIsDraggingPlayhead(true); 
            }}
          >
            <div className="absolute top-0 left-0 bottom-0 w-px bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
            <div className="absolute -top-0 -left-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white transform transition-transform group-hover:scale-125"></div>
          </div>

          {/* TRACKS CONTAINER */}
          <div className="py-4 space-y-3 relative w-full mt-2">
            
            {/* 1. VIDEO TRACK */}
            <div 
              className="h-20 relative group rounded-lg" 
              style={{ 
                left: `${videoTrackLeft}px`, 
                width: `${Math.max(50, videoTrackWidth)}px` 
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="absolute inset-y-1 inset-x-0 bg-[#1E1E1E] rounded-lg border border-purple-500/30 overflow-hidden select-none group-hover:border-purple-400 transition-colors">
                {/* Thumbnail Filmstrip */}
                {isLoadingThumbnails ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]">
                    <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                  </div>
                ) : thumbnails.length > 0 ? (
                  <div 
                    className="absolute top-0 bottom-0 flex flex-row opacity-40 pointer-events-none w-full"
                  >
                    {thumbnails.map((src, i) => (
                      <img 
                        key={i} 
                        src={src} 
                        className="h-full flex-1 object-cover min-w-0" 
                        alt=""
                        loading="lazy"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 opacity-40"></div>
                )}
                
                {/* Overlay Label */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-80 z-10 pointer-events-none">
                  <VideoIcon className="w-4 h-4 text-purple-200 drop-shadow-md"/>
                  <span className="text-[10px] text-purple-100 font-bold tracking-wider drop-shadow-md uppercase">
                    Main Video ({formatTime(videoDuration)})
                  </span>
                </div>
              </div>
              
              {/* Trim Handles */}
              <div 
                className="absolute left-0 top-1 bottom-1 w-4 bg-purple-600/80 hover:bg-purple-500 cursor-ew-resize flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 rounded-l-lg transition-opacity shadow-lg"
                onMouseDown={(e) => { 
                  e.stopPropagation(); 
                  setIsTrimming('start'); 
                }}
                title="Trim Start"
              >
                <GripVertical className="w-3 h-3 text-white" />
              </div>
              
              <div 
                className="absolute right-0 top-1 bottom-1 w-4 bg-purple-600/80 hover:bg-purple-500 cursor-ew-resize flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 rounded-r-lg transition-opacity shadow-lg"
                onMouseDown={(e) => { 
                  e.stopPropagation(); 
                  setIsTrimming('end'); 
                }}
                title="Trim End"
              >
                <GripVertical className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* 2. AUDIO TRACK */}
            {audioUrl && (
              <div 
                className="h-10 relative rounded-md bg-[#1a1a1a] border border-blue-500/30 overflow-hidden group hover:border-blue-500/60 transition-colors"
                style={{ 
                  left: `${START_PADDING}px`, 
                  width: `${videoTrackWidth}px` 
                }}
              >
                <div className="absolute inset-0 flex items-center px-3 gap-2">
                  <div className="bg-blue-500/20 p-1 rounded">
                    <Music className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <span className="text-[10px] text-blue-200 font-medium tracking-wide">
                    AI Voiceover
                  </span>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20 flex items-end gap-0.5 px-2">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="bg-blue-400 w-full rounded-t-sm" 
                      style={{ height: `${20 + Math.random() * 80}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. CAPTIONS TRACK */}
            {captions.length > 0 && (
              <div className="relative h-8 w-full mt-1">
                {captions.map((cap, i) => {
                  const capLeft = (cap.start * zoomLevel) + START_PADDING;
                  const capWidth = Math.max(20, (cap.end - cap.start) * zoomLevel);
                  
                  return (
                    <div 
                      key={i} 
                      className="absolute top-0 bottom-0 bg-[#222] border border-yellow-500/30 rounded flex items-center px-2 overflow-hidden hover:bg-[#2a2a2a] hover:border-yellow-500/60 transition cursor-help group"
                      style={{ 
                        left: `${capLeft}px`, 
                        width: `${capWidth}px` 
                      }}
                      title={`${formatTime(cap.start)} - ${cap.text}`}
                    >
                      {i === 0 && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500/50"></div>
                      )}
                      <span className="text-[9px] text-yellow-100/70 truncate font-mono select-none group-hover:text-yellow-100">
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