/**
 * Industry design systems.
 *
 * Every supported vertical owns a palette, typography pairing, hero
 * composition, section order and vocabulary. The generated-site renderer reads
 * this config — it never hardcodes "dental" anywhere.
 */

export type HeroVariant = "split" | "full" | "editorial";

export type SectionId =
  | "about"
  | "services"
  | "team"
  | "gallery"
  | "reviews"
  | "faq"
  | "contact";

export interface IndustryTheme {
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  secondary: string;
  muted: string;
  mutedForeground: string;
  border: string;
  ink: string;
  sand: string;
  radius: string;
  displayFont: string;
  bodyFont?: string;
}

export interface IndustryWords {
  servicesNav: string;
  servicesEyebrow: string;
  servicesTitle: string;
  teamNav: string;
  teamEyebrow: string;
  teamTitle: string;
  galleryNav: string;
  galleryTitle: string;
  aboutTitle: string;
  contactEyebrow: string;
  contactTitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  newsletterTitle: string;
}

export interface IndustryDesign {
  id: string;
  label: string;
  category: string;
  heroVariant: HeroVariant;
  sections: SectionId[];
  theme: IndustryTheme;
  words: IndustryWords;
  credibility: string[];
  /** Seed content used when a blueprint is generated for this vertical. */
  seed: {
    tagline: string;
    blurb: string;
    audience: string;
    usp: string[];
    trust: [string, string][];
    services: [string, string, string, string][];
    team: [string, string, string, string, string][];
    faqs: [string, string][];
    reviewSummary: string;
    reviews: [string, string][];
    gallery: string[];
    keywords: string[];
  };
}