// src/core/utils/intelligentSmartAlign.ts - COMPLETE SMART ALIGNMENT LOGIC

interface Caption {
  start: number;
  end: number;
  text: string;
}

interface AlignmentStrategy {
  videoSegments: VideoSegment[];
  audioSegments: AudioSegment[];
  alignedCaptions: Caption[];
  strategy: 'stretch' | 'pace-match' | 'scene-sync' | 'split-audio';
  confidence: number;
  recommendations: string[];
  newDuration?: number;
}

interface VideoSegment {
  start: number;
  end: number;
  sceneType: 'action' | 'transition' | 'static' | 'text';
  importance: number;
}

interface AudioSegment {
  start: number;
  end: number;
  text: string;
  pace: 'fast' | 'normal' | 'slow';
  words: number;
}

interface SceneAnalysis {
  hasMotion: boolean;
  brightness: number;
  sceneChanges: number[];
  visualDensity: number;
}

/**
 * MASTER SMART ALIGN FUNCTION
 * Intelligently aligns video, voiceover, and captions based on content analysis
 */
export async function intelligentSmartAlign(
  videoUrl: string,
  videoDuration: number,
  audioUrl: string,
  audioDuration: number,
  scriptText: string,
  existingCaptions: Caption[]
): Promise<AlignmentStrategy> {
  
  console.log('🧠 Starting Intelligent Alignment...');
  console.log(`📹 Video: ${videoDuration}s | 🎙️ Audio: ${audioDuration}s`);
  
  // Step 1: Analyze the mismatch
  const durationGap = Math.abs(videoDuration - audioDuration);
  const gapPercentage = (durationGap / videoDuration) * 100;
  
  console.log(`⚖️ Duration gap: ${durationGap.toFixed(2)}s (${gapPercentage.toFixed(1)}%)`);
  
  // Step 2: Analyze video content
  const videoAnalysis = await analyzeVideoScenes(videoUrl, videoDuration);
  
  // Step 3: Analyze audio/script content
  const audioAnalysis = await analyzeAudioContent(audioUrl, scriptText, audioDuration);
  
  // Step 4: Determine best alignment strategy
  let strategy: AlignmentStrategy;
  
  if (gapPercentage < 10) {
    // Small gap - stretch/compress audio slightly
    strategy = await strategyMinorAdjustment(videoAnalysis, audioAnalysis, videoDuration, audioDuration);
  } else if (audioDuration < videoDuration) {
    // Audio shorter than video - strategic placement
    strategy = await strategyAudioPlacement(videoAnalysis, audioAnalysis, videoDuration, existingCaptions);
  } else {
    // Audio longer than video - split and pace
    strategy = await strategyAudioSplitting(videoAnalysis, audioAnalysis, videoDuration, existingCaptions);
  }
  
  // Step 5: Generate optimized captions
  strategy.alignedCaptions = await generateOptimizedCaptions(
    strategy.audioSegments,
    strategy.videoSegments,
    existingCaptions
  );
  
  console.log('✅ Alignment complete:', strategy.strategy);
  
  return strategy;
}

/**
 * Analyze video to detect scenes, motion, and key moments
 */
