import { X, Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { Video } from "@/lib/videoData";

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
  onProgressUpdate: (id: string, progress: number) => void;
}

const VideoPlayer = ({ video, onClose, onProgressUpdate }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const timerRef = useRef<number>();

  const hideControls = useCallback(() => {
    clearTimeout(timerRef.current);
    setShowControls(true);
    timerRef.current = window.setTimeout(() => setShowControls(false), 3000);
  }, []);

  useEffect(() => {
    hideControls();
    return () => clearTimeout(timerRef.current);
  }, [hideControls]);

  const toggle = () => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.pause(); else videoRef.current.play();
    setPlaying(!playing);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * duration;
  };

  const skip = (s: number) => { if (videoRef.current) videoRef.current.currentTime += s; };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-[100] bg-background" onMouseMove={hideControls} onClick={toggle}>
      <video
        ref={videoRef}
        src={video.videoUrl}
        autoPlay
        muted={muted}
        className="w-full h-full object-contain"
        onTimeUpdate={() => {
          if (!videoRef.current) return;
          setCurrent(videoRef.current.currentTime);
          const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
          onProgressUpdate(video.id, pct);
        }}
        onLoadedMetadata={() => { if (videoRef.current) setDuration(videoRef.current.duration); }}
      />

      <div className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={e => e.stopPropagation()}>
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-b from-stream-overlay/80 to-transparent">
          <h2 className="text-lg font-semibold text-foreground">{video.title}</h2>
          <button onClick={onClose} className="text-foreground hover:text-primary transition-colors"><X className="w-6 h-6" /></button>
        </div>

        {/* Center controls */}
        <div className="flex items-center justify-center gap-8">
          <button onClick={() => skip(-10)} className="text-foreground/80 hover:text-foreground"><SkipBack className="w-8 h-8" /></button>
          <button onClick={toggle} className="w-16 h-16 rounded-full bg-foreground/20 flex items-center justify-center hover:bg-foreground/30 transition-colors">
            {playing ? <Pause className="w-8 h-8 text-foreground" /> : <Play className="w-8 h-8 text-foreground ml-1" />}
          </button>
          <button onClick={() => skip(10)} className="text-foreground/80 hover:text-foreground"><SkipForward className="w-8 h-8" /></button>
        </div>

        {/* Bottom bar */}
        <div className="p-4 bg-gradient-to-t from-stream-overlay/80 to-transparent">
          <div className="cursor-pointer h-1.5 bg-muted rounded-full mb-3 group" onClick={seek}>
            <div className="h-full bg-primary rounded-full relative transition-all" style={{ width: `${progress}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{fmt(currentTime)} / {fmt(duration)}</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setMuted(!muted)} className="text-foreground hover:text-primary transition-colors">
                {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button onClick={() => videoRef.current?.requestFullscreen()} className="text-foreground hover:text-primary transition-colors">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
