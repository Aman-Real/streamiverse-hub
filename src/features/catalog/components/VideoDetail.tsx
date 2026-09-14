import { Check, Play, Plus, ThumbsUp, X } from "lucide-react";
import type { Video } from "@/features/catalog/types";
import { useMyList } from "@/features/my-list/hooks/useMyList";

interface VideoDetailProps {
  video: Video;
  onClose: () => void;
  onPlay: (video: Video) => void;
}

const VideoDetail = ({ video, onClose, onPlay }: VideoDetailProps) => {
  const { isInList, toggleList } = useMyList();
  const inList = isInList(video.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stream-overlay/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-2xl mx-4 bg-card rounded-lg overflow-hidden shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="relative aspect-video">
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-card/80 rounded-full flex items-center justify-center text-foreground hover:bg-card"><X className="w-4 h-4" /></button>
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-foreground mb-2">{video.title}</h2>
            <div className="flex gap-2">
              <button onClick={() => onPlay(video)} className="flex items-center gap-1.5 bg-foreground text-background px-5 py-2 rounded-sm text-sm font-semibold hover:bg-foreground/90 transition-colors"><Play className="w-4 h-4 fill-current" /> Play</button>
              <button
                onClick={() => toggleList(video)}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${inList ? "border-primary bg-primary/20 text-primary" : "border-muted-foreground/40 text-foreground hover:border-foreground"}`}
                title={inList ? "Remove from My List" : "Add to My List"}
              >
                {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
              <button className="w-9 h-9 rounded-full border border-muted-foreground/40 flex items-center justify-center text-foreground hover:border-foreground transition-colors"><ThumbsUp className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3 text-sm">
            <span className="text-green-500 font-semibold">98% Match</span>
            <span className="text-muted-foreground">{video.year}</span>
            <span className="border border-muted-foreground/40 px-1.5 py-0.5 text-xs text-muted-foreground rounded-sm">{video.rating}</span>
            <span className="text-muted-foreground">{video.duration}</span>
          </div>
          <p className="text-sm text-secondary-foreground leading-relaxed mb-4">{video.description}</p>
          {video.progress > 0 && (
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Your progress</span>
                <span>{video.progress}%</span>
              </div>
              <div className="h-1 bg-muted rounded-full">
                <div className="h-full bg-primary rounded-full" style={{ width: `${video.progress}%` }} />
              </div>
            </div>
          )}
          <div className="mt-4 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Genre:</span> {video.genre}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
