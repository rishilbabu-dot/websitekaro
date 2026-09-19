/**
 * Turns an industry design system + a few facts about a business into a full
 * BusinessBlueprint. This is the deterministic stand-in for the AI research
 * pipeline: same contract in, same contract out.
 */
import type { BusinessBlueprint, Industry } from "@/features/businesses";
import type { VerifiedPlace } from "@/features/website-generation/place-research.types";
import type { WebsiteResearch } from "@/features/website-generation/website-research.types";
import { deriveBrandDirection } from "@/features/website-generation/brand-dna";
import { getIndustryDesign } from "./industry.config";

export interface BlueprintSeedInput {
  name: string;
  city: string;
  industry: string;
  sourceUrl?: string;
  verifiedPlace?: VerifiedPlace;
  websiteResearch?: WebsiteResearch;
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

const initials = (s: string) =>
  s.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("");

export const buildBlueprint = (input: BlueprintSeedInput): BusinessBlueprint => {
  const design = getIndustryDesign(input.industry);
  const s = design.seed;
  const verified = input.verifiedPlace;
  const name = verified?.name ?? (input.name.trim() || `${design.label} Studio`);
  const city = verified?.city || input.city.trim() || "Mumbai";
  const slug = `${slugify(name)}-${slugify(city)}`;
  const digits = Array.from(slug).reduce((a, c) => a + c.charCodeAt(0), 0);

  const site = input.websiteResearch;
  const mapsMedia = verified?.photos.map((photo) => ({ url: photo.url, source: "google-maps" as const, sourceUrl: photo.sourceUrl, ...(photo.attribution ? { attribution: photo.attribution } : {}) })) ?? [];
  const websiteMedia = site?.images.map((image) => ({ url: image.url, source: "website" as const, sourceUrl: image.sourcePage, ...(image.alt ? { attribution: image.alt } : {}) })) ?? [];
  const media = [...mapsMedia, ...websiteMedia];
  const direction = deriveBrandDirection({
    name,
    city,
    industry: design.id as Industry,
    category: verified?.category ?? design.category,
    reviews: verified ? {
      rating: verified.rating ?? 0,
      count: verified.reviewCount ?? 0,
      summary: "",
      verified: typeof verified.rating === "number" && typeof verified.reviewCount === "number",
      items: verified.reviews,
    } : { rating: 0, count: 0, summary: "", verified: false, items: [] },
    media,
  }, design.heroVariant, design.sections);

  return {
    id: `gen_${slug}`,
    slug,
    industry: design.id as Industry,
    status: "generated",
    generatedAt: new Date().toISOString().slice(0, 10),
    name,
    tagline: verified ? `${verified.category}${city ? ` in ${city}` : ""}` : s.tagline,
    category: design.category,
    description: site?.description || (verified ? `${name} is a ${verified.category.toLowerCase()}${city ? ` in ${city}` : ""}.` : `${name} is a ${design.category.toLowerCase()} in ${city}.`),
    address: verified?.formattedAddress ?? "",
    landmarks: [],
    city,
    phone: verified?.phone ?? "",
    whatsapp: verified?.phone.replace(/\D/g, "") ?? "",
    email: site?.emails[0] ?? "",
    mapEmbedQuery: verified?.latitude != null && verified.longitude != null ? `${verified.latitude},${verified.longitude}` : `${name}, ${city}`,
    hours: verified?.hours ?? [],
    logoMark: initials(name) || "WK",
    brand: { primary: design.theme.primary, accent: design.theme.accent },
    photos: verified?.photos.map((photo) => photo.url) ?? [],
    // Business-specific services, people, prices and FAQs must come from an
    // attributed source (official website extraction) or an owner edit.
    services: site?.services.slice(0, 6).map((s, i) => ({ id: `site-service-${i + 1}`, name: s.name, description: s.description ?? "" })) ?? [],
    team: [],
    faqs: site?.faqs.slice(0, 4).map((f, i) => ({ id: `site-faq-${i + 1}`, question: f.question, answer: f.answer })) ?? [],
    // Sample wording only. Nothing here is presented as a real Google review —
    // verified reviews arrive with the live Google Business source.
    reviews: verified ? {
      rating: verified.rating ?? 0,
      count: verified.reviewCount ?? 0,
      summary: "",
      verified: typeof verified.rating === "number" && typeof verified.reviewCount === "number",
      url: verified.mapsUrl,
      items: verified.reviews,
    } : { rating: 0, count: 0, summary: "", verified: false, items: [] },
    cta: { primary: design.words.ctaPrimary, secondary: design.words.ctaSecondary },
    seo: {
      title: `${name} — ${design.category} in ${city}`,
      metaDescription: verified
        ? `${name}${city ? ` in ${city}` : ""}. View verified business details, services and contact information.`.slice(0, 155)
        : `${name} is a ${design.category.toLowerCase()} in ${city}.`.slice(0, 155),
      keywords: [`${design.label.toLowerCase()} in ${city.toLowerCase()}`],
    },
    // Social links only exist when the owner supplies them — we never guess
    // that a profile belongs to this business.
    social: [],
    personality: [],
    audience: "",
    usp: [],
    trust: [],
    ...(verified ? {
      mapsUrl: verified.mapsUrl,
      verifiedIdentity: { placeId: verified.placeId, name: verified.name, mapsUrl: verified.mapsUrl, verifiedAt: verified.verifiedAt },
      media,
    } : media.length ? { media } : {}),
    ...(sources.length ? { sources } : {}),
    ...(site ? { websiteResearch: site } : {}),
    ...direction,
  };
};