async function analyzeVideoScenes(videoUrl: string, duration: number): Promise<VideoSegment[]> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.muted = true;
    video.crossOrigin = 'anonymous';
    
    const segments: VideoSegment[] = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    video.onloadedmetadata = async () => {
      canvas.width = 160;
      canvas.height = 90;
      
      const sampleCount = Math.min(30, Math.floor(duration));
      const interval = duration / sampleCount;
      
      let previousFrame: ImageData | null = null;
      let currentSegmentStart = 0;
      let sceneChanges: number[] = [0];
      
      for (let i = 0; i < sampleCount; i++) {
        const time = i * interval;
        video.currentTime = time;
        
        await new Promise(r => {
          video.onseeked = () => r(null);
        });
        
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          // Detect scene changes using frame difference
          if (previousFrame) {
            const difference = calculateFrameDifference(previousFrame, currentFrame);
            
            // Scene change detected (threshold: 30% difference)
            if (difference > 0.3) {
              sceneChanges.push(time);
              
              // Create segment for previous scene
              const segmentDuration = time - currentSegmentStart;
              if (segmentDuration > 1) { // Minimum 1 second scenes
                segments.push({
                  start: currentSegmentStart,
                  end: time,
                  sceneType: classifySceneType(difference, segmentDuration),
                  importance: calculateSceneImportance(difference, segmentDuration)
                });
              }
              
              currentSegmentStart = time;
            }
          }
          
          previousFrame = currentFrame;
        }
      }
      
      // Add final segment
      if (currentSegmentStart < duration) {
        segments.push({
          start: currentSegmentStart,
          end: duration,
          sceneType: 'static',
          importance: 0.5
        });
      }
      
      // If no scenes detected, create one large segment
      if (segments.length === 0) {
        segments.push({
          start: 0,
          end: duration,
          sceneType: 'static',
          importance: 1
        });
      }
      
      video.remove();
      resolve(segments);
    };
    
    video.onerror = () => {
      // Fallback: create simple segments
      const segmentDuration = Math.min(10, duration / 3);
      const fallbackSegments: VideoSegment[] = [];
      
      for (let i = 0; i < duration; i += segmentDuration) {
        fallbackSegments.push({
          start: i,
          end: Math.min(i + segmentDuration, duration),
          sceneType: 'static',
          importance: 0.7
        });
      }
      
      resolve(fallbackSegments);
    };
    
    video.load();
  });
}

/**
 * Calculate pixel difference between frames
 */
function calculateFrameDifference(frame1: ImageData, frame2: ImageData): number {
  let totalDiff = 0;
  const pixels = frame1.data.length / 4;
  
  for (let i = 0; i < frame1.data.length; i += 4) {
    const r = Math.abs(frame1.data[i] - frame2.data[i]);
    const g = Math.abs(frame1.data[i + 1] - frame2.data[i + 1]);
    const b = Math.abs(frame1.data[i + 2] - frame2.data[i + 2]);
    
    totalDiff += (r + g + b) / (255 * 3);
  }
  
  return totalDiff / pixels;
}

/**
 * Classify scene type based on characteristics
 */
function classifySceneType(motion: number, duration: number): 'action' | 'transition' | 'static' | 'text' {
  if (duration < 2) return 'transition';
  if (motion > 0.5) return 'action';
  if (duration > 8) return 'text';
  return 'static';
}

/**
 * Calculate scene importance (0-1)
 */
function calculateSceneImportance(motion: number, duration: number): number {
  // Longer scenes with moderate motion are more important
  const durationScore = Math.min(1, duration / 10);
  const motionScore = motion > 0.7 ? 0.5 : motion;
  
  return (durationScore * 0.6) + (motionScore * 0.4);
}

/**
 * Analyze audio content and script
 */
async function analyzeAudioContent(
  audioUrl: string,
  scriptText: string,
  audioDuration: number
): Promise<AudioSegment[]> {
  
  // Split script into logical segments
  const lines = scriptText
    .split('\n')
    .map(l => l.replace(/[\(\[].*?[\)\]]/g, '').trim())
    .filter(l => l.length > 0);
  
  const totalWords = lines.join(' ').split(/\s+/).length;
  const wordsPerSecond = totalWords / audioDuration;
  
  const segments: AudioSegment[] = [];
  let currentTime = 0;
  
  for (const line of lines) {
    const words = line.split(/\s+/).length;
    const estimatedDuration = words / wordsPerSecond;
    
    // Determine pace
    let pace: 'fast' | 'normal' | 'slow' = 'normal';
    if (wordsPerSecond > 3.5) pace = 'fast';
    else if (wordsPerSecond < 2.5) pace = 'slow';
    
    segments.push({
      start: currentTime,
      end: currentTime + estimatedDuration,
      text: line,
      pace,
      words
    });
    
    currentTime += estimatedDuration;
  }
  
  return segments;
}

