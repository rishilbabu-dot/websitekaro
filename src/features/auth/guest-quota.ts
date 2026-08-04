/**
 * Guest generation quota — 3 website generations per rolling 7 days.
 *
 * Storage is behind a tiny adapter so the browser implementation can be
 * swapped for server-side tracking without touching callers.
 */
export const GUEST_QUOTA = { limit: 3, windowDays: 7 } as const;

const KEY = "wk.guest.generations.v1";
const WINDOW_MS = GUEST_QUOTA.windowDays * 24 * 60 * 60 * 1000;

export interface QuotaStore {
  read(): number[];
  write(timestamps: number[]): void;
}

export const browserQuotaStore: QuotaStore = {
  read() {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(KEY);
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      return Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === "number") : [];
    } catch {
      return [];
    }
  },
  write(timestamps) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(timestamps));
    } catch {
      /* ignore */
    }
  },
};

let store: QuotaStore = browserQuotaStore;
export const setQuotaStore = (next: QuotaStore) => { store = next; };

const active = (now = Date.now()) => store.read().filter((t) => now - t < WINDOW_MS);

export interface GuestQuotaState {
  used: number;
  remaining: number;
  limit: number;
  exhausted: boolean;
  /** When the oldest generation falls out of the window. */
  resetsAt: number | null;
}

export const readGuestQuota = (): GuestQuotaState => {
  const now = Date.now();
  const list = active(now);
  const oldest = list.length ? Math.min(...list) : null;
  return {
    used: list.length,
    remaining: Math.max(0, GUEST_QUOTA.limit - list.length),
    limit: GUEST_QUOTA.limit,
    exhausted: list.length >= GUEST_QUOTA.limit,
    resetsAt: oldest ? oldest + WINDOW_MS : null,
  };
};

export const recordGuestGeneration = (): GuestQuotaState => {
  const now = Date.now();
  store.write([...active(now), now]);
  return readGuestQuota();
};

export const resetGuestQuota = () => store.write([]);

export const QUOTA_EXHAUSTED_MESSAGE =
  "You've used all 3 free website generations for this week. Sign in with Google to continue editing your existing website or contact WebsiteKaro to launch your business online.";