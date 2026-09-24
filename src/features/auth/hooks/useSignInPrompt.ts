import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authPath, redirectStateFor } from "@/features/auth/utils/authNavigation";

/**
 * Returns a function that asks a guest to sign in: a toast with a Sign in action that opens the auth
 * screen and, once they've signed in, brings them back to this page.
 */
export const useSignInPrompt = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (message: string) =>
      toast(message, {
        id: "sign-in-prompt",
        action: {
          label: "Sign in",
          onClick: () => navigate(authPath("sign-in"), { state: redirectStateFor(location) }),
        },
      }),
    [navigate, location],
  );
};
