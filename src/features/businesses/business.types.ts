/**
 * Business Blueprint — the structured contract every WebsiteKaro website is
 * generated from. AI research engines (future) produce this shape; the website
 * generator only ever consumes it. Adding an industry = adding a vertical
 * preset + template, never touching the renderer contract.
 */

export type Industry =
  | "dental"
  | "doctor"
  | "restaurant"
  | "hotel"
  | "resort"
  | "banquet"
  | "event"
  | "wedding"
  | "photographer"
  | "decorator"
  | "salon"
  | "lawyer"
  | "gym"
  | "school"
  | "coaching"
  | "interior"
  | "architect"
  | "retail"
  | "home-services";

export type WebsiteStatus = "draft" | "generated" | "in-review" | "published" | "suspended";

export interface Service {
  id: string;
  name: string;
  description: string;
  priceFrom?: string;
  duration?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  qualification: string;
  experience: string;
  bio: string;
  photo: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  source: string;
  date: string;
  /** Link to the review on its source (Google Maps listing). Never fabricated. */
  url?: string;
  /** True only when the text came from a real Google Business source. */
  verified?: boolean;
}

/** Where a piece of website content came from. */
export type SourceKind =
  | "google-maps"
  | "google-reviews"
  | "instagram"
  | "facebook"
  | "youtube"
  | "x"
  | "linkedin"
  | "tiktok"
  | "pinterest"
  | "website"
  | "booking"
  | "whatsapp"
  | "other";

export type SourceConfidence = "verified" | "user-provided" | "inferred";

export interface BrandSource {
  kind: SourceKind;
  label: string;
  url: string;
  confidence: SourceConfidence;
  verifiedAt?: string;
}

export interface BusinessPhoto {
  url: string;
  source: "owner" | "website" | "google-maps" | "social" | "stock" | "ai-generated";
  sourceUrl?: string;
  attribution?: string;
}

export interface VerifiedBusinessIdentity {
  placeId: string;
  name: string;
  mapsUrl: string;
  verifiedAt: string;
}

export interface BusinessBlueprint {
  id: string;
  slug: string;
  industry: Industry;
  status: WebsiteStatus;
  generatedAt: string;
  name: string;
  tagline: string;
  category: string;
  description: string;
  address: string;
  landmarks: string[];
  city: string;
  phone: string;
  whatsapp: string;
  email: string;
  mapEmbedQuery: string;
  hours: { day: string; open: string }[];
  logoMark: string;
  brand: { primary: string; accent: string };
  photos: string[];
  services: Service[];
  team: TeamMember[];
  faqs: Faq[];
  reviews: {
    rating: number;
    count: number;
    summary: string;
    items: Review[];
    /** True only when rating/count/items come from the real Google listing. */
    verified?: boolean;
    /** Google listing reviews URL, when known. */
    url?: string;
  };
  cta: { primary: string; secondary: string };
  seo: { keywords: string[]; metaDescription: string; title: string };
  social: { label: string; url: string }[];
  personality: string[];
  audience: string;
  usp: string[];
  trust: { label: string; value: string }[];
  /** Official Google Maps listing URL, when the visitor supplied one. */
  mapsUrl?: string;
  /** Every source that fed this website. Internal provenance, shown as a summary. */
  sources?: BrandSource[];
  /** Present only when Google Places resolved the submitted listing. */
  verifiedIdentity?: VerifiedBusinessIdentity;
  /** Source-aware media used by the renderer. Legacy `photos` remains supported. */
  media?: BusinessPhoto[];
}

export interface Lead {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  message: string;
  channel: "Appointment form" | "Contact form" | "WhatsApp" | "Call";
  createdAt: string;
  status: "new" | "contacted" | "closed";
}
