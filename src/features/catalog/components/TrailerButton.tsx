import { Clapperboard } from "lucide-react";
import { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { Video } from "@/features/catalog/types";

interface TrailerButtonProps extends Pick<ButtonProps, "variant" | "size" | "className"> {
  video: Video;
}

/**
 * "Trailer" button that plays the title's official trailer in a popup. Renders nothing when TMDB
 * has no trailer for the title, so there's never a button that does nothing.
 */
const TrailerButton = ({ video, variant = "outline", ...buttonProps }: TrailerButtonProps) => {
  const [open, setOpen] = useState(false);
  if (!video.trailerKey) return null;

  return (
    <>
      <Button variant={variant} {...buttonProps} onClick={() => setOpen(true)}>
        <Clapperboard /> Trailer
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="w-[calc(100vw-1.5rem)] max-w-4xl gap-3 overflow-hidden rounded-2xl border bg-card p-3 sm:p-4"
          // Keep focus on the popup itself rather than inside the video frame, so Escape still closes it.
          onOpenAutoFocus={event => {
            event.preventDefault();
            (event.currentTarget as HTMLElement | null)?.focus();
          }}
        >
          <DialogTitle className="pr-8 text-base">{video.title}: Trailer</DialogTitle>
          <DialogDescription className="sr-only">Official trailer for {video.title}, from YouTube.</DialogDescription>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
            {/* Mounted only while open, so closing the popup stops the video. */}
            {open && (
              <iframe
                title={`${video.title} trailer`}
                src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.trailerKey)}?autoplay=1&rel=0`}
                className="absolute inset-0 h-full w-full border-0"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrailerButton;
