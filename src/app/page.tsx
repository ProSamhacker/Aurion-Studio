'use client';

import { useState, useRef, useEffect } from 'react';
import { UploadCloud, Sparkles, Download, Scissors, Loader2, Mic, PlayCircle } from 'lucide-react';
import { useTimelineStore } from '@/core/stores/useTimelineStore';
import { FFmpegClient } from '@/core/ffmpeg/client';
import { trimVideo, compressVideo } from '@/core/ffmpeg/actions';
import ReactMarkdown from 'react-markdown';
import { RemotionPlayer } from '@/components/editor/RemotionPlayer';

export default function DashboardPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  
  const COMPRESSION_THRESHOLD = 100 * 1024 * 1024; // 100MB

  const { 
    setOriginalVideo, 
    originalVideoUrl, 
    setScript, 
    appendScript, 
    generatedScript,
    audioUrl,      
    setAudio       
  } = useTimelineStore();

  useEffect(() => {
    FFmpegClient.getInstance()
      .then(() => setReady(true))
      .catch((e) => console.error("FFmpeg failed to load:", e));
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; 
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setOriginalVideo(objectUrl);

    await analyzeVideo(file);
  };

  const analyzeVideo = async (file: File) => {
    setIsAnalyzing(true);
    const { setScript, appendScript } = useTimelineStore.getState();
    
    try {
      let base64Video = "";

      // 1. SMART COMPRESSION
      if (file.size > COMPRESSION_THRESHOLD) {
        console.log(`⚠️ Large File (${(file.size/1024/1024).toFixed(0)}MB). Compressing...`);
        setIsProcessing(true);
        setProgress(0);

        const rawUrl = URL.createObjectURL(file);
        const compressedBlob = await compressVideo(rawUrl, (pct) => setProgress(pct));
        
        base64Video = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(compressedBlob);
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
        });
        
        setIsProcessing(false); 
      } else {
        console.log(`✅ Small File. Sending directly.`);
        base64Video = await fileToBase64(file);
      }

      // 2. SEND TO GEMINI
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        body: JSON.stringify({ 
          prompt: "Analyze this video. Give me a Summary, Mood, Title, and a Voiceover Script.",
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
        const text = decoder.decode(value, { stream: true });
        appendScript(text);
      }
    } catch (err) {
      console.error("Analysis failed:", err);
      alert("Analysis failed. Check console.");
    } finally {
      setIsAnalyzing(false);
      setIsProcessing(false);
    }
  };

  // --- SMART VOICE GENERATION ---
  const handleGenerateVoice = async () => {
    if (!generatedScript) return;
    setIsGeneratingVoice(true);
    
    try {
      let textToRead = generatedScript;

      // Robust Parser
      const headerRegex = /(?:^|\n)[#*]*\s*\d*\.?\s*.*(?:Script|Voiceover|Narration).*[:*#-]*\s*(?:\n|$)/i;
      const headerMatch = generatedScript.match(headerRegex);

      if (headerMatch && headerMatch.index !== undefined) {
        textToRead = generatedScript.substring(headerMatch.index + headerMatch[0].length);
      } else {
        const timeMatch = generatedScript.match(/\b\d{1,2}:\d{2}\b/);
        if (timeMatch && timeMatch.index !== undefined) {
             textToRead = generatedScript.substring(timeMatch.index);
        }
      }

      textToRead = textToRead
        .replace(/[\[\(]?\d{1,2}:\d{2}(?:[-–]\d{1,2}:\d{2})?[\]\)]?/g, "") 
        .replace(/[\[\(][^\]\)]*?[\]\)]/g, "")
        .replace(/[*#_`~]/g, "")
        .replace(/(?:Speaker|Narrator):/gi, "")
        .trim();

      console.log("🗣️ FINAL AUDIO TEXT:", textToRead);

      if (textToRead.length < 10) throw new Error("Script too short");

      const VOICE_ID = "pNInz6obpgDQGcFmaJgB"; // Adam
      
      const response = await fetch('/api/ai/voice', {
        method: 'POST',
        body: JSON.stringify({ text: textToRead, voiceId: VOICE_ID }),
      });

      if (!response.ok) throw new Error('Voice generation failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudio(url); 
      
    } catch (e) {
      console.error(e);
      alert("Voice generation failed. Check console.");
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  const handleExport = async () => {
    if (!originalVideoUrl) return;
    setIsProcessing(true);
    setProgress(0);

    try {
      const newUrl = await trimVideo(originalVideoUrl, 0, 5, (pct) => setProgress(pct));
      const a = document.createElement('a');
      a.href = newUrl;
      a.download = 'aura-export.mp4';
      a.click();
    } catch (e) {
      console.error(e);
      alert("Export failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          <div className="text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Aura Studio
            </h1>
            <p className="text-slate-400 text-sm">
              FFmpeg Engine: {ready ? <span className="text-green-400">Ready</span> : <span className="text-yellow-500">Loading...</span>}
            </p>
          </div>

          {!originalVideoUrl ? (
            <div 
              className="border-2 border-dashed border-slate-700 rounded-xl h-64 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-slate-900/50 transition cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileSelect} />
              <div className="bg-slate-800 p-4 rounded-full mb-4 group-hover:scale-110 transition">
                <UploadCloud className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold">Upload Raw Footage</h3>
            </div>
          ) : (
            <div className="space-y-4">
              {/* --- THE NEW REMOTION PLAYER ENGINE --- */}
              <div className="relative group">
                <RemotionPlayer />
                
                {/* PROGRESS OVERLAY */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 backdrop-blur-sm rounded-xl">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                    <p className="text-white font-medium animate-pulse">Processing Video...</p>
                    <div className="w-64 h-2 bg-gray-700 rounded-full mt-4 overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-2 font-mono">{progress}%</p>
                  </div>
                )}
              </div>

              <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold flex items-center gap-2"><Scissors className="w-4 h-4" /> Quick Actions</h3>
                </div>
                <button 
                  onClick={handleExport}
                  disabled={isProcessing || !ready}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-2 rounded-md font-medium flex items-center justify-center gap-2 transition"
                >
                  {isProcessing ? 'Processing...' : <><Download className="w-4 h-4" /> Trim First 5s & Download</>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 h-[600px] flex flex-col relative">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h2 className="font-semibold">Aura Director</h2>
            </div>
            
            {/* VOICE BUTTON */}
            {generatedScript && !audioUrl && (
               <button 
                 onClick={handleGenerateVoice}
                 disabled={isGeneratingVoice}
                 className="bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition border border-purple-500/30"
               >
                 {isGeneratingVoice ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mic className="w-3 h-3" />}
                 {isGeneratingVoice ? 'Generating Audio...' : 'Generate Voiceover'}
               </button>
            )}
          </div>

          {/* AUDIO PLAYER */}
          {audioUrl && (
            <div className="bg-purple-900/20 border border-purple-500/30 p-3 rounded-lg mb-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="bg-purple-500 p-2 rounded-full text-white">
                <PlayCircle className="w-5 h-5" />
              </div>
              <audio controls src={audioUrl} className="w-full h-8 opacity-90" />
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-2 relative">
            {isAnalyzing && !generatedScript && !isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full animate-pulse" />
                  <Loader2 className="w-12 h-12 text-blue-400 animate-spin relative z-10" />
                </div>
                <p className="mt-6 text-slate-300 font-medium animate-pulse tracking-wide">Watching Video & Writing Script...</p>
              </div>
            )}

            {generatedScript ? (
              <article className="prose prose-invert prose-sm max-w-none prose-headings:text-blue-400 prose-p:text-slate-300 prose-li:text-slate-300">
                <ReactMarkdown>{generatedScript}</ReactMarkdown>
              </article>
            ) : !isAnalyzing && (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 italic">
                <UploadCloud className="w-12 h-12 mb-4 opacity-20" />
                <p>Upload a video to generate script...</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}