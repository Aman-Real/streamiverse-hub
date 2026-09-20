import { Heart, HelpCircle, History, LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ROUTES } from "@/app/routes";
import { DEMO_USER } from "@/config/app.config";
import AuthGate from "@/features/auth/components/AuthGate";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface ProfileDropdownProps {
  open: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { icon: User, label: "My Profile", path: ROUTES.profile },
  { icon: Heart, label: "My List", path: ROUTES.myList },
  { icon: History, label: "Watch History", path: ROUTES.watchHistory },
  { icon: Settings, label: "Settings", path: ROUTES.settings },
  { icon: HelpCircle, label: "Help Center", path: ROUTES.help },
];

const ProfileDropdown = ({ open, onClose }: ProfileDropdownProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  if (!open) return null;

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
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-12 right-0 z-50 w-56 bg-card border border-border rounded-lg shadow-2xl overflow-hidden animate-fade-in">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">{user?.name ?? DEMO_USER.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email ?? DEMO_USER.email}</p>
        </div>
        <div className="py-1">
          {MENU_ITEMS.map(item => (
            <button
              key={item.label}
              onClick={() => { navigate(item.path); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent/50 transition-colors"
            >
              <item.icon className="w-4 h-4 text-muted-foreground" />
              {item.label}
            </button>
          ))}
        </div>
        <AuthGate when="signedIn">
          <div className="border-t border-border py-1">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-accent/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </AuthGate>
      </div>
    </>
  );
};

export default ProfileDropdown;
