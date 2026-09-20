import { LogIn } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { AuthMode } from "@/features/auth/types";
import { authPath, getReturnPath, type AuthRedirectState } from "@/features/auth/utils/authNavigation";

interface AuthButtonProps extends Pick<ButtonProps, "variant" | "size" | "className"> {
  /** Which form the auth screen opens on. */
  mode?: AuthMode;
  /** Button text; defaults to "Sign up / Sign in". */
  children?: ReactNode;
}

/**
 * Link to the auth screen that remembers the current page, so people land back where
 * they were after signing in. Wrap it in <AuthGate when="signedOut"> to hide it for members.
 */
const AuthButton = ({ mode = "sign-in", children = "Sign up / Sign in", ...buttonProps }: AuthButtonProps) => {
  const { pathname, search, state } = useLocation();
  // On the auth screen itself, keep the original destination instead of pointing back at /auth.
  const redirectState: AuthRedirectState = {
    from: pathname === ROUTES.auth ? getReturnPath(state) : `${pathname}${search}`,
  };

  return (
    <Button asChild {...buttonProps}>
      <Link to={authPath(mode)} state={redirectState}>
        <LogIn />
        {children}
      </Link>
    </Button>
  );
};

export default AuthButton;
