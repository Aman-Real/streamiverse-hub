import { Bell, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import BrandMark from "@/components/common/BrandMark";
import PillTabs, { type PillTab } from "@/components/common/PillTabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/config/app.config";
import AuthButton from "@/features/auth/components/AuthButton";
import AuthGate from "@/features/auth/components/AuthGate";
import NotificationPanel from "@/features/notifications/components/NotificationPanel";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import ProfileDropdown from "@/features/profile/components/ProfileDropdown";
import { useAccount } from "@/features/profile/hooks/useAccount";
import { getInitials } from "@/lib/utils";

interface NavbarProps {
  onSearch: (query: string) => void;
}

const NAV_LINKS: PillTab<string>[] = [
  { label: "Home", value: ROUTES.home },
  { label: "Explore", value: ROUTES.explore },
  { label: "Watch Room", value: ROUTES.watch },
  { label: "My Lounge", value: ROUTES.myList },
];

const Navbar = ({ onSearch }: NavbarProps) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { unreadCount } = useNotifications();
  const account = useAccount();
  const active = NAV_LINKS.find(({ value }) => pathname === value || pathname.startsWith(`${value}/`))?.value ?? "";

  // Cmd/Ctrl + K focuses search.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-3 px-6 md:px-12">
        <button onClick={() => navigate(ROUTES.home)} className="flex shrink-0 items-center gap-3" aria-label="Home">
          <BrandMark />
          <span className="hidden text-lg font-bold tracking-wide text-foreground lg:block">{APP_CONFIG.brand}</span>
        </button>

        <PillTabs items={NAV_LINKS} value={active} onChange={path => navigate(path)} className="ml-5 hidden md:flex" />

        <label className="ml-auto flex h-10 min-w-0 max-w-64 flex-1 items-center gap-2 rounded-full border bg-card px-4 text-muted-foreground focus-within:border-primary/50">
          <Search className="h-4 w-4 shrink-0" />
          <input
            ref={searchRef}
            onChange={event => onSearch(event.target.value)}
            placeholder="Search films, directors..."
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="hidden rounded-md border bg-secondary px-1.5 font-mono text-[10px] lg:block">⌘K</kbd>
        </label>

        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="relative h-10 w-10"
            aria-label="Open notifications"
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
          >
            <Bell />
            {unreadCount > 0 && <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary" />}
          </Button>
          <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        {/* Signed-out visitors only; members get nothing here. Icon-only on phones, where space is tight. */}
        <AuthGate when="signedOut">
          <AuthButton variant="brand" size="sm" className="px-2.5 sm:px-4">
            <span className="sr-only sm:not-sr-only">Sign up / Sign in</span>
          </AuthButton>
        </AuthGate>

        <div className="relative">
          <button aria-label="Open profile" onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}>
            <Avatar className="border-2">
              <AvatarFallback className="bg-secondary text-xs font-semibold">{getInitials(account.name)}</AvatarFallback>
            </Avatar>
          </button>
          <ProfileDropdown open={profileOpen} onClose={() => setProfileOpen(false)} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
