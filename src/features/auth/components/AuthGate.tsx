import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { AuthStatus } from "@/features/auth/types";

interface AuthGateProps {
  /** The auth state the children are for. */
  when: Exclude<AuthStatus, "loading">;
  children: ReactNode;
  /** Shown in the other state instead. */
  fallback?: ReactNode;
}

/**
 * Renders children only for signed-in or only for signed-out visitors, e.g.
 * <AuthGate when="signedOut"><AuthButton /></AuthGate>. Renders nothing while Firebase
 * restores the session, so members never see a flash of signed-out UI on page load.
 */
const AuthGate = ({ when, children, fallback = null }: AuthGateProps) => {
  const { status } = useAuth();
  if (status === "loading") return null;
  return <>{status === when ? children : fallback}</>;
};

export default AuthGate;
