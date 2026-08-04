/**
 * Credit-aware generation contract.
 *
 * Every blueprint is produced in one of three modes. Draft never touches a
 * model, so it is free and stays the default everywhere in the product.
 */
import type { BusinessBlueprint } from "@/features/businesses";

export type GenerationMode = "draft" | "standard" | "deep";

export interface GenerationModeInfo {
  id: GenerationMode;
  label: string;
  blurb: string;
  costLabel: string;
  /** Model calls this mode makes. 0 = free. */
  calls: number;
}

export const GENERATION_MODES: GenerationModeInfo[] = [
  {
    id: "draft",
    label: "Draft",
    blurb: "Instant preview built from our industry design systems. No AI call.",
    costLabel: "Free",
    calls: 0,
  },
  {
    id: "standard",
    label: "Standard",
    blurb: "One AI pass writes the copy, services and FAQs for this business.",
    costLabel: "1 AI call",
    calls: 1,
  },
  {
    id: "deep",
    label: "Deep",
    blurb: "Standard plus a long-form pass for the about, services and FAQ copy.",
    costLabel: "2 AI calls",
    calls: 2,
  },
];

export const getGenerationMode = (id: string | undefined): GenerationMode =>
  GENERATION_MODES.some((m) => m.id === id) ? (id as GenerationMode) : "draft";

export const generationModeInfo = (id: GenerationMode): GenerationModeInfo =>
  GENERATION_MODES.find((m) => m.id === id) ?? GENERATION_MODES[0]!;

export interface GenerationUsage {
  inputTokens: number;
  outputTokens: number;
  /** Rough credit estimate derived from tokens; display-only. */
  estimatedCredits: number;
  model: string;
}

export interface GenerationOutcome {
  blueprint: BusinessBlueprint;
  /** Mode actually used — may be downgraded to draft by a guardrail. */
  mode: GenerationMode;
  requestedMode: GenerationMode;
  cached: boolean;
  usage?: GenerationUsage;
  /** Human-readable reason when we fell back to draft. */
  notice?: string;
}
