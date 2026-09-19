/**
 * Optional brand / social channels the business owner can supply alongside the
 * Google Maps link. Everything here is *user provided* — we never guess that a
 * profile belongs to a business, and we only ever link out to official URLs.
 */
import type { BrandSource, BusinessBlueprint, SourceKind } from "@/features/businesses";

export interface BrandLinkField {
  kind: SourceKind;
  label: string;
  placeholder: string;
  hint?: string;
  group: "social" | "web";
}

export const brandLinkFields: BrandLinkField[] = [
  { kind: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourbrand", group: "social" },
  { kind: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourbrand", group: "social" },
  { kind: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourbrand", hint: "Relevant videos can be embedded on your website.", group: "social" },
  { kind: "x", label: "X / Twitter", placeholder: "https://x.com/yourbrand", group: "social" },
  { kind: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/yourbrand", group: "social" },
  { kind: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@yourbrand", group: "social" },
  { kind: "pinterest", label: "Pinterest", placeholder: "https://pinterest.com/yourbrand", group: "social" },
  { kind: "website", label: "Official website", placeholder: "https://yourbrand.in", group: "web" },
  { kind: "booking", label: "Booking page", placeholder: "https://book.yourbrand.in", group: "web" },
  { kind: "whatsapp", label: "WhatsApp Business", placeholder: "https://wa.me/919820012345", group: "web" },
  { kind: "other", label: "Other brand link", placeholder: "https://…", group: "web" },
];

const LABELS: Record<SourceKind, string> = {
  "google-maps": "Google Maps",
  "google-reviews": "Google Reviews",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  x: "X / Twitter",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  pinterest: "Pinterest",
  website: "Official website",
  booking: "Booking page",
  whatsapp: "WhatsApp",
  other: "Brand link",
};

export const sourceLabel = (kind: SourceKind) => LABELS[kind] ?? "Link";

/** Accepts a full URL or a bare handle/domain and normalises it to an https URL. */
export const normaliseLink = (kind: SourceKind, raw: string): string | null => {
  const value = raw.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
    } catch {
      return null;
    }
  }
  if (value.includes(" ")) return null;
  const handle = value.replace(/^@/, "");
  if (!handle) return null;
  const bases: Partial<Record<SourceKind, string>> = {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/@",
    x: "https://x.com/",
    linkedin: "https://linkedin.com/company/",
    tiktok: "https://tiktok.com/@",
    pinterest: "https://pinterest.com/",
  };
  const base = bases[kind];
  if (base) return `${base}${handle}`;
  if (!handle.includes(".")) return null;
  return `https://${handle}`;
};

export type BrandLinkDraft = Partial<Record<SourceKind, string>>;

/** Turns raw inputs into validated, user-provided sources (invalid entries are dropped). */
export const toBrandSources = (draft: BrandLinkDraft): BrandSource[] =>
  brandLinkFields
    .map((field): BrandSource | null => {
      const url = normaliseLink(field.kind, draft[field.kind] ?? "");
      return url ? { kind: field.kind, label: sourceLabel(field.kind), url, confidence: "user-provided" } : null;
    })
    .filter((s): s is BrandSource => s !== null);

export const encodeBrandSources = (sources: BrandSource[]): string =>
  sources.length ? sources.map((s) => `${s.kind}|${encodeURIComponent(s.url)}`).join(",") : "";

export const decodeBrandSources = (raw: string): BrandSource[] => {
  if (!raw) return [];
  return raw
    .split(",")
    .map((part): BrandSource | null => {
      const [kind, url] = part.split("|");
      if (!kind || !url) return null;
      const field = brandLinkFields.find((f) => f.kind === kind);
      if (!field) return null;
      const safe = normaliseLink(field.kind, decodeURIComponent(url));
      return safe ? { kind: field.kind, label: sourceLabel(field.kind), url: safe, confidence: "user-provided" } : null;
    })
    .filter((s): s is BrandSource => s !== null);
};

/** YouTube channel/video URL → embeddable src, or null when we can't be sure. */
export const youtubeEmbed = (url: string): string | null => {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (!host.endsWith("youtube.com")) return null;
    const v = u.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}`;
    if (u.pathname.startsWith("/embed/")) return `https://www.youtube.com${u.pathname}`;
    const handle = u.pathname.match(/^\/@([^/]+)/)?.[1];
    if (handle) return `https://www.youtube.com/embed?listType=user_uploads&list=${handle}`;
    return null;
  } catch {
    return null;
  }
};

/**
 * Merges verified/user-provided sources into a generated blueprint. Nothing is
 * invented: only links the visitor actually supplied become site content.
 */
export const applyBrandSources = (
  blueprint: BusinessBlueprint,
  sources: BrandSource[],
  mapsUrl?: string,
): BusinessBlueprint => {
  const submittedMaps = mapsUrl && /^https?:\/\//i.test(mapsUrl.trim()) ? mapsUrl.trim() : undefined;
  const maps = blueprint.verifiedIdentity?.mapsUrl ?? blueprint.mapsUrl ?? submittedMaps;
  const existing = blueprint.sources ?? [];
  const all: BrandSource[] = [
    ...existing,
    ...(maps && !existing.some((source) => source.kind === "google-maps") ? [{
      kind: "google-maps" as const,
      label: sourceLabel("google-maps"),
      url: maps,
      confidence: blueprint.verifiedIdentity ? "verified" as const : "user-provided" as const,
    }] : []),
    ...sources,
  ].filter((source, index, list) => list.findIndex((item) => item.kind === source.kind && item.url === source.url) === index);
  return {
    ...blueprint,
    ...(maps ? { mapsUrl: maps } : {}),
    sources: all,
    social: sources
      .filter((s) => s.kind !== "whatsapp" && s.kind !== "booking" && s.kind !== "other")
      .map((s) => ({ label: s.label, url: s.url })),
  };
};
