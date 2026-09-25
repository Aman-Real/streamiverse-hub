import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";

const SIZES = {
  sm: "h-9 w-9 text-xs",
  md: "h-10 w-10 text-xs",
  lg: "h-16 w-16 text-base",
  xl: "h-20 w-20 text-xl sm:h-24 sm:w-24 sm:text-2xl",
} as const;

const ICON_SIZES = { sm: "h-4 w-4", md: "h-4 w-4", lg: "h-7 w-7", xl: "h-10 w-10 sm:h-12 sm:w-12" } as const;

interface ProfileAvatarProps {
  /** Initials come from this; without it a person icon is shown. */
  name?: string;
  /** Photo URL (or data URL). Falls back to the initials while loading or if it fails. */
  src?: string | null;
  size?: keyof typeof SIZES;
  /** "brand" fills the fallback with the theme colour (accounts); "muted" is quieter (cast lists). */
  tone?: "brand" | "muted";
  className?: string;
}

/** Round avatar for any person: the account in the navbar and profile screens, or cast members. */
const ProfileAvatar = ({ name, src, size = "md", tone = "brand", className }: ProfileAvatarProps) => {
  const initials = name ? getInitials(name) : "";

  return (
    <Avatar className={cn("border", SIZES[size], className)}>
      {src && <AvatarImage src={src} alt={name ?? ""} className="object-cover" />}
      <AvatarFallback
        className={cn(
          "font-semibold",
          tone === "brand" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
        )}
      >
        {initials || <User className={ICON_SIZES[size]} aria-hidden />}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
