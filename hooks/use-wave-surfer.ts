// hooks/use-wave-surfer.ts
import { useEffect, useRef, useState } from "react";

export function useWaveSurfer(url: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let ws: any = null;
    let isCancelled = false;

    const initWaveSurfer = async () => {
      if (!containerRef.current) return;

      try {
        // Dynamic import để tránh lỗi SSR trong Next.js
        const WaveSurferModule = (await import("wavesurfer.js")).default;
        if (isCancelled) return;

        if (containerRef.current) containerRef.current.innerHTML = "";

        ws = WaveSurferModule.create({
          container: containerRef.current,
          waveColor: "#D1D5DB",
          progressColor: "#DB2777",
          cursorColor: "transparent",
          barWidth: 2,
          barGap: 3,
          barRadius: 2,
          height: 40,
          url: url,
        });

        ws.on("ready", () => !isCancelled && setIsReady(true));
        ws.on("finish", () => !isCancelled && setIsPlaying(false));
        ws.on("play", () => !isCancelled && setIsPlaying(true));
        ws.on("pause", () => !isCancelled && setIsPlaying(false));

        wavesurfer.current = ws;
      } catch (error) {
        console.error("Wavesurfer init error:", error);
      }
    };

    initWaveSurfer();

    return () => {
      isCancelled = true;
      ws?.destroy();
    };
  }, [url]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    wavesurfer.current?.playPause();
  };

  return { containerRef, isPlaying, isReady, togglePlay };
}
