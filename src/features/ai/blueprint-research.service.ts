/**
 * Blueprint research — the single entry point the product calls to produce a
 * BusinessBlueprint.
 *
 * Draft mode resolves locally with zero cost. Standard and Deep go through the
 * credit-aware server function, which owns caching, guardrails and the ledger.
 */
import { buildBlueprint, getIndustryDesign } from "@/features/industries";
import { generateBlueprint } from "./blueprint.functions";
import { getGenerationMode, type GenerationOutcome } from "./generation.types";
import type { ResearchInput, ResearchResult } from "./ai.types";

export interface ResearchOptions extends ResearchInput {
  mode?: string;
  name: string;
  city?: string;
}

export const researchBusiness = async (input: ResearchOptions): Promise<GenerationOutcome> => {
  const mode = getGenerationMode(input.mode);
  const city = input.city?.trim() || "Mumbai";
  const industry = String(input.industry);

  if (mode === "draft") {
    const design = getIndustryDesign(industry);
    return {
      blueprint: buildBlueprint({
        name: input.name || `${design.label} Studio`,
        city,
        industry,
        ...(input.sourceUrl ? { sourceUrl: input.sourceUrl } : {}),
      }),
      mode: "draft",
      requestedMode: "draft",
      cached: false,
    };
  }

  return generateBlueprint({
    data: {
      name: input.name,
      city,
      industry,
      mode,
      ...(input.sourceUrl ? { sourceUrl: input.sourceUrl } : {}),
    },
  });
};

export type { ResearchResult };
