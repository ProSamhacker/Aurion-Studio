'use client';

import { useState, useRef, useEffect } from 'react';
import { useTimelineStore } from '@/core/stores/useTimelineStore';
import { FFmpegClient } from '@/core/ffmpeg/client';
import { compressVideo, mergeAudioWithVideo } from '@/core/ffmpeg/actions';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToolPanel } from '@/components/layout/ToolPanel';
import { RemotionPlayer } from '@/components/editor/RemotionPlayer';
import { Download, Loader2, Play, Pause, Square, Music, Type, Video as VideoIcon, Scissors, UploadCloud } from 'lucide-react';

export default function StudioPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const [activeTool, setActiveTool] = useState('upload');
  
  // Logic States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [previewVoiceUrl, setPreviewVoiceUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  
  const COMPRESSION_THRESHOLD = 100 * 1024 * 1024; 

  // Store
  const { 
    setOriginalVideo, originalVideoUrl, setScript, appendScript, generatedScript,
    audioUrl, setAudio, captions, setCaptions,
    isPlaying, setIsPlaying, currentTime, setCurrentTime, duration, setDuration
  } = useTimelineStore();

  useEffect(() => {
    FFmpegClient.getInstance().then(() => setReady(true)).catch(e => console.error(e));
  }, []);

  // Helper: Format seconds into MM:SS.ms
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset states
    const url = URL.createObjectURL(file);
    setOriginalVideo(url);
    setCaptions([]);
    setAudio("");
    setPreviewVoiceUrl(null);
    setCurrentTime(0);
    setIsPlaying(false);
    
    // Load duration metadata
    const video = document.createElement('video');
    video.src = url;
    video.onloadedmetadata = () => {
        if(isFinite(video.duration)) setDuration(video.duration);
    };
    
    setActiveTool('script'); 
    await analyzeVideo(file);
  };

  const analyzeVideo = async (file: File) => {
    setIsAnalyzing(true);
    const { setScript, appendScript } = useTimelineStore.getState();
    try {
      let base64Video = "";
      if (file.size > COMPRESSION_THRESHOLD) {
        setIsProcessing(true); setProgress(0);
        const rawUrl = URL.createObjectURL(file);
        const compressedBlob = await compressVideo(rawUrl, (pct) => setProgress(pct));
        base64Video = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(compressedBlob);
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
        });
        setIsProcessing(false); 
      } else {
        base64Video = await fileToBase64(file);
      }

      // Restored original prompt to prevent summary generation
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        body: JSON.stringify({ 
            prompt: "Analyze this video and write a synchronized voiceover script. format: **(0:00 - 0:00)** \"Spoken Text\". Do not provide a summary, mood, or intro text. Output ONLY the script.",
            videoData: base64Video, 
            mimeType: file.type 
        }),
      });
      
      if (!response.ok) throw new Error("API Error");
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;
      
      setScript(''); 
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
       let chunk = decoder.decode(value, { stream: true });
        
        // Clean markdown
        chunk = chunk
            .replace(/[#"*]/g, "")      
            .replace(/\*\*/g, "")       
            .replace(/###/g, "")        
            .replace(/^Title:/gm, "")   
            .replace(/^Summary:/gm, "") 

        appendScript(chunk);
      }
    } catch (err) { console.error(err); } 
    finally { setIsAnalyzing(false); setIsProcessing(false); }
  };

 const handleGenerateVoice = async () => {
    if (!generatedScript) return;
    setIsGeneratingVoice(true);
    
    try {
       const lines = generatedScript.split('\n');
       // Fix: Strip timestamp instead of removing the whole line
       const cleanLines = lines
        .map(line => line.replace(/^[\s-]*[\(\[]?\d{1,2}:\d{2}(?:.*?)[\)\]]?:?\s*/, "").trim())
        .filter(line => line.length > 0);

       const textToRead = cleanLines.join(' ');
       if (textToRead.length < 2) throw new Error("Script is empty.");

       const response = await fetch('/api/ai/voice', {
         method: 'POST',
         body: JSON.stringify({ text: textToRead, voiceId: "pNInz6obpgDQGcFmaJgB" }),
       });
       
       if (!response.ok) throw new Error('Failed');
       const blob = await response.blob();
       setPreviewVoiceUrl(URL.createObjectURL(blob));
       
    } catch (e) { 
        alert("Voice generation failed"); 
        console.error(e); 
    } finally { 
        setIsGeneratingVoice(false); 
    }
  };

  const handleApplyVoice = () => {
      if (previewVoiceUrl) {
          setAudio(previewVoiceUrl);
          setCaptions([]); 
          setPreviewVoiceUrl(null); 
      }
  };

  const handleAutoCaption = async () => {
    let mediaToTranscribe = audioUrl || originalVideoUrl;
    let mimeType = audioUrl ? 'audio/mpeg' : 'video/mp4';
    if (!mediaToTranscribe) return;
    setIsTranscribing(true);
    try {
       const responseMedia = await fetch(mediaToTranscribe);
       const blob = await responseMedia.blob();
       const base64Data = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
       });

       const response = await fetch('/api/ai/transcribe', {
         method: 'POST',
         body: JSON.stringify({ mediaData: base64Data, mimeType: mimeType }),
       });
       
       const data = await response.json();
       setCaptions(data.captions.map((c: any) => ({ ...c, start: parseFloat(c.start), end: parseFloat(c.end) })));
    } catch (e) { alert("Transcription failed"); } 
    finally { setIsTranscribing(false); }
  };

  const handleFinalExport = async () => {
      if (!originalVideoUrl || !audioUrl) return;
      setIsProcessing(true);
      try {
        const finalUrl = await mergeAudioWithVideo(originalVideoUrl, audioUrl, (pct) => setProgress(pct));
        const a = document.createElement('a'); a.href = finalUrl; a.download = 'final.mp4'; a.click();
      } catch (e) { alert("Export failed"); } finally { setIsProcessing(false); }
  };

  // --- INTERACTIVE TIMELINE HANDLERS ---
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    // Calculate percentage (0 to 1) based on click position
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    // Update store
    setCurrentTime(percentage * duration);
  };

  const handleTimelineScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only scrub if the primary mouse button is held down
    if (e.buttons === 1) handleTimelineClick(e); 
  };

  // --- RENDER ---
  return (
    <div className="flex h-screen bg-[#0E0E0E] text-white overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* ZONE A: SIDEBAR */}
      <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />

      {/* ZONE B: TOOL PANEL */}
      <ToolPanel 
         activeTool={activeTool}
         isAnalyzing={isAnalyzing}
         isGeneratingVoice={isGeneratingVoice}
         isTranscribing={isTranscribing}
         previewVoiceUrl={previewVoiceUrl}
         handleGenerateVoice={handleGenerateVoice}
         handleApplyVoice={handleApplyVoice}
         handleAutoCaption={handleAutoCaption}
         fileInputRef={fileInputRef}
         handleFileSelect={handleFileSelect}
      />

      {/* ZONE C: MAIN STAGE */}
      <div className="flex-1 flex flex-col relative min-w-0">
        
        {/* Header with Player Controls */}
        <div className="h-14 border-b border-[#1f1f1f] flex items-center justify-between px-6 bg-[#0F0F0F]">
            <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-gray-400">Project: Aura Studio</span>
                <div className="h-6 w-px bg-gray-800"></div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 hover:bg-gray-800 rounded-full transition">
                        {isPlaying ? <Pause className="w-4 h-4 fill-white"/> : <Play className="w-4 h-4 fill-white"/>}
                    </button>
                    <button onClick={() => { setIsPlaying(false); setCurrentTime(0); }} className="p-2 hover:bg-gray-800 rounded-full transition">
                        <Square className="w-3 h-3 fill-white"/>
                    </button>
                    <span className="text-sm font-mono font-medium text-purple-400 min-w-[80px]">
                        {formatTime(currentTime)}
                    </span>
                </div>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={handleFinalExport}
                    disabled={isProcessing || !audioUrl}
                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2"
                >
                    {isProcessing ? <Loader2 className="animate-spin w-3 h-3"/> : <Download className="w-3 h-3"/>}
                    Export
                </button>
            </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-[#0a0a0a] p-8 flex flex-col items-center justify-center relative">
             {!originalVideoUrl ? (
                <div className="text-center text-gray-600">
                    <div className="w-16 h-16 bg-[#141414] rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-800">
                        <UploadCloud className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-sm">Select "Media" in the sidebar to upload</p>
                </div>
             ) : (
                <div className="w-full max-w-5xl aspect-video shadow-2xl shadow-black ring-1 ring-gray-800 rounded-lg overflow-hidden relative bg-black">
                    <RemotionPlayer />
                    {isProcessing && (
                         <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
                             <p className="text-white font-medium animate-pulse mb-2">Processing...</p>
                             <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 transition-all" style={{width: `${progress}%`}}></div>
                             </div>
                         </div>
                    )}
                </div>
             )}
        </div>

        {/* ZONE D: TIMELINE (Clipchamp Style) */}
        <div className="h-72 bg-[#121212] border-t border-[#1f1f1f] flex flex-col select-none relative">
            
            {/* 1. Time Ruler */}
            <div className="h-8 border-b border-gray-800 flex items-end px-4 relative overflow-hidden">
                {/* Generate 20 tick marks */}
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="flex-1 border-l border-gray-700 h-2 relative">
                        <span className="absolute -top-4 left-1 text-[9px] text-gray-500 font-mono">
                            {formatTime((duration / 20) * i)}
                        </span>
                    </div>
                ))}
            </div>

            {/* 2. Tracks Container */}
            <div 
                ref={timelineRef}
                className="flex-1 p-4 space-y-2 relative overflow-hidden overflow-x-auto cursor-pointer"
                onMouseDown={handleTimelineClick}
                onMouseMove={handleTimelineScrub}
            >
                {/* Dynamic Playhead Line */}
                <div 
                    className="absolute top-0 bottom-0 w-px bg-white z-50 pointer-events-none transition-transform duration-75 ease-linear"
                    style={{ left: `${(currentTime / duration) * 100}%` }}
                >
                    <div className="absolute -top-3 -left-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white"></div>
                </div>

                {/* Track 1: Video */}
                {originalVideoUrl && (
                    <div className="h-12 bg-[#1E1E1E] rounded-lg border border-gray-700 relative overflow-hidden group">
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 gap-1">
                             <VideoIcon className="w-4 h-4"/>
                        </div>
                        <div className="absolute inset-y-0 left-0 bg-purple-500/20 w-full border-l-4 border-purple-500">
                            <span className="text-[10px] text-purple-200 font-bold px-2 py-1 block">Original Video</span>
                        </div>
                    </div>
                )}

                {/* Track 2: AI Voiceover */}
                {audioUrl && (
                    <div className="h-12 bg-[#1E1E1E] rounded-lg border border-gray-700 relative overflow-hidden group animate-in slide-in-from-left-2">
                        <div className="absolute inset-y-0 left-0 w-full bg-blue-500/20 border-l-4 border-blue-500 flex items-center">
                            <Music className="w-3 h-3 text-blue-300 ml-2 mr-2"/>
                            <span className="text-[10px] text-blue-200 font-bold">AI Voiceover</span>
                            <div className="flex gap-0.5 ml-4 h-4 items-center opacity-50">
                                {[...Array(40)].map((_,i) => <div key={i} className="w-1 bg-blue-400 rounded-full" style={{height: `${Math.random()*100}%`}}></div>)}
                            </div>
                        </div>
                    </div>
                )}

                {/* Track 3: Captions */}
                {captions.length > 0 && (
                    <div className="h-8 bg-[#1E1E1E] rounded-lg border border-gray-700 relative overflow-hidden flex items-center">
                        <div className="absolute inset-y-0 left-0 w-full bg-yellow-500/10 border-l-4 border-yellow-500 flex items-center">
                             <Type className="w-3 h-3 text-yellow-500 ml-2 mr-2"/>
                             <span className="text-[10px] text-yellow-200 font-bold">Subtitles ({captions.length} segments)</span>
                        </div>
                        {/* Visual Caption Segments */}
                        {captions.map((cap, i) => (
                            <div 
                                key={i} 
                                className="absolute top-1 bottom-1 bg-yellow-500/40 border border-yellow-500/50 rounded-sm"
                                style={{
                                    left: `${(cap.start / duration) * 100}%`,
                                    width: `${((cap.end - cap.start) / duration) * 100}%`
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}