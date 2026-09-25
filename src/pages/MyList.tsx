import { Bookmark, House, LoaderCircle, MoreVertical } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import EmptyState from "@/components/common/EmptyState";
import PillTabs, { type PillTab } from "@/components/common/PillTabs";
import Rating from "@/components/common/Rating";
import SectionHeader from "@/components/common/SectionHeader";
import PageShell from "@/components/layout/PageShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CategoryRow from "@/features/catalog/components/CategoryRow";
import VideoCard from "@/features/catalog/components/VideoCard";
import VideoGrid from "@/features/catalog/components/VideoGrid";
import { useCatalogBrowser } from "@/features/catalog/hooks/useCatalogBrowser";
import type { VideoType } from "@/features/catalog/types";
import {
  filterByType, formatLength, getResumeLabel, searchVideos, sortVideos, type SortKey,
} from "@/features/catalog/utils/catalog";
import MyListButton from "@/features/my-list/components/MyListButton";
import { useMyList } from "@/features/my-list/hooks/useMyList";
import ProfileSummary from "@/features/profile/components/ProfileSummary";
import { useWatchProgress } from "@/features/watch-progress/hooks/useWatchProgress";

/** Saved titles shown before "Load all": fills whole rows at every grid width (2, 3, 4 or 6 columns). */
const PAGE_SIZE = 12;

const FILTERS: PillTab<VideoType | "all">[] = [
  { value: "all", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "series", label: "Series" },
];

const SORT_LABELS: Record<SortKey, string> = { recent: "Recently Added", rating: "Top Rated", title: "A–Z" };

/** My Lounge: profile, continue watching and the Watchlist (every title saved with the Save button). */
const MyList = () => {
  const { continueWatching, withProgress, removeProgress } = useWatchProgress();
  const { myList } = useMyList();
  const browser = useCatalogBrowser();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<VideoType | "all">("all");
  const [sort, setSort] = useState<SortKey>("recent");
  const [showAll, setShowAll] = useState(false);
  const query = browser.search.trim();

  // Saved titles carry their own card data; progress is merged in so it's always current.
  const saved = useMemo(
    () => sortVideos(searchVideos(filterByType(myList.map(withProgress), filter), browser.search), sort),
    [myList, withProgress, filter, sort, browser.search],
  );
  const visible = showAll ? saved : saved.slice(0, PAGE_SIZE);

  return (
    <PageShell searchable withFooter>
      <div className="page-container">
        <ProfileSummary savedCount={myList.length} inProgressCount={continueWatching.length} />

        <CategoryRow
          title="Continue Watching"
          icon={<LoaderCircle className="h-6 w-6 text-primary" />}
          count={`${continueWatching.length} in progress`}
          columns={3}
        >
          {continueWatching.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              variant="landscape"
              onSelect={browser.openPlayer}
              meta={getResumeLabel(video)}
              aside={
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={event => event.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8 text-muted-foreground" aria-label={`More options for ${video.title}`}>
                      <MoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={event => event.stopPropagation()}>
                    <DropdownMenuItem onSelect={() => browser.openDetail(video)}>View details</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => removeProgress(video.id)}>Remove from Continue Watching</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              }
            />
          ))}
        </CategoryRow>

        <section>
          <SectionHeader
            title="Watchlist"
            icon={<Bookmark className="h-6 w-6 text-primary" />}
            count={`${saved.length} ${saved.length === 1 ? "title" : "titles"}`}
            action={
              <>
                <PillTabs items={FILTERS} value={filter} onChange={setFilter} />
                <Select value={sort} onValueChange={value => setSort(value as SortKey)}>
                  <SelectTrigger className="h-11 w-auto gap-2 rounded-full bg-card/60 px-4" aria-label="Sort Watchlist">
                    <span className="text-muted-foreground">Sort:</span>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SORT_LABELS).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </>
            }
          />

          {saved.length === 0 ? (
            myList.length === 0 ? (
              <EmptyState
                icon={Bookmark}
                title="Your Watchlist is empty"
                description="Tap Save on any movie or series and it shows up here, on every device you sign in on."
                action={<Button onClick={() => navigate(ROUTES.home)}><House /> Browse titles</Button>}
              />
            ) : (
              <EmptyState
                title="No saved titles match"
                description={query ? `Nothing in your Watchlist matches "${query}".` : "Try another filter."}
                action={
                  <Button variant="outline" onClick={() => { setFilter("all"); browser.setSearch(""); }}>
                    Show all saved titles
                  </Button>
                }
              />
            )
          ) : (
            <>
              <VideoGrid>
                {visible.map(video => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onSelect={browser.openDetail}
                    meta={`${video.year} • ${formatLength(video)}`}
                    overlay={<Badge variant="glass" className="absolute right-3 top-3"><Rating value={video.score} /></Badge>}
                    footer={
                      <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
                        <Badge variant="brand" className="min-w-0 truncate rounded-md">
                          {video.genre}
                        </Badge>
                        <MyListButton video={video} variant="ghost" className="h-8 w-8 shrink-0" />
                      </div>
                    }
                  />
                ))}
              </VideoGrid>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card px-4 py-4 text-sm text-muted-foreground sm:px-6">
                <span className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Displaying {visible.length} of {saved.length} saved titles
                </span>
                {visible.length < saved.length && (
                  <Button variant="outline" onClick={() => setShowAll(true)}>Load All {saved.length} Saved Titles</Button>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </PageShell>
  );
};

export default MyList;
