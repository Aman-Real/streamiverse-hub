import { LogIn } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { AuthMode } from "@/features/auth/types";
import { authPath, redirectStateFor } from "@/features/auth/utils/authNavigation";

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
  const redirectState = redirectStateFor(useLocation());

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
