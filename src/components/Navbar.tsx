import { Search, Bell, User } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-stream-overlay to-transparent">
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-bold text-primary tracking-tight">STREAMIX</h1>
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <button className="text-foreground font-medium">Home</button>
          <button className="hover:text-foreground transition-colors">Movies</button>
          <button className="hover:text-foreground transition-colors">Series</button>
          <button className="hover:text-foreground transition-colors">My List</button>
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
        <button className="text-foreground hover:text-primary transition-colors"><Bell className="w-5 h-5" /></button>
        <button className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center">
          <User className="w-4 h-4 text-primary-foreground" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
