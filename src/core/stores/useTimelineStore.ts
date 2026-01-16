// src/core/stores/useTimelineStore.ts - ENHANCED PREVIEW-ONLY VERSION
import { create } from 'zustand';

export interface Caption {
  start: number;
  end: number;
  text: string;
  style?: CaptionStyle;
}

export interface CaptionStyle {
  color: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  textAlign: 'left' | 'center' | 'right';
  backgroundColor: string;
  position: 'top' | 'center' | 'bottom';
  opacity: number;
}

export interface VoiceSettings {
  voiceId: string;
  speed: number;
  pitch: number;
  stability: number;
  similarityBoost: number;
}

export interface MediaAsset {
  id: string;
  url: string;
  type: 'video' | 'image';
  name: string;
  duration?: number;
  thumbnail?: string;
}

export interface Project {
  id: string;
  name: string;
  originalVideoUrl: string | null;
  mediaLibrary: MediaAsset[];
  generatedScript: string;
  captions: Caption[];
  audioUrl: string | null;
  audioDuration: number | null;
  voiceSettings: VoiceSettings;
  defaultCaptionStyle: CaptionStyle;
  duration: number;
  lastSaved: Date;
}

interface BufferState {
  isBuffering: boolean;
  bufferProgress: number;
  videoReady: boolean;
  audioReady: boolean;
}

interface TimelineState extends Project {
  isPlaying: boolean;
  currentTime: number;
  fps: number;
  zoomLevel: number;
  
  hasUnsavedChanges: boolean;
  isAutoSaving: boolean;
  
  // Enhanced buffering
  bufferState: BufferState;
  
  // Playback quality
  playbackQuality: 'auto' | 'high' | 'medium' | 'low';
  
  // Actions
  setOriginalVideo: (url: string) => void;
  addMediaToLibrary: (file: File, url: string) => void;
  setDuration: (duration: number) => void;
  setScript: (script: string) => void;
  appendScript: (text: string) => void;
  setCaptions: (captions: Caption[]) => void;
  updateCaption: (index: number, updates: Partial<Caption>) => void;
  setDefaultCaptionStyle: (style: Partial<CaptionStyle>) => void;
  setAudio: (url: string, duration: number) => void;
  setVoiceSettings: (settings: Partial<VoiceSettings>) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setZoomLevel: (zoom: number) => void;
  
  // Buffer management
  setBufferState: (state: Partial<BufferState>) => void;
  resetBuffer: () => void;
  
  // Quality management
  setPlaybackQuality: (quality: 'auto' | 'high' | 'medium' | 'low') => void;
  
  // Project management
  saveProject: () => void;
  loadProject: (projectId: string) => void;
  updateProjectName: (name: string) => void;
  resetProject: () => void;
  
  // Preload management
  preloadMedia: () => Promise<void>;
}

const defaultCaptionStyle: CaptionStyle = {
  color: '#FFFFFF',
  fontSize: 42,
  fontFamily: 'Inter, sans-serif',
  fontWeight: 'bold',
  textAlign: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  position: 'bottom',
  opacity: 1,
};

const defaultVoiceSettings: VoiceSettings = {
  voiceId: 'pNInz6obpgDQGcFmaJgB',
  speed: 1.0,
  pitch: 1.0,
  stability: 0.5,
  similarityBoost: 0.75,
};

const initialBufferState: BufferState = {
  isBuffering: false,
  bufferProgress: 0,
  videoReady: false,
  audioReady: false,
};

const initialState = {
  id: '',
  name: 'Untitled Project',
  originalVideoUrl: null,
  mediaLibrary: [],
  generatedScript: '',
  audioUrl: null,
  audioDuration: null,
  captions: [],
  voiceSettings: defaultVoiceSettings,
  defaultCaptionStyle: defaultCaptionStyle,
  isPlaying: false,
  currentTime: 0,
  duration: 60,
  fps: 30,
  zoomLevel: 30,
  lastSaved: new Date(),
  hasUnsavedChanges: false,
  isAutoSaving: false,
  bufferState: initialBufferState,
  playbackQuality: 'auto' as const,
};

