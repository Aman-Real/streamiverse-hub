import { History, Play, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { videos } from "@/lib/videoData";

const WatchHistory = () => {
  const [search, setSearch] = useState("");
  const watched = videos.filter(v => v.progress > 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onSearch={setSearch} />
      <div className="pt-24 px-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3"><History className="w-8 h-8" /> Watch History</h1>
          <button className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors">
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>
        {watched.length === 0 ? (
          <p className="text-muted-foreground text-center py-16">No watch history yet. Start watching something!</p>
        ) : (
          <div className="space-y-3">
            {watched.map(v => (
              <div key={v.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
                <img src={v.thumbnail} alt={v.title} className="w-28 h-16 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{v.title}</p>
                  <p className="text-xs text-muted-foreground">{v.genre} • {v.year}</p>
                  <div className="mt-1 h-1 bg-secondary rounded-full w-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${v.progress}%` }} />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{v.progress}%</span>
                <Play className="w-5 h-5 text-primary shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchHistory;
