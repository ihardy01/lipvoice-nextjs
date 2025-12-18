// hooks/use-wave-surfer.ts
import { useEffect, useRef, useState } from "react";

export function useWaveSurfer(url: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // [!code ++]
  const [duration, setDuration] = useState(0); // [!code ++]

  useEffect(() => {
    let ws: any = null;
    let isCancelled = false;

    const initWaveSurfer = async () => {
      if (!containerRef.current) return;

      try {
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

        ws.on("ready", () => {
          if (!isCancelled) {
            setIsReady(true);
            setDuration(ws.getDuration()); // [!code ++] Lấy tổng thời gian
          }
        });

        // [!code ++] Cập nhật thời gian hiện tại khi đang phát
        ws.on("audioprocess", () => {
          if (!isCancelled) setCurrentTime(ws.getCurrentTime());
        });

        // [!code ++] Cập nhật khi người dùng nhấn (seek) trên thanh sóng
        ws.on("interaction", () => {
          if (!isCancelled) setCurrentTime(ws.getCurrentTime());
        });

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

  // [!code ++] Hàm định dạng giây thành mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    containerRef,
    isPlaying,
    isReady,
    togglePlay,
    currentTime: formatTime(currentTime), // [!code ++]
    duration: formatTime(duration), // [!code ++]
  };
}
