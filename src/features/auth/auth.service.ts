/**
 * Authentication service — integration seam.
 *
 * The MVP has no backend: Google sign-in is simulated and staff roles are
 * unlocked with temporary passcodes. Wiring real auth later means replacing
 * this file, not the dashboards that consume it.
 */
import type { AuthSession, AuthUser, UserRole } from "./auth.types";
import { GUEST_SESSION, getSessionSnapshot, setSession } from "./auth.store";
import { clearStaffToken, setStaffToken } from "./staff-token";

/** Temporary MVP passcodes — replace with real admin auth. */
export const SUPER_ADMIN_PASSCODE = "iamsuperadmin";
export const ADMIN_PASSCODE = "iamadmin";

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

/**
 * Unlock a staff role with a passcode. The entered passcode decides which
 * role is granted — Super Admin or Admin. Returns the granted role, or
 * `null` if the passcode is not recognised.
 */
export const unlockWithPasscode = (passcode: string): UserRole | null => {
  const code = passcode.trim();
  let user: AuthUser | null = null;
  if (code === SUPER_ADMIN_PASSCODE) {
    user = { id: "u_admin", name: "WebsiteKaro Admin", email: "admin@websitekaro.in", role: "super-admin" };
  } else if (code === ADMIN_PASSCODE) {
    user = { id: "u_staff", name: "WebsiteKaro Staff", email: "staff@websitekaro.in", role: "admin" };
  }
  if (!user) return null;
  setSession({ user, isAuthenticated: true });
  setStaffToken(code);
  return user.role;
};

export const signOut = () => setSession(GUEST_SESSION);
