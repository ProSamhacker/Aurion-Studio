import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, Volume2, Gauge, Play, Pause, User, UserCircle, X, ChevronRight, CheckCircle, Loader2 
} from 'lucide-react';

interface VoiceSettings {
  voiceId: string;
  speed: number;
  pitch: number;
  stability: number;
  similarityBoost: number;
}

const EnhancedVoicePanel = ({
  settings,
  onSettingsChange,
  onGenerate,
  isGenerating,
  previewUrl,
  onApply,
  script
}: any) => {
  const [showVoiceLibrary, setShowVoiceLibrary] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // In a real app, you might want to fetch real previews from ElevenLabs API
  const getPreviewUrl = (voiceId: string) => `https://storage.googleapis.com/eleven-public-cdn/audio/en-US/fin/fin_1.mp3`; 

  const stopAudio = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
    }
    setPlayingVoiceId(null);
  };

  const playPreview = (voiceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingVoiceId === voiceId) {
        stopAudio();
        return;
    }
    stopAudio();
    
    // Create new audio for preview
    const audio = new Audio(getPreviewUrl(voiceId));
    // Apply the speed setting to the preview to give user real feedback
    audio.playbackRate = settings.speed || 1.0; 
    audio.volume = 0.5;
    
    audio.play().catch(e => console.error("Preview play failed", e));
    audio.onended = () => setPlayingVoiceId(null);
    audioRef.current = audio;
    setPlayingVoiceId(voiceId);
  };

  const voices = [
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'Deep, authoritative narrative', gender: 'male', age: 'middle', style: 'narrative' },
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Clear, professional standard', gender: 'female', age: 'young', style: 'professional' },
    { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', description: 'Energetic, youthful vlogger', gender: 'male', age: 'young', style: 'energetic' },
    { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', description: 'Strong, confident news', gender: 'female', age: 'middle', style: 'confident' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Soft, warm conversation', gender: 'female', age: 'young', style: 'warm' },
    { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', description: 'Rich, storytelling tone', gender: 'male', age: 'middle', style: 'storytelling' },
    { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', description: 'Cheerful, bright narration', gender: 'female', age: 'young', style: 'cheerful' },
    { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', description: 'Casual, friendly podcast', gender: 'male', age: 'young', style: 'casual' },
  ];
  
  const selectedVoice = voices.find(v => v.id === settings.voiceId) || voices[0];

  return (
    <div className="flex flex-col h-full bg-[#141414] relative">
      {/* Header */}
      <div className="p-5 border-b border-[#1f1f1f]">
        <h2 className="text-base font-bold text-white">Voice Studio</h2>
      </div>

      <div className="p-5 space-y-6 flex-1 overflow-y-auto modern-scrollbar">
        {/* Selected Voice Button */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Voice Persona</label>
          <button
            onClick={() => setShowVoiceLibrary(true)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 hover:border-purple-500/50 hover:bg-[#202020] transition group flex items-center gap-4 text-left"
          >
             <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-purple-500/30 group-hover:scale-105 transition">
                {selectedVoice.gender === 'male' ? <User className="w-5 h-5 text-purple-400" /> : <UserCircle className="w-5 h-5 text-purple-400" />}
             </div>
             <div className="flex-1">
                 <div className="font-bold text-white text-sm">{selectedVoice.name}</div>
                 <div className="text-xs text-gray-400">{selectedVoice.style}</div>
             </div>
             <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition" />
          </button>
        </div>

        {/* Settings Sliders */}
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1a1a1a] p-3 rounded-xl border border-[#2a2a2a] hover:border-gray-700 transition">
                <label className="text-[10px] font-bold text-gray-500 uppercase flex justify-between">
                   <span className="flex items-center gap-1"><Gauge className="w-3 h-3"/> Speed</span>
                   <span className="text-purple-400">{settings.speed}x</span>
                </label>
                <input 
                   type="range" min="0.5" max="2" step="0.1" 
                   value={settings.speed}
                   onChange={(e) => onSettingsChange({ speed: parseFloat(e.target.value) })}
                   className="w-full mt-2 accent-purple-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>
             <div className="bg-[#1a1a1a] p-3 rounded-xl border border-[#2a2a2a] hover:border-gray-700 transition">
                <label className="text-[10px] font-bold text-gray-500 uppercase flex justify-between">
                   <span className="flex items-center gap-1"><Volume2 className="w-3 h-3"/> Pitch</span>
                   <span className="text-purple-400">{settings.pitch}x</span>
                </label>
                <input 
                   type="range" min="0.5" max="2" step="0.1" 
                   value={settings.pitch}
                   onChange={(e) => onSettingsChange({ pitch: parseFloat(e.target.value) })}
                   className="w-full mt-2 accent-purple-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>

        {/* Generate Button */}
        <button
            onClick={onGenerate}
            disabled={isGenerating || !script}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin"/> : <Mic className="w-4 h-4"/>}
            <span>{isGenerating ? "Generating..." : "Generate Voice"}</span>
        </button>

        {/* Preview Player */}
        {previewUrl && (
            <div className="p-3 bg-[#1a1a1a] rounded-xl border border-green-500/30 flex flex-col gap-2">
                <div className="flex justify-between items-center text-green-400 text-[10px] font-bold">
                    <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Ready</span>
                    <button onClick={onApply} className="bg-white text-black px-2 py-1 rounded hover:bg-gray-200">Apply</button>
                </div>
                <audio controls src={previewUrl} className="w-full h-8" />
            </div>
        )}
      </div>

      {/* MODAL - Fixed Position Z-Index 100 to avoid overlap */}
      {showVoiceLibrary && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-6 animate-in fade-in duration-200">
           <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl">
              <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-center bg-[#141414] rounded-t-2xl">
                 <h3 className="text-lg font-bold text-white">Voice Library</h3>
                 <button onClick={() => setShowVoiceLibrary(false)} className="hover:text-white text-gray-500"><X className="w-5 h-5"/></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-6 overflow-y-auto modern-scrollbar bg-[#0E0E0E]">
                 {voices.map(voice => (
                    <div 
                        key={voice.id}
                        onClick={() => { onSettingsChange({ voiceId: voice.id }); setShowVoiceLibrary(false); }}
                        className={`p-4 rounded-xl border cursor-pointer hover:border-gray-500 transition-all ${settings.voiceId === voice.id ? 'border-purple-500 bg-purple-500/10' : 'border-[#2a2a2a] bg-[#1a1a1a]'}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-400"/>
                            </div>
                            <button 
                                onClick={(e) => playPreview(voice.id, e)}
                                className="w-8 h-8 rounded-full bg-[#252525] hover:bg-white hover:text-black flex items-center justify-center transition"
                            >
                                {playingVoiceId === voice.id ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                            </button>
                        </div>
                        <div className="font-bold text-white">{voice.name}</div>
                        <div className="text-xs text-gray-500 line-clamp-2">{voice.description}</div>
                        <div className="flex gap-1 mt-2">
                             <span className="text-[9px] bg-white/5 border border-white/10 px-1 rounded text-gray-400">{voice.gender}</span>
                             <span className="text-[9px] bg-white/5 border border-white/10 px-1 rounded text-gray-400">{voice.style}</span>
                        </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedVoicePanel;