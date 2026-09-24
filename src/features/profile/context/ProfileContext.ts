import { createContext } from "react";
import type { UserProfile } from "@/features/profile/types";

export interface ProfileContextValue {
  /** The signed-in account's profile document; null while loading, when signed out, or before it's created. */
  profile: UserProfile | null;
  loading: boolean;
}

export const ProfileContext = createContext<ProfileContextValue | null>(null);
