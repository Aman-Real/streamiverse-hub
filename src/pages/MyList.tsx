import { useState, useMemo, useCallback } from "react";
import Navbar from "@/components/Navbar";
import CategoryRow from "@/components/CategoryRow";
import VideoPlayer from "@/components/VideoPlayer";
import VideoDetail from "@/components/VideoDetail";
import { Video } from "@/lib/videoData";
import { useMyList } from "@/hooks/useMyList";

const MyList = () => {
  const { myList, removeFromList } = useMyList();
  const [search, setSearch] = useState("");
  const [playing, setPlaying] = useState<Video | null>(null);
  const [detail, setDetail] = useState<Video | null>(null);

  const filteredList = useMemo(() => {
    if (!search.trim()) return myList;
    const q = search.toLowerCase();
    return myList.filter(v => v.title.toLowerCase().includes(q) || v.genre.toLowerCase().includes(q));
  }, [search, myList]);

  const categories = useMemo(() => {
    if (filteredList.length === 0) return [];
    return [{ name: "My List", items: filteredList }];
  }, [filteredList]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={setSearch} />
      <div className="pt-24 px-6 md:px-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">My List</h1>
        {categories.length === 0 && (
          <p className="text-muted-foreground text-center py-20">Your list is empty. Add videos from the home page!</p>
        )}
        {categories.map(cat => (
          <CategoryRow key={cat.name} title={cat.name} videos={cat.items} onPlay={setPlaying} onInfo={setDetail} />
        ))}
      </div>
      <footer className="py-8 px-12 text-center text-xs text-muted-foreground border-t border-border mt-8">
        © 2025 Streamix. All rights reserved.
      </footer>
      {detail && <VideoDetail video={detail} onClose={() => setDetail(null)} onPlay={v => { setDetail(null); setPlaying(v); }} />}
      {playing && <VideoPlayer video={playing} onClose={() => setPlaying(null)} onProgressUpdate={() => {}} />}
    </div>
  );
};

export default MyList;
