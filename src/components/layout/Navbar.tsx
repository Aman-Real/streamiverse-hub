import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { activeNavPath, NAV_ITEMS } from "@/app/navigation";
import { ROUTES, searchRoute } from "@/app/routes";
import BrandMark from "@/components/common/BrandMark";
import PillTabs, { type PillTab } from "@/components/common/PillTabs";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import { APP_CONFIG } from "@/config/app.config";
import AuthButton from "@/features/auth/components/AuthButton";
import AuthGate from "@/features/auth/components/AuthGate";
import { useSearchQuery } from "@/features/catalog/hooks/useSearchQuery";
import ProfileDropdown from "@/features/profile/components/ProfileDropdown";
import { useAccount } from "@/features/profile/hooks/useAccount";

interface NavbarProps {
  /** True when the current page filters itself with the search box; otherwise typing opens Home's search. */
  searchable: boolean;
}

/** Router state that asks the next page's navbar to put the cursor back in the search box. */
interface NavbarState {
  focusSearch?: boolean;
}

const NAV_TABS: PillTab<string>[] = NAV_ITEMS.map(({ label, path }) => ({ label, value: path }));

const Navbar = ({ searchable }: NavbarProps) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useSearchQuery();
  const account = useAccount();
  const active = activeNavPath(location.pathname);

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

  // Arriving from another page's search box: keep typing where you left off.
  useEffect(() => {
    const input = searchRef.current;
    if (!(location.state as NavbarState | null)?.focusSearch || !input) return;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }, [location.state]);

  const changeSearch = (value: string) => {
    if (searchable) {
      setQuery(value);
    } else if (value.trim()) {
      const state: NavbarState = { focusSearch: true };
      navigate(searchRoute(ROUTES.home, value), { state });
    }
  };

  const clearSearch = () => {
    setQuery("");
    searchRef.current?.focus();
  };

  return (
    <nav aria-label="Primary" className="fixed inset-x-0 top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
      <div className="page-width flex h-[var(--navbar-height)] items-center gap-2 sm:gap-3">
        <button onClick={() => navigate(ROUTES.home)} className="flex shrink-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`${APP_CONFIG.name} home`}>
          <BrandMark />
          <span className="hidden text-lg font-bold tracking-wide text-foreground lg:block">{APP_CONFIG.brand}</span>
        </button>

        <PillTabs items={NAV_TABS} value={active} onChange={path => navigate(path)} className="ml-3 hidden md:flex lg:ml-5" />

        <form
          role="search"
          onSubmit={event => {
            event.preventDefault();
            // Enter closes the on-screen keyboard on phones; results are already showing.
            searchRef.current?.blur();
          }}
          className="ml-auto flex h-10 min-w-0 max-w-64 flex-1 items-center gap-2 rounded-full border bg-card px-3 text-muted-foreground focus-within:border-primary/50 sm:px-4"
        >
          <Search className="h-4 w-4 shrink-0" aria-hidden />
          <input
            ref={searchRef}
            type="search"
            value={searchable ? query : ""}
            onChange={event => changeSearch(event.target.value)}
            onKeyDown={event => {
              if (event.key === "Escape" && query) {
                event.preventDefault();
                clearSearch();
              }
            }}
            placeholder="Search movies & series..."
            aria-label="Search movies and series"
            enterKeyHint="search"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {searchable && query && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="-mr-1 grid h-6 w-6 shrink-0 place-items-center rounded-full hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </form>

        {/* Signed-out visitors only. Icon-only below lg, where space is tight. */}
        <AuthGate when="signedOut">
          <AuthButton variant="brand" size="sm" className="shrink-0 px-2.5 lg:px-4">
            <span className="sr-only lg:not-sr-only">Sign up / Sign in</span>
          </AuthButton>
        </AuthGate>

        <div className="relative shrink-0">
          <button
            aria-label="Open account menu"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen(!profileOpen)}
            className="block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ProfileAvatar name={account.isGuest ? undefined : account.name} src={account.photoUrl} className="border-2" />
          </button>
          <ProfileDropdown open={profileOpen} onClose={() => setProfileOpen(false)} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
