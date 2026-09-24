import { Bookmark, Check, Plus } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useSignInPrompt } from "@/features/auth/hooks/useSignInPrompt";
import type { Video } from "@/features/catalog/types";
import { useMyList } from "@/features/my-list/hooks/useMyList";
import { cn } from "@/lib/utils";

interface MyListButtonProps extends ButtonProps {
  video: Video;
  /** Renders a text button; without it, an icon-only bookmark. */
  label?: string;
}

/**
 * Adds or removes a title from My List, anywhere it's rendered (even inside clickable cards).
 * My List belongs to an account, so guests are asked to sign in instead.
 */
const MyListButton = ({ video, label, className, ...props }: MyListButtonProps) => {
  const { isInList, toggleList } = useMyList();
  const { status } = useAuth();
  const promptSignIn = useSignInPrompt();
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
        if (status === "signedIn") toggleList(video);
        else if (status === "signedOut") promptSignIn("Sign in to save titles to My List.");
      }}
    >
      <Icon />
      {label}
    </Button>
  );
};

export default MyListButton;
