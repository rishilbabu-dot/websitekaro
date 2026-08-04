/**
 * Local preview store.
 *
 * Freshly generated blueprints do not exist in the business service yet, so we
 * stash them in browser storage keyed by slug. That lets the standalone
 * preview routes (/site/:slug, /preview/:slug) open in a new tab or popup
 * window. Swapping this for a server-backed draft table later is a one-file
 * change.
 */
import type { BusinessBlueprint } from "@/features/businesses";

const KEY = (slug: string) => `wk_preview_${slug}`;

export const savePreviewBlueprint = (data: BusinessBlueprint) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY(data.slug), JSON.stringify(data));
  } catch {
    /* storage unavailable — preview simply falls back to not found */
  }
};

export const loadPreviewBlueprint = (slug: string): BusinessBlueprint | undefined => {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(KEY(slug));
    return raw ? (JSON.parse(raw) as BusinessBlueprint) : undefined;
  } catch {
    return undefined;
  }
};
