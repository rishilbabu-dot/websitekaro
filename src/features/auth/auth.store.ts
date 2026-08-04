/**
 * Tiny observable session store.
 *
 * Keeps auth state outside React so guards, dialogs and layouts all read one
 * source of truth. Swap `auth.service` internals for real auth later.
 */
import type { AuthSession } from "./auth.types";
import { browserSessionStorage } from "./auth.storage";

export const GUEST_SESSION: AuthSession = { user: null, isAuthenticated: false };

let session: AuthSession = GUEST_SESSION;
let hydrated = false;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const subscribeSession = (listener: () => void) => {
  listeners.add(listener);
  if (!hydrated) {
    hydrated = true;
    const stored = browserSessionStorage.read();
    if (stored?.user) {
      session = stored;
      queueMicrotask(emit);
    }
  }
  return () => listeners.delete(listener);
};

export const getSessionSnapshot = () => session;
export const getServerSessionSnapshot = () => GUEST_SESSION;

export const setSession = (next: AuthSession) => {
  session = next;
  browserSessionStorage.write(next.user ? next : null);
  emit();
};