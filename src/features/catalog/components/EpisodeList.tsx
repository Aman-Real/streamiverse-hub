import { Download, PlayCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import SectionHeader from "@/components/common/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Thumbnail from "@/features/catalog/components/Thumbnail";
import type { Video } from "@/features/catalog/types";
import { currentEpisode, formatRuntime, timeLeft } from "@/features/catalog/utils/catalog";
import { cn } from "@/lib/utils";

interface EpisodeListProps {
  video: Video;
  onPlay: (video: Video) => void;
}

/** Season picker and episode rows for a series. Key it by video id so the season resets per title. */
const EpisodeList = ({ video, onPlay }: EpisodeListProps) => {
  const episodes = video.episodes ?? [];
  const seasons = [...new Set(episodes.map(episode => episode.season))];
  const [season, setSeason] = useState(currentEpisode(video)?.season ?? seasons[0]);
  const countIn = (value: number) => episodes.filter(episode => episode.season === value).length;

  if (episodes.length === 0) return null;

  return (
    <section>
      <SectionHeader
        eyebrow="Episodes"
        title={`Season ${season}`}
        action={
          <>
            <Select value={String(season)} onValueChange={value => setSeason(Number(value))}>
              <SelectTrigger className="h-9 w-52 rounded-full bg-card text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {seasons.map(value => (
                  <SelectItem key={value} value={String(value)}>Season {value} ({countIn(value)} Episodes)</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" aria-label="Download season" onClick={() => toast.success(`Season ${season} queued for download`)}>
              <Download />
            </Button>
          </>
        }
      />
      <div className="space-y-3">
        {episodes.filter(episode => episode.season === season).map(episode => {
          const inProgress = episode.progress > 0 && episode.progress < 100;
          return (
            <article key={episode.id} className="flex flex-col gap-4 rounded-2xl border bg-card p-3 sm:flex-row">
              <Thumbnail src={episode.thumbnail} alt={episode.title} progress={episode.progress} className="aspect-video sm:w-56">
                <Badge variant="glass" className="absolute bottom-2 right-2">{formatRuntime(episode.runtime)}</Badge>
              </Thumbnail>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-1">
                <div className="flex items-start justify-between gap-3">
                  <p className={cn("text-xs", inProgress ? "font-medium text-primary-soft" : "text-muted-foreground")}>
                    {inProgress ? `E${episode.number} • In Progress (${timeLeft(episode)})` : `Episode ${episode.number}`}
                  </p>
                  <Badge variant="secondary" className="font-medium text-muted-foreground">{episode.format}</Badge>
                </div>
                <h3 className="font-semibold text-foreground">{episode.title}</h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">{episode.description}</p>
                <div className="mt-auto flex items-center justify-between border-t pt-2 text-xs text-muted-foreground">
                  Aired {episode.airDate}
                  <Button variant="ghost" size="icon" aria-label={`Play ${episode.title}`} onClick={() => onPlay(video)}>
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
