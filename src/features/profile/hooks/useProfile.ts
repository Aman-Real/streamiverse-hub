import { useContext } from "react";
import { ProfileContext } from "@/features/profile/context/ProfileContext";

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used inside <ProfileProvider>");
  }
  return context;
};
