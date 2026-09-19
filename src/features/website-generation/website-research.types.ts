/**
 * Official-website research — facts and media extracted from a business's own
 * public website. Always additive and source-aware: nothing here invents
 * content, and every image keeps the page it came from.
 */

export interface WebsiteImage {
  url: string;
  /** The page this image was found on — used for attribution links. */
  sourcePage: string;
  alt?: string;
}

export interface WebsiteServiceHint {
  name: string;
  description?: string;
}

export interface WebsiteFaq {
  question: string;
  answer: string;
}

export interface WebsiteResearch {
  /** Final URL after redirects. */
  url: string;
  /** Verified when the URL came from the Google listing; otherwise user-provided. */
  confidence: "verified" | "user-provided";
  fetchedAt: string;
  title: string;
  description: string;
  /** Short visible-text excerpt, used as grounding context for AI copy. */
  about: string;
  services: WebsiteServiceHint[];
  faqs: WebsiteFaq[];
  emails: string[];
  images: WebsiteImage[];
  logoUrl?: string;
  themeColor?: string;
}

export interface WebsiteResearchResult {
  research: WebsiteResearch | null;
  notice?: string;
}
