import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import VideoCard from "./VideoCard";
import { Video } from "@/lib/videoData";

interface CategoryRowProps {
  title: string;
  videos: Video[];
  onPlay: (video: Video) => void;
  onInfo: (video: Video) => void;
}

const CategoryRow = ({ title, videos, onPlay, onInfo }: CategoryRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 500, behavior: "smooth" });
  };

  if (videos.length === 0) return null;

  return (
    <section className="relative px-6 md:px-12 mb-10">
      <h3 className="text-lg font-semibold text-foreground tracking-wide mb-4">{title}</h3>
      <div className="group/row relative">
        <button onClick={() => scroll(-1)} className="absolute left-0 top-0 bottom-8 z-10 h-12 w-12 bg-gradient-to-r from-background to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity rounded-full">
          <ChevronLeft className="w-7 h-7 text-foreground" />
        </button>
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {videos.map(v => (
            <VideoCard key={v.id} video={v} onPlay={onPlay} onInfo={onInfo} />
          ))}
        </div>
        <button onClick={() => scroll(1)} className="absolute right-0 top-0 bottom-8 z-10 h-12 w-12 bg-gradient-to-l from-background to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity rounded-full">
          <ChevronRight className="w-7 h-7 text-foreground" />
        </button>
      </div>
    </section>
  );
};

export default CategoryRow;
