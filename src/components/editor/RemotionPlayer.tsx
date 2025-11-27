'use client';

import { Player } from '@remotion/player';
import { useTimelineStore } from '@/core/stores/useTimelineStore';
import { VideoComposition } from './VideoComposition';

export const RemotionPlayer = () => {
  const { originalVideoUrl, audioUrl, generatedScript } = useTimelineStore();

  // Default dimensions (16:9)
  const width = 1920;
  const height = 1080;

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-black">
      <Player
        component={VideoComposition}
        inputProps={{
          videoUrl: originalVideoUrl,
          audioUrl: audioUrl,
          // For now, we pass a dummy caption to test the overlay
          captions: originalVideoUrl ? "AI Captions will appear here..." : null,
        }}
        durationInFrames={30 * 60} // Default 60 seconds (we will make this dynamic later)
        fps={30}
        compositionWidth={width}
        compositionHeight={height}
        style={{
          width: '100%',
          height: '100%',
        }}
        controls
      />
    </div>
  );
};