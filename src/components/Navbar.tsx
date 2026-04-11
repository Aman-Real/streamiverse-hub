import { Search, Bell, User } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationPanel from "./NotificationPanel";
import ProfileDropdown from "./ProfileDropdown";

interface NavbarProps {
  onSearch: (query: string) => void;
}

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Movies", path: "/movies" },
  { label: "Series", path: "/series" },
  { label: "My List", path: "/my-list" },
];

const Navbar = ({ onSearch }: NavbarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useNotifications();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-stream-overlay to-transparent">
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-bold text-primary tracking-tight cursor-pointer" onClick={() => navigate("/")}>STREAMIX</h1>
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          {navLinks.map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`transition-colors ${location.pathname === link.path ? "text-foreground font-medium" : "hover:text-foreground"}`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          {searchOpen && (
            <input
              autoFocus
              value={query}
              onChange={e => { setQuery(e.target.value); onSearch(e.target.value); }}
              onBlur={() => { if (!query) setSearchOpen(false); }}
              placeholder="Search titles..."
              className="bg-secondary border border-border rounded-sm px-3 py-1.5 text-sm text-foreground w-48 mr-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          )}
          <button onClick={() => setSearchOpen(!searchOpen)} className="text-foreground hover:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="text-foreground hover:text-primary transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors"
          >
            <User className="w-4 h-4 text-primary-foreground" />
          </button>
          <ProfileDropdown open={profileOpen} onClose={() => setProfileOpen(false)} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
