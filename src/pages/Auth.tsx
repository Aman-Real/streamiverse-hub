import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import AuthForm from "@/features/auth/components/AuthForm";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { AuthMode } from "@/features/auth/types";
import { getReturnPath, parseAuthMode } from "@/features/auth/utils/authNavigation";

/** Sign in / sign up screen. Once signed in, visitors go back to the page they came from, or home. */
const Auth = () => {
  const { status } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = parseAuthMode(searchParams.get("mode"));

  if (status === "signedIn") return <Navigate to={getReturnPath(location.state)} replace />;

  // Switching forms replaces the URL (no extra Back-button steps) and keeps the return path.
  const changeMode = (next: AuthMode) => setSearchParams({ mode: next }, { replace: true, state: location.state });

  return (
    <PageShell className="text-foreground">
      <main className="flex min-h-screen items-center justify-center px-6 pb-16 pt-28">
        {status === "signedOut" && (
          <section className="w-full max-w-md rounded-3xl border bg-card p-6 shadow-2xl md:p-8">
            <AuthForm mode={mode} onModeChange={changeMode} />
          </section>
        )}
      </main>
    </PageShell>
  );
};

export default Auth;
