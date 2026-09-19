/**
 * Generic-content detection.
 *
 * After the model writes copy we check whether it could belong to any business
 * in the category. Anything flagged here goes back to the model once for a
 * uniqueness refinement pass; nothing is invented to fix it.
 */
import type { BusinessBlueprint } from "@/features/businesses";

const BANNED = [
  "your trusted partner",
  "trusted partner",
  "state-of-the-art",
  "state of the art",
  "one-stop",
  "one stop shop",
  "we strive",
  "unparalleled",
  "next level",
  "cutting-edge",
  "world-class",
  "best in class",
  "second to none",
  "customer satisfaction is our",
  "we pride ourselves",
  "wide range of services",
  "quality service at affordable",
  "lorem ipsum",
];

export interface GenericFinding {
  field: string;
  reason: string;
}

const clean = (value: string) => value.toLowerCase();

function scan(field: string, value: string | undefined, findings: GenericFinding[]) {
  if (!value) return;
  const lower = clean(value);
  for (const phrase of BANNED) {
    if (lower.includes(phrase)) {
      findings.push({ field, reason: `uses the filler phrase "${phrase}"` });
      return;
    }
  }
}

/** Returns the fields that read like template copy for this blueprint. */
export function detectGenericCopy(blueprint: BusinessBlueprint, city: string): GenericFinding[] {
  const findings: GenericFinding[] = [];

  scan("tagline", blueprint.tagline, findings);
  scan("description", blueprint.description, findings);
  scan("seoDescription", blueprint.seo?.metaDescription, findings);
  blueprint.services.forEach((service, i) => scan(`services[${i}].description`, service.description, findings));
  blueprint.faqs.forEach((faq, i) => scan(`faqs[${i}].answer`, faq.answer, findings));
  blueprint.usp.forEach((usp, i) => scan(`usp[${i}]`, usp, findings));

  // The description must anchor the business in the real world: its own name or
  // its city. Copy that mentions neither is interchangeable with any competitor.
  const body = clean(blueprint.description ?? "");
  const nameToken = clean(blueprint.name.split(/\s+/)[0] ?? "");
  if (body && nameToken && !body.includes(nameToken) && !body.includes(clean(city))) {
    findings.push({ field: "description", reason: `never mentions ${blueprint.name} or ${city}` });
  }

  if (blueprint.tagline && blueprint.tagline.trim().split(/\s+/).length < 3) {
    findings.push({ field: "tagline", reason: "is too short to say anything specific" });
  }

  return findings;
}

/** A short instruction block naming what must be rewritten. */
export function refinementBrief(findings: GenericFinding[]): string {
  return findings.map((f) => `- ${f.field} ${f.reason}`).join("\n");
}
