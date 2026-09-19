import { Bookmark, Check, Plus } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { Video } from "@/features/catalog/types";
import { useMyList } from "@/features/my-list/hooks/useMyList";
import { cn } from "@/lib/utils";

interface MyListButtonProps extends ButtonProps {
  video: Video;
  /** Renders a text button; without it, an icon-only bookmark. */
  label?: string;
}

/** Adds or removes a title from My List, anywhere it's rendered (even inside clickable cards). */
const MyListButton = ({ video, label, className, ...props }: MyListButtonProps) => {
  const { isInList, toggleList } = useMyList();
  const saved = isInList(video.id);
  const Icon = label ? (saved ? Check : Plus) : Bookmark;

  return (
    <Button
      variant="outline"
      size={label ? "default" : "icon"}
      aria-pressed={saved}
      aria-label={label ? undefined : saved ? "Remove from My List" : "Add to My List"}
      className={cn(!label && saved && "text-primary [&_svg]:fill-current", className)}
      {...props}
      onClick={event => {
        event.stopPropagation();
        toggleList(video);
      }}
    >
      <Icon />
      {label}
    </Button>
  );
};

export default MyListButton;
