// hooks/use-wave-surfer.ts
import { useEffect, useRef, useState, useCallback } from "react";

export function useWaveSurfer(url: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let ws: any = null;
    let isCancelled = false;

    const initWaveSurfer = async () => {
      if (!containerRef.current || !url) return;

      try {
        const WaveSurferModule = (await import("wavesurfer.js")).default;
        if (isCancelled) return;

        // Xóa nội dung cũ trước khi khởi tạo
        if (containerRef.current) containerRef.current.innerHTML = "";

        ws = WaveSurferModule.create({
          container: containerRef.current,
          waveColor: "#D1D5DB",
          progressColor: "#DB2777",
          cursorColor: "transparent",
          barWidth: 2,
          barGap: 3,
          barRadius: 2,
          height: 60, // Tăng nhẹ chiều cao để dễ nhìn hơn trong modal
          url: url,
        });

        ws.on("ready", () => {
          if (!isCancelled) {
            setIsReady(true);
            setDuration(ws.getDuration());
          }
        });

        ws.on("audioprocess", () => {
          if (!isCancelled) setCurrentTime(ws.getCurrentTime());
        });

        ws.on("interaction", () => {
          if (!isCancelled) setCurrentTime(ws.getCurrentTime());
        });

        ws.on("finish", () => !isCancelled && setIsPlaying(false));
        ws.on("play", () => !isCancelled && setIsPlaying(true));
        ws.on("pause", () => !isCancelled && setIsPlaying(false));

        wavesurferRef.current = ws;
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

  // Hàm điều khiển phát/tạm dừng
  const togglePlayPause = useCallback(() => {
    wavesurferRef.current?.playPause();
  }, []);

  // [!code ++] Hàm điều chỉnh tốc độ (0.8 - 1.2)
  const setSpeed = useCallback((speed: number) => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setPlaybackRate(speed);
    }
  }, []);

  // Hàm định dạng thời gian
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    containerRef,
    isPlaying,
    isReady,
    togglePlayPause,
    setSpeed, // [!code ++] Xuất hàm setSpeed ra ngoài
    currentTime, // Trả về dạng number để tính toán %
    duration, // Trả về dạng number
    formattedCurrentTime: formatTime(currentTime), // Trả về dạng string để hiển thị
    formattedDuration: formatTime(duration), // Trả về dạng string để hiển thị
  };
}
