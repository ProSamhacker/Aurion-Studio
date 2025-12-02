import { useTimelineStore } from '@/core/stores/useTimelineStore';
import { Loader2, Mic, Wand2, CheckCircle, Bot, Clock, RefreshCw } from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import EnhancedVoicePanel from '@/components/NEW/VoiceControlPanel';
import CaptionStyleEditor from '@/components/NEW/CaptionStyleEditor';

interface ToolPanelProps {
  activeTool: string;
  isAnalyzing: boolean;
  isGeneratingVoice: boolean;
  isTranscribing: boolean;
  previewVoiceUrl: string | null;
  handleGenerateVoice: () => void;
  handleApplyVoice: () => void;
  handleAutoCaption: () => void;
  handleRegenerateScript: () => void; // NEW PROP
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ToolPanel = ({ 
  activeTool, isAnalyzing, isGeneratingVoice, isTranscribing, previewVoiceUrl,
  handleGenerateVoice, handleApplyVoice, handleAutoCaption, handleRegenerateScript,
  fileInputRef, handleFileSelect 
}: ToolPanelProps) => {
  
  const { 
    generatedScript, setScript, audioUrl, captions, 
    voiceSettings, setVoiceSettings,
    defaultCaptionStyle, setDefaultCaptionStyle, updateCaption, originalVideoUrl
  } = useTimelineStore();

  const handleLineUpdate = (index: number, newText: string, timestamp: string | null) => {
    const lines = generatedScript.split('\n');
    lines[index] = timestamp ? `(${timestamp}) ${newText}` : newText;
    setScript(lines.join('\n'));
  };

  return (
    <div className="w-[360px] bg-[#141414] border-r border-[#1f1f1f] h-screen overflow-y-auto flex flex-col shrink-0 z-20 transition-all duration-300">
      
      {/* --- 1. MEDIA UPLOAD PANEL --- */}
      {activeTool === 'upload' && (
        <div className="p-6">
          <h2 className="text-lg font-bold text-white mb-6">Project Media</h2>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-700 rounded-xl h-40 flex flex-col items-center justify-center bg-[#1a1a1a] hover:bg-[#202020] hover:border-purple-500 cursor-pointer transition group"
          >
            <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileSelect} />
            <div className="bg-[#252525] p-3 rounded-full mb-3 group-hover:scale-110 transition">
                <Wand2 className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-sm text-gray-400 font-medium">Upload Video</p>
            <p className="text-xs text-gray-600 mt-1">Auto-Compress & Analyze</p>
          </div>
        </div>
      )}

      {/* --- 2. SCRIPT EDITOR PANEL --- */}
      {activeTool === 'script' && (
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-[#1f1f1f] sticky top-0 bg-[#141414] z-10 flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-white">AI Script</h2>
              <p className="text-xs text-gray-500 mt-1">
                  {isAnalyzing ? "Analyzing footage..." : "Edit text segments below."}
              </p>
            </div>
            
            {/* NEW: Regenerate Button */}
            <button 
              onClick={handleRegenerateScript}
              disabled={isAnalyzing || !originalVideoUrl}
              className="p-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-gray-400 hover:text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed group"
              title="Regenerate Script"
            >
              <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            </button>
          </div>
          
          <div className="flex-1 p-4 space-y-3">
            {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center h-64 text-purple-400 space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-sm font-medium animate-pulse">Gemini is watching...</span>
                </div>
            ) : generatedScript ? (
                generatedScript.split('\n').map((line, index) => {
                    if (!line.trim()) return null;
                    const match = line.match(/^[\s-]*[\(\[]?(\d{1,2}:\d{2}(?:\s*[-–]\s*\d{1,2}:\d{2})?)[\)\]]?:?\s*/);
                    const timestamp = match ? match[1] : null;
                    const fullPrefix = match ? match[0] : "";
                    const textContent = line.replace(fullPrefix, "").trim();

                    return (
                        <div key={index} className="group bg-[#1a1a1a] border border-gray-800 hover:border-gray-600 rounded-xl p-3 transition-all relative">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 border border-purple-500/20 select-none">
                                    <Clock className="w-3 h-3" />
                                    {timestamp || "Auto"}
                                </div>
                            </div>
                            <textarea 
                                className="w-full bg-transparent text-gray-200 text-sm leading-relaxed outline-none resize-none font-medium h-auto overflow-hidden placeholder-gray-600"
                                value={textContent}
                                rows={Math.max(2, Math.ceil(textContent.length / 35))}
                                onChange={(e) => handleLineUpdate(index, e.target.value, timestamp)}
                            />
                        </div>
                    );
                })
            ) : (
                <div className="text-center text-gray-600 mt-10 text-sm italic">
                    Upload a video to generate a script.
                </div>
            )}
          </div>
        </div>
      )}

      {/* --- 3. VOICE STUDIO PANEL --- */}
      {activeTool === 'voice' && (
        <EnhancedVoicePanel
          settings={voiceSettings}
          onSettingsChange={setVoiceSettings}
          onGenerate={handleGenerateVoice}
          isGenerating={isGeneratingVoice}
          previewUrl={previewVoiceUrl}
          onApply={handleApplyVoice}
          script={generatedScript}
        />
      )}

      {/* --- 4. CAPTION EDITOR PANEL --- */}
      {activeTool === 'captions' && (
        <div className="flex flex-col h-full">
          <CaptionStyleEditor
            style={defaultCaptionStyle}
            onChange={setDefaultCaptionStyle}
          />
          <div className="flex-1 overflow-y-auto p-4 space-y-2 border-t border-[#1f1f1f] mt-4">
            <h3 className="text-sm font-bold text-white mb-2">Caption Text</h3>
            {captions.length === 0 ? (
                <button 
                    onClick={handleAutoCaption}
                    disabled={isTranscribing}
                    className="w-full py-8 border-2 border-dashed border-gray-800 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-purple-500 hover:text-purple-400 transition"
                >
                    {isTranscribing ? <Loader2 className="w-5 h-5 animate-spin mb-2" /> : <Bot className="w-5 h-5 mb-2" />}
                    {isTranscribing ? "Transcribing..." : "Auto-Generate Captions"}
                </button>
            ) : (
                captions.map((cap, i) => (
                    <div key={i} className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-800">
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1 font-mono">
                            <span>{cap.start.toFixed(2)}s</span>
                            <span>{cap.end.toFixed(2)}s</span>
                        </div>
                        <textarea
                            value={cap.text}
                            onChange={(e) => updateCaption(i, { text: e.target.value })}
                            className="w-full bg-transparent text-sm text-gray-200 outline-none resize-none"
                            rows={2}
                        />
                    </div>
                ))
            )}
          </div>
        </div>
      )}
     
    </div>
  );
};