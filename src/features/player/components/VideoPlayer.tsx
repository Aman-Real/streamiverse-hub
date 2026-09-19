import { ArrowLeft, ChevronsRight, Maximize, Pause, PictureInPicture2, Play, RotateCcw, RotateCw, Subtitles, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { Video } from "@/features/catalog/types";
import { currentEpisode } from "@/features/catalog/utils/catalog";
import MyListButton from "@/features/my-list/components/MyListButton";
import { formatPlaybackTime } from "@/features/player/utils/time";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
  onProgressUpdate: (id: string, progress: number) => void;
}

const CONTROLS_HIDE_DELAY_MS = 3000;
const SKIP_SECONDS = 10;
/** Where "Skip Intro" jumps to. */
const INTRO_END_SECONDS = 42;

const Control = ({ className, ...props }: ButtonProps) => (
  <Button variant="ghost" size="icon" className={cn("text-foreground", className)} {...props} />
);

const VideoPlayer = ({ video, onClose, onProgressUpdate }: VideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimerRef = useRef<number | undefined>(undefined);
  /** Last percentage pushed upward - keeps us from re-rendering the app 4x/sec. */
  const lastReportedRef = useRef(-1);

  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
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

  const seekTo = (seconds: number) => {
    if (videoRef.current) videoRef.current.currentTime = seconds;
  };

  const changeVolume = ([value]: number[]) => {
    if (videoRef.current) videoRef.current.volume = value;
    setVolume(value);
    setMuted(value === 0);
  };

  const toggleCaptions = () => {
    const track = videoRef.current?.textTracks[0];
    if (track) track.mode = track.mode === "showing" ? "hidden" : "showing";
  };

  const togglePictureInPicture = () =>
    (document.pictureInPictureElement ? document.exitPictureInPicture() : videoRef.current?.requestPictureInPicture())?.catch(() => {});

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

  const handleBuffer = () => {
    const ranges = videoRef.current?.buffered;
    if (ranges?.length) setBuffered(ranges.end(ranges.length - 1));
  };

  const episode = currentEpisode(video);
  const percentOf = (seconds: number) => (duration > 0 ? (seconds / duration) * 100 : 0);

  return (
    <div
      ref={containerRef}
      onMouseMove={revealControls}
      className="relative min-h-[20rem] overflow-hidden rounded-3xl border bg-background md:aspect-video"
    >
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.backdrop ?? video.thumbnail}
        autoPlay
        muted={muted}
        onClick={togglePlay}
        className="absolute inset-0 h-full w-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onProgress={handleBuffer}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={event => setDuration(event.currentTarget.duration)}
      />

      <div
        className={cn(
          "pointer-events-none absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-background/80 via-transparent to-background/70 p-4 transition-all duration-300 md:p-6",
          !showControls && "invisible opacity-0",
        )}
      >
        <div className="pointer-events-auto flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onClose}><ArrowLeft /> Back</Button>
          <p className="min-w-0 truncate border-l pl-4 text-lg font-medium text-foreground">
            {video.title}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {episode ? `S${episode.season}:E${episode.number} · ${episode.title}` : `${video.genre} · ${video.year}`}
            </span>
          </p>
          <div className="ml-auto hidden gap-2 md:flex">
            {video.formats.map(format => <Badge key={format} variant="glass" className="py-1">{format}</Badge>)}
          </div>
          <MyListButton video={video} className="ml-auto md:ml-0" />
        </div>

        <div className="space-y-3">
          {currentTime < INTRO_END_SECONDS && (
            <Button variant="outline" className="pointer-events-auto bg-background/70" onClick={() => seekTo(INTRO_END_SECONDS)}>
              <ChevronsRight className="text-primary" /> Skip Intro
              <span className="font-mono text-xs text-muted-foreground">{formatPlaybackTime(INTRO_END_SECONDS - currentTime)}</span>
            </Button>
          )}

          <div className="pointer-events-auto rounded-2xl border bg-background/80 px-4 pb-2 pt-4 backdrop-blur-xl md:px-6">
            <div className="relative flex items-center">
              <div className="absolute left-0 h-1 rounded-full bg-foreground/20" style={{ width: `${percentOf(buffered)}%` }} />
              <Slider aria-label="Seek" value={[currentTime]} max={duration || 1} step={1} onValueChange={([value]) => seekTo(value)} />
            </div>
            <div className="mt-2 flex items-center gap-1">
              <Control aria-label={playing ? "Pause" : "Play"} onClick={togglePlay}>
                {playing ? <Pause className="fill-current" /> : <Play className="fill-current" />}
              </Control>
              <Control className="hidden sm:inline-flex" aria-label="Back 10 seconds" onClick={() => seekTo(currentTime - SKIP_SECONDS)}><RotateCcw /></Control>
              <Control className="hidden sm:inline-flex" aria-label="Forward 10 seconds" onClick={() => seekTo(currentTime + SKIP_SECONDS)}><RotateCw /></Control>
              <span className="ml-3 font-mono text-sm text-foreground">
                {formatPlaybackTime(currentTime)} <span className="text-muted-foreground">/ {formatPlaybackTime(duration)}</span>
              </span>
              <Control className="ml-auto" aria-label={muted ? "Unmute" : "Mute"} onClick={() => setMuted(!muted)}>
                {muted ? <VolumeX /> : <Volume2 />}
              </Control>
              <Slider aria-label="Volume" value={[muted ? 0 : volume]} max={1} step={0.05} onValueChange={changeVolume} className="mr-2 hidden w-20 sm:flex" />
              <Control className="hidden sm:inline-flex" aria-label="Toggle captions" onClick={toggleCaptions}><Subtitles /></Control>
              <Control className="hidden sm:inline-flex" aria-label="Picture in picture" onClick={togglePictureInPicture}><PictureInPicture2 /></Control>
              <Control aria-label="Fullscreen" onClick={() => containerRef.current?.requestFullscreen()}><Maximize /></Control>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
