// src/core/stores/useTimelineStore.ts - WITH UNDO/REDO & AUDIO DURATION
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
}

export interface Project {
  id: string;
  name: string;
  originalVideoUrl: string | null;
  mediaLibrary: MediaAsset[];
  generatedScript: string;
  captions: Caption[];
  audioUrl: string | null;
  audioDuration: number | null; // ADDED: Track actual audio length
  voiceSettings: VoiceSettings;
  defaultCaptionStyle: CaptionStyle;
  duration: number;
  videoTrim: { start: number; end: number };
  lastSaved: Date;
}

interface ClipboardData {
  type: 'video' | 'audio' | 'caption';
  data: any;
  index?: number;
}

// History state for undo/redo
interface HistoryState {
  captions: Caption[];
  videoTrim: { start: number; end: number };
  audioUrl: string | null;
  generatedScript: string;
  duration: number;
}

interface TimelineState extends Project {
  isPlaying: boolean;
  currentTime: number;
  fps: number;
  zoomLevel: number;
  
  hasUnsavedChanges: boolean;
  isAutoSaving: boolean;
  clipboard: ClipboardData | null;
  
  // Undo/Redo
  history: HistoryState[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;

  // Actions
  setOriginalVideo: (url: string) => void;
  addMediaToLibrary: (file: File, url: string) => void;
  selectMediaFromLibrary: (url: string) => void;
  setDuration: (duration: number) => void;
  setVideoTrim: (start: number, end: number) => void;
  setScript: (script: string) => void;
  appendScript: (text: string) => void;
  setCaptions: (captions: Caption[]) => void;
  updateCaption: (index: number, updates: Partial<Caption>) => void;
  updateCaptionStyle: (index: number, style: Partial<CaptionStyle>) => void;
  setDefaultCaptionStyle: (style: Partial<CaptionStyle>) => void;
  setAudio: (url: string, duration: number) => void; // UPDATED: Accept duration
  setVoiceSettings: (settings: Partial<VoiceSettings>) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setZoomLevel: (zoom: number) => void;
  
  // Clipboard & Editing
  copyClip: (type: string, index?: number) => void;
  cutClip: (type: string, index?: number) => void;
  pasteClip: (atTime: number) => void;
  deleteClip: (type: string, index?: number) => void;
  splitClipAtPlayhead: (time: number) => void;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  
  // Project management
  saveProject: () => void;
  loadProject: (projectId: string) => void;
  updateProjectName: (name: string) => void;
  resetProject: () => void;
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

const initialState = {
  id: '',
  name: 'Untitled Project',
  originalVideoUrl: null,
  mediaLibrary: [],
  generatedScript: '',
  audioUrl: null,
  audioDuration: null, // ADDED
  captions: [],
  voiceSettings: defaultVoiceSettings,
  defaultCaptionStyle: defaultCaptionStyle,
  isPlaying: false,
  currentTime: 0,
  duration: 60,
  fps: 30,
  zoomLevel: 30,
  videoTrim: { start: 0, end: 60 },
  lastSaved: new Date(),
  hasUnsavedChanges: false,
  isAutoSaving: false,
  clipboard: null,
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,
};

export const useTimelineStore = create<TimelineState>((set, get) => ({
  ...initialState,

  // ========== HISTORY MANAGEMENT ==========
  
  saveToHistory: () => {
    const state = get();
    
    const historyState: HistoryState = {
      captions: JSON.parse(JSON.stringify(state.captions)),
      videoTrim: { ...state.videoTrim },
      audioUrl: state.audioUrl,
      generatedScript: state.generatedScript,
      duration: state.duration
    };
    
    // Remove any redo history when making new changes
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(historyState);
    
    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
      canUndo: true,
      canRedo: false
    });
  },

  undo: () => {
    const state = get();
    
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      const historyState = state.history[newIndex];
      
      set({
        ...historyState,
        historyIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: true,
        hasUnsavedChanges: true
      });
    }
  },

  redo: () => {
    const state = get();
    
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      const historyState = state.history[newIndex];
      
      set({
        ...historyState,
        historyIndex: newIndex,
        canUndo: true,
        canRedo: newIndex < state.history.length - 1,
        hasUnsavedChanges: true
      });
    }
  },

  // ========== MEDIA MANAGEMENT ==========

