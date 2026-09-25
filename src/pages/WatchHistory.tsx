import { History, Play, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES, watchRoute } from "@/app/routes";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import PageShell from "@/components/layout/PageShell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Video } from "@/features/catalog/types";
import { useWatchProgress } from "@/features/watch-progress/hooks/useWatchProgress";

/** "S2:E5 · Episode title" for series, the genre and year for movies. */
const describe = (video: Video) => {
  const episode = video.episodes?.[0];
  return episode ? `S${episode.season}:E${episode.number} · ${episode.title}` : `${video.genre} • ${video.year}`;
};

/** Everything the signed-in viewer has watched, finished titles included, most recent first. Tap a row to play. */
const WatchHistory = () => {
  const { history: watched, clearWatchHistory, removeProgress } = useWatchProgress();
  const navigate = useNavigate();

  const play = (video: Video) => {
    const episode = video.episodes?.[0];
    navigate(watchRoute(video.id, episode && { season: episode.season, episode: episode.number }));
  };

  return (
    <PageShell className="text-foreground" withFooter>
      <div className="page-container-narrow max-w-4xl">
        <PageHeader
          title="Watch History"
          icon={History}
          action={
            watched.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                    <Trash2 /> Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[calc(100vw-2rem)] rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear your watch history?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This removes every title from Watch History and Continue Watching, on all your devices. It can't be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-full">Keep history</AlertDialogCancel>
                    <AlertDialogAction className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={clearWatchHistory}>
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )
          }
        />
        {watched.length === 0 ? (
          <EmptyState
            icon={History}
            title="No watch history yet"
            description="Titles you play show up here, so you can jump back in."
            action={<Button onClick={() => navigate(ROUTES.home)}>Find something to watch</Button>}
          />
        ) : (
          <ul className="space-y-3">
            {watched.map(video => (
              <li key={video.id} className="group relative flex items-center gap-3 rounded-2xl border bg-card p-3 transition-colors hover:border-primary/40 sm:gap-4 sm:p-4">
                <button
                  type="button"
                  onClick={() => play(video)}
                  aria-label={`Play ${video.title}`}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-4"
                >
                  <img src={video.backdrop ?? video.thumbnail} alt="" loading="lazy" className="aspect-video w-24 shrink-0 rounded-lg bg-muted object-cover sm:w-28" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-foreground">{video.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">{describe(video)}</span>
                    <span className="mt-2 flex items-center gap-3">
                      <Progress value={video.progress} className="h-1 flex-1 bg-secondary" aria-label={`${video.progress}% watched`} />
                      <span className="w-16 shrink-0 text-right text-xs text-muted-foreground">
                        {video.progress >= 100 ? "Finished" : `${video.progress}%`}
                      </span>
                    </span>
                  </span>
                  <Play className="hidden h-5 w-5 shrink-0 text-primary sm:block" aria-hidden />
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  aria-label={`Remove ${video.title} from history`}
                  onClick={() => removeProgress(video.id)}
                >
                  <X />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
};

export default WatchHistory;