/**
 * STRATEGY 1: Minor adjustment (<10% gap)
 * Slightly stretch or compress audio playback
 */
async function strategyMinorAdjustment(
  videoSegs: VideoSegment[],
  audioSegs: AudioSegment[],
  videoDuration: number,
  audioDuration: number
): Promise<AlignmentStrategy> {
  
  const stretchFactor = videoDuration / audioDuration;
  
  // Adjust audio segment times
  const adjustedAudio = audioSegs.map(seg => ({
    ...seg,
    start: seg.start * stretchFactor,
    end: seg.end * stretchFactor
  }));
  
  return {
    videoSegments: videoSegs,
    audioSegments: adjustedAudio,
    alignedCaptions: [],
    strategy: 'stretch',
    confidence: 0.95,
    recommendations: [
      `✅ Audio will be ${stretchFactor > 1 ? 'slightly slowed' : 'slightly sped up'} by ${Math.abs((1 - stretchFactor) * 100).toFixed(1)}%`,
      '✅ This change is barely noticeable and maintains natural flow',
      '✅ All content preserved with minimal quality impact'
    ]
  };
}

/**
 * STRATEGY 2: Audio shorter than video
 * Place audio at key moments, add pauses
 */
async function strategyAudioPlacement(
  videoSegs: VideoSegment[],
  audioSegs: AudioSegment[],
  videoDuration: number,
  existingCaptions: Caption[]
): Promise<AlignmentStrategy> {
  
  // Sort video segments by importance
  const sortedScenes = [...videoSegs].sort((a, b) => b.importance - a.importance);
  
  // Distribute audio across important scenes
  const totalAudioDuration = audioSegs[audioSegs.length - 1].end;
  const availableTime = videoDuration;
  const extraTime = availableTime - totalAudioDuration;
  const pauseBetweenSegments = extraTime / (audioSegs.length - 1);
  
  // Redistribute audio with strategic pauses
  const redistributedAudio: AudioSegment[] = [];
  let currentTime = 0;
  
  for (let i = 0; i < audioSegs.length; i++) {
    const seg = audioSegs[i];
    const duration = seg.end - seg.start;
    
    // Try to align with important video scenes
    const matchingScene = sortedScenes.find(
      vs => currentTime >= vs.start && currentTime <= vs.end
    );
    
    // Add slight offset if aligning with scene change
    if (matchingScene && Math.abs(currentTime - matchingScene.start) > 0.5) {
      currentTime = matchingScene.start;
    }
    
    redistributedAudio.push({
      ...seg,
      start: currentTime,
      end: currentTime + duration
    });
    
    currentTime += duration;
    
    // Add pause between segments (except last)
    if (i < audioSegs.length - 1) {
      currentTime += Math.max(0.5, pauseBetweenSegments);
    }
  }
  
  return {
    videoSegments: videoSegs,
    audioSegments: redistributedAudio,
    alignedCaptions: [],
    strategy: 'scene-sync',
    confidence: 0.85,
    recommendations: [
      `✅ Audio placed at ${audioSegs.length} key moments in the video`,
      `✅ Added ${pauseBetweenSegments.toFixed(1)}s pauses between segments for natural pacing`,
      '💡 Consider: Extend script to fill gaps, or trim video to match audio length',
      '💡 Tip: Use B-roll footage during pauses for professional look'
    ]
  };
}

/**
 * STRATEGY 3: Audio longer than video
 * Split audio and either recommend extending video or fast-pace delivery
 */
