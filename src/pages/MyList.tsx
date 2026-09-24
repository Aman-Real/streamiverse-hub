import { LoaderCircle, MoreVertical } from "lucide-react";
import { useMemo, useState } from "react";
import PillTabs, { type PillTab } from "@/components/common/PillTabs";
import Rating from "@/components/common/Rating";
import SectionHeader from "@/components/common/SectionHeader";
import PageShell from "@/components/layout/PageShell";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CategoryRow from "@/features/catalog/components/CategoryRow";
import VideoCard from "@/features/catalog/components/VideoCard";
import { useCatalogBrowser } from "@/features/catalog/hooks/useCatalogBrowser";
import type { VideoType } from "@/features/catalog/types";
import {
  filterByType, formatLength, getResumeLabel, searchVideos, sortVideos, type SortKey,
} from "@/features/catalog/utils/catalog";
import MyListButton from "@/features/my-list/components/MyListButton";
import { useMyList } from "@/features/my-list/hooks/useMyList";
import ProfileSummary from "@/features/profile/components/ProfileSummary";
import { useWatchProgress } from "@/features/watch-progress/hooks/useWatchProgress";

const PAGE_SIZE = 6;

const FILTERS: PillTab<VideoType | "all">[] = [
  { value: "all", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "series", label: "Series" },
];

const SORT_LABELS: Record<SortKey, string> = { recent: "Recently Added", rating: "Top Rated", title: "A–Z" };

const GENRE_TONES: Record<string, BadgeProps["variant"]> = {
  "Sci-Fi": "lavender", Drama: "lavender", Thriller: "amber", Adventure: "amber", Fantasy: "rose",
};

/** My Lounge: profile, continue watching and the saved titles library. */
const MyList = () => {
  const { continueWatching, withProgress, removeProgress } = useWatchProgress();
  const { myList } = useMyList();
  const browser = useCatalogBrowser();
  const [filter, setFilter] = useState<VideoType | "all">("all");
  const [sort, setSort] = useState<SortKey>("recent");
  const [showAll, setShowAll] = useState(false);

  // Saved titles carry their own card data; progress is merged in so it's always current.
  const saved = useMemo(
    () => sortVideos(searchVideos(filterByType(myList.map(withProgress), filter), browser.search), sort),
    [myList, withProgress, filter, sort, browser.search],
  );
  const visible = showAll ? saved : saved.slice(0, PAGE_SIZE);

  return (
    <PageShell onSearch={browser.setSearch} withFooter>
      <div className="page-container">
        <ProfileSummary savedCount={myList.length} />

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
                    <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8 text-muted-foreground" aria-label="More options">
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
            title="Saved Titles"
            count={`${saved.length} titles`}
            action={
              <>
                <PillTabs items={FILTERS} value={filter} onChange={setFilter} />
                <Select value={sort} onValueChange={value => setSort(value as SortKey)}>
                  <SelectTrigger className="h-11 w-auto gap-2 rounded-full bg-card/60 px-4">
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
            <p className="rounded-2xl border border-dashed py-16 text-center text-muted-foreground">
              Nothing saved here yet. Add titles with "My List" on Home or Explore.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {visible.map(video => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onSelect={browser.openDetail}
                    meta={`${video.year} • ${formatLength(video)}`}
                    overlay={<Badge variant="glass" className="absolute right-3 top-3"><Rating value={video.score} /></Badge>}
                    footer={
                      <div className="mt-auto flex items-center justify-between border-t pt-3">
                        <Badge variant={GENRE_TONES[video.genre] ?? "secondary"} className="rounded-md uppercase tracking-wider">
                          {video.genre}
                        </Badge>
                        <MyListButton video={video} variant="ghost" className="h-8 w-8" />
                      </div>
                    }
                  />
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card px-6 py-4 text-sm text-muted-foreground">
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
