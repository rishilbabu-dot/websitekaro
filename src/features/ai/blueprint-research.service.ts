/**
 * AI blueprint research — integration seam.
 *
 * Not wired to a provider yet. When AI is enabled this is the only place that
 * talks to the model; everything downstream consumes a BusinessBlueprint.
 */
import type { ResearchInput, ResearchResult } from "./ai.types";

export const researchBusiness = async (_input: ResearchInput): Promise<ResearchResult> => ({
  stage: "queued",
});
