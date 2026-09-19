/**
 * Safe official-website fetcher + extractor.
 *
 * Pure-HTTP, no headless browser. Hardened against SSRF: only public http(s)
 * hosts, no credentials, private/local hostnames and IP literals are refused
 * before and after every redirect. Pages are size- and time-capped, and the
 * crawl budget is the homepage plus at most two same-origin content pages.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type {
  WebsiteFaq,
  WebsiteImage,
  WebsiteResearch,
  WebsiteResearchResult,
  WebsiteServiceHint,
} from "./website-research.types";

const inputSchema = z.object({
  url: z.string().trim().min(4).max(500),
  verified: z.boolean().optional(),
});

const MAX_REDIRECTS = 3;
const MAX_BYTES = 1_000_000;
const FETCH_TIMEOUT_MS = 8_000;
const MAX_IMAGES = 8;
const MAX_EXTRA_PAGES = 2;

const PRIVATE_HOST =
  /^(localhost|.*\.(localhost|local|internal|lan)|0\.|10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1|\[::1\]|\[?f[cd][0-9a-f]{2}:)/i;

/** True only for public http(s) URLs we are willing to fetch. */
export const isSafePublicUrl = (raw: string): boolean => {
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    if (url.username || url.password) return false;
    const host = url.hostname.toLowerCase();
    if (!host || PRIVATE_HOST.test(host)) return false;
    return true;
  } catch {
    return false;
  }
};

const stripTags = (html: string) =>
  html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

const absolutize = (href: string, base: string): string | null => {
  try {
    const url = new URL(href, base);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
};

const SKIP_IMAGE = /logo|icon|favicon|sprite|avatar|badge|flag|qr|pixel|spinner|loader|payment|visa|mastercard/i;

interface JsonLdNode {
  "@type"?: string | string[];
  name?: unknown;
  description?: unknown;
  itemListElement?: unknown;
  mainEntity?: unknown;
  acceptsReservations?: unknown;
  [key: string]: unknown;
}

const jsonLdNodes = (html: string): JsonLdNode[] => {
  const nodes: JsonLdNode[] = [];
  const walk = (value: unknown) => {
    if (Array.isArray(value)) { value.forEach(walk); return; }
    if (!value || typeof value !== "object") return;
    const node = value as JsonLdNode;
    nodes.push(node);
    if (node["@graph"]) walk(node["@graph"]);
  };
  for (const match of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { walk(JSON.parse(match[1]!)); } catch { /* malformed JSON-LD is skipped */ }
  }
  return nodes;
};

const typeIs = (node: JsonLdNode, wanted: string) => {
  const t = node["@type"];
  const types = Array.isArray(t) ? t : [t];
  return types.some((entry) => typeof entry === "string" && entry.toLowerCase().includes(wanted.toLowerCase()));
};

export interface ExtractedPage {
  title: string;
  description: string;
  headings: string[];
  images: WebsiteImage[];
  services: WebsiteServiceHint[];
  faqs: WebsiteFaq[];
  emails: string[];
  logoUrl?: string;
  themeColor?: string;
  text: string;
  contentLinks: string[];
}

/** Pure HTML extraction — exported for tests. */
export const extractPage = (html: string, pageUrl: string): ExtractedPage => {
  const title = stripTags(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  const metaDesc =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)?.[1] ?? "";
  const themeColor = html.match(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i)?.[1];
  const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1];
  const logoLink = html.match(/<link[^>]+rel=["'](?:apple-touch-icon|icon)["'][^>]+href=["']([^"']+)["']/i)?.[1];

  const headings: string[] = [];
  for (const match of html.matchAll(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/gi)) {
    const text = stripTags(match[1]!);
    if (text.length > 2 && text.length < 120) headings.push(text);
  }

  const images: WebsiteImage[] = [];
  for (const match of html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)) {
    const src = match[1]!;
    if (src.startsWith("data:") || src.endsWith(".svg") || SKIP_IMAGE.test(src)) continue;
    const absolute = absolutize(src, pageUrl);
    if (!absolute) continue;
    const alt = match[0]!.match(/alt=["']([^"']*)["']/i)?.[1];
    images.push({ url: absolute, sourcePage: pageUrl, ...(alt ? { alt: stripTags(alt) } : {}) });
  }
  if (ogImage) {
    const absolute = absolutize(ogImage, pageUrl);
    if (absolute && !images.some((image) => image.url === absolute)) images.unshift({ url: absolute, sourcePage: pageUrl });
  }

  const nodes = jsonLdNodes(html);
  const services: WebsiteServiceHint[] = [];
  const faqs: WebsiteFaq[] = [];
  for (const node of nodes) {
    if (typeIs(node, "service") && typeof node.name === "string") {
      services.push({
        name: node.name,
        ...(typeof node.description === "string" ? { description: node.description } : {}),
      });
    }
    for (const key of ["itemListElement", "mainEntity"] as const) {
      const list = node[key];
      if (!Array.isArray(list)) continue;
      for (const item of list) {
        if (!item || typeof item !== "object") continue;
        const row = item as JsonLdNode;
        if (typeIs(row, "service") && typeof row.name === "string") {
          services.push({ name: row.name, ...(typeof row.description === "string" ? { description: row.description } : {}) });
        }
        if (typeIs(row, "question") && typeof row.name === "string") {
          const answer = row["acceptedAnswer"] as { text?: unknown } | undefined;
          if (typeof answer?.text === "string" && answer.text.trim()) {
            faqs.push({ question: row.name, answer: stripTags(answer.text).slice(0, 400) });
          }
        }
      }
    }
  }

  // Heading-based fallback for service hints when no JSON-LD exists.
  if (!services.length) {
    const serviceHeading = headings.findIndex((h) => /service|treatment|what we do|offering|menu|package|solution/i.test(h));
    if (serviceHeading >= 0) {
      for (const heading of headings.slice(serviceHeading + 1, serviceHeading + 7)) {
        if (!/contact|about|footer|follow|review|testimonial|faq/i.test(heading)) services.push({ name: heading });
      }
    }
  }

  const text = stripTags(html).slice(0, 4000);
  const emails = Array.from(new Set(text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) ?? []))
    .filter((email) => !/example\.|sentry|wixpress|\.png|\.jpg/i.test(email))
    .slice(0, 3);

  const contentLinks: string[] = [];
  for (const match of html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = match[1]!;
    const label = stripTags(match[2]!);
    if (!/about|service|treatment|menu|package|portfolio|gallery|pricing|story/i.test(`${href} ${label}`)) continue;
    const absolute = absolutize(href, pageUrl);
    if (!absolute) continue;
    try {
      if (new URL(absolute).hostname !== new URL(pageUrl).hostname) continue;
    } catch { continue; }
    if (!contentLinks.includes(absolute)) contentLinks.push(absolute);
  }

  const logoAbsolute = logoLink ? absolutize(logoLink, pageUrl) : null;

  return {
    title,
    description: metaDesc,
    headings: headings.slice(0, 12),
    images,
    services: services.slice(0, 8),
    faqs: faqs.slice(0, 6),
    emails,
    ...(logoAbsolute ? { logoUrl: logoAbsolute } : {}),
    ...(themeColor ? { themeColor } : {}),
    text,
    contentLinks: contentLinks.slice(0, MAX_EXTRA_PAGES),
  };
};

/** Reads a response body with a hard size cap. */
const readCapped = async (response: Response): Promise<string> => {
  if (!response.body) return response.text();
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done || !value) break;
    total += value.byteLength;
    chunks.push(value);
    if (total >= MAX_BYTES) { await reader.cancel().catch(() => undefined); break; }
  }
  return new TextDecoder().decode(
    chunks.length === 1 ? chunks[0]! : (() => {
      const merged = new Uint8Array(Math.min(total, MAX_BYTES));
      let offset = 0;
      for (const chunk of chunks) { merged.set(chunk.subarray(0, merged.length - offset), offset); offset += chunk.length; }
      return merged;
    })(),
  );
};

