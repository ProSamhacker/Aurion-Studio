import { useState, useRef, useEffect } from 'react';
import { UploadCloud, RotateCcw } from 'lucide-react'; 
import { RemotionPlayer } from '@/components/editor/RemotionPlayer';
import { useTimelineStore } from '@/core/stores/useTimelineStore';

interface CanvasProps {
  isProcessing: boolean;
  progress: number;
}

export const Canvas = ({ isProcessing, progress }: CanvasProps) => {
  const { originalVideoUrl } = useTimelineStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use Refs for state that is accessed inside event listeners to prevent staleness
  // UPDATED: Set initial scale to 0.75 (75%) with offsets to CENTER the video
  // x: 100, y: 56.25 ensures the 75% scaled video sits exactly in the middle of the 800x450 box
  const transformRef = useRef({ scale: 0.75, x: 100, y: 56.25 });
  const [transform, setTransform] = useState(transformRef.current);

  // --- CONFIG: MOVEMENT BOUNDARIES ---
  const PAN_LIMIT = 1500; // Pixels from center. Prevents video from flying off-screen.
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 5;

  // Helper to update state and ref with CLAMPING
  const updateTransform = (newTransform: { scale: number; x: number; y: number }) => {
      // Clamp values to prevent "lost" video
      const clamped = {
          scale: Math.max(MIN_SCALE, Math.min(MAX_SCALE, newTransform.scale)),
          x: Math.max(-PAN_LIMIT, Math.min(PAN_LIMIT, newTransform.x)),
          y: Math.max(-PAN_LIMIT, Math.min(PAN_LIMIT, newTransform.y)),
      };

      transformRef.current = clamped;
      setTransform(clamped);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
        // 1. STOP PAGE SCROLLING
        e.preventDefault();
        e.stopPropagation();

        const current = transformRef.current;

        if (e.ctrlKey || e.metaKey) {
            // --- ZOOM LOGIC ---
            const zoomSensitivity = 0.1;
            const delta = e.deltaY > 0 ? (1 - zoomSensitivity) : (1 + zoomSensitivity);
            const rawScale = current.scale * delta;
            
            // Pre-calculate clamped scale to ensure smooth zooming at limits
            const newScale = Math.min(Math.max(MIN_SCALE, rawScale), MAX_SCALE);

            const rect = container.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Zoom towards mouse pointer
            // Formula: new_pos = mouse_pos - (mouse_relative_to_object * scale_factor)
            // It adjusts x/y so the point under the mouse stays stationary
            const newX = mouseX - (mouseX - current.x) * (newScale / current.scale);
            const newY = mouseY - (mouseY - current.y) * (newScale / current.scale);

            updateTransform({ scale: newScale, x: newX, y: newY });
        } else {
            // --- PAN LOGIC (SCROLL) ---
            // We now apply the clamped updateTransform function
            updateTransform({ 
                ...current, 
                x: current.x - e.deltaX, 
                y: current.y - e.deltaY 
            });
        }
    };

    // Passive: false is required to prevent default browser scrolling
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // --- DRAG INTERACTION ---
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
      // Middle Mouse (button 1) OR Left Click + Shift/Space to drag
      if (e.button === 1 || e.shiftKey || e.button === 0) { 
          setIsDragging(true);
          // Calculate the offset of the mouse relative to the current transform 
          // so the jump doesn't happen when starting a new drag
          setDragStart({ 
              x: e.clientX - transform.x, 
              y: e.clientY - transform.y 
          });
      }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (isDragging) {
          updateTransform({
              ...transform,
              x: e.clientX - dragStart.x,
              y: e.clientY - dragStart.y
          });
      }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div 
        ref={containerRef}
        className={`flex-1 bg-[#0a0a0a] p-8 flex flex-col items-center justify-center relative overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
    >
      {/* Canvas Controls Overlay */}
      <div className="absolute top-4 right-4 z-50 flex gap-2 bg-[#1a1a1a]/90 p-1.5 rounded-lg border border-white/10 backdrop-blur-md pointer-events-auto select-none shadow-xl">
          <span className="text-xs text-gray-300 font-mono flex items-center px-2 border-r border-white/10">
            {Math.round(transform.scale * 100)}%
          </span>
          <button 
            // UPDATED: Reset now restores the 75% Centered View
            onClick={() => updateTransform({ scale: 0.75, x: 100, y: 56.25 })} 
            className="p-1.5 hover:bg-white/10 rounded-md text-gray-300 hover:text-white transition group" 
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform"/>
          </button>
      </div>

      {!originalVideoUrl ? (
        <div className="text-center text-gray-600 pointer-events-none select-none">
          <div className="w-16 h-16 bg-[#141414] rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-800">
            <UploadCloud className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-sm">Select "Media" in the sidebar to upload</p>
        </div>
      ) : (
        <div 
            className="will-change-transform origin-top-left transition-transform duration-75 ease-out"
            style={{ 
                transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})` 
            }}
        >
          {/* Main Video Container */}
          <div className="w-[800px] aspect-video shadow-2xl shadow-black ring-1 ring-gray-800 rounded-lg overflow-hidden relative bg-black pointer-events-none">
            <RemotionPlayer />
            
            {/* Processing Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
                <p className="text-white font-medium animate-pulse mb-2">Processing...</p>
                <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};