async function strategyAudioSplitting(
  videoSegs: VideoSegment[],
  audioSegs: AudioSegment[],
  videoDuration: number,
  existingCaptions: Caption[]
): Promise<AlignmentStrategy> {
  
  const totalAudioDuration = audioSegs[audioSegs.length - 1].end;
  const excessDuration = totalAudioDuration - videoDuration;
  const excessPercentage = (excessDuration / videoDuration) * 100;
  
  // Calculate how much to speed up
  const speedupFactor = totalAudioDuration / videoDuration;
  
  if (speedupFactor < 1.3) {
    // Can speed up reasonably (< 30% faster)
    const adjustedAudio = audioSegs.map(seg => ({
      ...seg,
      start: seg.start / speedupFactor,
      end: seg.end / speedupFactor,
      pace: 'fast' as const
    }));
    
    return {
      videoSegments: videoSegs,
      audioSegments: adjustedAudio,
      alignedCaptions: [],
      strategy: 'pace-match',
      confidence: 0.75,
      recommendations: [
        `⚠️ Audio is ${excessPercentage.toFixed(1)}% longer than video`,
        `✅ Voiceover sped up by ${((speedupFactor - 1) * 100).toFixed(1)}% to fit`,
        '💡 RECOMMENDED: Trim script or extend video for better quality',
        '💡 Fast pacing may feel rushed - consider regenerating with shorter script'
      ]
    };
  } else {
    // Too much audio - need to split
    const segmentsToFit = Math.floor(videoDuration / (totalAudioDuration / audioSegs.length));
    const fittedAudio = audioSegs.slice(0, segmentsToFit);
    
    // Redistribute evenly
    const segmentDuration = videoDuration / fittedAudio.length;
    const redistributed = fittedAudio.map((seg, i) => ({
      ...seg,
      start: i * segmentDuration,
      end: (i + 1) * segmentDuration
    }));
    
    return {
      videoSegments: videoSegs,
      audioSegments: redistributed,
      alignedCaptions: [],
      strategy: 'split-audio',
      confidence: 0.60,
      recommendations: [
        `⚠️ Audio is ${excessPercentage.toFixed(1)}% longer than video - CRITICAL MISMATCH`,
        `✅ Using first ${segmentsToFit}/${audioSegs.length} audio segments to fit`,
        `❌ Remaining audio cut off (${(audioSegs.length - segmentsToFit)} segments)`,
        '🚨 ACTION REQUIRED:',
        '   1. TRIM SCRIPT: Remove unnecessary content and regenerate voice',
        '   2. EXTEND VIDEO: Add more footage to match full audio',
        '   3. SPLIT PROJECT: Create multiple videos for full content'
      ]
    };
  }
}

/**
 * Generate optimized captions based on alignment
 */
async function generateOptimizedCaptions(
  audioSegments: AudioSegment[],
  videoSegments: VideoSegment[],
  existingCaptions: Caption[]
): Promise<Caption[]> {
  
  const optimizedCaptions: Caption[] = [];
  
  for (const audioSeg of audioSegments) {
    // Split long audio into caption-sized chunks (max 7 words)
    const words = audioSeg.text.split(/\s+/);
    const chunks: string[] = [];
    
    for (let i = 0; i < words.length; i += 5) {
      chunks.push(words.slice(i, i + 5).join(' '));
    }
    
    const segmentDuration = audioSeg.end - audioSeg.start;
    const chunkDuration = segmentDuration / chunks.length;
    
    chunks.forEach((chunk, i) => {
      optimizedCaptions.push({
        start: audioSeg.start + (i * chunkDuration),
        end: audioSeg.start + ((i + 1) * chunkDuration),
        text: chunk
      });
    });
  }
  
  return optimizedCaptions;
}

/**
 * PUBLIC API: Apply smart alignment with UI feedback
 */
export async function applySmartAlignment(
  videoUrl: string,
  videoDuration: number,
  audioUrl: string,
  audioDuration: number,
  scriptText: string,
  existingCaptions: Caption[],
  onProgress: (message: string, percent: number) => void
): Promise<AlignmentStrategy> {
  
  try {
    onProgress('🧠 Analyzing video content...', 10);
    
    const strategy = await intelligentSmartAlign(
      videoUrl,
      videoDuration,
      audioUrl,
      audioDuration,
      scriptText,
      existingCaptions
    );
    
    onProgress('✅ Alignment complete!', 100);
    
    return strategy;
    
  } catch (error) {
    console.error('Smart Align failed:', error);
    throw new Error('Alignment failed. Please check video and audio files.');
  }
}