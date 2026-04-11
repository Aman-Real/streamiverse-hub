import { useState, useMemo, useCallback } from "react";
import Navbar from "@/components/Navbar";
import CategoryRow from "@/components/CategoryRow";
import VideoPlayer from "@/components/VideoPlayer";
import VideoDetail from "@/components/VideoDetail";
import { videos as initialVideos, Video } from "@/lib/videoData";

const Series = () => {
  const [videoList, setVideoList] = useState(initialVideos);
  const [search, setSearch] = useState("");
  const [playing, setPlaying] = useState<Video | null>(null);
  const [detail, setDetail] = useState<Video | null>(null);

  const handleProgress = useCallback((id: string, progress: number) => {
    setVideoList(prev => prev.map(v => v.id === id ? { ...v, progress: Math.round(progress) } : v));
  }, []);

  const series = useMemo(() => videoList.filter(v => v.type === "series"), [videoList]);

  const filteredCategories = useMemo(() => {
    let items = series;
    if (search.trim()) {
      const q = search.toLowerCase();
      items = series.filter(v => v.title.toLowerCase().includes(q) || v.genre.toLowerCase().includes(q));
    }
    const genres = [...new Set(items.map(v => v.genre))];
    return genres.map(g => ({ name: g, items: items.filter(v => v.genre === g) }));
  }, [search, series]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={setSearch} />
      <div className="pt-24 px-6 md:px-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">Series</h1>
        {filteredCategories.length === 0 && (
          <p className="text-muted-foreground text-center py-20">No series found.</p>
        )}
        {filteredCategories.map(cat => (
          <CategoryRow key={cat.name} title={cat.name} videos={cat.items} onPlay={setPlaying} onInfo={setDetail} />
        ))}
      </div>
      <footer className="py-8 px-12 text-center text-xs text-muted-foreground border-t border-border mt-8">
        © 2025 Streamix. All rights reserved.
      </footer>
      {detail && <VideoDetail video={detail} onClose={() => setDetail(null)} onPlay={v => { setDetail(null); setPlaying(v); }} />}
      {playing && <VideoPlayer video={playing} onClose={() => setPlaying(null)} onProgressUpdate={handleProgress} />}
    </div>
  );
};

export default Series;
