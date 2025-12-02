// src/core/stores/useTimelineStore.ts
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
  updateCaption: (index: number, text: string) => void; // <--- NEW ACTION
  setAudio: (url: string) => void;
  addClip: (clip: Clip) => void;
  
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setZoomLevel: (zoom: number) => void;
  setVideoTrim: (start: number, end: number) => void;
}

// Wrap the store in "persist" to save it to LocalStorage
export const useTimelineStore = create<TimelineState>()(
  persist(
    (set) => ({
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
      videoTrim: { start: 0, end: 0 }, 

      // --- 1. PROXY LOGIC (For Google Drive playback) ---
      setOriginalVideo: (url) => {
        if (url && (url.includes('drive.google.com') || url.includes('googleusercontent.com'))) {
            // Wrap it in our local proxy to fix CORS headers
            const proxyUrl = `/api/video-proxy?url=${encodeURIComponent(url)}`;
            set({ originalVideoUrl: proxyUrl });
        } else {
            set({ originalVideoUrl: url });
        }
      },

      setScript: (script) => set({ generatedScript: script }),
      appendScript: (text) => set((state) => ({ generatedScript: state.generatedScript + text })),
      setCaptions: (captions) => set({ captions }),

      // --- 2. NEW CAPTION UPDATE LOGIC ---
      updateCaption: (index, newText) => set((state) => {
        const newCaptions = [...state.captions];
        if (newCaptions[index]) {
            newCaptions[index] = { ...newCaptions[index], text: newText };
        }
        return { captions: newCaptions };
      }),

      setAudio: (url) => set({ audioUrl: url }),
      addClip: (clip) => set((state) => ({ clips: [...state.clips, clip] })),
      
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setCurrentTime: (time) => set({ currentTime: Math.max(0, time) }),
      setDuration: (duration) => set({ duration, videoTrim: { start: 0, end: duration } }),
      setZoomLevel: (zoomLevel) => set({ zoomLevel: Math.max(10, Math.min(200, zoomLevel)) }),
      
      setVideoTrim: (start, end) => set((state) => ({ 
        videoTrim: { 
          start: Math.max(0, start), 
          end: Math.min(state.duration, Math.max(start + 1, end))
        } 
      })),
    }),
    {
      name: 'aura-project-storage', // unique name for the local storage key
      storage: createJSONStorage(() => localStorage), // use browser local storage
      // Don't save 'isPlaying' so audio doesn't blast on refresh
      partialize: (state) => ({ 
          originalVideoUrl: state.originalVideoUrl,
          generatedScript: state.generatedScript,
          captions: state.captions,
          audioUrl: state.audioUrl,
          duration: state.duration,
          videoTrim: state.videoTrim
      }),
    }
  )
);