import { Play } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorState from "@/components/common/ErrorState";
import LoadingState from "@/components/common/LoadingState";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import Rating from "@/components/common/Rating";
import SectionHeader from "@/components/common/SectionHeader";
import PageShell from "@/components/layout/PageShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CategoryRow from "@/features/catalog/components/CategoryRow";
import EpisodeList from "@/features/catalog/components/EpisodeList";
import HeroBanner from "@/features/catalog/components/HeroBanner";
import TrailerButton from "@/features/catalog/components/TrailerButton";
import VideoCard from "@/features/catalog/components/VideoCard";
import { useCatalogBrowser } from "@/features/catalog/hooks/useCatalogBrowser";
import { NO_VIDEOS, useTitle, useTrending } from "@/features/catalog/hooks/useCatalogQueries";
import { currentEpisode, formatLength } from "@/features/catalog/utils/catalog";
import MyListButton from "@/features/my-list/components/MyListButton";
import { useWatchProgress } from "@/features/watch-progress/hooks/useWatchProgress";
import { isTmdbNotFound } from "@/lib/tmdb";
import NotFound from "@/pages/NotFound";

const CAST_PREVIEW = 4;

/** Title details for /explore/:id; without an id it explores the top trending title. */
const Explore = () => {
  const { id } = useParams();
  const browser = useCatalogBrowser();
  const { withProgress } = useWatchProgress();
  const [showFullCast, setShowFullCast] = useState(false);
  const { data: trending = NO_VIDEOS } = useTrending(!id);
  const { data, error, refetch } = useTitle(id ?? trending[0]?.id);
  // Progress bars on the title and its episodes, and "Play Season N" for the season in progress.
  const video = useMemo(() => (data ? withProgress(data.video) : undefined), [data, withProgress]);
  const recommendations = data?.recommendations ?? NO_VIDEOS;

  if (isTmdbNotFound(error)) return <NotFound />;
  if (!video) {
    return (
      <PageShell>
        <div className="page-container">
          {error ? (
            <ErrorState title="Couldn't load this title" onRetry={() => void refetch()} />
          ) : (
            <LoadingState label="Loading title…" />
          )}
        </div>
      </PageShell>
    );
  }
  const cast = video.cast ?? [];
  const season = currentEpisode(video)?.season;

  return (
    <PageShell withFooter>
      <div className="page-container">
        <HeroBanner
          video={video}
          label={video.type === "movie" ? "Movie" : "Series"}
          eyebrow={video.tagline}
          tags={[String(video.year), video.rating, formatLength(video), ...video.formats]}
          actions={
            <>
              <Button onClick={() => browser.openPlayer(video)}>
                <Play className="fill-current" /> {season ? `Play Season ${season}` : "Play"}
              </Button>
              <MyListButton video={video} showLabel />
              <TrailerButton video={video} />
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
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {(showFullCast ? cast : cast.slice(0, CAST_PREVIEW)).map(member => (
                <div key={member.name} className="min-w-0 rounded-2xl border bg-card p-4 text-center sm:p-5">
                  <ProfileAvatar name={member.name} size="lg" tone="muted" className="mx-auto mb-3 border-2" />
                  <p className="truncate text-sm font-semibold text-foreground">{member.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{member.role}</p>
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
