/**
 * Browser-storage session persistence.
 *
 * This is the only place that touches localStorage. Replacing it with a
 * Supabase-backed adapter later means editing this file alone.
 */
import type { AuthSession, SessionStorageAdapter } from "./auth.types";

const KEY = "wk.session.v1";

export const browserSessionStorage: SessionStorageAdapter = {
  read() {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as AuthSession) : null;
    } catch {
      return null;
    }
  },
  write(session) {
    if (typeof window === "undefined") return;
    try {
      if (session) window.localStorage.setItem(KEY, JSON.stringify(session));
      else window.localStorage.removeItem(KEY);
    } catch {
      /* storage unavailable — session stays in memory */
    }
  },
};