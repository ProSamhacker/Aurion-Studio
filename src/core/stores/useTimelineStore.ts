// src/core/stores/useTimelineStore.ts - PERSISTENCE FIX
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Clip {
  id: string;
  type: 'video' | 'audio' | 'image';
  url: string;
  start: number;
  end: number;
  layer: number;
}

export interface Caption {
  start: number;
  end: number;
  text: string;
}

interface TimelineState {
  originalVideoUrl: string | null;
  generatedScript: string;
  captions: Caption[];
  audioUrl: string | null;
  
  clips: Clip[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  fps: number;
  zoomLevel: number;
  videoTrim: { start: number; end: number };

  // Actions
  setOriginalVideo: (url: string) => void;
  setScript: (script: string) => void;
  appendScript: (text: string) => void;
  setCaptions: (captions: Caption[]) => void;
  updateCaption: (index: number, text: string) => void;
  setAudio: (url: string) => void;
  addClip: (clip: Clip) => void;
  
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setZoomLevel: (zoom: number) => void;
  setVideoTrim: (start: number, end: number) => void;
  
  // Reset function
  resetProject: () => void;
}

const initialState = {
  originalVideoUrl: null,
  generatedScript: "",
  audioUrl: null,
  clips: [],
  captions: [],
  isPlaying: false,
  currentTime: 0,
  duration: 60,
  fps: 30,
  zoomLevel: 30,
  videoTrim: { start: 0, end: 60 },
};

// Helper to check if URL is persistable
const isPersistableUrl = (url: string | null): boolean => {
  if (!url) return false;
  
  // Blob URLs are temporary - don't persist
  if (url.startsWith('blob:')) {
    console.warn('⚠️ Blob URL detected - will not persist:', url.substring(0, 30) + '...');
    return false;
  }
  
  // Proxy URLs are session-specific - don't persist
  if (url.startsWith('/api/video-proxy')) {
    console.warn('⚠️ Proxy URL detected - will not persist');
    return false;
  }
  
  // Data URLs are too large - don't persist
  if (url.startsWith('data:')) {
    console.warn('⚠️ Data URL detected - will not persist');
    return false;
  }
  
  // Drive URLs are good!
  if (url.includes('drive.google.com') || url.includes('googleusercontent.com')) {
    console.log('✅ Drive URL - will persist:', url.substring(0, 50) + '...');
    return true;
  }
  
  // Other HTTP(S) URLs are probably fine
  if (url.startsWith('http://') || url.startsWith('https://')) {
    console.log('✅ HTTP URL - will persist:', url.substring(0, 50) + '...');
    return true;
  }
  
  return false;
};

export const useTimelineStore = create<TimelineState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setOriginalVideo: (url) => {
        console.log('📹 Setting video URL:', url?.substring(0, 50) + '...');
        
        // Proxy Drive URLs for playback
        let finalUrl = url;
        if (url && (url.includes('drive.google.com') || url.includes('googleusercontent.com'))) {
          finalUrl = `/api/video-proxy?url=${encodeURIComponent(url)}`;
          console.log('🔀 Proxying for playback (original URL saved for persistence)');
        }
        
        // Store both the display URL (proxied) and original URL (for persistence)
        set({ 
          originalVideoUrl: finalUrl,
          // We'll use the original URL in partialize
        });
      },

      setScript: (script) => {
        console.log('📝 Setting script (length:', script.length, ')');
        set({ generatedScript: script });
      },
      
      appendScript: (text) => set((state) => ({ 
        generatedScript: state.generatedScript + text 
      })),
      
      setCaptions: (captions) => {
        console.log('💬 Setting captions:', captions.length, 'items');
        set({ captions });
      },

      updateCaption: (index, newText) => set((state) => {
        const newCaptions = [...state.captions];
        if (newCaptions[index]) {
          newCaptions[index] = { ...newCaptions[index], text: newText };
        }
        return { captions: newCaptions };
      }),

      setAudio: (url) => {
        console.log('🎵 Setting audio URL:', url?.substring(0, 50) + '...');
        set({ audioUrl: url });
      },
      
      addClip: (clip) => set((state) => ({ 
        clips: [...state.clips, clip] 
      })),
      
