import { History, Play, Trash2 } from "lucide-react";
import { useMemo } from "react";
import PageShell from "@/components/layout/PageShell";
import { useVideoLibrary } from "@/features/catalog/hooks/useVideoLibrary";
import { getContinueWatching } from "@/features/catalog/utils/catalog";

const WatchHistory = () => {
  const { videos, clearWatchHistory } = useVideoLibrary();
  const watched = useMemo(() => getContinueWatching(videos), [videos]);

  return (
    <PageShell className="text-foreground">
      <div className="pt-24 px-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3"><History className="w-8 h-8" /> Watch History</h1>
          <button
            onClick={clearWatchHistory}
            className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>
        {watched.length === 0 ? (
          <p className="text-muted-foreground text-center py-16">No watch history yet. Start watching something!</p>
        ) : (
          <div className="space-y-3">
            {watched.map(video => (
              <div key={video.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
                <img src={video.thumbnail} alt={video.title} className="w-28 h-16 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{video.title}</p>
                  <p className="text-xs text-muted-foreground">{video.genre} • {video.year}</p>
                  <div className="mt-1 h-1 bg-secondary rounded-full w-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${video.progress}%` }} />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{video.progress}%</span>
                <Play className="w-5 h-5 text-primary shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default WatchHistory;
