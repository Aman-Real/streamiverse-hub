import { ReactNode } from "react";
import Rating from "@/components/common/Rating";
import { Badge } from "@/components/ui/badge";
import type { Video } from "@/features/catalog/types";

interface HeroBannerProps {
  video: Video;
  /** Highlighted first badge, e.g. "Featured". */
  label: string;
  tags: string[];
  /** Kicker above the title. */
  eyebrow?: string;
  actions: ReactNode;
}

/** Wide artwork with the title, tags and actions over it. Used at the top of Home and Explore. */
const HeroBanner = ({ video, label, tags, eyebrow, actions }: HeroBannerProps) => (
  <section className="relative isolate overflow-hidden rounded-3xl border bg-card">
    <img src={video.backdrop ?? video.thumbnail} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/80 to-background/20 sm:bg-gradient-to-r sm:to-background/10" />
    <div className="flex min-h-[22rem] max-w-2xl flex-col justify-end gap-4 p-5 sm:min-h-[26rem] sm:justify-center sm:gap-5 sm:p-8 md:p-12">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="brand">{label}</Badge>
        {tags.filter(Boolean).map(tag => <Badge key={tag} variant="glass">{tag}</Badge>)}
        <Badge variant="glass"><Rating value={video.score} /></Badge>
      </div>
      {eyebrow && (
        <p className="eyebrow flex items-center gap-2">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          {eyebrow}
        </p>
      )}
      <h1 className="break-words text-3xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-4xl md:text-6xl">
        {video.title}
        {video.subtitle && <span className="block text-primary-soft">{video.subtitle}</span>}
      </h1>
      <p className="line-clamp-3 max-w-lg text-sm leading-relaxed text-secondary-foreground sm:line-clamp-none md:text-base">{video.description}</p>
      <div className="flex flex-wrap gap-2 sm:gap-3">{actions}</div>
    </div>
  </section>
);

export default HeroBanner;
