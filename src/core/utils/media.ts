// src/core/utils/media.ts

export const generateVideoThumbnails = async (
  videoUrl: string, 
  count: number = 30
): Promise<string[]> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.preload = 'metadata';

    const snapshots: string[] = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Handle Load
    video.onloadedmetadata = async () => {
      canvas.width = 160; 
      canvas.height = 90;
      
      const duration = video.duration;
      // Safety check for invalid duration
      if (!duration || duration === Infinity) {
          resolve([]); 
          return;
      }

      const interval = duration / count;

      for (let i = 0; i < count; i++) {
        const time = i * interval;
        video.currentTime = time;
        
        await new Promise<void>((r) => {
            const onSeeked = () => {
                video.removeEventListener('seeked', onSeeked);
                r();
            };
            // Add error listener to seek as well
            video.onerror = () => r(); 
            video.addEventListener('seeked', onSeeked);
        });

        if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            snapshots.push(canvas.toDataURL('image/jpeg', 0.7)); 
        }
      }
      
      video.remove();
      resolve(snapshots);
    };

    // --- ADD THIS ERROR HANDLER ---
    video.onerror = (e) => {
        console.warn("Could not generate thumbnails for:", videoUrl, e);
        resolve([]); // Resolve with empty array instead of hanging
    };
    
    video.load();
  });
};