/** Fetch with manual redirect validation so every hop stays public. */
const fetchSafe = async (url: string): Promise<{ html: string; finalUrl: string } | null> => {
  let current = url;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (!isSafePublicUrl(current)) return null;
    const response = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { "User-Agent": "WebsiteKaro-Research/1.0 (+https://websitekaro.lovable.app)", Accept: "text/html" },
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      const next = location ? absolutize(location, current) : null;
      if (!next) return null;
      current = next;
      continue;
    }
    if (!response.ok) return null;
    const type = response.headers.get("content-type") ?? "";
    if (!/text\/html|application\/xhtml/i.test(type)) return null;
    return { html: await readCapped(response), finalUrl: response.url || current };
  }
  return null;
};

const dedupe = <T>(items: T[], key: (item: T) => string) =>
  items.filter((item, index, all) => all.findIndex((other) => key(other) === key(item)) === index);

export const researchOfficialWebsite = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<WebsiteResearchResult> => {
    if (!isSafePublicUrl(data.url)) {
      return { research: null, notice: "That website address doesn't look safe to read, so we skipped it." };
    }
    try {
      const homepage = await fetchSafe(data.url);
      if (!homepage) {
        return { research: null, notice: "We couldn't read the official website — the preview uses your verified Google details only." };
      }

      const main = extractPage(homepage.html, homepage.finalUrl);
      const pages = [main];
      for (const link of main.contentLinks) {
        const extra = await fetchSafe(link).catch(() => null);
        if (extra) pages.push(extractPage(extra.html, extra.finalUrl));
      }

      const images = dedupe(pages.flatMap((p) => p.images), (i) => i.url).slice(0, MAX_IMAGES);
      const services = dedupe(pages.flatMap((p) => p.services), (s) => s.name.toLowerCase()).slice(0, 8);
      const faqs = dedupe(pages.flatMap((p) => p.faqs), (f) => f.question.toLowerCase()).slice(0, 6);
      const emails = dedupe(pages.flatMap((p) => p.emails), (e) => e.toLowerCase()).slice(0, 3);

      const research: WebsiteResearch = {
        url: homepage.finalUrl,
        confidence: data.verified ? "verified" : "user-provided",
        fetchedAt: new Date().toISOString(),
        title: main.title,
        description: main.description,
        about: main.text.slice(0, 1200),
        services,
        faqs,
        emails,
        images,
        ...(main.logoUrl ? { logoUrl: main.logoUrl } : {}),
        ...(main.themeColor ? { themeColor: main.themeColor } : {}),
      };
      return { research };
    } catch (error) {
      console.error("Official website research failed", error);
      return { research: null, notice: "We couldn't read the official website — the preview uses your verified Google details only." };
    }
  });
