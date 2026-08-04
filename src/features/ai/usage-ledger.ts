/**
 * Usage ledger.
 *
 * Records every generation (AI or draft, cached or fresh) so the admin can see
 * exactly what is being spent. In-memory today; the LedgerStore interface is
 * the seam for persisting to a database later.
 */
import type { GenerationMode, GenerationUsage } from "./generation.types";
import { GENERATION_LIMITS } from "./generation.limits";

export interface LedgerEntry {
  id: string;
  at: number;
  business: string;
  industry: string;
  mode: GenerationMode;
  cached: boolean;
  model?: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCredits: number;
}

export interface LedgerStore {
  push(entry: LedgerEntry): void;
  all(): LedgerEntry[];
}

const MAX_ENTRIES = 1000;

const createMemoryLedger = (): LedgerStore => {
  const entries: LedgerEntry[] = [];
  return {
    push: (entry) => {
      entries.push(entry);
      if (entries.length > MAX_ENTRIES) entries.shift();
    },
    all: () => entries.slice(),
  };
};

const ledger: LedgerStore = createMemoryLedger();

const DAY_MS = 1000 * 60 * 60 * 24;

export const recordGeneration = (input: {
  business: string;
  industry: string;
  mode: GenerationMode;
  cached: boolean;
  usage?: GenerationUsage;
}) => {
  ledger.push({
    id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    at: Date.now(),
    business: input.business,
    industry: input.industry,
    mode: input.mode,
    cached: input.cached,
    ...(input.usage?.model ? { model: input.usage.model } : {}),
    inputTokens: input.usage?.inputTokens ?? 0,
    outputTokens: input.usage?.outputTokens ?? 0,
    estimatedCredits: input.usage?.estimatedCredits ?? 0,
  });
};

/** AI (non-draft, non-cached) generations in the last 24h. */
export const aiGenerationsToday = () => {
  const since = Date.now() - DAY_MS;
  return ledger.all().filter((e) => e.at >= since && e.mode !== "draft" && !e.cached).length;
};

export const dailyCapReached = () => aiGenerationsToday() >= GENERATION_LIMITS.perDay;

export interface UsageSummary {
  generationsToday: number;
  aiGenerationsToday: number;
  cachedToday: number;
  cacheHitRate: number;
  estimatedCreditsToday: number;
  dailyCap: number;
  byMode: { mode: GenerationMode; count: number; estimatedCredits: number }[];
  recent: LedgerEntry[];
}

export const usageSummary = (): UsageSummary => {
  const since = Date.now() - DAY_MS;
  const today = ledger.all().filter((e) => e.at >= since);
  const cached = today.filter((e) => e.cached).length;
  const modes: GenerationMode[] = ["draft", "standard", "deep"];

  return {
    generationsToday: today.length,
    aiGenerationsToday: today.filter((e) => e.mode !== "draft" && !e.cached).length,
    cachedToday: cached,
    cacheHitRate: today.length ? Math.round((cached / today.length) * 100) : 0,
    estimatedCreditsToday: Number(
      today.reduce((sum, e) => sum + e.estimatedCredits, 0).toFixed(4),
    ),
    dailyCap: GENERATION_LIMITS.perDay,
    byMode: modes.map((mode) => {
      const rows = today.filter((e) => e.mode === mode);
      return {
        mode,
        count: rows.length,
        estimatedCredits: Number(rows.reduce((s, e) => s + e.estimatedCredits, 0).toFixed(4)),
      };
    }),
    recent: today.slice(-12).reverse(),
  };
};
