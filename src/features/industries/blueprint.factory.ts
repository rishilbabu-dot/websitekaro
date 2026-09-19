/**
 * Turns an industry design system + a few facts about a business into a full
 * BusinessBlueprint. This is the deterministic stand-in for the AI research
 * pipeline: same contract in, same contract out.
 */
import type { BusinessBlueprint, Industry } from "@/features/businesses";
import { getIndustryDesign } from "./industry.config";

export interface BlueprintSeedInput {
  name: string;
  city: string;
  industry: string;
  sourceUrl?: string;
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

const initials = (s: string) =>
  s.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("");

export const buildBlueprint = (input: BlueprintSeedInput): BusinessBlueprint => {
  const design = getIndustryDesign(input.industry);
  const s = design.seed;
  const name = input.name.trim() || `${design.label} Studio`;
  const city = input.city.trim() || "Mumbai";
  const slug = `${slugify(name)}-${slugify(city)}`;
  const digits = Array.from(slug).reduce((a, c) => a + c.charCodeAt(0), 0);
  const phoneTail = String(10000 + (digits % 89999));

  return {
    id: `gen_${slug}`,
    slug,
    industry: design.id as Industry,
    status: "generated",
    generatedAt: new Date().toISOString().slice(0, 10),
    name,
    tagline: s.tagline,
    category: design.category,
    description: `${name} is a ${design.category.toLowerCase()} in ${city}. ${s.blurb}`,
    address: `Ground Floor, Linking Road, ${city} 400050`,
    landmarks: [`Near ${city} station`, "Ample parking on site"],
    city,
    phone: `+91 98${String(digits % 100).padStart(2, "0")}0 ${phoneTail}`,
    whatsapp: `9198${String(digits % 100).padStart(2, "0")}0${phoneTail}`,
    email: `hello@${slugify(name).replace(/-/g, "")}.in`,
    mapEmbedQuery: `${name}, ${city}`,
    hours: [
      { day: "Monday – Friday", open: "10:00 – 20:00" },
      { day: "Saturday", open: "10:00 – 18:00" },
      { day: "Sunday", open: "By appointment" },
    ],
    logoMark: initials(name) || "WK",
    brand: { primary: design.theme.primary, accent: design.theme.accent },
    photos: [],
    services: s.services.map(([sname, desc, priceFrom, duration], i) => ({
      id: `s${i + 1}`,
      name: sname,
      description: desc,
      priceFrom,
      duration,
    })),
    team: s.team.map(([tname, role, qualification, experience, bio], i) => ({
      id: `t${i + 1}`,
      name: tname,
      role,
      qualification,
      experience,
      bio,
      photo: "",
    })),
    faqs: s.faqs.map(([question, answer], i) => ({ id: `f${i + 1}`, question, answer })),
    // Sample wording only. Nothing here is presented as a real Google review —
    // verified reviews arrive with the live Google Business source.
    reviews: {
      rating: 4.8,
      count: 120 + (digits % 400),
      summary: s.reviewSummary,
      verified: false,
      items: s.reviews.map(([author, text], i) => ({
        id: `r${i + 1}`,
        author,
        rating: 5,
        text,
        source: "Sample",
        verified: false,
        date: i === 0 ? "2 weeks ago" : "1 month ago",
      })),
    },
    cta: { primary: design.words.ctaPrimary, secondary: design.words.ctaSecondary },
    seo: {
      title: `${name} — ${design.category} in ${city}`,
      metaDescription: `${s.blurb} Visit ${name}, a ${design.category.toLowerCase()} in ${city}.`.slice(0, 155),
      keywords: [...s.keywords, `${design.label.toLowerCase()} in ${city.toLowerCase()}`],
    },
    // Social links only exist when the owner supplies them — we never guess
    // that a profile belongs to this business.
    social: [],
    personality: ["Premium", "Trustworthy", "Warm"],
    audience: s.audience,
    usp: s.usp,
    trust: s.trust.map(([label, value]) => ({ label, value })),
  };
};