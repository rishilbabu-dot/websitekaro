import type { BusinessBlueprint, Industry } from "@/features/businesses";

/** Input the research pipeline receives (Google Maps link or raw business data). */
export interface ResearchInput {
  sourceUrl?: string;
  businessName?: string;
  city?: string;
  industry: Industry | string;
}

export type ResearchStage = "queued" | "scraping" | "enriching" | "drafting" | "ready" | "failed";

export interface ResearchResult {
  stage: ResearchStage;
  blueprint?: BusinessBlueprint;
  error?: string;
}
