import { useState, useMemo, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import CategoryRow from "@/components/CategoryRow";
import VideoPlayer from "@/components/VideoPlayer";
import VideoDetail from "@/components/VideoDetail";
import { videos as initialVideos, categories, Video } from "@/lib/videoData";

const Index = () => {
  const [videoList, setVideoList] = useState(initialVideos);
  const [search, setSearch] = useState("");
  const [playing, setPlaying] = useState<Video | null>(null);
  const [detail, setDetail] = useState<Video | null>(null);

  const handleProgress = useCallback((id: string, progress: number) => {
    setVideoList(prev => prev.map(v => v.id === id ? { ...v, progress: Math.round(progress) } : v));
  }, []);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    const filtered = videoList.filter(v => v.title.toLowerCase().includes(q) || v.genre.toLowerCase().includes(q));
    return filtered.length ? [{ name: "Search Results", items: filtered }] : [];
  }, [search, videoList]);

  const heroVideo = videoList[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={setSearch} />
      <HeroBanner video={heroVideo} onPlay={setPlaying} onInfo={setDetail} />
      <div className="-mt-24 relative z-10">
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

export default Index;
