import { useTimelineStore } from '@/core/stores/useTimelineStore';
import { Loader2, Mic, Bot, RefreshCw, Plus, Trash2, Edit3, Film, Image as ImageIcon, GripVertical } from 'lucide-react';
import EnhancedVoicePanel from '@/components/NEW/VoiceControlPanel';
import CaptionStyleEditor from '@/components/NEW/CaptionStyleEditor';
import React from 'react';

interface ToolPanelProps {
  activeTool: string;
  isAnalyzing: boolean;
  isGeneratingVoice: boolean;
  isTranscribing: boolean;
  previewVoiceUrl: string | null;
  handleGenerateVoice: () => void;
  handleApplyVoice: () => void;
  handleAutoCaption: () => void;
  handleRegenerateScript: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ToolPanel = ({ 
  activeTool, isAnalyzing, isGeneratingVoice, isTranscribing, previewVoiceUrl,
  handleGenerateVoice, handleApplyVoice, handleAutoCaption, handleRegenerateScript,
  fileInputRef, handleFileSelect 
}: ToolPanelProps) => {
  
  const { 
    generatedScript, setScript, captions, 
    voiceSettings, setVoiceSettings,
    defaultCaptionStyle, setDefaultCaptionStyle, updateCaption, 
    mediaLibrary, setOriginalVideo, originalVideoUrl
  } = useTimelineStore();

  const handleLineUpdate = (index: number, newText: string, timestamp: string | null) => {
    const lines = generatedScript.split('\n');
    lines[index] = timestamp ? `(${timestamp}) ${newText}` : newText;
    setScript(lines.join('\n'));
  };

  // Drag handler for media items
  const handleDragStart = (e: React.DragEvent, url: string) => {
     e.dataTransfer.setData('video/url', url);
     e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="w-[360px] bg-[#141414] border-r border-[#1f1f1f] h-screen flex flex-col shrink-0 z-20 transition-all duration-300">
      
      {/* --- 1. MEDIA LIBRARY PANEL --- */}
      {activeTool === 'upload' && (
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-[#1f1f1f] flex justify-between items-center bg-[#141414] sticky top-0 z-10">
            <h2 className="text-base font-bold text-white">Project Media</h2>
            <span className="text-[10px] text-gray-500 bg-[#1a1a1a] px-2 py-1 rounded-full border border-gray-800">{mediaLibrary.length} assets</span>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto modern-scrollbar space-y-4">
            {/* Upload Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-gray-700 rounded-xl h-24 flex flex-col items-center justify-center bg-[#1a1a1a] hover:bg-[#202020] hover:border-purple-500 cursor-pointer transition group"
            >
              <input type="file" ref={fileInputRef} className="hidden" accept="video/*,image/*" multiple onChange={handleFileSelect} />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center group-hover:bg-purple-500/20 transition">
                   <Plus className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-xs font-bold text-gray-300 group-hover:text-white">Import Media</span>
              </div>
            </div>

            {/* Media Menu List (Draggable) */}
            <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Library (Drag to Timeline)</p>
                {mediaLibrary.map((media) => (
                    <div 
                        key={media.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, media.url)}
                        onClick={() => media.type === 'video' && setOriginalVideo(media.url)}
                        className={`flex items-center gap-3 p-2 rounded-lg border cursor-grab active:cursor-grabbing group hover:bg-[#202020] transition ${
                            originalVideoUrl === media.url ? 'bg-[#1a1a1a] border-purple-500/50' : 'bg-transparent border-transparent hover:border-gray-800'
                        }`}
                    >
                        {/* Thumbnail */}
                        <div className="w-16 h-10 bg-black rounded overflow-hidden relative border border-gray-800 shrink-0">
                             {media.type === 'video' ? (
                                <video src={media.url} className="w-full h-full object-cover opacity-80" />
                             ) : (
                                <img src={media.url} alt="" className="w-full h-full object-cover opacity-80" />
                             )}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className={`text-xs truncate font-medium ${originalVideoUrl === media.url ? 'text-purple-400' : 'text-gray-300'}`}>
                                {media.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] text-gray-500 uppercase bg-white/5 px-1.5 rounded flex items-center gap-1">
                                    {media.type === 'video' ? <Film className="w-2 h-2"/> : <ImageIcon className="w-2 h-2"/>}
                                    {media.type}
                                </span>
                            </div>
                        </div>

                        {/* Drag Handle */}
                        <GripVertical className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* --- 2. SCRIPT EDITOR PANEL --- */}
      {activeTool === 'script' && (
        <div className="flex flex-col h-full">
           <div className="p-5 border-b border-[#1f1f1f] sticky top-0 bg-[#141414] z-10 flex justify-between items-center">
             <h2 className="text-base font-bold text-white">AI Script</h2>
             <button onClick={handleRegenerateScript} className="p-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-lg transition"><RefreshCw className="w-3.5 h-3.5" /></button>
           </div>
           
           <div className="flex-1 p-4 overflow-y-auto modern-scrollbar space-y-3">
               {generatedScript ? (
                  generatedScript.split('\n').map((line, i) => {
                    if (!line.trim()) return null;
                    return (
                        <div key={i} className="group bg-[#1a1a1a] border border-gray-800 rounded-xl p-3">
                             <textarea 
                                className="w-full bg-transparent text-gray-200 text-sm outline-none resize-none"
                                value={line} 
                                rows={Math.max(2, Math.ceil(line.length / 35))}
                                onChange={(e) => handleLineUpdate(i, e.target.value, null)}
                             />
                        </div>
                    );
                  })
               ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 text-xs text-center p-6">
                      <Edit3 className="w-8 h-8 opacity-20 mb-2"/>
                      Video must be analyzed first to generate script.
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
        <div className="flex flex-col h-full bg-[#141414]">
          <div className="p-5 border-b border-[#1f1f1f]">
             <h2 className="text-base font-bold text-white mb-1">Captions</h2>
             <p className="text-[10px] text-gray-500">Auto-transcribe and style</p>
          </div>

          <div className="flex-1 overflow-y-auto modern-scrollbar">
            {captions.length === 0 ? (
               /* Empty State: Only show Generate Button */
               <div className="h-full flex flex-col items-center justify-center p-6 space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full flex items-center justify-center border border-purple-500/20">
                      <Bot className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-center space-y-1">
                      <h3 className="text-sm font-bold text-white">Generate Captions</h3>
                      <p className="text-[10px] text-gray-500 max-w-[200px] mx-auto leading-relaxed">
                          AI will analyze your audio track to create perfectly synced subtitles.
                      </p>
                  </div>
                  
                  <button 
                    onClick={handleAutoCaption}
                    disabled={isTranscribing}
                    className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition shadow-lg shadow-purple-900/10"
                  >
                    {isTranscribing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />}
                    <span>{isTranscribing ? "Transcribing..." : "Generate Now"}</span>
                  </button>
               </div>
            ) : (
                /* Editor UI: Shows ONLY after generation */
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    
                    {/* Style Editor (Always visible after gen) */}
                    <CaptionStyleEditor
                        style={defaultCaptionStyle}
                        onChange={setDefaultCaptionStyle}
                    />
                    
                    {/* Transcript List */}
                    <div className="p-4 space-y-2">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Transcript</span>
                            <button 
                                onClick={handleAutoCaption} 
                                className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                            >
                                <RefreshCw className="w-3 h-3"/> Regenerate
                            </button>
                        </div>
                        
                        {captions.map((cap, i) => (
                            <div key={i} className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition group focus-within:border-purple-500/50">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 rounded">{cap.start.toFixed(1)}s - {cap.end.toFixed(1)}s</span>
                                    <button 
                                        onClick={() => {
                                            const newCaps = [...captions];
                                            newCaps.splice(i, 1);
                                            useTimelineStore.getState().setCaptions(newCaps);
                                        }}
                                        className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                                <textarea
                                    value={cap.text}
                                    onChange={(e) => updateCaption(i, { text: e.target.value })}
                                    className="w-full bg-transparent text-xs text-gray-200 outline-none resize-none leading-relaxed"
                                    rows={Math.max(1, Math.ceil(cap.text.length / 30))}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};