/**
 * Business Blueprint — the structured contract every WebsiteKaro website is
 * generated from. AI research engines (future) produce this shape; the website
 * generator only ever consumes it. Adding an industry = adding a vertical
 * preset + template, never touching the renderer contract.
 */

export type Industry =
  | "dental"
  | "restaurant"
  | "salon"
  | "lawyer"
  | "ca"
  | "gym"
  | "school"
  | "hotel"
  | "interior"
  | "architect"
  | "retail"
  | "home-services"
  | "real-estate";

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
  reviews: { rating: number; count: number; summary: string; items: Review[] };
  cta: { primary: string; secondary: string };
  seo: { keywords: string[]; metaDescription: string; title: string };
  social: { label: string; url: string }[];
  personality: string[];
  audience: string;
  usp: string[];
  trust: { label: string; value: string }[];
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
