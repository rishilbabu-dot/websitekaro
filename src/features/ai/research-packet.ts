/**
 * Builds the grounded research packet handed to the copy model.
 *
 * Everything in the packet is a fact we actually resolved (Google listing,
 * verified reviews, the official website) plus the Brand DNA derived from those
 * facts. The model is told to write ONLY from this packet, which is what keeps
 * generated copy specific to the business instead of generic industry filler.
 */
import type { BusinessBlueprint } from "@/features/businesses";
import type { VerifiedPlace } from "@/features/website-generation/place-research.types";
import type { WebsiteResearch } from "@/features/website-generation/website-research.types";

const trim = (value: string, max: number) => (value.length > max ? `${value.slice(0, max).trimEnd()}…` : value);

export interface ResearchPacketInput {
  blueprint: BusinessBlueprint;
  city: string;
  industryLabel: string;
  industryCategory: string;
  verifiedPlace?: VerifiedPlace | undefined;
  websiteResearch?: WebsiteResearch | undefined;
}

export function buildResearchPacket(input: ResearchPacketInput): string {
  const { blueprint, city, industryLabel, industryCategory, verifiedPlace: place, websiteResearch: site } = input;
  const lines: string[] = [];

  lines.push("== VERIFIED BUSINESS FACTS ==");
  lines.push(`Exact business name (never change it): ${blueprint.name}`);
  lines.push(`City: ${city}`);
  lines.push(`Industry: ${industryLabel} (${industryCategory})`);

  if (place) {
    lines.push(`Google category: ${place.category ?? "not listed"}`);
    if (place.address) lines.push(`Address: ${place.address}`);
    if (place.phone) lines.push(`Phone: ${place.phone}`);
    if (place.website) lines.push(`Official website: ${place.website}`);
    if (place.rating && place.userRatingCount) {
      lines.push(`Google rating: ${place.rating} from ${place.userRatingCount} reviews`);
    }
    if (place.hours?.length) lines.push(`Opening hours: ${place.hours.slice(0, 7).join("; ")}`);
    if (place.photos?.length) lines.push(`Verified photos available: ${place.photos.length}`);
    if (place.reviews?.length) {
      lines.push("Real customer reviews (verbatim, use only as sentiment evidence — never quote as your own words):");
      for (const review of place.reviews.slice(0, 5)) {
        lines.push(`- "${trim(review.text.replace(/\s+/g, " "), 240)}"`);
      }
    }
  } else {
    lines.push("No verified Google listing was resolved. Do not state any fact you were not given.");
  }

  if (site) {
    lines.push("");
    lines.push(`== OFFICIAL WEBSITE (${site.url}, ${site.confidence}) ==`);
    if (site.title) lines.push(`Site title: ${site.title}`);
    if (site.description) lines.push(`Site description: ${site.description}`);
    if (site.about) lines.push(`About text: ${trim(site.about.replace(/\s+/g, " "), 900)}`);
    if (site.services.length) {
      lines.push(`Services listed on their site: ${site.services.map((s) => s.name).join(", ")}`);
    }
    if (site.faqs.length) {
      lines.push("FAQs on their site:");
      for (const faq of site.faqs.slice(0, 5)) lines.push(`- ${faq.question} → ${trim(faq.answer, 240)}`);
    }
  }

  if (blueprint.brandDNA) {
    lines.push("");
    lines.push("== BRAND DNA (derived from the facts above) ==");
    lines.push(`Archetype: ${blueprint.brandDNA.archetype} · Energy: ${blueprint.brandDNA.energy}`);
    if (blueprint.brandDNA.signals?.length) lines.push(`Signals: ${blueprint.brandDNA.signals.join(", ")}`);
  }

  lines.push("");
  lines.push("== WRITING RULES ==");
  lines.push(`1. Write about ${blueprint.name} specifically. Reference ${city}, the neighbourhood, the real reviews' sentiment and the website facts above.`);
  lines.push("2. Never invent prices, awards, certifications, years in business, team members, medical or legal claims, or statistics.");
  lines.push("3. If a fact is not in this packet, do not state it. Write around it.");
  lines.push("4. Never use filler such as 'your trusted partner', 'state-of-the-art', 'one-stop solution', 'we strive', 'unparalleled', 'take your business to the next level'.");
  lines.push("5. The copy must read as if it could only belong to this business — swapping in another name should make it read wrong.");

  return lines.join("\n");
}
