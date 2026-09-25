import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingState from "@/components/common/LoadingState";
import PageShell from "@/components/layout/PageShell";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authPath, redirectStateFor, type AuthRedirectState } from "@/features/auth/utils/authNavigation";

interface RequireAuthProps {
  children: ReactNode;
  /** Shown on the sign-in screen, e.g. "Sign in to watch titles." */
  message?: string;
}

/**
 * Route guard for member-only screens. Guests are sent to sign in and brought back to the exact
 * page (title, episode, query string) afterwards. While Firebase restores a saved session, a
 * spinner shows instead, so members are never bounced to sign-in on a page reload.
 */
const RequireAuth = ({ children, message = "Sign in to continue." }: RequireAuthProps) => {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <PageShell>
        <div className="page-container">
          <LoadingState />
        </div>
      </PageShell>
    );
  }

  if (status === "signedOut") {
    const state: AuthRedirectState = { ...redirectStateFor(location), message };
    return <Navigate to={authPath("sign-in")} replace state={state} />;
  }

  return <>{children}</>;
};

export default RequireAuth;
