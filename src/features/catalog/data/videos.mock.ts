import heroBanner from "@/assets/images/hero-banner.jpg";
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
  {
    id: "1", title: "Neon Metropolis", subtitle: "Resurrection", tagline: "Neo-Tokyo Arc • Phase II",
    description: "In a sprawling cyberpunk city, a rogue hacker uncovers a conspiracy that threatens to reshape humanity's future forever.",
    thumbnail: thumb1, backdrop: heroBanner, runtime: 54, genre: "Sci-Fi", year: 2025, rating: "TV-MA", score: 9.1, match: 98,
    formats: ["4K Ultra HD", "Dolby Atmos"], progress: 60, videoUrl: SAMPLE_VIDEO, type: "series",
    episodes: [
      { id: "1-1-1", season: 1, number: 1, title: "Signal Lost", description: "A blackout in the upper spires sends Kaelen into the undercity with a stolen neural key.", runtime: 52, airDate: "Mar 3, 2024", format: "4K HDR", progress: 100, thumbnail: thumb3 },
      { id: "1-1-2", season: 1, number: 2, title: "Chrome Tide", description: "The syndicate floods the grid with decoys while Maya traces the key's first owner.", runtime: 49, airDate: "Mar 10, 2024", format: "Dolby Atmos", progress: 100, thumbnail: thumb5 },
      { id: "1-2-1", season: 2, number: 1, title: "Electric Shadows", description: "Kaelen infiltrates a high-altitude server vault during an ionic storm and decrypts a ghost memory from before the Blackout.", runtime: 54, airDate: "Oct 14, 2025", format: "Dolby Atmos", progress: 60, thumbnail: thumb1 },
      { id: "1-2-2", season: 2, number: 2, title: "Ghost in the Signal", description: "Pursued through the sunken canal district, Maya races to build an offline bridge before the beacon self-terminates.", runtime: 48, airDate: "Oct 21, 2025", format: "4K HDR", progress: 0, thumbnail: thumb2 },
      { id: "1-2-3", season: 2, number: 3, title: "Zero Day Genesis", description: "A clandestine meeting at the orbital sky-club goes wrong when a defense AI hijacks life support.", runtime: 51, airDate: "Oct 28, 2025", format: "Dolby Vision", progress: 0, thumbnail: thumb4 },
      { id: "1-2-4", season: 2, number: 4, title: "Sub-Level Orbit", description: "Trapped beneath the city crust, the crew must commandeer an abandoned maglev before the sector is purged.", runtime: 58, airDate: "Nov 4, 2025", format: "Lossless Audio", progress: 0, thumbnail: thumb6 },
    ],
    cast: [
      { name: "Kenji Sato", role: "Kaelen Voss", credits: "4 Titles" },
      { name: "Nadia Okafor", role: "Maya Chen", credits: "2 Titles" },
      { name: "Marcus Lind", role: "Director", credits: "6 Titles" },
      { name: "Sofia Delgado", role: "Showrunner", credits: "Creator" },
      { name: "Aiko Tanaka", role: "Composer", credits: "3 Titles" },
      { name: "Ravi Menon", role: "Cinematographer", credits: "5 Titles" },
    ],
  },
  { id: "2", title: "The Deep Below", description: "A marine biologist discovers an ancient civilization hidden in the darkest depths of the ocean.", thumbnail: thumb2, runtime: 112, genre: "Thriller", year: 2024, rating: "PG-13", score: 8.4, match: 91, formats: ["4K HDR", "Dolby Atmos"], progress: 0, videoUrl: SAMPLE_VIDEO, type: "movie" },
  { id: "3", title: "Lost Temples", description: "An archaeologist races against time to find a legendary artifact before a ruthless treasure hunter gets to it first.", thumbnail: thumb3, runtime: 45, genre: "Adventure", year: 2025, rating: "PG-13", score: 8.7, match: 89, formats: ["4K HDR"], progress: 72, videoUrl: SAMPLE_VIDEO, type: "series" },
  { id: "4", title: "Beyond the Stars", description: "Humanity's last hope rests with a lone astronaut sent to find a new home among the stars.", thumbnail: thumb4, runtime: 50, genre: "Sci-Fi", year: 2024, rating: "PG-13", score: 9.2, match: 94, formats: ["IMAX", "Dolby Vision"], progress: 0, videoUrl: SAMPLE_VIDEO, type: "series" },
  { id: "5", title: "The Dark Fortress", description: "A cursed knight must infiltrate an ancient fortress to break a spell that has plagued the land for centuries.", thumbnail: thumb5, runtime: 108, genre: "Fantasy", year: 2025, rating: "TV-14", score: 8.1, match: 86, formats: ["4K HDR", "Dolby Atmos"], progress: 50, videoUrl: SAMPLE_VIDEO, type: "movie" },
  { id: "6", title: "Canyon Runner", description: "A lone wanderer traverses the world's most dangerous canyon in a desperate search for water.", thumbnail: thumb6, runtime: 42, genre: "Drama", year: 2024, rating: "R", score: 8.8, match: 92, formats: ["Dolby Vision"], progress: 0, videoUrl: SAMPLE_VIDEO, type: "series" },
];

/**
 * Editorial "Trending Now" row, by video id rather than array index -
 * reordering MOCK_VIDEOS can never silently change what it contains.
 */
export const TRENDING_IDS = ["2", "4", "6", "1", "5"];
