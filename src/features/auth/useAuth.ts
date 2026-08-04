import { useSyncExternalStore } from "react";
import type { UserRole } from "./auth.types";
import { getServerSessionSnapshot, getSessionSnapshot, subscribeSession } from "./auth.store";
import { signInWithGoogle, signOut, unlockSuperAdmin } from "./auth.service";

/** Reads the live session. Swap the service implementation to go live. */
export const useAuth = () => {
  const session = useSyncExternalStore(subscribeSession, getSessionSnapshot, getServerSessionSnapshot);
  const role: UserRole = session.user?.role ?? "guest";
  return {
    ...session,
    role,
    isGuest: role === "guest",
    isOwner: role === "business-owner",
    isSuperAdmin: role === "super-admin",
    signInWithGoogle,
    unlockSuperAdmin,
    signOut,
  };
};
