import { Play, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Episode } from "@/features/catalog/types";

interface UpNextCardProps {
  episode: Episode;
  /** Counts down and starts the episode by itself (the "Autoplay next episode" setting). */
  autoplay: boolean;
  /** Countdown length when autoplaying. */
  seconds: number;
  onPlay: () => void;
  onCancel: () => void;
}

/**
 * "Up next" card over the player when an episode ends. With autoplay on it counts down and plays the
 * next episode; either way the viewer can play it now or dismiss the card.
 */
const UpNextCard = ({ episode, autoplay, seconds, onPlay, onCancel }: UpNextCardProps) => {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (!autoplay) return;
    if (remaining <= 0) {
      onPlay();
      return;
    }
    const timer = window.setTimeout(() => setRemaining(value => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [autoplay, remaining, onPlay]);

  return (
    <div className="absolute inset-0 z-10 flex items-end justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 sm:p-6">
      <div role="status" aria-live="polite" className="w-full max-w-sm rounded-2xl border bg-card/95 p-4 shadow-2xl backdrop-blur animate-in fade-in-0 slide-in-from-bottom-2">
        <p className="eyebrow">Up next</p>
        <p className="mt-1 truncate font-semibold text-foreground">
          S{episode.season}:E{episode.number} · {episode.title}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {autoplay ? `Starts in ${Math.max(0, remaining)}s` : "Autoplay is off in Settings."}
        </p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" className="flex-1" onClick={onPlay}>
            <Play className="fill-current" /> Play now
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>
            <X /> {autoplay ? "Cancel" : "Close"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpNextCard;
