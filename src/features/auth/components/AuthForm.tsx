import { Loader2, MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import BrandMark from "@/components/common/BrandMark";
import FormTextField from "@/components/common/FormTextField";
import PillTabs, { type PillTab } from "@/components/common/PillTabs";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { APP_CONFIG } from "@/config/app.config";
import GoogleSignInButton from "@/features/auth/components/GoogleSignInButton";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { AuthMode } from "@/features/auth/types";
import { getAuthErrorMessage } from "@/features/auth/utils/authErrors";

interface AuthFormValues {
  name: string;
  email: string;
  password: string;
}

interface AuthFormProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  /** Why the visitor is being asked to sign in, e.g. "Sign in to watch titles." Shown above the form. */
  notice?: string | null;
}

const MODE_TABS: PillTab<AuthMode>[] = [
  { value: "sign-in", label: "Sign in" },
  { value: "sign-up", label: "Sign up" },
];

const COPY: Record<AuthMode, { title: string; subtitle: string; submit: string; pending: string }> = {
  "sign-in": {
    title: "Welcome back",
    subtitle: "Sign in to pick up where you left off.",
    submit: "Sign in",
    pending: "Signing in…",
  },
  "sign-up": {
    title: `Join ${APP_CONFIG.name}`,
    subtitle: "Create a free account. It takes a few seconds.",
    submit: "Sign up",
    pending: "Creating your account…",
  },
  "reset-password": {
    title: "Reset your password",
    subtitle: "Enter your account email and we'll send you a link to set a new one.",
    submit: "Send reset link",
    pending: "Sending…",
  },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Firebase rejects shorter passwords. */
const MIN_PASSWORD_LENGTH = 6;

/**
 * Sign in, sign up and password reset in one panel. It doesn't navigate: whoever renders it
 * reacts to the auth state changing (pages/Auth redirects; a dialog could simply close).
 */
const AuthForm = ({ mode, onModeChange, notice }: AuthFormProps) => {
  const { signIn, signUp, sendPasswordReset } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [resetSentTo, setResetSentTo] = useState<string | null>(null);
  const form = useForm<AuthFormValues>({
    defaultValues: { name: "", email: "", password: "" },
    // Fields hidden by the current mode drop out, so e.g. the name rule can't block signing in.
    shouldUnregister: true,
  });
  const { isSubmitting } = form.formState;
  const copy = COPY[mode];

  const switchMode = (next: AuthMode) => {
    setError(null);
    setResetSentTo(null);
    form.clearErrors();
    onModeChange(next);
  };

  const onSubmit = async ({ name, email, password }: AuthFormValues) => {
    setError(null);
    try {
      if (mode === "sign-in") {
        await signIn(email, password);
        toast.success("Signed in");
      } else if (mode === "sign-up") {
        await signUp(name, email, password);
        toast.success("Account created");
      } else {
        await sendPasswordReset(email);
        setResetSentTo(email.trim());
      }
    } catch (caught) {
      setError(getAuthErrorMessage(caught));
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-4 text-center">
        <BrandMark size="lg" className="mx-auto" />
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{copy.title}</h1>
          <p className="text-sm text-muted-foreground">{copy.subtitle}</p>
        </div>
      </header>

      {notice && mode !== "reset-password" && (
        <p role="status" className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-center text-sm text-primary-soft">
          {notice}
        </p>
      )}

      {mode !== "reset-password" && (
        <PillTabs
          items={MODE_TABS}
          value={mode}
          onChange={switchMode}
          className="w-full [&>button]:flex-1 [&>button]:justify-center"
        />
      )}

      {resetSentTo ? (
        <div role="status" className="space-y-4 text-center">
          <MailCheck className="mx-auto h-8 w-8 text-primary" />
          <p className="text-sm text-muted-foreground">
            If an account exists for <span className="font-medium text-foreground">{resetSentTo}</span>, a reset link is on
            its way. Check your inbox and spam folder.
          </p>
          <Button variant="outline" className="w-full" onClick={() => switchMode("sign-in")}>
            Back to sign in
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {mode === "sign-up" && (
              <FormTextField
                control={form.control}
                name="name"
                label="Name"
                autoComplete="name"
                disabled={isSubmitting}
                rules={{ validate: value => value.trim().length > 0 || "Enter your name" }}
              />
            )}
            <FormTextField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              disabled={isSubmitting}
              rules={{
                required: "Enter your email",
                pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address" },
              }}
            />
            {mode !== "reset-password" && (
              <FormTextField
                control={form.control}
                name="password"
                label="Password"
                type="password"
                autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                disabled={isSubmitting}
                rules={{
                  required: "Enter your password",
                  minLength: { value: MIN_PASSWORD_LENGTH, message: `Passwords have at least ${MIN_PASSWORD_LENGTH} characters` },
                }}
                labelAction={
                  mode === "sign-in" && (
                    <button
                      type="button"
                      onClick={() => switchMode("reset-password")}
                      className="rounded text-xs font-medium text-primary-soft hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Forgot password?
                    </button>
                  )
                }
              />
            )}

            {error && (
              <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              {isSubmitting ? copy.pending : copy.submit}
            </Button>

            {mode === "reset-password" && (
              <Button type="button" variant="ghost" className="w-full" onClick={() => switchMode("sign-in")}>
                Back to sign in
              </Button>
            )}
          </form>
        </Form>
      )}

      {mode !== "reset-password" && (
        <>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Separator className="flex-1" />
            or
            <Separator className="flex-1" />
          </div>
          <GoogleSignInButton onError={setError} disabled={isSubmitting} />
        </>
      )}
    </div>
  );
};

export default AuthForm;
