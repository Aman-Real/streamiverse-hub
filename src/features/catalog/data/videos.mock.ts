import thumb1 from "@/assets/images/thumb-1.jpg";
import thumb2 from "@/assets/images/thumb-2.jpg";
import thumb3 from "@/assets/images/thumb-3.jpg";
import thumb4 from "@/assets/images/thumb-4.jpg";
import thumb5 from "@/assets/images/thumb-5.jpg";
import thumb6 from "@/assets/images/thumb-6.jpg";
import type { Video } from "@/features/catalog/types";

/**
 * MOCK DATA - replace this whole file with an API call when the backend lands.
 * Nothing outside this folder imports it directly; everything reads the catalog
 * through <VideoLibraryProvider>, so the swap is a one-file change.
 */

const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export const MOCK_VIDEOS: Video[] = [
  { id: "1", title: "Neon Metropolis", description: "In a sprawling cyberpunk city, a rogue hacker uncovers a conspiracy that threatens to reshape humanity's future forever.", thumbnail: thumb1, duration: "2:14:30", genre: "Sci-Fi", year: 2025, rating: "TV-MA", progress: 35, videoUrl: SAMPLE_VIDEO, type: "movie" },
  { id: "2", title: "The Deep Below", description: "A marine biologist discovers an ancient civilization hidden in the darkest depths of the ocean.", thumbnail: thumb2, duration: "1:52:10", genre: "Thriller", year: 2024, rating: "PG-13", progress: 0, videoUrl: SAMPLE_VIDEO, type: "movie" },
  { id: "3", title: "Lost Temples", description: "An archaeologist races against time to find a legendary artifact before a ruthless treasure hunter gets to it first.", thumbnail: thumb3, duration: "2:05:45", genre: "Adventure", year: 2025, rating: "PG-13", progress: 72, videoUrl: SAMPLE_VIDEO, type: "series" },
  { id: "4", title: "Beyond the Stars", description: "Humanity's last hope rests with a lone astronaut sent to find a new home among the stars.", thumbnail: thumb4, duration: "2:31:00", genre: "Sci-Fi", year: 2024, rating: "PG-13", progress: 0, videoUrl: SAMPLE_VIDEO, type: "series" },
  { id: "5", title: "The Dark Fortress", description: "A cursed knight must infiltrate an ancient fortress to break a spell that has plagued the land for centuries.", thumbnail: thumb5, duration: "1:48:20", genre: "Fantasy", year: 2025, rating: "TV-14", progress: 50, videoUrl: SAMPLE_VIDEO, type: "movie" },
  { id: "6", title: "Canyon Runner", description: "A lone wanderer traverses the world's most dangerous canyon in a desperate search for water.", thumbnail: thumb6, duration: "1:35:55", genre: "Drama", year: 2024, rating: "R", progress: 0, videoUrl: SAMPLE_VIDEO, type: "series" },
];

/** An editorially curated home row. */
export interface CuratedRow {
  name: string;
  videoIds: string[];
}

/**
 * Home-page rows, by video id rather than array index - reordering MOCK_VIDEOS
 * can no longer silently change what these rows contain.
 */
export const CURATED_ROWS: CuratedRow[] = [
  { name: "Trending Now", videoIds: ["2", "4", "6", "1"] },
  { name: "Sci-Fi & Fantasy", videoIds: ["1", "4", "5"] },
  { name: "New Releases", videoIds: ["3", "2", "6", "5"] },
];
