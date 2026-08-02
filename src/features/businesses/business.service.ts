/**
 * Business management service.
 *
 * The rest of the app reads businesses and leads through this module only, so
 * swapping the mock source for a real backend later is a single-file change.
 */
import type { BusinessBlueprint, Industry, Lead, WebsiteStatus } from "./business.types";
import { businesses, leads } from "./business.mock";

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

export const industryPresets: IndustryPreset[] = [
  { id: "dental", label: "Dental Clinic", ready: true },
  { id: "restaurant", label: "Restaurant", ready: false },
  { id: "salon", label: "Salon & Spa", ready: false },
  { id: "lawyer", label: "Law Firm", ready: false },
  { id: "ca", label: "Chartered Accountant", ready: false },
  { id: "gym", label: "Gym & Fitness", ready: false },
  { id: "school", label: "School", ready: false },
  { id: "hotel", label: "Hotel", ready: false },
  { id: "interior", label: "Interior Designer", ready: false },
  { id: "architect", label: "Architect", ready: false },
  { id: "retail", label: "Retail Store", ready: false },
  { id: "home-services", label: "Home Services", ready: false },
  { id: "real-estate", label: "Real Estate", ready: false },
];
