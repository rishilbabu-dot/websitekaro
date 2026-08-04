/**
 * Business management service.
 *
 * The rest of the app reads businesses and leads through this module only, so
 * swapping the mock source for a real backend later is a single-file change.
 */
import type { BusinessBlueprint, Industry, Lead, WebsiteStatus } from "./business.types";
import { businesses, leads } from "./business.mock";
import { industryDesigns } from "@/features/industries/industry.config";

export const listBusinesses = (): BusinessBlueprint[] => businesses;

export const getBusiness = (slugOrId: string): BusinessBlueprint | undefined =>
  businesses.find((b) => b.slug === slugOrId || b.id === slugOrId);

export const listLeads = (businessId?: string): Lead[] =>
  businessId ? leads.filter((l) => l.businessId === businessId) : leads;

export const countByStatus = (status: WebsiteStatus): number =>
  businesses.filter((b) => b.status === status).length;

export const statusLabel: Record<string, string> = {
  draft: "Draft",
  generated: "Generated",
  "in-review": "In review",
  published: "Published",
  suspended: "Suspended",
};

export interface IndustryPreset {
  id: Industry | string;
  label: string;
  ready: boolean;
}

/** Every vertical with its own design system is generation-ready. */
export const industryPresets: IndustryPreset[] = industryDesigns.map((d) => ({
  id: d.id,
  label: d.label,
  ready: true,
}));
