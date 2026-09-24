import { useMemo } from "react";
import { GUEST_ACCOUNT } from "@/config/app.config";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useProfile } from "@/features/profile/hooks/useProfile";
import type { Plan } from "@/features/profile/types";

/** Plan names as members see them. */
const PLAN_LABELS: Record<Plan, string> = { free: "Free", pro: "Pro" };

/** The current account, ready to display. */
export interface Account {
  isGuest: boolean;
  name: string;
  email: string;
  planLabel: string;
  /** e.g. "Jan 2026"; null for guests and until the profile loads. */
  memberSince: string | null;
}

const GUEST: Account = { isGuest: true, ...GUEST_ACCOUNT, planLabel: PLAN_LABELS.free, memberSince: null };

const formatMemberSince = (date: Date) => date.toLocaleDateString("en-US", { month: "short", year: "numeric" });

/**
 * Who's signed in, for the navbar, profile menu and profile pages: the profile document once it has
 * loaded, the auth session until then, and a guest placeholder when nobody is signed in.
 */
export const useAccount = (): Account => {
  const { user } = useAuth();
  const { profile } = useProfile();

  return useMemo(() => {
    if (!user) return GUEST;
    return {
      isGuest: false,
      name: profile?.displayName || user.name,
      email: profile?.email || user.email,
      planLabel: PLAN_LABELS[profile?.plan ?? "free"],
      memberSince: profile?.createdAt ? formatMemberSince(profile.createdAt) : null,
    };
  }, [user, profile]);
};
