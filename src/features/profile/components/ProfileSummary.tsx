import { Bookmark, Heart, History } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ROUTES } from "@/app/routes";
import PillTabs, { type PillTab } from "@/components/common/PillTabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DEMO_USER } from "@/config/app.config";
import { getInitials } from "@/lib/utils";

const FAVORITES = "favorites";

const LIBRARY_TABS: PillTab<string>[] = [
  { value: ROUTES.myList, label: "Watchlist", icon: Bookmark },
  { value: FAVORITES, label: "Favorites", icon: Heart },
  { value: ROUTES.watchHistory, label: "History", icon: History },
];

interface ProfileSummaryProps {
  savedCount: number;
}

/** Profile card with library tabs, shown at the top of My Lounge. */
const ProfileSummary = ({ savedCount }: ProfileSummaryProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <section className="flex flex-col gap-6 rounded-3xl border bg-card p-6 md:p-8 lg:flex-row lg:items-center">
      <div className="relative w-fit">
        <Avatar className="h-20 w-20 rounded-2xl border">
          <AvatarFallback className="rounded-2xl bg-secondary text-xl font-semibold">{getInitials(DEMO_USER.name)}</AvatarFallback>
        </Avatar>
        <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card bg-success" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{DEMO_USER.name}</h1>
          <Badge variant="secondary" className="font-medium">{DEMO_USER.plan}</Badge>
          <Badge variant="secondary" className="bg-secondary/50 font-medium text-muted-foreground">{DEMO_USER.tier}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Personal Cinema Lounge <span className="mx-1.5">•</span> {savedCount} saved titles <span className="mx-1.5">•</span>
          <span className="text-primary-soft">Dolby Atmos calibrated</span>
        </p>
      </div>
      <PillTabs
        items={LIBRARY_TABS}
        value={pathname}
        tone="brand"
        className="w-fit"
        onChange={tab => (tab === FAVORITES ? toast("Favorites are coming soon") : navigate(tab))}
      />
    </section>
  );
};

export default ProfileSummary;
