/**
 * Authentication service — integration seam.
 *
 * The MVP has no backend: Google sign-in is simulated and the Super Admin is
 * unlocked with a temporary passcode. Wiring real auth later means replacing
 * this file, not the dashboards that consume it.
 */
import type { AuthSession, AuthUser } from "./auth.types";
import { GUEST_SESSION, getSessionSnapshot, setSession } from "./auth.store";

/** Temporary MVP passcode — replace with real admin auth. */
export const SUPER_ADMIN_PASSCODE = "iamsuperadmin";

const ownerFromEmail = (email: string): AuthUser => ({
  id: `u_${email.split("@")[0]}`,
  name: email
    .split("@")[0]!
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()),
  email,
  role: "business-owner",
  // Reconnects the signed-in user to the business they already generated.
  businessId: "biz-1",
});

export const getSession = (): AuthSession => getSessionSnapshot();

/** Simulated Google OAuth. Replace with a real provider call. */
export const signInWithGoogle = async (email: string): Promise<AuthSession> => {
  await new Promise((r) => setTimeout(r, 700));
  const next: AuthSession = { user: ownerFromEmail(email.trim().toLowerCase()), isAuthenticated: true };
  setSession(next);
  return next;
};

export const unlockSuperAdmin = (passcode: string): boolean => {
  if (passcode.trim() !== SUPER_ADMIN_PASSCODE) return false;
  setSession({
    user: { id: "u_admin", name: "WebsiteKaro Admin", email: "admin@websitekaro.in", role: "super-admin" },
    isAuthenticated: true,
  });
  return true;
};

export const signOut = () => setSession(GUEST_SESSION);
