import { Clapperboard, Play } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Rating from "@/components/common/Rating";
import SectionHeader from "@/components/common/SectionHeader";
import PageShell from "@/components/layout/PageShell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CategoryRow from "@/features/catalog/components/CategoryRow";
import EpisodeList from "@/features/catalog/components/EpisodeList";
import HeroBanner from "@/features/catalog/components/HeroBanner";
import VideoCard from "@/features/catalog/components/VideoCard";
import { useCatalogBrowser } from "@/features/catalog/hooks/useCatalogBrowser";
import { useVideoLibrary } from "@/features/catalog/hooks/useVideoLibrary";
import { currentEpisode, formatLength, getRecommendations } from "@/features/catalog/utils/catalog";
import MyListButton from "@/features/my-list/components/MyListButton";
import { getInitials } from "@/lib/utils";

const CAST_PREVIEW = 4;

/** Title details for /explore/:id; without an id it explores the featured title. */
const Explore = () => {
  const { id } = useParams();
  const { videos } = useVideoLibrary();
  const browser = useCatalogBrowser();
  const [showFullCast, setShowFullCast] = useState(false);
  const video = videos.find(item => item.id === id) ?? videos[0];
  const recommendations = useMemo(() => (video ? getRecommendations(videos, video) : []), [videos, video]);

  if (!video) return null;
  const cast = video.cast ?? [];
  const season = currentEpisode(video)?.season;

  return (
    <PageShell withFooter>
      <div className="page-container">
        <HeroBanner
          video={video}
          label="Original"
          eyebrow={video.tagline}
          tags={[String(video.year), video.rating, formatLength(video), ...video.formats]}
          actions={
            <>
              <Button variant="light" onClick={() => browser.openPlayer(video)}>
                <Play className="fill-current" /> {season ? `Play Season ${season}` : "Play"}
              </Button>
              <MyListButton video={video} label="Watchlist" />
              <Button variant="outline" onClick={() => browser.openPlayer(video)}><Clapperboard /> Trailer</Button>
            </>
          }
        />

        <EpisodeList key={video.id} video={video} onPlay={browser.openPlayer} />

        {cast.length > 0 && (
          <section>
            <SectionHeader
              eyebrow="Ensemble"
              title="Cast & Visionaries"
              action={cast.length > CAST_PREVIEW && (
                <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setShowFullCast(!showFullCast)}>
                  {showFullCast ? "Show Less" : "View Full Credits"}
                </Button>
              )}
            />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {(showFullCast ? cast : cast.slice(0, CAST_PREVIEW)).map(member => (
                <div key={member.name} className="rounded-2xl border bg-card p-5 text-center">
                  <Avatar className="mx-auto mb-3 h-16 w-16 border-2">
                    <AvatarFallback className="bg-secondary font-semibold">{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-semibold text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                  <p className="mt-3 text-xs text-muted-foreground/70">{member.credits}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <CategoryRow eyebrow="Recommendations" title="More Like This">
          {recommendations.map(item => (
            <VideoCard
              key={item.id}
              video={item}
              onSelect={browser.openDetail}
              overlay={<Badge variant="glass" className="absolute left-3 top-3">{item.match}% Match</Badge>}
              meta={formatLength(item)}
              aside={<Rating value={item.score} />}
            />
          ))}
        </CategoryRow>
      </div>
    </PageShell>
  );
};

export default Explore;
