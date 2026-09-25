import { HelpCircle, History, LogIn, LogOut, Settings, Sofa, User } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ROUTES } from "@/app/routes";
import AuthGate from "@/features/auth/components/AuthGate";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authPath, redirectStateFor } from "@/features/auth/utils/authNavigation";
import { useAccount } from "@/features/profile/hooks/useAccount";

interface ProfileDropdownProps {
  open: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { icon: User, label: "My Profile", path: ROUTES.profile },
  { icon: Sofa, label: "My Lounge", path: ROUTES.myList },
  { icon: History, label: "Watch History", path: ROUTES.watchHistory },
  { icon: Settings, label: "Settings", path: ROUTES.settings },
  { icon: HelpCircle, label: "Help Center", path: ROUTES.help },
];

const ITEM_CLASS =
  "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:outline-none";

/** Account menu under the navbar avatar. Guests see a Sign in item where members see Sign Out. */
const ProfileDropdown = ({ open, onClose }: ProfileDropdownProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const account = useAccount();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleSignOut = async () => {
    onClose();
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch {
      toast.error("Couldn't sign out. Check your connection and try again.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden />
      <div
        role="menu"
        className="absolute right-0 top-12 z-50 w-56 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border bg-card shadow-2xl animate-in fade-in-0 zoom-in-95"
      >
        <div className="border-b px-4 py-3">
          <p className="truncate text-sm font-semibold text-foreground">{account.name}</p>
          <p className="truncate text-xs text-muted-foreground">{account.email}</p>
        </div>
        <div className="py-1">
          {MENU_ITEMS.map(item => (
            <button key={item.label} role="menuitem" onClick={() => go(item.path)} className={`${ITEM_CLASS} text-foreground`}>
              <item.icon className="h-4 w-4 text-muted-foreground" />
              {item.label}
            </button>
          ))}
        </div>
        <div className="border-t py-1">
          <AuthGate
            when="signedIn"
            fallback={
              <button
                role="menuitem"
                onClick={() => {
                  onClose();
                  navigate(authPath("sign-in"), { state: redirectStateFor(location) });
                }}
                className={`${ITEM_CLASS} text-primary-soft`}
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </button>
            }
          >
            <button role="menuitem" onClick={handleSignOut} className={`${ITEM_CLASS} text-destructive`}>
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </AuthGate>
        </div>
      </div>
    </>
  );
};

export default ProfileDropdown;
