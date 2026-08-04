/**
 * Schema for the AI-authored slice of a blueprint.
 *
 * The model never returns a whole BusinessBlueprint — the deterministic factory
 * owns structure, IDs, theme and contact data. The model only writes copy, and
 * anything it returns is validated here before it is merged.
 */
import { z } from "zod";

export const aiCopySchema = z.object({
  tagline: z.string(),
  description: z.string(),
  audience: z.string(),
  usp: z.array(z.string()),
  personality: z.array(z.string()),
  services: z.array(z.object({ name: z.string(), description: z.string() })),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
  reviewSummary: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string(),
  keywords: z.array(z.string()),
});

export type AiCopy = z.infer<typeof aiCopySchema>;

export const aiLongFormSchema = z.object({
  description: z.string(),
  services: z.array(z.object({ name: z.string(), description: z.string() })),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
});

export type AiLongForm = z.infer<typeof aiLongFormSchema>;
