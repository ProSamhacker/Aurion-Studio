// src/components/studio/TimelineControls.tsx - ENHANCED VERSION
import { Play, Pause, Square, SkipBack, SkipForward, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { useTimelineStore } from '@/core/stores/useTimelineStore';
import { formatTime } from '@/core/utils/time';
import { useState } from 'react';

export const TimelineControls = () => {
  const { 
    isPlaying, setIsPlaying, 
    currentTime, setCurrentTime, 
    duration, bufferState,
    zoomLevel, setZoomLevel
  } = useTimelineStore();

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const handleSkip = (amount: number) => {
    setCurrentTime(Math.min(duration, Math.max(0, currentTime + amount)));
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleZoomChange = (delta: number) => {
    const newZoom = Math.max(10, Math.min(300, zoomLevel + delta));
    setZoomLevel(newZoom);
  };

  return (
    <div className="h-14 bg-[#0a0a0a] border-t border-[#1f1f1f] flex items-center justify-between px-6 shrink-0 select-none z-10 relative">
      
      {/* Left: Playback Controls */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => handleSkip(-5)} 
          className="p-2 text-gray-400 hover:text-white hover:bg-[#1f1f1f] rounded-lg transition"
          title="Back 5s (←)"
          disabled={bufferState.isBuffering}
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button 
          onClick={() => setIsPlaying(!isPlaying)} 
          disabled={bufferState.isBuffering}
          className="w-10 h-10 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-full transition flex items-center justify-center shadow-lg"
          title="Play/Pause (Space)"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        <button 
          onClick={handleStop} 
          className="p-2 text-gray-400 hover:text-white hover:bg-[#1f1f1f] rounded-lg transition"
          title="Stop"
          disabled={bufferState.isBuffering}
        >
          <Square className="w-4 h-4 fill-current" />
        </button>

        <button 
          onClick={() => handleSkip(5)} 
          className="p-2 text-gray-400 hover:text-white hover:bg-[#1f1f1f] rounded-lg transition"
          title="Forward 5s (→)"
          disabled={bufferState.isBuffering}
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-gray-800 mx-2"></div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleMute}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#1f1f1f] rounded-lg transition"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            title="Volume"
          />
        </div>
      </div>

      {/* Center: Time Display & Progress Bar */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2 mx-8">
        <div className="text-xs font-mono bg-black/30 px-3 py-1 rounded-full border border-white/5 shadow-inner">
          <span className="text-purple-300 font-medium">{formatTime(currentTime)}</span>
          <span className="text-gray-600 mx-2">|</span>
          <span className="text-gray-500">{formatTime(duration)}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full max-w-md">
          <input
            type="range"
            min="0"
            max={duration}
            step="0.01"
            value={currentTime}
            onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            disabled={bufferState.isBuffering}
          />
        </div>
      </div>

      {/* Right: Zoom & View Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-[#1a1a1a] rounded-lg border border-gray-800 px-2 py-1">
          <button
            onClick={() => handleZoomChange(-10)}
            className="p-1 text-gray-400 hover:text-white transition text-xs font-bold"
            title="Zoom Out"
          >
            −
          </button>
          <span className="text-xs text-gray-400 font-mono w-12 text-center">
            {Math.round(zoomLevel)}px/s
          </span>
          <button
            onClick={() => handleZoomChange(10)}
            className="p-1 text-gray-400 hover:text-white transition text-xs font-bold"
            title="Zoom In"
          >
            +
          </button>
        </div>

        <div className="h-6 w-px bg-gray-800 mx-1"></div>

        <button
          className="p-2 text-gray-400 hover:text-white hover:bg-[#1f1f1f] rounded-lg transition"
          title="Fullscreen (Coming Soon)"
          disabled
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};