// src/app/project/[projectId]/page.tsx - VIDEO PERSISTENCE FIX
'use client';

import { useState, useRef, useEffect } from 'react';
import { useTimelineStore } from '@/core/stores/useTimelineStore';
import { FFmpegClient } from '@/core/ffmpeg/client';
import { compressVideo, mergeAudioWithVideo } from '@/core/ffmpeg/actions';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToolPanel } from '@/components/layout/ToolPanel';
import { Canvas } from '@/components/studio/Canvas'; 
import { Timeline } from '@/components/studio/Timeline';
import { TimelineControls } from '@/components/studio/TimelineControls';
import { Download, Loader2, AlertCircle } from 'lucide-react';

export default function StudioPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTool, setActiveTool] = useState('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [previewVoiceUrl, setPreviewVoiceUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  
  // NEW: Upload tracking
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const COMPRESSION_THRESHOLD = 100 * 1024 * 1024; 

  const { 
    setOriginalVideo, originalVideoUrl, setScript, appendScript, generatedScript,
    audioUrl, setAudio, setCaptions,
    setIsPlaying, setCurrentTime, setDuration
  } = useTimelineStore();

  useEffect(() => {
    FFmpegClient.getInstance().then(() => setReady(true)).catch(e => console.error(e));
  }, []);

  // NEW: Warn user before leaving if upload in progress
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isUploading || hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Upload in progress. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isUploading, hasUnsavedChanges]);

  // NEW: Check for missing video on load
  useEffect(() => {
    if (originalVideoUrl && originalVideoUrl.startsWith('blob:')) {
      console.warn('⚠️ Blob URL detected on page load - video will not persist');
      // Clear it since blob URLs don't work after refresh
      setOriginalVideo('');
    }
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
    });
  };

  const extractVideoDuration = (videoUrl: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      
      video.onloadedmetadata = () => {
        const duration = video.duration;
        console.log('📹 Video duration extracted:', duration);
        video.remove();
        
        if (duration && isFinite(duration) && duration > 0) {
          resolve(duration);
        } else {
          reject(new Error('Invalid video duration'));
        }
      };
      
      video.onerror = () => {
        video.remove();
        reject(new Error('Failed to load video metadata'));
      };
      
      video.src = videoUrl;
      video.load();
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('📁 File selected:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
    setHasUnsavedChanges(true);

    // 1. Create local preview URL (temporary)
    const localUrl = URL.createObjectURL(file);
    setOriginalVideo(localUrl);

    // 2. Extract duration
    try {
      const duration = await extractVideoDuration(localUrl);
      setDuration(duration);
      console.log('✅ Duration set to:', duration);
    } catch (error) {
      console.error('❌ Failed to extract duration:', error);
      setDuration(60);
    }
    
    // 3. Upload to Drive IMMEDIATELY (blocking with better UX)
    const driveUrl = await uploadToDrive(file);
    
    if (driveUrl) {
      // Replace temporary blob URL with permanent Drive URL
      setOriginalVideo(driveUrl);
      setHasUnsavedChanges(false);
      console.log('✅ Video persisted to Drive:', driveUrl);
    } else {
      console.warn('⚠️ Drive upload failed - video will not persist on refresh');
    }
    
    // 4. Switch to script tab and start analysis
    setActiveTool('script');
    await analyzeVideo(file);
  };

  const uploadToDrive = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      console.log('☁️ Uploading to Google Drive...');
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress (since fetch doesn't support upload progress easily)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (!res.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await res.json();
      console.log('✅ Upload complete:', data.url);
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
      
      return data.url;
    } catch (error) {
      console.error('❌ Drive upload failed:', error);
      setIsUploading(false);
      setUploadProgress(0);
      return null;
    }
  };

  const analyzeVideo = async (file: File) => {
    setIsAnalyzing(true);
    const { setScript, appendScript } = useTimelineStore.getState();
    
    try {
      let base64Video = "";
      
      if (file.size > COMPRESSION_THRESHOLD) {
        console.log('🗜️ Video too large, compressing...');
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
        console.log('✅ Compression complete');
      } else {
        base64Video = await fileToBase64(file);
      }

      console.log('🤖 Sending to Gemini for analysis...');
      
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        body: JSON.stringify({ 
          prompt: "Analyze this video and write a synchronized voiceover script. Format: **(0:00 - 0:05)** \"Spoken Text\". Do not provide a summary, mood, or intro text. Output ONLY the script.",
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
        chunk = chunk
          .replace(/[#"*]/g, "")      
          .replace(/\*\*/g, "")       
          .replace(/###/g, "")        
          .replace(/^Title:/gm, "")   
          .replace(/^Summary:/gm, "");

        appendScript(chunk);
      }
      
      console.log('✅ Script generation complete');
    } catch (err) { 
      console.error('❌ Analysis failed:', err);
      alert('Failed to analyze video. Please try again.');
    } finally { 
      setIsAnalyzing(false); 
      setIsProcessing(false); 
    }
  };

  const handleGenerateVoice = async () => {
    if (!generatedScript) return;
    setIsGeneratingVoice(true);
    
    try {
      const lines = generatedScript.split('\n');
      const cleanLines = lines
        .map(line => line.replace(/^[\s-]*[\(\[]?\d{1,2}:\d{2}(?:.*?)[\)\]]?:?\s*/, "").trim())
        .filter(line => line.length > 0);

      const textToRead = cleanLines.join(' ');
      if (textToRead.length < 2) throw new Error("Script is empty.");

      console.log('🎙️ Generating voiceover...');
      
      const response = await fetch('/api/ai/voice', {
        method: 'POST',
        body: JSON.stringify({ 
          text: textToRead, 
          voiceId: "pNInz6obpgDQGcFmaJgB" 
        }),
      });
      
      if (!response.ok) throw new Error('Voice generation failed');
      
      const blob = await response.blob();
      setPreviewVoiceUrl(URL.createObjectURL(blob));
      console.log('✅ Voiceover generated');
    } catch (e) { 
      alert("Voice generation failed. Please check your API keys."); 
      console.error('❌ Voice generation error:', e); 
    } finally { 
      setIsGeneratingVoice(false); 
    }
  };

  const handleApplyVoice = () => {
    if (previewVoiceUrl) {
      setAudio(previewVoiceUrl);
      setCaptions([]);
      setPreviewVoiceUrl(null);
      console.log('✅ Voiceover applied to timeline');
    }
  };

  const handleAutoCaption = async () => {
    let mediaToTranscribe = audioUrl || originalVideoUrl;
    let mimeType = audioUrl ? 'audio/mpeg' : 'video/mp4';
    if (!mediaToTranscribe) return;
    
    setIsTranscribing(true);
    
    try {
      console.log('📝 Transcribing audio...');
      
      const responseMedia = await fetch(mediaToTranscribe);
      const blob = await responseMedia.blob();
      
      const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
      });

      const response = await fetch('/api/ai/transcribe', {
        method: 'POST',
        body: JSON.stringify({ 
          mediaData: base64Data, 
          mimeType: mimeType 
        }),
      });
      
      const data = await response.json();
      
      const cleanCaptions = data.captions
        .map((c: any) => ({ 
          ...c, 
          start: parseFloat(c.start), 
          end: parseFloat(c.end) 
        }))
        .filter((c: any) => {
          const text = c.text.trim();
          if (/^\d+$/.test(text)) return false; 
          if (/^\d{1,2}:\d{2}$/.test(text)) return false;
          return text.length > 0;
        });

      setCaptions(cleanCaptions);
      console.log('✅ Transcription complete:', cleanCaptions.length, 'captions');
    } catch (e) { 
      console.error('❌ Transcription error:', e);
      alert("Transcription failed. Please try again."); 
    } finally { 
      setIsTranscribing(false); 
    }
  };

  const handleFinalExport = async () => {
    if (!originalVideoUrl || !audioUrl) {
      alert('Please add both video and audio before exporting');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      console.log('🎬 Starting final export...');
      const finalUrl = await mergeAudioWithVideo(
        originalVideoUrl, 
        audioUrl, 
        (pct) => setProgress(pct)
      );
      
      const a = document.createElement('a'); 
      a.href = finalUrl; 
      a.download = 'aura-studio-export.mp4'; 
      a.click();
      
      console.log('✅ Export complete');
    } catch (e) { 
      console.error('❌ Export failed:', e);
      alert("Export failed. Please try again."); 
    } finally { 
      setIsProcessing(false); 
    }
  };

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
        
        {/* Header Area */}
        <div className="h-14 border-b border-[#1f1f1f] flex items-center justify-between px-6 bg-[#0F0F0F] shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-400">Project: Aura Studio</span>
            
            {/* NEW: Upload Status Indicator */}
            {isUploading && (
              <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-3 py-1">
                <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
                <span className="text-xs text-blue-300 font-medium">
                  Uploading to Drive... {uploadProgress}%
                </span>
              </div>
            )}
            
            {/* NEW: Warning if using blob URL */}
            {originalVideoUrl && originalVideoUrl.startsWith('blob:') && !isUploading && (
              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-3 py-1">
                <AlertCircle className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-yellow-300 font-medium">
                  Video not saved - will be lost on refresh
                </span>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleFinalExport}
            disabled={isProcessing || !audioUrl}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition"
          >
            {isProcessing ? <Loader2 className="animate-spin w-3 h-3"/> : <Download className="w-3 h-3"/>}
            Export Video
          </button>
        </div>

        {/* ZONE C: CANVAS */}
        <Canvas isProcessing={isProcessing} progress={progress} />

        {/* ZONE D: TIMELINE AREA */}
        <TimelineControls />
        <Timeline />

      </div>
    </div>
  );
}