// src/components/studio/Timeline.tsx - COMPLETE PROFESSIONAL VERSION
import { useRef, useEffect, useState, useCallback } from 'react';
import { Video as VideoIcon, Music, GripVertical, Loader2, Scissors, Copy, Trash2, Split, Undo2, Redo2, ZoomIn, ZoomOut } from 'lucide-react';
import { useTimelineStore } from '@/core/stores/useTimelineStore';
import { formatTime } from '@/core/utils/time';
import { generateVideoThumbnails } from '@/core/utils/media';

interface ContextMenu {
  x: number;
  y: number;
  clipType: 'video' | 'audio' | 'caption';
  clipIndex?: number;
}

export const Timeline = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const timelineContentRef = useRef<HTMLDivElement>(null);
  
  const { 
    originalVideoUrl, audioUrl, captions, 
    duration, zoomLevel, setZoomLevel, isPlaying,
    videoTrim, setVideoTrim, setCurrentTime, setOriginalVideo,
    setDuration, currentTime, saveProject, splitClipAtPlayhead,
    copyClip, pasteClip, deleteClip, cutClip, undo, redo,
    canUndo, canRedo, audioDuration
  } = useTimelineStore();

  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [isTrimming, setIsTrimming] = useState<'start' | 'end' | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [selectedClip, setSelectedClip] = useState<{ type: string; index?: number } | null>(null);
  const [isDraggingAudio, setIsDraggingAudio] = useState(false);
  const [audioOffset, setAudioOffset] = useState(0);

  // Calculate actual content duration dynamically
  const calculateContentDuration = useCallback(() => {
    let maxDuration = 0;
    
    if (videoTrim) {
      maxDuration = Math.max(maxDuration, videoTrim.end);
    }
    
    // FIXED: Use actual audio duration, not project duration
    if (audioUrl && audioDuration) {
      maxDuration = Math.max(maxDuration, audioDuration + audioOffset);
    }
    
    if (captions.length > 0) {
      const lastCaptionEnd = Math.max(...captions.map(c => c.end));
      maxDuration = Math.max(maxDuration, lastCaptionEnd);
    }
    
    return Math.max(maxDuration, 10);
  }, [videoTrim, audioUrl, audioDuration, captions, audioOffset]);

  const contentDuration = calculateContentDuration();
  
  const START_PADDING = 40;
  const END_PADDING = 300;
  const totalWidth = (contentDuration * zoomLevel) + START_PADDING + END_PADDING;

  // ========== KEYBOARD SHORTCUTS ==========
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Space - Play/Pause
      if (e.code === 'Space') {
        e.preventDefault();
        useTimelineStore.setState({ isPlaying: !isPlaying });
      }
      
      // Ctrl + S - Save
      if (modifier && e.key === 's') {
        e.preventDefault();
        saveProject();
      }
      
      // Ctrl + Z - Undo
      if (modifier && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      
      // Ctrl + Y or Ctrl + Shift + Z - Redo
      if ((modifier && e.key === 'y') || (modifier && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        redo();
      }
      
      // Ctrl + C - Copy
      if (modifier && e.key === 'c' && selectedClip) {
        e.preventDefault();
        copyClip(selectedClip.type, selectedClip.index);
      }
      
      // Ctrl + V - Paste
      if (modifier && e.key === 'v') {
        e.preventDefault();
        pasteClip(currentTime);
      }
      
      // Ctrl + X - Cut
      if (modifier && e.key === 'x' && selectedClip) {
        e.preventDefault();
        cutClip(selectedClip.type, selectedClip.index);
      }
      
      // Delete - Delete selected clip
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedClip) {
        e.preventDefault();
        deleteClip(selectedClip.type, selectedClip.index);
        setSelectedClip(null);
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
      
      // S - Split at playhead
      if (e.key === 's' && !modifier && selectedClip) {
        e.preventDefault();
        splitClipAtPlayhead(currentTime);
      }
      
      // Plus/Minus - Zoom
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        setZoomLevel(Math.min(300, zoomLevel * 1.2));
      }
      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setZoomLevel(Math.max(10, zoomLevel * 0.8));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTime, selectedClip, contentDuration, zoomLevel]);

  // ========== CONTEXT MENU ==========
  const handleContextMenu = useCallback((e: React.MouseEvent, type: 'video' | 'audio' | 'caption', index?: number) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      clipType: type,
      clipIndex: index
    });
    setSelectedClip({ type, index });
  }, []);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // ========== THUMBNAIL GENERATION ==========
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

  // ========== SMOOTH PLAYHEAD ANIMATION ==========
  useEffect(() => {
    let rafId: number;
    let lastTime = performance.now();

    const animate = (currentTimestamp: number) => {
      const state = useTimelineStore.getState();
      const deltaTime = (currentTimestamp - lastTime) / 1000;
      lastTime = currentTimestamp;

      if (state.isPlaying) {
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

      // FIXED: Smooth auto-scroll with playhead
      if (state.isPlaying && viewportRef.current) {
        const viewport = viewportRef.current;
        const viewportWidth = viewport.clientWidth;
        const currentScroll = viewport.scrollLeft;
        const relativePos = currentPx - currentScroll;
        const triggerPoint = viewportWidth * 0.7;

        if (relativePos > triggerPoint) {
          viewport.scrollTo({
            left: currentPx - triggerPoint,
            behavior: 'auto' // Changed to auto for smoother experience
          });
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [contentDuration, zoomLevel]);

  // ========== ZOOM & SCROLL ==========
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.ctrlKey || e.metaKey) {
        // ZOOM with Ctrl+Scroll
        const rect = viewport.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const scrollLeft = viewport.scrollLeft;
        
        // Calculate position before zoom
        const timeAtMouse = (mouseX + scrollLeft - START_PADDING) / zoomLevel;
        
        // Apply zoom
        const zoomDelta = e.deltaY > 0 ? 0.85 : 1.15;
        const newZoom = Math.max(10, Math.min(300, zoomLevel * zoomDelta));
        setZoomLevel(newZoom);
        
        // Keep mouse position stable
        requestAnimationFrame(() => {
          const newScrollLeft = (timeAtMouse * newZoom) + START_PADDING - mouseX;
          viewport.scrollLeft = newScrollLeft;
        });
      } else {
        // SCROLL - Horizontal scroll with vertical wheel
        const scrollSpeed = e.shiftKey ? 3 : 1;
        viewport.scrollLeft += e.deltaY * scrollSpeed;
      }
    };

    viewport.addEventListener('wheel', handleWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', handleWheel);
  }, [zoomLevel, setZoomLevel]);

  // ========== MOUSE INTERACTION ==========
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!viewportRef.current) return;
      
      const rect = viewportRef.current.getBoundingClientRect();
      const scrollLeft = viewportRef.current.scrollLeft;
      const relativeX = e.clientX - rect.left + scrollLeft;
      const effectiveX = Math.max(0, relativeX - START_PADDING);
      const timeAtMouse = effectiveX / useTimelineStore.getState().zoomLevel;

      if (isDraggingPlayhead) {
        setCurrentTime(Math.max(0, Math.min(contentDuration, timeAtMouse)));
      }

      if (isTrimming) {
        if (isTrimming === 'start') {
          const newStart = Math.min(timeAtMouse, videoTrim.end - 0.5);
          setVideoTrim(Math.max(0, newStart), videoTrim.end);
        } else {
          const newEnd = Math.max(videoTrim.start + 0.5, timeAtMouse);
          setVideoTrim(videoTrim.start, newEnd);
          
          if (newEnd > duration) {
            setDuration(newEnd);
          }
        }
      }

      // FIXED: Audio dragging
      if (isDraggingAudio) {
        const newOffset = timeAtMouse;
        setAudioOffset(Math.max(0, newOffset));
      }
    };

    const handleMouseUp = () => {
      setIsDraggingPlayhead(false);
      setIsTrimming(null);
      setIsDraggingAudio(false);
    };

    if (isDraggingPlayhead || isTrimming || isDraggingAudio) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingPlayhead, isTrimming, isDraggingAudio, videoTrim, setCurrentTime, setVideoTrim, contentDuration, duration, setDuration]);

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

  // ========== DROP HANDLER ==========
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const url = e.dataTransfer.getData('video/url');
    if (url) {
      setOriginalVideo(url);
    }
  };

  // ========== RULER TICKS ==========
  const tickInterval = zoomLevel > 80 ? 1 : zoomLevel > 40 ? 2 : zoomLevel > 20 ? 5 : 10;
  const ticks = [];
  for (let i = 0; i <= contentDuration; i += tickInterval) {
    ticks.push(i);
  }

  const videoTrackLeft = START_PADDING;
  const videoDuration = videoTrim.end - videoTrim.start;
  const videoTrackWidth = videoDuration * zoomLevel;
  
  // FIXED: Audio track width based on actual audio duration
  const audioTrackWidth = audioDuration ? (audioDuration * zoomLevel) : videoTrackWidth;
  const audioTrackLeft = START_PADDING + (audioOffset * zoomLevel);

  if (!originalVideoUrl) {
    return (
      <div className="flex flex-col h-72 bg-[#121212] border-t border-[#1f1f1f] items-center justify-center">
        <VideoIcon className="w-12 h-12 text-gray-700 mb-3" />
        <p className="text-gray-500 text-sm">Drag media from library to timeline</p>
        <p className="text-gray-600 text-xs mt-1">Or upload a video to get started</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-72 bg-[#121212] border-t border-[#1f1f1f] select-none relative shrink-0 z-0">
      
      {/* TIMELINE CONTROLS BAR */}
      <div className="h-12 bg-[#0a0a0a] border-b border-[#1f1f1f] flex items-center justify-between px-4 shrink-0">
        
        {/* Undo/Redo */}
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#1f1f1f] rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed group"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#1f1f1f] rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed group"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="h-6 w-px bg-gray-800 mx-1"></div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setZoomLevel(Math.max(10, zoomLevel * 0.8))}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#1f1f1f] rounded-lg transition"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1 rounded-lg border border-gray-800">
            <span className="text-xs text-gray-500 font-mono">{Math.round(zoomLevel)}px/s</span>
          </div>
          
          <button
            onClick={() => setZoomLevel(Math.min(300, zoomLevel * 1.2))}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#1f1f1f] rounded-lg transition"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <div className="text-[10px] text-gray-600 font-mono">
          Ctrl+Scroll to zoom • Shift+Scroll to scroll fast
        </div>
      </div>

      {/* TIMELINE VIEWPORT */}
      <div 
        ref={viewportRef} 
        className="flex-1 overflow-x-auto overflow-y-hidden relative modern-scrollbar"
      >
        <div 
          ref={timelineContentRef}
          className="h-full relative" 
          style={{ width: `${totalWidth}px`, minWidth: '100%' }}
          onMouseDown={handleTimelineClick}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
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
              className={`h-24 relative group rounded-lg no-seek transition-all ${
                selectedClip?.type === 'video' ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{ 
                left: `${videoTrackLeft}px`, 
                width: `${Math.max(50, videoTrackWidth)}px` 
              }}
              onClick={() => setSelectedClip({ type: 'video' })}
              onContextMenu={(e) => handleContextMenu(e, 'video')}
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
                    Main Video • {formatTime(videoDuration)}
                  </span>
                </div>

                {videoTrim.start > 0 && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>
                )}
                {videoTrim.end < duration && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-yellow-400"></div>
                )}
              </div>
              
              {/* Trim Handles */}
              <div 
                className="no-seek absolute left-0 top-1 bottom-1 w-5 bg-purple-600/90 hover:bg-purple-500 cursor-ew-resize flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 rounded-l-lg transition-all shadow-xl border-r-2 border-purple-400"
                onMouseDown={(e) => { 
                  e.stopPropagation(); 
                  setIsTrimming('start'); 
                }}
                title="Trim Start"
              >
                <GripVertical className="w-4 h-4 text-white" />
              </div>
              
              <div 
                className="no-seek absolute right-0 top-1 bottom-1 w-5 bg-purple-600/90 hover:bg-purple-500 cursor-ew-resize flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 rounded-r-lg transition-all shadow-xl border-l-2 border-purple-400"
                onMouseDown={(e) => { 
                  e.stopPropagation(); 
                  setIsTrimming('end'); 
                }}
                title="Trim End"
              >
                <GripVertical className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* AUDIO TRACK - FIXED WITH PROPER DURATION */}
            {audioUrl && audioDuration && (
              <div 
                className={`h-12 relative rounded-lg bg-gradient-to-br from-[#1a2a3a] to-[#1a1a2a] border-2 border-blue-500/40 overflow-hidden group hover:border-blue-500/70 transition-all no-seek shadow-lg cursor-move ${
                  selectedClip?.type === 'audio' ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{ 
                  left: `${audioTrackLeft}px`, 
                  width: `${audioTrackWidth}px` 
                }}
                onClick={() => setSelectedClip({ type: 'audio' })}
                onContextMenu={(e) => handleContextMenu(e, 'audio')}
                onMouseDown={(e) => {
                  if (e.button === 0) {
                    e.stopPropagation();
                    setIsDraggingAudio(true);
                  }
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

                {/* Drag indicator */}
                <div className="absolute top-1 left-1 right-1 h-1 bg-blue-400/50 rounded-full opacity-0 group-hover:opacity-100 transition"></div>
              </div>
            )}

            {/* CAPTIONS TRACK */}
            {captions.length > 0 && (
              <div className="relative h-10 w-full">
                {captions.map((cap, i) => {
                  const capLeft = (cap.start * zoomLevel) + START_PADDING;
                  const capWidth = Math.max(30, (cap.end - cap.start) * zoomLevel);
                  const isSelected = selectedClip?.type === 'caption' && selectedClip.index === i;
                  
                  return (
                    <div 
                      key={i} 
                      className={`no-seek absolute top-0 bottom-0 bg-gradient-to-r from-yellow-900/40 to-yellow-800/40 border-2 rounded-lg flex items-center px-3 overflow-hidden hover:from-yellow-800/60 hover:to-yellow-700/60 transition cursor-pointer group ${
                        isSelected ? 'ring-2 ring-yellow-400 border-yellow-400' : 'border-yellow-600/50'
                      }`}
                      style={{ 
                        left: `${capLeft}px`, 
                        width: `${capWidth}px` 
                      }}
                      onClick={() => setSelectedClip({ type: 'caption', index: i })}
                      onContextMenu={(e) => handleContextMenu(e, 'caption', i)}
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
      {/* CONTEXT MENU */}
      {contextMenu && (
        <div 
          className="fixed bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-2xl py-1 z-[100] min-w-[180px]"
          style={{ 
            left: `${contextMenu.x}px`, 
            top: `${contextMenu.y}px` 
          }}
        >
          <button
            onClick={() => {
              copyClip(contextMenu.clipType, contextMenu.clipIndex);
              setContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-3"
          >
            <Copy className="w-4 h-4" />
            Copy <span className="ml-auto text-xs text-gray-500">Ctrl+C</span>
          </button>
          
          <button
            onClick={() => {
              cutClip(contextMenu.clipType, contextMenu.clipIndex);
              setContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-3"
          >
            <Scissors className="w-4 h-4" />
            Cut <span className="ml-auto text-xs text-gray-500">Ctrl+X</span>
          </button>
          
          <button
            onClick={() => {
              pasteClip(currentTime);
              setContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-3"
          >
            <Copy className="w-4 h-4 rotate-180" />
            Paste <span className="ml-auto text-xs text-gray-500">Ctrl+V</span>
          </button>
          
          <div className="h-px bg-gray-700 my-1"></div>
          
          <button
            onClick={() => {
              splitClipAtPlayhead(currentTime);
              setContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-3"
          >
            <Split className="w-4 h-4" />
            Split at Playhead <span className="ml-auto text-xs text-gray-500">S</span>
          </button>
          
          <div className="h-px bg-gray-700 my-1"></div>
          
          <button
            onClick={() => {
              deleteClip(contextMenu.clipType, contextMenu.clipIndex);
              setSelectedClip(null);
              setContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 flex items-center gap-3"
          >
            <Trash2 className="w-4 h-4" />
            Delete <span className="ml-auto text-xs text-gray-500">Del</span>
          </button>
        </div>
      )}
    </div>
  );
};