  setOriginalVideo: (url) => {
    const proxiedUrl = url.includes('drive.google.com') 
      ? `/api/video-proxy?url=${encodeURIComponent(url)}` 
      : url;
    
    get().saveToHistory();
    
    set({ 
      originalVideoUrl: proxiedUrl,
      hasUnsavedChanges: true,
      currentTime: 0 
    });
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
          name: file.name 
        }
      ],
      hasUnsavedChanges: true
    };
  }),

  selectMediaFromLibrary: (url) => {
     get().setOriginalVideo(url);
  },

  setDuration: (duration) => {
    const validDuration = Math.max(0.1, duration);
    
    get().saveToHistory();
    
    set({ 
      duration: validDuration,
      videoTrim: { start: 0, end: validDuration },
      hasUnsavedChanges: true
    });
  },

  setVideoTrim: (start, end) => {
    const validStart = Math.max(0, start);
    const validEnd = Math.max(validStart + 0.5, end);
    
    get().saveToHistory();
    
    set({ 
      videoTrim: { start: validStart, end: validEnd },
      hasUnsavedChanges: true
    });
  },

  // ========== SCRIPT MANAGEMENT ==========

  setScript: (script) => {
    get().saveToHistory();
    
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
    get().saveToHistory();
    
    set({ 
      captions, 
      hasUnsavedChanges: true
    });
  },

  updateCaption: (index, updates) => {
    get().saveToHistory();
    
    set((state) => {
      const newCaptions = [...state.captions];
      if (newCaptions[index]) {
        newCaptions[index] = { ...newCaptions[index], ...updates };
      }
      return { captions: newCaptions, hasUnsavedChanges: true };
    });
  },

  updateCaptionStyle: (index, styleUpdates) => {
    get().saveToHistory();
    
    set((state) => {
      const newCaptions = [...state.captions];
      if (newCaptions[index]) {
        newCaptions[index] = {
          ...newCaptions[index],
          style: { ...(newCaptions[index].style || state.defaultCaptionStyle), ...styleUpdates } as CaptionStyle
        };
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
    get().saveToHistory();
    
    set({ 
      audioUrl: url,
      audioDuration: duration, // FIXED: Store actual audio duration
      hasUnsavedChanges: true 
    });
  },

  setVoiceSettings: (settings) => set((state) => ({
    voiceSettings: { ...state.voiceSettings, ...settings },
    hasUnsavedChanges: true
  })),
  
  // ========== PLAYBACK CONTROLS ==========

  setIsPlaying: (isPlaying) => {
    const state = get();
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

  // ========== CLIPBOARD & EDITING ==========

  copyClip: (type, index) => {
    const state = get();
    let data = null;

    if (type === 'video' && state.originalVideoUrl) {
      data = {
        url: state.originalVideoUrl,
        trim: { ...state.videoTrim }
      };
    } else if (type === 'audio' && state.audioUrl) {
      data = { 
        url: state.audioUrl,
        duration: state.audioDuration 
      };
    } else if (type === 'caption' && index !== undefined && state.captions[index]) {
      data = { ...state.captions[index] };
    }

    if (data) {
      set({ 
        clipboard: { type: type as any, data, index },
        hasUnsavedChanges: true 
      });
    }
  },

  cutClip: (type, index) => {
    const state = get();
    state.copyClip(type, index);
    state.deleteClip(type, index);
  },

  pasteClip: (atTime) => {
    const state = get();
    
    if (!state.clipboard) return;

    get().saveToHistory();

    const { type, data } = state.clipboard;

    if (type === 'caption') {
      const duration = data.end - data.start;
      const newCaption: Caption = {
        ...data,
        start: atTime,
        end: atTime + duration
      };
      
      set((s) => ({
        captions: [...s.captions, newCaption].sort((a, b) => a.start - b.start),
        hasUnsavedChanges: true
      }));
    } else if (type === 'audio') {
      set({ 
        audioUrl: data.url,
        audioDuration: data.duration,
        hasUnsavedChanges: true 
      });
    }
  },

  deleteClip: (type, index) => {
    get().saveToHistory();

    if (type === 'video') {
      set({ 
        originalVideoUrl: null, 
        videoTrim: { start: 0, end: 60 },
        hasUnsavedChanges: true 
      });
    } else if (type === 'audio') {
      set({ 
        audioUrl: null,
        audioDuration: null,
        hasUnsavedChanges: true 
      });
    } else if (type === 'caption' && index !== undefined) {
      set((s) => ({
        captions: s.captions.filter((_, i) => i !== index),
        hasUnsavedChanges: true
      }));
    }
  },

  splitClipAtPlayhead: (time) => {
    const state = get();

    get().saveToHistory();

    const captionIndex = state.captions.findIndex(
      c => time >= c.start && time <= c.end
    );

    if (captionIndex !== -1) {
      const caption = state.captions[captionIndex];
      
      const firstPart: Caption = {
        ...caption,
        end: time
      };
      
      const secondPart: Caption = {
        ...caption,
        start: time
      };

      const newCaptions = [...state.captions];
      newCaptions[captionIndex] = firstPart;
      newCaptions.splice(captionIndex + 1, 0, secondPart);

      set({ captions: newCaptions, hasUnsavedChanges: true });
    }
  },

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
      audioDuration: state.audioDuration, // ADDED
      voiceSettings: state.voiceSettings,
      defaultCaptionStyle: state.defaultCaptionStyle,
      duration: state.duration,
      videoTrim: state.videoTrim,
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
        audioDuration: project.audioDuration || null, // ADDED
        isPlaying: false,
        currentTime: 0,
        fps: 30,
        zoomLevel: 30,
        hasUnsavedChanges: false,
        isAutoSaving: false,
        clipboard: null,
        history: [],
        historyIndex: -1,
        canUndo: false,
        canRedo: false,
      });
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