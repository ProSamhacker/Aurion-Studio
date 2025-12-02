import React, { useState } from 'react';
import { 
  Mic, Volume2, Gauge, Activity, Play, CheckCircle, Loader2,
  User, UserCircle
} from 'lucide-react';

interface VoiceSettings {
  voiceId: string;
  speed: number;
  pitch: number;
  stability: number;
  similarityBoost: number;
}

interface Voice {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female';
  age: 'young' | 'middle' | 'old';
  style: string;
}

const EnhancedVoicePanel = ({
  settings,
  onSettingsChange,
  onGenerate,
  isGenerating,
  previewUrl,
  onApply,
  script
}: {
  settings: VoiceSettings;
  onSettingsChange: (updates: Partial<VoiceSettings>) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  previewUrl: string | null;
  onApply: () => void;
  script: string;
}) => {
  const [showVoiceLibrary, setShowVoiceLibrary] = useState(false);

  const voices: Voice[] = [
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'Deep, authoritative voice', gender: 'male', age: 'middle', style: 'narrative' },
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Clear, professional', gender: 'female', age: 'young', style: 'professional' },
    { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', description: 'Energetic, youthful', gender: 'male', age: 'young', style: 'energetic' },
    { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', description: 'Strong, confident', gender: 'female', age: 'middle', style: 'confident' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Soft, warm', gender: 'female', age: 'young', style: 'warm' },
    { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', description: 'Rich, storytelling', gender: 'male', age: 'middle', style: 'storytelling' },
    { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', description: 'Cheerful, bright', gender: 'female', age: 'young', style: 'cheerful' },
    { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', description: 'Casual, friendly', gender: 'male', age: 'young', style: 'casual' },
  ];

  const selectedVoice = voices.find(v => v.id === settings.voiceId) || voices[0];

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Mic className="w-5 h-5 text-purple-400" />
          Voice Studio
        </h2>
        <p className="text-xs text-gray-500">Powered by ElevenLabs AI</p>
      </div>

      {/* Voice Selection */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Voice Character
        </label>
        
        <button
          onClick={() => setShowVoiceLibrary(true)}
          className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl p-4 hover:border-purple-500 transition group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center group-hover:bg-purple-500/20 transition">
              {selectedVoice.gender === 'male' ? (
                <User className="w-5 h-5 text-purple-400" />
              ) : (
                <UserCircle className="w-5 h-5 text-purple-400" />
              )}
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-white">{selectedVoice.name}</div>
              <div className="text-xs text-gray-500">{selectedVoice.description}</div>
            </div>
            <div className="flex gap-1">
              <span className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full">
                {selectedVoice.gender}
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full capitalize">
                {selectedVoice.style}
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Voice Library Modal */}
      {showVoiceLibrary && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">Voice Library</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {voices.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => {
                    onSettingsChange({ voiceId: voice.id });
                    setShowVoiceLibrary(false);
                  }}
                  className={`p-4 rounded-xl border-2 transition text-left ${
                    settings.voiceId === voice.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-700 bg-[#252525] hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      settings.voiceId === voice.id ? 'bg-purple-500/20' : 'bg-gray-700/50'
                    }`}>
                      {voice.gender === 'male' ? (
                        <User className="w-5 h-5 text-gray-400" />
                      ) : (
                        <UserCircle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white text-sm mb-1">{voice.name}</div>
                      <div className="text-xs text-gray-500 mb-2">{voice.description}</div>
                      <div className="flex gap-1">
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-700/50 text-gray-400 rounded">
                          {voice.age}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-700/50 text-gray-400 rounded capitalize">
                          {voice.style}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowVoiceLibrary(false)}
              className="w-full px-4 py-2.5 bg-[#252525] hover:bg-[#303030] text-white rounded-lg text-sm font-medium transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Speed Control */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Gauge className="w-3 h-3" />
            Speed
          </span>
          <span className="font-mono text-white text-sm">{settings.speed.toFixed(2)}x</span>
        </label>
        
        <div className="space-y-2">
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.05"
            value={settings.speed}
            onChange={(e) => onSettingsChange({ speed: parseFloat(e.target.value) })}
            className="w-full accent-purple-500"
          />
          <div className="flex justify-between text-[10px] text-gray-600 px-1">
            <span>Slower</span>
            <span>Normal</span>
            <span>Faster</span>
          </div>
        </div>
      </div>

      {/* Pitch Control */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Volume2 className="w-3 h-3" />
            Pitch
          </span>
          <span className="font-mono text-white text-sm">{settings.pitch.toFixed(2)}x</span>
        </label>
        
        <div className="space-y-2">
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.05"
            value={settings.pitch}
            onChange={(e) => onSettingsChange({ pitch: parseFloat(e.target.value) })}
            className="w-full accent-purple-500"
          />
          <div className="flex justify-between text-[10px] text-gray-600 px-1">
            <span>Lower</span>
            <span>Normal</span>
            <span>Higher</span>
          </div>
        </div>
      </div>

      {/* Stability */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="w-3 h-3" />
            Stability
          </span>
          <span className="font-mono text-white text-sm">{Math.round(settings.stability * 100)}%</span>
        </label>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={settings.stability}
          onChange={(e) => onSettingsChange({ stability: parseFloat(e.target.value) })}
          className="w-full accent-purple-500"
        />
        <p className="text-[10px] text-gray-600">
          Higher stability = More consistent voice
        </p>
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating || !script}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 transition shadow-lg shadow-purple-900/20"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Voice...
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" />
            Generate Voiceover
          </>
        )}
      </button>

      {/* Script Length Info */}
      {script && (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-xs text-gray-400">
          <div className="flex justify-between mb-1">
            <span>Script length:</span>
            <span className="text-white font-medium">{script.length} characters</span>
          </div>
          <div className="flex justify-between">
            <span>Est. duration:</span>
            <span className="text-white font-medium">
              ~{Math.round(script.length / 15)} seconds
            </span>
          </div>
        </div>
      )}

      {/* Preview Audio */}
      {previewUrl && (
        <div className="space-y-3 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/30 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-sm text-purple-200 font-medium">Preview Ready</span>
            </div>
            <button
              onClick={onApply}
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition"
            >
              Apply to Timeline
            </button>
          </div>
          
          <audio
            controls
            src={previewUrl}
            className="w-full h-10 rounded-lg"
            style={{ filter: 'invert(1) hue-rotate(180deg)' }}
          />
          
          <div className="flex gap-2 text-[10px] text-gray-500">
            <button
              onClick={onGenerate}
              className="flex-1 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#252525] rounded text-gray-400 hover:text-white transition"
            >
              Regenerate
            </button>
            <button
              onClick={() => {
                const a = document.createElement('a');
                a.href = previewUrl;
                a.download = 'voiceover.mp3';
                a.click();
              }}
              className="flex-1 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#252525] rounded text-gray-400 hover:text-white transition"
            >
              Download
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default EnhancedVoicePanel;