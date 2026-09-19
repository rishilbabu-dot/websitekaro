/**
 * Blueprint cache.
 *
 * Repeat generations of the same business + mode return the cached blueprint
 * with zero model calls. In-memory today; the BlueprintStore interface is the
 * single seam to swap in a database table later.
 */
import type { BusinessBlueprint } from "@/features/businesses";
import type { GenerationMode } from "./generation.types";

export interface CachedBlueprint {
  blueprint: BusinessBlueprint;
  createdAt: number;
}

export interface BlueprintStore {
  get(key: string): CachedBlueprint | undefined;
  set(key: string, value: CachedBlueprint): void;
  size(): number;
}

const TTL_MS = 1000 * 60 * 60 * 24; // 24h
const MAX_ENTRIES = 500;

const createMemoryStore = (): BlueprintStore => {
  const map = new Map<string, CachedBlueprint>();
  return {
    get: (key) => {
      const hit = map.get(key);
      if (!hit) return undefined;
      if (Date.now() - hit.createdAt > TTL_MS) {
        map.delete(key);
        return undefined;
      }
      return hit;
    },
    set: (key, value) => {
      if (map.size >= MAX_ENTRIES) {
        const oldest = map.keys().next().value;
        if (oldest) map.delete(oldest);
      }
      map.set(key, value);
    },
    size: () => map.size,
  };
};

const store: BlueprintStore = createMemoryStore();

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

export const cacheKey = (input: {
  name: string;
  city: string;
  industry: string;
  mode: GenerationMode;
  sourceFingerprint?: string;
}) => [norm(input.name), norm(input.city), norm(input.industry), input.mode, input.sourceFingerprint ?? "unverified-v1"].join("|");

export const readCachedBlueprint = (key: string) => store.get(key)?.blueprint;

export const writeCachedBlueprint = (key: string, blueprint: BusinessBlueprint) =>
  store.set(key, { blueprint, createdAt: Date.now() });

export const cacheSize = () => store.size();
