import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../useAuth";
import type { UserRole } from "../auth.types";
import { GoogleSignInDialog } from "./GoogleSignInDialog";
import { SuperAdminPasscodeDialog } from "./SuperAdminPasscodeDialog";

/**
 * Client-side role gate. Session lives in browser storage for the MVP, so the
 * check runs after hydration; move to a router `beforeLoad` guard once auth
 * is server-backed.
 */
export function RequireRole({ role, children }: { role: UserRole; children: ReactNode }) {
  const { role: current } = useAuth();
  const [signIn, setSignIn] = useState(false);
  const [passcode, setPasscode] = useState(false);

  if (current === role || current === "super-admin") return <>{children}</>;

  const admin = role === "super-admin";
  return (
    <div className="flex min-h-dvh items-center justify-center bg-secondary/40 px-5">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-[var(--shadow-soft)]">
        <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-secondary"><Lock className="size-5 text-primary" /></span>
        <h1 className="mt-5 text-xl">{admin ? "Restricted area" : "Sign in to continue"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {admin
            ? "The WebsiteKaro control room is available to Super Admins only."
            : "Sign in with Google to open your business dashboard and edit your website."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {admin ? (
            <Button onClick={() => setPasscode(true)}>Enter passcode</Button>
          ) : (
            <Button onClick={() => setSignIn(true)}>Continue with Google</Button>
          )}
          <Button variant="outline" asChild><Link to="/">Back to home</Link></Button>
        </div>
      </div>
      <GoogleSignInDialog open={signIn} onOpenChange={setSignIn} />
      <SuperAdminPasscodeDialog open={passcode} onOpenChange={setPasscode} />
    </div>
  );
}