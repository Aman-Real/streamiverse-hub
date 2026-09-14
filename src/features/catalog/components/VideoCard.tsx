import { Play } from "lucide-react";
import type { Video } from "@/features/catalog/types";

interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
  onInfo: (video: Video) => void;
}

const VideoCard = ({ video, onPlay, onInfo }: VideoCardProps) => {
  return (
    <div
      className="group relative flex-shrink-0 w-[200px] md:w-[240px] cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10"
      onClick={() => onInfo(video)}
    >
      <div className="relative rounded-sm overflow-hidden aspect-[2/3]">
        <img src={video.thumbnail} alt={video.title} loading="lazy" className="w-full h-full object-cover" width={640} height={960} />
        <div className="absolute inset-0 bg-gradient-to-t from-stream-overlay/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <button
          onClick={e => { e.stopPropagation(); onPlay(video); }}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="w-12 h-12 rounded-full bg-foreground/90 flex items-center justify-center">
            <Play className="w-5 h-5 text-background fill-current ml-0.5" />
          </div>
        </button>
        {video.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
            <div className="h-full bg-primary rounded-r-sm" style={{ width: `${video.progress}%` }} />
          </div>
        )}
      </div>
      <div className="mt-2 px-0.5">
        <h3 className="text-sm font-medium text-foreground truncate">{video.title}</h3>
        <p className="text-xs text-muted-foreground">{video.year} • {video.genre}</p>
      </div>
    </div>
  );
};

export default VideoCard;
