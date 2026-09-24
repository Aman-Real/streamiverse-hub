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

const HeroBanner = ({ video, label, tags, eyebrow, actions }: HeroBannerProps) => (
  <section className="relative isolate overflow-hidden rounded-3xl border bg-card">
    <img src={video.backdrop ?? video.thumbnail} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/80 to-background/10" />
    <div className="flex min-h-[26rem] max-w-2xl flex-col justify-center gap-5 p-8 md:p-12">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="brand">{label}</Badge>
        {tags.map(tag => <Badge key={tag} variant="glass">{tag}</Badge>)}
        <Badge variant="glass"><Rating value={video.score} /></Badge>
      </div>
      {eyebrow && (
        <p className="eyebrow flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {eyebrow}
        </p>
      )}
      <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl">
        {video.title}
        {video.subtitle && <span className="block text-primary-soft">{video.subtitle}</span>}
      </h1>
      <p className="max-w-lg text-sm leading-relaxed text-secondary-foreground md:text-base">{video.description}</p>
      <div className="flex flex-wrap gap-3">{actions}</div>
    </div>
  </section>
);

export default HeroBanner;
