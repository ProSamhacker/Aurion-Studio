import { create } from 'zustand';

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
  
  // Editor State
  clips: Clip[];
  isPlaying: boolean;
  currentTime: number; // Current playback time in seconds
  duration: number;    // Total duration in seconds
  fps: number;         // Frames Per Second
  
  // Actions
  setOriginalVideo: (url: string) => void;
  setScript: (script: string) => void;
  appendScript: (text: string) => void;
  setCaptions: (captions: Caption[]) => void;
  setAudio: (url: string) => void;
  addClip: (clip: Clip) => void;
  
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void; // <--- NEW
}

export const useTimelineStore = create<TimelineState>((set) => ({
  originalVideoUrl: null,
  generatedScript: "",
  audioUrl: null,
  clips: [],
  captions: [],
  
  isPlaying: false,
  currentTime: 0,
  duration: 60, // Default duration to avoid 0 division
  fps: 30,

  setOriginalVideo: (url) => set({ originalVideoUrl: url }),
  setScript: (script) => set({ generatedScript: script }),
  appendScript: (text) => set((state) => ({ generatedScript: state.generatedScript + text })),
  setCaptions: (captions) => set({ captions }),
  setAudio: (url) => set({ audioUrl: url }),
  addClip: (clip) => set((state) => ({ clips: [...state.clips, clip] })),
  
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
}));