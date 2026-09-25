import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useSignInPrompt } from "@/features/auth/hooks/useSignInPrompt";
import type { Video } from "@/features/catalog/types";
import { useMyList } from "@/features/my-list/hooks/useMyList";
import { cn } from "@/lib/utils";

interface MyListButtonProps extends Omit<ButtonProps, "children"> {
  video: Video;
  /** Shows the "Save" / "Saved" text; without it the button is an icon-only bookmark. */
  showLabel?: boolean;
}

/**
 * The one Save button: adds a title to the Watchlist (My Lounge), or removes it when already saved.
 * Works anywhere it's rendered, even inside clickable cards. Guests are asked to sign in instead.
 */
const MyListButton = ({ video, showLabel = false, className, variant = "outline", ...props }: MyListButtonProps) => {
  const { isInList, toggleList } = useMyList();
  const { status } = useAuth();
  const promptSignIn = useSignInPrompt();
  const saved = isInList(video.id);
  const Icon = saved ? BookmarkCheck : Bookmark;

  return (
    <Button
      variant={variant}
      size={showLabel ? "default" : "icon"}
      aria-pressed={saved}
      aria-label={showLabel ? undefined : saved ? `Remove ${video.title} from Watchlist` : `Save ${video.title} to Watchlist`}
      title={saved ? "Remove from Watchlist" : "Save to Watchlist"}
      className={cn(saved && "text-primary", className)}
      {...props}
      onClick={event => {
        event.stopPropagation();
        if (status === "signedIn") {
          toggleList(video);
          toast.success(saved ? "Removed from Watchlist" : "Saved to Watchlist", { id: `watchlist-${video.id}` });
        } else if (status === "signedOut") {
          promptSignIn("Sign in to save titles to your Watchlist.");
        }
      }}
    >
      <Icon />
      {showLabel && (saved ? "Saved" : "Save")}
    </Button>
  );
};

export default MyListButton;
