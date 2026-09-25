import { Bookmark, History } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import PillTabs, { type PillTab } from "@/components/common/PillTabs";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import { Badge } from "@/components/ui/badge";
import { useAccount } from "@/features/profile/hooks/useAccount";

const LIBRARY_TABS: PillTab<string>[] = [
  { value: ROUTES.myList, label: "Watchlist", icon: Bookmark },
  { value: ROUTES.watchHistory, label: "History", icon: History },
];

interface ProfileSummaryProps {
  savedCount: number;
  inProgressCount: number;
}

/** Profile card with library tabs, shown at the top of My Lounge. */
const ProfileSummary = ({ savedCount, inProgressCount }: ProfileSummaryProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const account = useAccount();

  return (
    <section className="flex flex-col gap-5 rounded-3xl border bg-card p-5 sm:p-6 md:p-8 lg:flex-row lg:items-center lg:gap-6">
      <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5">
        <ProfileAvatar name={account.name} src={account.photoUrl} size="xl" className="shrink-0" />
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="min-w-0 break-words text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{account.name}</h1>
            <Badge variant="secondary" className="font-medium">{account.planLabel}</Badge>
            {account.memberSince && (
              <Badge variant="secondary" className="bg-secondary/50 font-medium text-muted-foreground">Member since {account.memberSince}</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {savedCount} in Watchlist <span className="mx-1.5">•</span> {inProgressCount} in progress
          </p>
        </div>
      </div>
      <PillTabs items={LIBRARY_TABS} value={pathname} tone="brand" className="w-fit" onChange={tab => navigate(tab)} />
    </section>
  );
};

export default ProfileSummary;
