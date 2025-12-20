'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Download, Loader2, AlertCircle, ArrowLeft, Save, Clock, Zap } from 'lucide-react';

// Core & Stores
import { useTimelineStore } from '../../../core/stores/useTimelineStore';
import { FFmpegClient } from '../../../core/ffmpeg/client';
import { compressVideo, mergeAudioWithVideo } from '../../../core/ffmpeg/actions';

// Utils
import { applySmartAlignment } from '@/core/utils/intelligentSmartAlign';

// Components
import { Sidebar } from '../../../components/layout/Sidebar';
import { ToolPanel } from '../../../components/layout/ToolPanel';
import { Canvas } from '../../../components/studio/Canvas'; 
import { Timeline } from '../../../components/studio/Timeline';
import { TimelineControls } from '../../../components/studio/TimelineControls';

export default function StudioPage() {
  const params = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const projectId = params.projectId as string;
  
  // Local State
  const [activeTool, setActiveTool] = useState('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [previewVoiceUrl, setPreviewVoiceUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [showSmartAlign, setShowSmartAlign] = useState(false);

  const COMPRESSION_THRESHOLD = 100 * 1024 * 1024; 

  const { 
    setOriginalVideo, originalVideoUrl, setScript, appendScript, generatedScript,
    audioUrl, setAudio, setCaptions, captions,
    setIsPlaying, setCurrentTime, setDuration, duration,
    loadProject, saveProject, hasUnsavedChanges, updateProjectName, name: projectName,
    voiceSettings, addMediaToLibrary 
  } = useTimelineStore();

  useEffect(() => {
    FFmpegClient.getInstance().then(() => setReady(true)).catch(e => console.error(e));
  }, []);

  // 1. Load Project on Mount
  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  // 2. Auto-Save Implementation
  useEffect(() => {
    if (hasUnsavedChanges) {
      setAutoSaveStatus('unsaved');
    }
    
    const interval = setInterval(() => {
      if (useTimelineStore.getState().hasUnsavedChanges) {
        setAutoSaveStatus('saving');
        saveProject();
        setTimeout(() => setAutoSaveStatus('saved'), 1000);
      }
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [hasUnsavedChanges]);

  // Warn user before leaving if upload in progress
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isUploading || hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Upload in progress or unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isUploading, hasUnsavedChanges]);

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowBackConfirm(true);
    } else {
      router.push('/');
    }
  };

  // --- Smart Alignment Logic ---
  const handleSmartAlign = async (options: any) => {
    if (!audioUrl || !originalVideoUrl) {
      alert("Need both video and audio to align!");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create a fallback trim object if not in store
      const currentVideoTrim = { start: 0, end: duration }; 

      const result = await applySmartAlignment(
        originalVideoUrl,
        currentVideoTrim.end - currentVideoTrim.start,
        audioUrl,
        duration, // assuming audio duration matches video or is handled internally
        generatedScript,
        captions,
        (message: string, percent: number) => {
          console.log(`${message} (${percent}%)`);
          setProgress(percent);
        }
      );

      // Log results
      console.log('✅ Smart Align Strategy:', result.strategy);
      console.log('📊 Confidence:', (result.confidence * 100).toFixed(0) + '%');
      
      // Notify user (Optional: could be a toast instead of alert)
      // const recommendations = result.recommendations.join('\n');
      // alert(`Smart Align Complete!\n\nStrategy: ${result.strategy}\nConfidence: ${(result.confidence * 100).toFixed(0)}%\n\n${recommendations}`);

      // Apply aligned captions
      if (result.alignedCaptions) {
        setCaptions(result.alignedCaptions);
      }
      
      // Update duration if the strategy modified silence
      if (options.trimSilence && result.newDuration) {
         setDuration(result.newDuration);
      }

    } catch (error) {
      console.error('Smart Align failed:', error);
      alert('Alignment failed. Check console for details.');
    } finally {
      setIsProcessing(false);
      setShowSmartAlign(false);
    }
  };

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

  const analyzeVideo = async (file: File) => {
    setIsAnalyzing(true);
    const { setScript, appendScript } = useTimelineStore.getState();
    
    try {
      let base64Video = "";
      
      if (file.size > COMPRESSION_THRESHOLD) {
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
        base64Video = await fileToBase64(file);
      }

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
    } catch (err) { 
      alert('Failed to analyze video. Please try again.');
    } finally { 
      setIsAnalyzing(false); 
      setIsProcessing(false); 
    }
  };

  const uploadToDrive = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

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
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
      
      return data.url;
    } catch (error) {
      console.error('Drive upload failed:', error);
      setIsUploading(false);
      setUploadProgress(0);
      return null;
    }
  };

  const handleRegenerateScript = async () => {
    if (!originalVideoUrl) return;
    if (generatedScript && !confirm("Regenerating will overwrite your current script. Continue?")) {
      return;
    }
    try {
      setIsAnalyzing(true);
      const response = await fetch(originalVideoUrl);
      if (!response.ok) throw new Error('Failed to fetch video for regeneration');
      const blob = await response.blob();
      const file = new File([blob], "regenerated_video.mp4", { type: blob.type || 'video/mp4' });
      await analyzeVideo(file);
    } catch (error) {
      console.error("Regeneration failed:", error);
      alert("Failed to regenerate script. Please ensure the video is accessible.");
      setIsAnalyzing(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    addMediaToLibrary(file, localUrl);
    setOriginalVideo(localUrl);

    try {
      const duration = await extractVideoDuration(localUrl);
      setDuration(duration);
    } catch (error) {
      setDuration(60);
    }
    
    const driveUrl = await uploadToDrive(file);
    if (driveUrl) {
       // Ideally update store here
    }
    
    setActiveTool('script');
    await analyzeVideo(file);
  };

 const handleGenerateVoice = async () => {
    if (!generatedScript) return;
    setIsGeneratingVoice(true);
    
    try {
      const lines = generatedScript.split('\n');
      const cleanLines = lines
        .map(line => {
            let text = line;
            text = text.replace(/[\(\[]\d{1,2}:\d{2}(?:.*?)[\)\]]/g, "");
            text = text.replace(/^[\s\d\.\)\-\]]*(?:Scene\s*\d+:?)?(?:Narrator:?)?\s*/i, "");
            text = text.replace(/[\(\[]\d{1,2}:\d{2}.*$/, "");
            return text.trim();
        })
        .filter(line => line.length > 0 && !line.match(/^\d+$/));

      const textToRead = cleanLines.join(' ');
      if (textToRead.length < 2) throw new Error("Script is empty after cleaning.");
      
      const response = await fetch('/api/ai/voice', {
        method: 'POST',
        body: JSON.stringify({ 
          text: textToRead, 
          voiceId: voiceSettings.voiceId,
          speed: voiceSettings.speed,
          pitch: voiceSettings.pitch,
          stability: voiceSettings.stability,
          similarityBoost: voiceSettings.similarityBoost
        }),
      });
      
      if (!response.ok) throw new Error('Voice generation failed');
      
      const blob = await response.blob();
      setPreviewVoiceUrl(URL.createObjectURL(blob));
    } catch (e) { 
      alert("Voice generation failed. Please check your API keys."); 
      console.error(e); 
    } finally { 
      setIsGeneratingVoice(false); 
    }
  };

  const handleApplyVoice = () => {
    // Just clear preview - duration extraction now in ToolPanel
    setPreviewVoiceUrl(null);
    saveProject();
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
    } catch (e) { 
      console.error('Transcription error:', e);
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
      const finalUrl = await mergeAudioWithVideo(
        originalVideoUrl, 
        audioUrl, 
        (pct) => setProgress(pct)
      );
      
      const a = document.createElement('a'); 
      a.href = finalUrl; 
      a.download = `aura-export-${projectId}.mp4`; 
      a.click();
    } catch (e) { 
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
        handleRegenerateScript={handleRegenerateScript}
        fileInputRef={fileInputRef}
        handleFileSelect={handleFileSelect}
      />

      {/* ZONE C: MAIN STAGE */}
      <div className="flex-1 flex flex-col relative min-w-0">
        
        {/* Header Area */}
        <div className="h-14 border-b border-[#1f1f1f] flex items-center justify-between px-6 bg-[#0F0F0F] shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="h-6 w-px bg-gray-800"></div>
            <input type="text" value={projectName} onChange={(e) => updateProjectName(e.target.value)} className="bg-transparent text-sm font-medium text-white focus:outline-none focus:bg-[#1a1a1a] px-2 py-1 rounded" />
            
            <div className="flex items-center gap-2 text-xs">
              {autoSaveStatus === 'saving' && (<><Loader2 className="w-3 h-3 animate-spin text-blue-400" /><span className="text-blue-400">Saving...</span></>)}
              {autoSaveStatus === 'saved' && (<><Save className="w-3 h-3 text-green-400" /><span className="text-green-400">Saved</span></>)}
              {autoSaveStatus === 'unsaved' && (<><Clock className="w-3 h-3 text-yellow-400" /><span className="text-yellow-400">Unsaved changes</span></>)}
            </div>

            {isUploading && (
              <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-3 py-1 ml-2">
                <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
                <span className="text-xs text-blue-300 font-medium">Uploading: {uploadProgress}%</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => setShowSmartAlign(true)} className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-cyan-900/20">
              <Zap className="w-3 h-3" /> Smart Align
            </button>
            <button onClick={handleFinalExport} disabled={isProcessing || !audioUrl} className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition">
              {isProcessing ? <Loader2 className="animate-spin w-3 h-3"/> : <Download className="w-3 h-3"/>} Export Video
            </button>
          </div>
        </div>

        {/* ZONE C: CANVAS */}
        <Canvas isProcessing={isProcessing} progress={progress} />

        {/* ZONE D: TIMELINE AREA */}
        <TimelineControls />
        <Timeline />

      </div>

      {/* Back Confirmation Modal */}
      {showBackConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Unsaved Changes</h3>
                <p className="text-sm text-gray-400">You have unsaved changes. Do you want to save before leaving?</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowBackConfirm(false)} className="flex-1 px-4 py-2 bg-[#252525] hover:bg-[#303030] text-white rounded-lg text-sm font-medium transition">Cancel</button>
              <button onClick={() => router.push('/')} className="flex-1 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg text-sm font-medium transition">Don't Save</button>
              <button onClick={() => { saveProject(); router.push('/'); }} className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition">Save & Leave</button>
            </div>
          </div>
        </div>
      )}

      {/* Smart Align Modal */}
      {showSmartAlign && (
        <SmartAlignModal 
          isOpen={showSmartAlign}
          onClose={() => setShowSmartAlign(false)}
          onApply={handleSmartAlign}
          isProcessing={isProcessing} 
        />
      )}
    </div>
  );
}