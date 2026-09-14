import { Maximize, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Video } from "@/features/catalog/types";
import { formatPlaybackTime } from "@/features/player/utils/time";

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
  onProgressUpdate: (id: string, progress: number) => void;
}

const CONTROLS_HIDE_DELAY_MS = 3000;
const SKIP_SECONDS = 10;

const VideoPlayer = ({ video, onClose, onProgressUpdate }: VideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimerRef = useRef<number | undefined>(undefined);
  /** Last percentage pushed upward - keeps us from re-rendering the app 4x/sec. */
  const lastReportedRef = useRef(-1);

  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const revealControls = useCallback(() => {
    clearTimeout(hideTimerRef.current);
    setShowControls(true);
    hideTimerRef.current = window.setTimeout(() => setShowControls(false), CONTROLS_HIDE_DELAY_MS);
  }, []);

  useEffect(() => {
    revealControls();
    return () => clearTimeout(hideTimerRef.current);
  }, [revealControls]);

  useEffect(() => {
    lastReportedRef.current = -1;
  }, [video.id]);

  const togglePlay = () => {
    const element = videoRef.current;
    if (!element) return;
    if (element.paused) element.play(); else element.pause();
  };

  const seek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = ratio * duration;
  };

  const skip = (seconds: number) => {
    if (videoRef.current) videoRef.current.currentTime += seconds;
  };

  const handleTimeUpdate = () => {
    const element = videoRef.current;
    if (!element) return;
    setCurrentTime(element.currentTime);
    if (!Number.isFinite(element.duration) || element.duration === 0) return;
    const percent = Math.round((element.currentTime / element.duration) * 100);
    if (percent !== lastReportedRef.current) {
      lastReportedRef.current = percent;
      onProgressUpdate(video.id, percent);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] bg-background" onMouseMove={revealControls} onClick={togglePlay}>
      <video
        ref={videoRef}
        src={video.videoUrl}
        autoPlay
        muted={muted}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
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
          <button onClick={() => skip(-SKIP_SECONDS)} className="text-foreground/80 hover:text-foreground"><SkipBack className="w-8 h-8" /></button>
          <button onClick={togglePlay} className="w-16 h-16 rounded-full bg-foreground/20 flex items-center justify-center hover:bg-foreground/30 transition-colors">
            {playing ? <Pause className="w-8 h-8 text-foreground" /> : <Play className="w-8 h-8 text-foreground ml-1" />}
          </button>
          <button onClick={() => skip(SKIP_SECONDS)} className="text-foreground/80 hover:text-foreground"><SkipForward className="w-8 h-8" /></button>
        </div>

        {/* Bottom bar */}
        <div className="p-4 bg-gradient-to-t from-stream-overlay/80 to-transparent">
          <div className="cursor-pointer h-1.5 bg-muted rounded-full mb-3 group" onClick={seek}>
            <div className="h-full bg-primary rounded-full relative transition-all" style={{ width: `${progress}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{formatPlaybackTime(currentTime)} / {formatPlaybackTime(duration)}</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setMuted(!muted)} className="text-foreground hover:text-primary transition-colors">
                {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button onClick={() => containerRef.current?.requestFullscreen()} className="text-foreground hover:text-primary transition-colors">
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