export const useTimelineStore = create<TimelineState>((set, get) => ({
  ...initialState,

  // ========== MEDIA MANAGEMENT ==========

  setOriginalVideo: (url) => {
    const proxiedUrl = url.includes('drive.google.com') 
      ? `/api/video-proxy?url=${encodeURIComponent(url)}` 
      : url;
    
    set({ 
      originalVideoUrl: proxiedUrl,
      hasUnsavedChanges: true,
      currentTime: 0,
      bufferState: { ...initialBufferState, isBuffering: true }
    });
    
    // Trigger preload
    get().preloadMedia();
  },

  addMediaToLibrary: (file, url) => set((state) => {
    const exists = state.mediaLibrary.some(m => m.name === file.name);
    if (exists) return {};

    return {
      mediaLibrary: [
        ...state.mediaLibrary, 
        { 
          id: Math.random().toString(36).substr(2, 9), 
          url, 
          type: file.type.startsWith('video') ? 'video' : 'image', 
          name: file.name,
          duration: undefined,
          thumbnail: undefined
        }
      ],
      hasUnsavedChanges: true
    };
  }),

  setDuration: (duration) => {
    const validDuration = Math.max(0.1, duration);
    set({ 
      duration: validDuration,
      hasUnsavedChanges: true
    });
  },

  // ========== SCRIPT MANAGEMENT ==========

  setScript: (script) => {
    set({ 
      generatedScript: script,
      hasUnsavedChanges: true 
    });
  },
  
  appendScript: (text) => set((state) => ({ 
    generatedScript: state.generatedScript + text,
    hasUnsavedChanges: true
  })),
  
  // ========== CAPTIONS MANAGEMENT ==========

  setCaptions: (captions) => {
    set({ 
      captions, 
      hasUnsavedChanges: true
    });
  },

  updateCaption: (index, updates) => {
    set((state) => {
      const newCaptions = [...state.captions];
      if (newCaptions[index]) {
        newCaptions[index] = { ...newCaptions[index], ...updates };
      }
      return { captions: newCaptions, hasUnsavedChanges: true };
    });
  },

  setDefaultCaptionStyle: (style) => set((state) => ({
    defaultCaptionStyle: { ...state.defaultCaptionStyle, ...style },
    hasUnsavedChanges: true
  })),

  // ========== AUDIO MANAGEMENT ==========

  setAudio: (url, duration) => {
    set({ 
      audioUrl: url,
      audioDuration: duration,
      hasUnsavedChanges: true,
      bufferState: { ...get().bufferState, audioReady: false }
    });
    
    // Preload audio
    get().preloadMedia();
  },

  setVoiceSettings: (settings) => set((state) => ({
    voiceSettings: { ...state.voiceSettings, ...settings },
    hasUnsavedChanges: true
  })),
  
  // ========== PLAYBACK CONTROLS ==========

  setIsPlaying: (isPlaying) => {
    const state = get();
    
    // Don't play if buffering
    if (isPlaying && state.bufferState.isBuffering) {
      console.warn('Cannot play while buffering');
      return;
    }
    
    if (isPlaying && state.currentTime >= state.duration) {
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
  
  setZoomLevel: (zoomLevel) => {
    const clamped = Math.max(10, Math.min(300, zoomLevel));
    set({ zoomLevel: clamped });
  },

  // ========== BUFFER MANAGEMENT ==========

  setBufferState: (updates) => set((state) => ({
    bufferState: { ...state.bufferState, ...updates }
  })),

  resetBuffer: () => set({
    bufferState: initialBufferState
  }),

  preloadMedia: async () => {
    const state = get();
    
    set({ bufferState: { ...state.bufferState, isBuffering: true, bufferProgress: 0 }});
    
    const promises: Promise<void>[] = [];
    
    // Preload video
    if (state.originalVideoUrl) {
      promises.push(
        new Promise((resolve) => {
          const video = document.createElement('video');
          video.preload = 'auto';
          video.src = state.originalVideoUrl!;
          
          video.addEventListener('canplaythrough', () => {
            set((s) => ({ 
              bufferState: { ...s.bufferState, videoReady: true }
            }));
            resolve();
          });
          
          video.addEventListener('error', () => {
            console.error('Video preload failed');
            resolve();
          });
          
          video.load();
        })
      );
    }
    
    // Preload audio
    if (state.audioUrl) {
      promises.push(
        new Promise((resolve) => {
          const audio = new Audio();
          audio.preload = 'auto';
          audio.src = state.audioUrl!;
          
          audio.addEventListener('canplaythrough', () => {
            set((s) => ({ 
              bufferState: { ...s.bufferState, audioReady: true }
            }));
            resolve();
          });
          
          audio.addEventListener('error', () => {
            console.error('Audio preload failed');
            resolve();
          });
          
          audio.load();
        })
      );
    }
    
    await Promise.all(promises);
    
    set((s) => ({ 
      bufferState: { 
        ...s.bufferState, 
        isBuffering: false, 
        bufferProgress: 100 
      }
    }));
  },

  // ========== QUALITY MANAGEMENT ==========

  setPlaybackQuality: (quality) => set({ playbackQuality: quality }),

  // ========== PROJECT MANAGEMENT ==========

  saveProject: () => {
    const state = get();
    const projectData: Project = {
      id: state.id,
      name: state.name,
      originalVideoUrl: state.originalVideoUrl,
      mediaLibrary: state.mediaLibrary,
      generatedScript: state.generatedScript,
      captions: state.captions,
      audioUrl: state.audioUrl,
      audioDuration: state.audioDuration,
      voiceSettings: state.voiceSettings,
      defaultCaptionStyle: state.defaultCaptionStyle,
      duration: state.duration,
      lastSaved: new Date(),
    };
    
    localStorage.setItem(`aura-project-${state.id}`, JSON.stringify(projectData));
    
    const projectsList = JSON.parse(localStorage.getItem('aura-projects') || '[]');
    const existingIndex = projectsList.findIndex((p: any) => p.id === state.id);
    
    const projectMeta = {
      id: state.id,
      name: state.name,
      thumbnail: '',
      lastEdited: new Date(),
      duration: state.duration,
    };
    
    if (existingIndex >= 0) {
      projectsList[existingIndex] = projectMeta;
    } else {
      projectsList.unshift(projectMeta);
    }
    
    localStorage.setItem('aura-projects', JSON.stringify(projectsList));
    set({ hasUnsavedChanges: false, lastSaved: new Date() });
  },

  loadProject: (projectId) => {
    const projectData = localStorage.getItem(`aura-project-${projectId}`);
    
    if (projectData) {
      const project: Project = JSON.parse(projectData);
      set({
        ...project,
        mediaLibrary: project.mediaLibrary || [],
        audioDuration: project.audioDuration || null,
        isPlaying: false,
        currentTime: 0,
        fps: 30,
        zoomLevel: 30,
        hasUnsavedChanges: false,
        isAutoSaving: false,
        bufferState: initialBufferState,
        playbackQuality: 'auto',
      });
      
      // Preload after loading
      get().preloadMedia();
    } else {
      set({
        ...initialState,
        id: projectId,
        hasUnsavedChanges: false,
      });
    }
  },

  updateProjectName: (name) => set({ name, hasUnsavedChanges: true }),
  
  resetProject: () => set(initialState),
}));