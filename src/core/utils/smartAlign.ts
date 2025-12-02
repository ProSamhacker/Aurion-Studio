// src/core/utils/smartAlign.ts - COMPLETE SMART ALIGNMENT SYSTEM

interface Caption {
  start: number;
  end: number;
  text: string;
}

interface AudioAnalysis {
  duration: number;
  silentParts: Array<{ start: number; end: number; duration: number }>;
  speechParts: Array<{ start: number; end: number; confidence: number }>;
  averageAmplitude: number;
  peaks: Array<{ time: number; amplitude: number }>;
}

interface AlignmentResult {
  alignedCaptions: Caption[];
  trimmedSilence: boolean;
  originalDuration: number;
  newDuration: number;
  improvements: string[];
}

/**
 * Main Smart Alignment Function
 * Analyzes audio and automatically syncs captions for professional output
 */
export async function smartAlignCaptions(
  audioUrl: string,
  captions: Caption[],
  options: {
    trimShortSilence?: boolean;  // Remove pauses under 0.3s
    adjustCaptionTiming?: boolean; // Auto-fit captions to speech
    minCaptionGap?: number;       // Minimum gap between captions
  } = {}
): Promise<AlignmentResult> {
  
  const {
    trimShortSilence = true,
    adjustCaptionTiming = true,
    minCaptionGap = 0.1
  } = options;

  const improvements: string[] = [];
  
  // 1. Analyze Audio
  console.log('🎵 Analyzing audio...');
  const analysis = await analyzeAudioFile(audioUrl);
  
  // 2. Identify Speech Segments
  const speechSegments = analysis.speechParts;
  
  // 3. Align Captions to Speech
  let alignedCaptions = [...captions];
  
  if (adjustCaptionTiming && speechSegments.length > 0) {
    alignedCaptions = alignCaptionsToSpeech(
      captions, 
      speechSegments,
      minCaptionGap
    );
    improvements.push('✅ Synced captions to speech patterns');
  }
  
  // 4. Remove Short Awkward Gaps
  if (trimShortSilence) {
    alignedCaptions = removeShortGaps(alignedCaptions, 0.3);
    improvements.push('✅ Removed awkward pauses');
  }
  
  // 5. Ensure Minimum Gaps
  alignedCaptions = enforceMinimumGaps(alignedCaptions, minCaptionGap);
  improvements.push('✅ Optimized caption spacing');
  
  // 6. Calculate Duration Changes
  const originalDuration = captions[captions.length - 1]?.end || analysis.duration;
  const newDuration = alignedCaptions[alignedCaptions.length - 1]?.end || analysis.duration;
  
  return {
    alignedCaptions,
    trimmedSilence: trimShortSilence,
    originalDuration,
    newDuration,
    improvements
  };
}

/**
 * Analyze audio file using Web Audio API
 */
async function analyzeAudioFile(audioUrl: string): Promise<AudioAnalysis> {
  // Create audio context
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Fetch and decode audio
  const response = await fetch(audioUrl);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  // Get audio data
  const channelData = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  const duration = audioBuffer.duration;
  
  // Analyze in chunks
  const chunkSize = Math.floor(sampleRate * 0.1); // 100ms chunks
  const chunks = [];
  
  for (let i = 0; i < channelData.length; i += chunkSize) {
    const chunk = channelData.slice(i, i + chunkSize);
    const time = i / sampleRate;
    
    // Calculate RMS (Root Mean Square) for amplitude
    let sum = 0;
    for (let j = 0; j < chunk.length; j++) {
      sum += chunk[j] * chunk[j];
    }
    const rms = Math.sqrt(sum / chunk.length);
    
    chunks.push({ time, amplitude: rms });
  }
  
  // Calculate average amplitude
  const avgAmplitude = chunks.reduce((sum, c) => sum + c.amplitude, 0) / chunks.length;
  
  // Detect silent and speech parts
  const threshold = avgAmplitude * 0.2; // 20% of average is considered silence
  const speechThreshold = avgAmplitude * 0.5;
  
  const silentParts: Array<{ start: number; end: number; duration: number }> = [];
  const speechParts: Array<{ start: number; end: number; confidence: number }> = [];
  
  let currentSilent: { start: number } | null = null;
  let currentSpeech: { start: number } | null = null;
  
  chunks.forEach((chunk) => {
    if (chunk.amplitude < threshold) {
      // Silence detected
      if (!currentSilent) {
        currentSilent = { start: chunk.time };
      }
      if (currentSpeech) {
        speechParts.push({
          start: currentSpeech.start,
          end: chunk.time,
          confidence: 1.0
        });
        currentSpeech = null;
      }
    } else if (chunk.amplitude > speechThreshold) {
      // Speech detected
      if (!currentSpeech) {
        currentSpeech = { start: chunk.time };
      }
      if (currentSilent) {
        const duration = chunk.time - currentSilent.start;
        if (duration > 0.1) { // Only count silences > 100ms
          silentParts.push({
            start: currentSilent.start,
            end: chunk.time,
            duration
          });
        }
        currentSilent = null;
      }
    }
  });
  
  // Close any open segments
  if (currentSilent) {
    silentParts.push({
      start: currentSilent.start,
      end: duration,
      duration: duration - currentSilent.start
    });
  }
  if (currentSpeech) {
    speechParts.push({
      start: currentSpeech.start,
      end: duration,
      confidence: 1.0
    });
  }
  
  // Find peaks
  const peaks = chunks
    .filter(c => c.amplitude > avgAmplitude * 1.5)
    .map(c => ({ time: c.time, amplitude: c.amplitude }));
  
  await audioContext.close();
  
  return {
    duration,
    silentParts,
    speechParts,
    averageAmplitude: avgAmplitude,
    peaks
  };
}

