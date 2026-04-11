import { User, Settings, HelpCircle, LogOut, History, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProfileDropdownProps {
  open: boolean;
  onClose: () => void;
}

const ProfileDropdown = ({ open, onClose }: ProfileDropdownProps) => {
  const navigate = useNavigate();

  if (!open) return null;

  const menuItems = [
    { icon: User, label: "My Profile", action: () => navigate("/profile") },
    { icon: Heart, label: "My List", action: () => navigate("/my-list") },
    { icon: History, label: "Watch History", action: () => navigate("/watch-history") },
    { icon: Settings, label: "Settings", action: () => navigate("/settings") },
    { icon: HelpCircle, label: "Help Center", action: () => navigate("/help") },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-12 right-0 z-50 w-56 bg-card border border-border rounded-lg shadow-2xl overflow-hidden animate-fade-in">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Guest User</p>
          <p className="text-xs text-muted-foreground">guest@streamix.app</p>
        </div>
        <div className="py-1">
          {menuItems.map(item => (
            <button
              key={item.label}
              onClick={() => { item.action(); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent/50 transition-colors"
            >
              <item.icon className="w-4 h-4 text-muted-foreground" />
              {item.label}
            </button>
          ))}
        </div>
        <div className="border-t border-border py-1">
          <button
            onClick={() => { toast.success("Signed out successfully"); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-accent/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileDropdown;
