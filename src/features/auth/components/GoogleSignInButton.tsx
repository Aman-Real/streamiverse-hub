import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getAuthErrorMessage } from "@/features/auth/utils/authErrors";
import { cn } from "@/lib/utils";

interface GoogleSignInButtonProps {
  /** Receives the message when sign-in fails. Defaults to an error toast. Closing the popup isn't a failure. */
  onError?: (message: string) => void;
  disabled?: boolean;
  className?: string;
}

/** Opens Google's account chooser in a popup. Works for new and returning users alike. */
const GoogleSignInButton = ({ onError = message => toast.error(message), disabled, className }: GoogleSignInButtonProps) => {
  const { signInWithGoogle } = useAuth();
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    setPending(true);
    try {
      await signInWithGoogle();
      toast.success("Signed in");
    } catch (error) {
      const message = getAuthErrorMessage(error);
      if (message) onError(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <Button type="button" variant="outline" className={cn("w-full", className)} disabled={disabled || pending} onClick={handleClick}>
      {pending && <Loader2 className="animate-spin" />}
      Continue with Google
    </Button>
  );
};

export default GoogleSignInButton;
