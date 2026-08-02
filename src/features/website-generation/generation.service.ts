/**
 * Website generation service.
 *
 * Today the generator resolves an already-researched blueprint from the
 * business module; later the same contract will call the AI research pipeline
 * and persist the produced blueprint.
 */
import type { BusinessBlueprint } from "@/features/businesses";
import { getBusiness } from "@/features/businesses";

export interface GenerationRequest {
  sourceUrl: string;
  industry: string;
}

export const resolveSiteBlueprint = (slug: string): BusinessBlueprint | undefined => getBusiness(slug);

export const siteUrl = (slug: string) => `/site/${slug}`;
export const previewUrl = (slug: string) => `/admin/preview/${slug}`;
