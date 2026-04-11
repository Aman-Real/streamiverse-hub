import { Play, Info } from "lucide-react";
import heroImage from "@/assets/hero-banner.jpg";
import { Video } from "@/lib/videoData";

interface HeroBannerProps {
  video: Video;
  onPlay: (video: Video) => void;
  onInfo: (video: Video) => void;
}

const HeroBanner = ({ video, onPlay, onInfo }: HeroBannerProps) => {
  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      <img src={heroImage} alt={video.title} className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

      <div className="absolute bottom-[15%] left-0 px-6 md:px-12 max-w-2xl animate-fade-in">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold bg-primary px-2 py-0.5 rounded-sm text-primary-foreground">{video.rating}</span>
          <span className="text-xs text-muted-foreground">{video.year}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{video.genre}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{video.duration}</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight">{video.title}</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed mb-6 line-clamp-3">{video.description}</p>
        <div className="flex items-center gap-3">
          <button onClick={() => onPlay(video)} className="flex items-center gap-2 bg-foreground text-background px-6 py-2.5 rounded-sm font-semibold text-sm hover:bg-foreground/90 transition-colors">
            <Play className="w-5 h-5 fill-current" /> Play
          </button>
          <button onClick={() => onInfo(video)} className="flex items-center gap-2 bg-secondary/80 text-foreground px-6 py-2.5 rounded-sm font-semibold text-sm hover:bg-secondary transition-colors">
            <Info className="w-5 h-5" /> More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