      setIsPlaying: (isPlaying) => {
        const state = get();
        if (isPlaying && state.currentTime >= state.duration) {
          console.log('⏹️ Auto-stopping at end');
          set({ currentTime: 0, isPlaying: true });
        } else {
          set({ isPlaying });
        }
      },
      
      setCurrentTime: (time) => {
        const state = get();
        const clampedTime = Math.max(0, Math.min(state.duration, time));
        
        if (clampedTime >= state.duration && state.isPlaying) {
          set({ currentTime: state.duration, isPlaying: false });
        } else {
          set({ currentTime: clampedTime });
        }
      },
      
      setDuration: (duration) => {
        const validDuration = Math.max(0.1, duration);
        console.log('⏱️ Setting duration:', validDuration, 'seconds');
        
        set({ 
          duration: validDuration,
          videoTrim: { start: 0, end: validDuration },
          currentTime: Math.min(get().currentTime, validDuration)
        });
      },
      
      setZoomLevel: (zoomLevel) => {
        const clamped = Math.max(10, Math.min(200, zoomLevel));
        set({ zoomLevel: clamped });
      },
      
      setVideoTrim: (start, end) => set((state) => {
        const validStart = Math.max(0, start);
        const validEnd = Math.min(state.duration, Math.max(start + 0.5, end));
        
        console.log('✂️ Trimming video:', validStart, '->', validEnd);
        
        return { 
          videoTrim: { 
            start: validStart, 
            end: validEnd
          } 
        };
      }),
      
      resetProject: () => {
        console.log('🔄 Resetting project');
        set(initialState);
      },
    }),
    {
      name: 'aura-project-storage',
      storage: createJSONStorage(() => localStorage),
      version: 2, // Bump version to clear old data
      
      // FIXED: Better persistence logic
      partialize: (state) => {
        // Extract original Drive URL from proxy URL if needed
        let videoUrl = state.originalVideoUrl;
        if (videoUrl?.startsWith('/api/video-proxy?url=')) {
          const match = videoUrl.match(/url=([^&]+)/);
          if (match) {
            videoUrl = decodeURIComponent(match[1]);
          }
        }
        
        return {
          // Only persist if it's a Drive URL (not blob/proxy)
          originalVideoUrl: isPersistableUrl(videoUrl) ? videoUrl : null,
          generatedScript: state.generatedScript,
          captions: state.captions,
          audioUrl: isPersistableUrl(state.audioUrl) ? state.audioUrl : null,
          duration: state.duration,
          videoTrim: state.videoTrim,
          zoomLevel: state.zoomLevel,
        };
      },
      
      // Handle loading saved state
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('❌ Failed to load saved state:', error);
          return;
        }
        
        if (state) {
          console.log('💾 Loading saved project from localStorage');
          
          // Reset playback state
          state.isPlaying = false;
          state.currentTime = 0;
          
          // Validate duration
          if (!state.duration || state.duration <= 0) {
            console.warn('⚠️ Invalid saved duration, resetting to 60s');
            state.duration = 60;
            state.videoTrim = { start: 0, end: 60 };
          }
          
          // Check if we have a video URL
          if (state.originalVideoUrl) {
            console.log('✅ Restored video URL:', state.originalVideoUrl.substring(0, 50) + '...');
            
            // Re-proxy it if needed
            if (state.originalVideoUrl.includes('drive.google.com')) {
              const proxied = `/api/video-proxy?url=${encodeURIComponent(state.originalVideoUrl)}`;
              state.originalVideoUrl = proxied;
              console.log('🔀 Re-proxied Drive URL for playback');
            }
          } else {
            console.log('⚠️ No video URL in saved state');
          }
          
          // Log what we restored
          console.log('📊 Restored state:', {
            hasVideo: !!state.originalVideoUrl,
            hasScript: state.generatedScript.length > 0,
            hasAudio: !!state.audioUrl,
            hasCaptions: state.captions.length > 0,
            duration: state.duration
          });
        }
      },
      
      // Migrate old data if needed
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          console.log('🔄 Migrating storage from version', version, 'to 2');
          // Clear any blob URLs from old versions
          if (persistedState.originalVideoUrl?.startsWith('blob:')) {
            persistedState.originalVideoUrl = null;
          }
          if (persistedState.audioUrl?.startsWith('blob:')) {
            persistedState.audioUrl = null;
          }
        }
        return persistedState as TimelineState;
      },
    }
  )
);