import React, { useState } from 'react';
import { Zap, Sliders, Wand2, Check, X } from 'lucide-react';

interface SmartAlignOptions {
  autoSyncCaptions: boolean;
  trimSilence: boolean;
  beatSyncCuts: boolean;
}

interface SmartAlignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (options: SmartAlignOptions) => void;
  isProcessing?: boolean;
}

const SmartAlignModal: React.FC<SmartAlignModalProps> = ({ 
  isOpen, 
  onClose, 
  onApply,
  isProcessing = false 
}) => {
  const [options, setOptions] = useState<SmartAlignOptions>({
    autoSyncCaptions: true,
    trimSilence: true,
    beatSyncCuts: false,
  });

  if (!isOpen) return null;

  const toggleOption = (key: keyof SmartAlignOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-[#1a1a1a] border border-cyan-500/30 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl shadow-cyan-900/20 scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-cyan-500/30">
            <Zap className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">Smart Alignment</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Use AI to automatically synchronize your audio, captions, and visuals for a professional flow.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Options Grid */}
        <div className="space-y-3 mb-8">
          
          {/* Option 1: Auto-sync */}
          <div 
            onClick={() => toggleOption('autoSyncCaptions')}
            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
              options.autoSyncCaptions 
                ? 'bg-cyan-950/30 border-cyan-500/50' 
                : 'bg-[#252525] border-gray-800 hover:border-gray-700'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              options.autoSyncCaptions ? 'bg-cyan-500/20' : 'bg-gray-800'
            }`}>
              <Sliders className={`w-5 h-5 ${options.autoSyncCaptions ? 'text-cyan-400' : 'text-gray-500'}`} />
            </div>
            <div className="flex-1">
              <div className={`text-sm font-bold mb-0.5 ${options.autoSyncCaptions ? 'text-white' : 'text-gray-300'}`}>
                Auto-sync Captions
              </div>
              <div className="text-xs text-gray-500">
                Match caption start/end times to speech pace
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
              options.autoSyncCaptions ? 'bg-cyan-500 border-cyan-500' : 'border-gray-600'
            }`}>
              {options.autoSyncCaptions && <Check className="w-3 h-3 text-black stroke-[4]" />}
            </div>
          </div>

          {/* Option 2: Trim Silence */}
          <div 
            onClick={() => toggleOption('trimSilence')}
            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
              options.trimSilence 
                ? 'bg-cyan-950/30 border-cyan-500/50' 
                : 'bg-[#252525] border-gray-800 hover:border-gray-700'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              options.trimSilence ? 'bg-cyan-500/20' : 'bg-gray-800'
            }`}>
              <Wand2 className={`w-5 h-5 ${options.trimSilence ? 'text-cyan-400' : 'text-gray-500'}`} />
            </div>
            <div className="flex-1">
              <div className={`text-sm font-bold mb-0.5 ${options.trimSilence ? 'text-white' : 'text-gray-300'}`}>
                Trim Silence
              </div>
              <div className="text-xs text-gray-500">
                Automatically cut dead air and long pauses
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
              options.trimSilence ? 'bg-cyan-500 border-cyan-500' : 'border-gray-600'
            }`}>
              {options.trimSilence && <Check className="w-3 h-3 text-black stroke-[4]" />}
            </div>
          </div>

          {/* Option 3: Beat Sync */}
          <div 
            onClick={() => toggleOption('beatSyncCuts')}
            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
              options.beatSyncCuts 
                ? 'bg-cyan-950/30 border-cyan-500/50' 
                : 'bg-[#252525] border-gray-800 hover:border-gray-700'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              options.beatSyncCuts ? 'bg-cyan-500/20' : 'bg-gray-800'
            }`}>
              <Zap className={`w-5 h-5 ${options.beatSyncCuts ? 'text-cyan-400' : 'text-gray-500'}`} />
            </div>
            <div className="flex-1">
              <div className={`text-sm font-bold mb-0.5 ${options.beatSyncCuts ? 'text-white' : 'text-gray-300'}`}>
                Beat Sync Cuts
              </div>
              <div className="text-xs text-gray-500">
                Align video scene cuts with audio rhythm
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
              options.beatSyncCuts ? 'bg-cyan-500 border-cyan-500' : 'border-gray-600'
            }`}>
              {options.beatSyncCuts && <Check className="w-3 h-3 text-black stroke-[4]" />}
            </div>
          </div>

        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-[#252525] hover:bg-[#303030] text-white rounded-xl text-sm font-bold transition"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={() => onApply(options)}
            disabled={isProcessing}
            className="flex-[2] px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                Apply Smart Alignment
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SmartAlignModal;