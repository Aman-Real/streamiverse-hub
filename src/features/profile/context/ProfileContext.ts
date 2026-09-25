import { createContext } from "react";
import type { UserProfile } from "@/features/profile/types";

export interface ProfileContextValue {
  /** The signed-in account's profile document; null while loading, when signed out, or before it's created. */
  profile: UserProfile | null;
  loading: boolean;
  /** Renames the account everywhere (profile document and sign-in session). Rejects with a displayable message. */
  updateDisplayName: (name: string) => Promise<void>;
  /** Crops, shrinks and saves a new profile photo. Rejects with a displayable message. */
  updatePhoto: (file: File) => Promise<void>;
  /** Removes the uploaded profile photo. Rejects with a displayable message. */
  removePhoto: () => Promise<void>;
}

export const ProfileContext = createContext<ProfileContextValue | null>(null);
