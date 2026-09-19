import type { BrandDNA, BusinessBlueprint, Industry, WebsiteDesignStrategy } from "@/features/businesses";
import type { HeroVariant, SectionId } from "@/features/industries";

type BrandInputs = Pick<BusinessBlueprint, "name" | "city" | "industry" | "category" | "reviews" | "media">;

const heritageWords = /heritage|palace|royal|classic|legacy|mahal|villa|manor|established/i;
const precisionIndustries: Industry[] = ["dental", "doctor", "lawyer", "architect", "coaching"];
const vibrantIndustries: Industry[] = ["restaurant", "event", "wedding", "gym", "salon", "retail"];

const stableHash = (value: string) =>
  Array.from(value).reduce((hash, char) => ((hash * 31) + char.charCodeAt(0)) >>> 0, 2166136261);

export function deriveBrandDirection(input: BrandInputs, defaultHero: HeroVariant, defaultSections: SectionId[]): {
  brandDNA: BrandDNA;
  designStrategy: WebsiteDesignStrategy;
} {
  const signature = `${input.name}|${input.city}|${input.industry}`;
  const hash = stableHash(signature);
  const photoCount = input.media?.length ?? 0;
  const rating = input.reviews.verified ? input.reviews.rating : 0;

  const archetype = heritageWords.test(input.name)
    ? "heritage"
    : precisionIndustries.includes(input.industry)
      ? "precision"
      : vibrantIndustries.includes(input.industry)
        ? "vibrant"
        : hash % 2 === 0 ? "welcoming" : "editorial";
  const energy = archetype === "heritage" || archetype === "precision"
    ? "quiet"
    : archetype === "vibrant" ? "bold" : "balanced";
  const imageTreatment = photoCount >= 5
    ? "gallery-led"
    : photoCount > 0 && (archetype === "heritage" || archetype === "vibrant")
      ? "immersive"
      : "framed";
  const heroVariant: HeroVariant = imageTreatment === "immersive"
    ? "full"
    : imageTreatment === "gallery-led" && hash % 3 === 0
      ? "editorial"
      : defaultHero;

  const available = [...defaultSections];
  if (imageTreatment === "gallery-led") {
    const gallery = available.indexOf("gallery");
    if (gallery > 1) {
      available.splice(gallery, 1);
      available.splice(1, 0, "gallery");
    }
  }
  if (input.reviews.verified && rating >= 4.5) {
    const reviews = available.indexOf("reviews");
    if (reviews > 2) {
      available.splice(reviews, 1);
      available.splice(2, 0, "reviews");
    }
  }

  const signals = [input.category];
  if (input.city) signals.push(input.city);
  if (photoCount) signals.push(`${photoCount} verified photos`);
  if (input.reviews.verified) signals.push("verified customer reputation");

  return {
    brandDNA: {
      archetype,
      energy,
      locality: input.city,
      confidence: Math.min(1, 0.55 + (photoCount ? 0.2 : 0) + (input.reviews.verified ? 0.2 : 0)),
      signals,
    },
    designStrategy: {
      heroVariant,
      imageTreatment,
      alignment: heroVariant === "editorial" ? "center" : "left",
      sectionOrder: available,
    },
  };
}