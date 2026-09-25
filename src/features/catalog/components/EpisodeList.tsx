import { PlayCircle } from "lucide-react";
import { useState } from "react";
import SectionHeader from "@/components/common/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Thumbnail from "@/features/catalog/components/Thumbnail";
import type { Episode, Video } from "@/features/catalog/types";
import { currentEpisode, formatRuntime, timeLeft } from "@/features/catalog/utils/catalog";
import { cn } from "@/lib/utils";

interface EpisodeListProps {
  video: Video;
  /** Plays the title from the chosen episode. */
  onPlay: (video: Video, episode?: Episode) => void;
  /** The episode playing right now (Watch Room); it's highlighted and its season opens first. */
  activeEpisodeId?: string;
}

/** Season picker and episode rows for a series. Key it by video id so the season resets per title. */
const EpisodeList = ({ video, onPlay, activeEpisodeId }: EpisodeListProps) => {
  const episodes = video.episodes ?? [];
  const seasons = [...new Set(episodes.map(episode => episode.season))];
  const active = episodes.find(episode => episode.id === activeEpisodeId);
  const [season, setSeason] = useState(active?.season ?? currentEpisode(video)?.season ?? seasons[0]);
  const countIn = (value: number) => episodes.filter(episode => episode.season === value).length;

  if (episodes.length === 0) return null;

  return (
    <section>
      <SectionHeader
        eyebrow="Episodes"
        title={`Season ${season}`}
        action={
          seasons.length > 1 && (
            <Select value={String(season)} onValueChange={value => setSeason(Number(value))}>
              <SelectTrigger className="h-9 w-full min-w-[12rem] rounded-full bg-card text-xs sm:w-52" aria-label="Choose season">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {seasons.map(value => (
                  <SelectItem key={value} value={String(value)}>Season {value} ({countIn(value)} Episodes)</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }
      />
      <div className="space-y-3">
        {episodes.filter(episode => episode.season === season).map(episode => {
          const inProgress = episode.progress > 0 && episode.progress < 100;
          const playing = episode.id === activeEpisodeId;
          const play = () => onPlay(video, episode);
          return (
            <article
              key={episode.id}
              aria-current={playing || undefined}
              className={cn(
                "flex flex-col gap-4 rounded-2xl border bg-card p-3 transition-colors sm:flex-row",
                playing ? "border-primary/60 bg-primary/5" : "hover:border-primary/40",
              )}
            >
              <button
                type="button"
                onClick={play}
                aria-label={`Play episode ${episode.number}: ${episode.title}`}
                className="group/thumb shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-56"
              >
                <Thumbnail src={episode.thumbnail} alt="" progress={episode.progress} className="aspect-video w-full">
                  <span className="absolute inset-0 grid place-items-center bg-background/40 opacity-0 transition-opacity group-hover/thumb:opacity-100 group-focus-visible/thumb:opacity-100">
                    <PlayCircle className="h-10 w-10 text-primary" />
                  </span>
                  {episode.runtime > 0 && <Badge variant="glass" className="absolute bottom-2 right-2">{formatRuntime(episode.runtime)}</Badge>}
                </Thumbnail>
              </button>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-1">
                <div className="flex items-start justify-between gap-3">
                  <p className={cn("text-xs", playing || inProgress ? "font-medium text-primary-soft" : "text-muted-foreground")}>
                    {playing
                      ? `Episode ${episode.number} • Now playing`
                      : inProgress
                        ? `E${episode.number} • In Progress (${timeLeft(episode)})`
                        : `Episode ${episode.number}`}
                  </p>
                  <Badge variant="secondary" className="font-medium text-muted-foreground">{episode.format}</Badge>
                </div>
                <h3 className="font-semibold text-foreground">{episode.title}</h3>
                {episode.description && <p className="line-clamp-2 text-sm text-muted-foreground">{episode.description}</p>}
                <div className="mt-auto flex items-center justify-between gap-3 border-t pt-2 text-xs text-muted-foreground">
                  {episode.airDate ? `Aired ${episode.airDate}` : <span />}
                  <Button variant="ghost" size="icon" aria-label={`Play ${episode.title}`} onClick={play}>
                    <PlayCircle />
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default EpisodeList;
