// src/core/utils/media.ts - FULLY FIXED VERSION

export const generateVideoThumbnails = async (
  videoUrl: string, 
  count: number = 30
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    console.log('🎬 Starting thumbnail generation for:', videoUrl);
    
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous'; // Try CORS first
    video.muted = true;
    video.preload = 'metadata';
    
    const snapshots: string[] = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let retryWithoutCORS = false;

    // Error handler
    video.onerror = (e) => {
      console.warn('⚠️ Thumbnail generation error:', e);
      
      // If CORS failed, try without crossOrigin
      if (!retryWithoutCORS && video.crossOrigin === 'anonymous') {
        console.log('🔄 Retrying without CORS...');
        retryWithoutCORS = true;
        video.crossOrigin = null as any;
        video.src = videoUrl;
        video.load();
        return;
      }
      
      // If still failing, resolve with empty array (graceful degradation)
      console.warn('❌ Could not generate thumbnails for:', videoUrl);
      video.remove();
      resolve([]); // Don't reject - let the UI show without thumbnails
    };

    // Success handler
    video.onloadedmetadata = async () => {
      try {
        const duration = video.duration;
        
        // Validate duration
        if (!duration || !isFinite(duration) || duration <= 0) {
          console.warn('⚠️ Invalid video duration:', duration);
          video.remove();
          resolve([]);
          return;
        }

        console.log('✅ Video metadata loaded. Duration:', duration, 'Generating', count, 'thumbnails');
        
        // Set canvas size
        canvas.width = 160; 
        canvas.height = 90;
        
        const interval = duration / count;
        const maxRetries = 3;

        for (let i = 0; i < count; i++) {
          const time = Math.min(i * interval, duration - 0.1); // Stay within bounds
          
          let retries = 0;
          let success = false;
          
          while (retries < maxRetries && !success) {
            try {
              video.currentTime = time;
              
              await new Promise<void>((r, rej) => {
                const timeout = setTimeout(() => rej(new Error('Seek timeout')), 3000);
                
                const onSeeked = () => {
                  clearTimeout(timeout);
                  video.removeEventListener('seeked', onSeeked);
                  r();
                };
                
                video.addEventListener('seeked', onSeeked);
              });

              // Draw frame
              if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                
                // Validate that we got actual image data
                if (dataUrl && dataUrl.length > 100) {
                  snapshots.push(dataUrl);
                  success = true;
                }
              }
            } catch (seekError) {
              retries++;
              console.warn(`⚠️ Thumbnail ${i} failed (attempt ${retries}):`, seekError);
              
              if (retries >= maxRetries) {
                // Skip this thumbnail
                console.warn(`⏭️ Skipping thumbnail ${i}`);
              }
            }
          }
        }
        
        console.log('✅ Generated', snapshots.length, 'thumbnails successfully');
        video.remove();
        resolve(snapshots);
        
      } catch (error) {
        console.error('❌ Thumbnail generation failed:', error);
        video.remove();
        resolve([]); // Graceful degradation
      }
    };

    // Set source and load
    video.src = videoUrl;
    video.load();
    
    // Safety timeout - don't hang forever
    setTimeout(() => {
      if (snapshots.length === 0) {
        console.warn('⏱️ Thumbnail generation timeout');
        video.remove();
        resolve([]);
      }
    }, 30000); // 30 second max
  });
};

/**
 * Extract video duration safely
 */
export const getVideoDuration = (videoUrl: string): Promise<number> => {
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
      reject(new Error('Failed to load video'));
    };
    
    video.src = videoUrl;
    video.load();
    
    // Timeout after 10 seconds
    setTimeout(() => {
      video.remove();
      reject(new Error('Timeout loading video metadata'));
    }, 10000);
  });
};

/**
 * Check if a URL is a blob URL
 */
export const isBlobUrl = (url: string): boolean => {
  return url.startsWith('blob:');
};

/**
 * Check if a URL needs proxying (Drive URLs)
 */
export const needsProxy = (url: string): boolean => {
  return url.includes('drive.google.com') || url.includes('googleusercontent.com');
};