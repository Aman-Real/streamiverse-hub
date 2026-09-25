import { useState } from "react";
import PillTabs, { type PillTab } from "@/components/common/PillTabs";
import Rating from "@/components/common/Rating";
import type { GenreOption } from "@/config/catalog.config";
import CategoryRow from "@/features/catalog/components/CategoryRow";
import VideoCard from "@/features/catalog/components/VideoCard";
import { useGenreMix } from "@/features/catalog/hooks/useCatalogQueries";
import type { Video } from "@/features/catalog/types";

interface GenreRowProps {
  title: string;
  options: readonly GenreOption[];
  /** The choice shown until the viewer picks one, e.g. their favourite genre. Defaults to the first option. */
  initialOptionId?: string;
  onSelect: (video: Video) => void;
}

const NO_OPTION: GenreOption = { id: "", label: "" };

/**
 * A row with genre chips above it: pick a genre, and the row shows its most popular movies and series.
 * The chips scroll sideways on phones and wrap onto more lines on wider screens.
 */
const GenreRow = ({ title, options, initialOptionId, onSelect }: GenreRowProps) => {
  const [pickedId, setPickedId] = useState<string | null>(null);
  const selectedId = pickedId ?? initialOptionId ?? options[0]?.id;
  const selected = options.find(option => option.id === selectedId) ?? options[0];
  const { videos, isLoading } = useGenreMix(selected ?? NO_OPTION, Boolean(selected));
  if (!selected) return null;

  const tabs: PillTab<string>[] = options.map(option => ({ value: option.id, label: option.label }));

  return (
    <CategoryRow
      title={title}
      loading={isLoading}
      emptyMessage={`No ${selected.label.toLowerCase()} titles to show right now. Try another genre.`}
      toolbar={
        <PillTabs
          items={tabs}
          value={selected.id}
          tone="brand"
          onChange={setPickedId}
          className="md:flex-wrap md:overflow-visible md:rounded-3xl"
        />
      }
    >
      {videos.map(video => (
        <VideoCard
          key={video.id}
          video={video}
          onSelect={onSelect}
          meta={`${video.type === "movie" ? "Movie" : "Series"} • ${video.year}`}
          aside={<Rating value={video.score} />}
        />
      ))}
    </CategoryRow>
  );
};

export default GenreRow;