/**
 * Align captions to match speech segments
 */
function alignCaptionsToSpeech(
  captions: Caption[],
  speechSegments: Array<{ start: number; end: number }>,
  minGap: number
): Caption[] {
  const aligned: Caption[] = [];
  
  captions.forEach((caption, index) => {
    // Find the speech segment that best matches this caption
    const matchingSegment = speechSegments.find(seg => {
      // Caption should start within or near this speech segment
      const captionMid = caption.start + (caption.end - caption.start) / 2;
      return captionMid >= seg.start && captionMid <= seg.end;
    });
    
    if (matchingSegment) {
      // Adjust caption to match speech segment
      const newCaption = { ...caption };
      
      // Start caption at speech start (or a bit before for readability)
      newCaption.start = Math.max(0, matchingSegment.start - 0.1);
      
      // End caption at speech end (or a bit after)
      newCaption.end = matchingSegment.end + 0.1;
      
      // Ensure minimum gap from previous caption
      if (aligned.length > 0) {
        const prevEnd = aligned[aligned.length - 1].end;
        if (newCaption.start < prevEnd + minGap) {
          newCaption.start = prevEnd + minGap;
        }
      }
      
      aligned.push(newCaption);
    } else {
      // No matching speech segment, keep original timing
      aligned.push({ ...caption });
    }
  });
  
  return aligned;
}

/**
 * Remove short gaps between captions that feel awkward
 */
function removeShortGaps(captions: Caption[], maxGap: number): Caption[] {
  const result: Caption[] = [];
  
  for (let i = 0; i < captions.length; i++) {
    const current = { ...captions[i] };
    
    if (i > 0) {
      const previous = result[result.length - 1];
      const gap = current.start - previous.end;
      
      // If gap is very short, extend previous caption to meet current
      if (gap < maxGap && gap > 0) {
        previous.end = current.start - 0.05; // Small 50ms gap
      }
    }
    
    result.push(current);
  }
  
  return result;
}

/**
 * Ensure minimum gap between all captions
 */
function enforceMinimumGaps(captions: Caption[], minGap: number): Caption[] {
  const result: Caption[] = [];
  
  captions.forEach((caption, index) => {
    const newCaption = { ...caption };
    
    if (index > 0) {
      const prevEnd = result[index - 1].end;
      
      // Ensure minimum gap
      if (newCaption.start < prevEnd + minGap) {
        newCaption.start = prevEnd + minGap;
      }
      
      // Ensure caption doesn't end before it starts
      if (newCaption.end <= newCaption.start) {
        newCaption.end = newCaption.start + 1; // Minimum 1 second duration
      }
    }
    
    result.push(newCaption);
  });
  
  return result;
}

/**
 * Calculate optimal caption duration based on text length
 * Rule: Average reading speed is 3-4 words per second
 */
export function calculateOptimalDuration(text: string): number {
  const words = text.trim().split(/\s+/).length;
  const readingSpeed = 3.5; // words per second
  const minDuration = 1.0; // minimum 1 second
  const maxDuration = 5.0; // maximum 5 seconds
  
  const calculated = words / readingSpeed;
  return Math.min(maxDuration, Math.max(minDuration, calculated));
}

/**
 * Validate caption timings
 */
export function validateCaptions(captions: Caption[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  captions.forEach((caption, index) => {
    // Check duration
    const duration = caption.end - caption.start;
    if (duration < 0.5) {
      errors.push(`Caption ${index + 1}: Too short (${duration.toFixed(2)}s)`);
    }
    if (duration > 10) {
      errors.push(`Caption ${index + 1}: Too long (${duration.toFixed(2)}s)`);
    }
    
    // Check overlap with next
    if (index < captions.length - 1) {
      const nextCaption = captions[index + 1];
      if (caption.end > nextCaption.start) {
        errors.push(`Caption ${index + 1}: Overlaps with next caption`);
      }
    }
    
    // Check text length
    if (caption.text.length > 100) {
      errors.push(`Caption ${index + 1}: Text too long (${caption.text.length} chars)`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}