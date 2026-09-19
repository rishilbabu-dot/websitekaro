import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildBlueprint, getIndustryDesign } from "@/features/industries";
import { cacheKey, cacheSize, readCachedBlueprint, writeCachedBlueprint } from "./blueprint-cache";
import { estimateCredits, GENERATION_LIMITS } from "./generation.limits";
import { getGenerationMode, type GenerationOutcome, type GenerationUsage } from "./generation.types";
import { dailyCapReached, recordGeneration, usageSummary } from "./usage-ledger";
import { aiCopySchema, aiLongFormSchema } from "./blueprint.schema";
import { buildResearchPacket } from "./research-packet";
import { detectGenericCopy, refinementBrief } from "./generic-content";

import type { VerifiedPlace } from "@/features/website-generation/place-research.types";
import type { WebsiteResearch } from "@/features/website-generation/website-research.types";

const MODEL = "google/gemini-3.6-flash";

const inputSchema = z.object({
  name: z.string().min(1).max(120),
  city: z.string().max(80).default("Mumbai"),
  industry: z.string().max(60),
  mode: z.string().max(20).optional(),
  sourceUrl: z.string().max(500).optional(),
  /** AI imagery is opt-in and off by default; it is the most expensive step. */
  withImages: z.boolean().optional(),
  verifiedPlace: z.custom<VerifiedPlace>().optional(),
  websiteResearch: z.custom<WebsiteResearch>().optional(),
});

export const generateBlueprint = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<GenerationOutcome> => {
    const requestedMode = getGenerationMode(data.mode);
    const design = getIndustryDesign(data.industry);
    const city = data.city?.trim() || "Mumbai";
    const base = buildBlueprint({
      name: data.name,
      city,
      industry: data.industry,
      ...(data.sourceUrl ? { sourceUrl: data.sourceUrl } : {}),
      ...(data.verifiedPlace ? { verifiedPlace: data.verifiedPlace } : {}),
      ...(data.websiteResearch ? { websiteResearch: data.websiteResearch } : {}),
    });

    const finish = (
      blueprint: GenerationOutcome["blueprint"],
      mode: GenerationOutcome["mode"],
      extra: { cached?: boolean; usage?: GenerationUsage; notice?: string } = {},
    ): GenerationOutcome => {
      recordGeneration({
        business: blueprint.name,
        industry: design.id,
        mode,
        cached: extra.cached ?? false,
        ...(extra.usage ? { usage: extra.usage } : {}),
      });
      return {
        blueprint,
        mode,
        requestedMode,
        cached: extra.cached ?? false,
        ...(extra.usage ? { usage: extra.usage } : {}),
        ...(extra.notice ? { notice: extra.notice } : {}),
      };
    };

    if (requestedMode === "draft") return finish(base, "draft");

    // Source fingerprints keep different source sets from reusing stale copy.
    const placeFp = data.verifiedPlace ? `${data.verifiedPlace.placeId}:${data.verifiedPlace.verifiedAt.slice(0, 10)}` : "unverified";
    const webFp = data.websiteResearch ? `:web-${data.websiteResearch.url.slice(0, 60)}-${data.websiteResearch.fetchedAt.slice(0, 10)}` : "";
    const key = cacheKey({
      name: data.name,
      city,
      industry: design.id,
      mode: requestedMode,
      sourceFingerprint: `${placeFp}${webFp}:research-v2`,
    });
    const cached = readCachedBlueprint(key);
    if (cached) return finish(cached, requestedMode, { cached: true });

    if (dailyCapReached()) {
      return finish(base, "draft", {
        notice: `Daily AI limit reached (${GENERATION_LIMITS.perDay} generations). Showing the free Draft version instead.`,
      });
    }

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return finish(base, "draft", { notice: "AI is not configured — showing the free Draft version." });
    }

    try {
      const [{ generateText, Output, NoObjectGeneratedError }, { createLovableAiGatewayProvider }] =
        await Promise.all([import("ai"), import("@/lib/ai-gateway.server")]);

      const gateway = createLovableAiGatewayProvider(apiKey, undefined, { structuredOutputs: true });
      const model = gateway(MODEL);

      let inputTokens = 0;
      let outputTokens = 0;

      // The packet is the only ground truth the model is allowed to write from.
      const context = buildResearchPacket({
        blueprint: base,
        city,
        industryLabel: design.label,
        industryCategory: design.category,
        ...(data.verifiedPlace ? { verifiedPlace: data.verifiedPlace } : {}),
        ...(data.websiteResearch ? { websiteResearch: data.websiteResearch } : {}),
      });

      const SYSTEM =
        "You are a senior copywriter at a premium Indian digital agency. You write from a verified research packet only. Every line must be specific to this one business. Never invent prices, awards, certifications, experience claims or medical claims.";

      const copyResult = await generateText({
        model,
        output: Output.object({ schema: aiCopySchema }),
        system: SYSTEM,
        prompt: [
          context,
          "",
          `Write website copy for this business. Keep the tagline under 70 characters, the description 2-3 sentences, seoTitle under 60 characters and seoDescription under 155 characters. Return exactly ${base.services.length} services (reuse the existing service names) and ${base.faqs.length} FAQs. Give 3 usp items, 3 personality words and 6 keywords.`,
        ].join("\n"),
      });


      inputTokens += copyResult.usage?.inputTokens ?? 0;
      outputTokens += copyResult.usage?.outputTokens ?? 0;
      const copy = copyResult.output;

      const clamp = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

      let blueprint = {
        ...base,
        tagline: clamp(copy.tagline, 90),
        description: copy.description,
        audience: copy.audience || base.audience,
        usp: copy.usp.slice(0, 4).length ? copy.usp.slice(0, 4) : base.usp,
        personality: copy.personality.slice(0, 4).length ? copy.personality.slice(0, 4) : base.personality,
        services: base.services.map((s, i) => {
          const next = copy.services[i];
          return next ? { ...s, name: next.name || s.name, description: next.description || s.description } : s;
        }),
        faqs: base.faqs.map((f, i) => {
          const next = copy.faqs[i];
          return next ? { ...f, question: next.question || f.question, answer: next.answer || f.answer } : f;
        }),
        reviews: { ...base.reviews, summary: copy.reviewSummary || base.reviews.summary },
        seo: {
          title: clamp(copy.seoTitle || base.seo.title, 60),
          metaDescription: clamp(copy.seoDescription || base.seo.metaDescription, 155),
          keywords: copy.keywords.slice(0, 8).length ? copy.keywords.slice(0, 8) : base.seo.keywords,
        },
      };

      if (requestedMode === "deep") {
        try {
          const longResult = await generateText({
            model,
            output: Output.object({ schema: aiLongFormSchema }),
            system:
              "You are a senior copywriter at a premium Indian digital agency. Expand website copy into rich, specific long-form sections without inventing facts.",
            prompt: [
              context,
              "",
              `Current description: ${blueprint.description}`,
              "",
              `Expand into long-form copy: a 4-5 sentence description, ${blueprint.services.length} services with 2-3 sentence descriptions (same names), and ${blueprint.faqs.length} FAQs with 2-3 sentence answers (same questions).`,
            ].join("\n"),
          });

          inputTokens += longResult.usage?.inputTokens ?? 0;
          outputTokens += longResult.usage?.outputTokens ?? 0;
          const long = longResult.output;

          blueprint = {
            ...blueprint,
            description: long.description || blueprint.description,
            services: blueprint.services.map((s, i) => {
              const next = long.services[i];
              return next?.description ? { ...s, description: next.description } : s;
            }),
            faqs: blueprint.faqs.map((f, i) => {
              const next = long.faqs[i];
              return next?.answer ? { ...f, answer: next.answer } : f;
            }),
          };
        } catch (error) {
          if (!NoObjectGeneratedError.isInstance(error)) throw error;
          // Keep the standard-quality copy rather than failing the generation.
        }
      }

      // Uniqueness pass: if the copy still reads like a template, give the model
      // one chance to rewrite only the flagged fields — no new facts allowed.
      const findings = detectGenericCopy(blueprint, city);
      if (findings.length) {
        try {
          const fixResult = await generateText({
            model,
            output: Output.object({ schema: aiCopySchema }),
            system: SYSTEM,
            prompt: [
              context,
              "",
              "The draft copy below was flagged as generic. Rewrite it so it could only describe this business. Keep the same structure, service names and FAQ questions, and add no new facts.",
              "",
              "Flagged:",
              refinementBrief(findings),
              "",
              `Current tagline: ${blueprint.tagline}`,
              `Current description: ${blueprint.description}`,
              `Current USPs: ${blueprint.usp.join(" | ")}`,
              `Current service descriptions: ${blueprint.services.map((s) => `${s.name}: ${s.description}`).join(" | ")}`,
              `Current FAQ answers: ${blueprint.faqs.map((f) => `${f.question}: ${f.answer}`).join(" | ")}`,
            ].join("\n"),
          });

          inputTokens += fixResult.usage?.inputTokens ?? 0;
          outputTokens += fixResult.usage?.outputTokens ?? 0;
          const fixed = fixResult.output;

          const candidate = {
            ...blueprint,
            tagline: clamp(fixed.tagline || blueprint.tagline, 90),
            description: fixed.description || blueprint.description,
            usp: fixed.usp.slice(0, 4).length ? fixed.usp.slice(0, 4) : blueprint.usp,
            services: blueprint.services.map((s, i) => {
              const next = fixed.services[i];
              return next?.description ? { ...s, description: next.description } : s;
            }),
            faqs: blueprint.faqs.map((f, i) => {
              const next = fixed.faqs[i];
              return next?.answer ? { ...f, answer: next.answer } : f;
            }),
            seo: {
              ...blueprint.seo,
              metaDescription: clamp(fixed.seoDescription || blueprint.seo.metaDescription, 155),
            },
          };
          // Only keep the rewrite if it actually improved specificity.
          if (detectGenericCopy(candidate, city).length < findings.length) blueprint = candidate;
        } catch (error) {
          if (!NoObjectGeneratedError.isInstance(error)) throw error;
          // Keep the flagged-but-valid copy rather than failing the generation.
        }
      }


      const usage: GenerationUsage = {
        inputTokens,
        outputTokens,
        estimatedCredits: estimateCredits(inputTokens, outputTokens),
        model: MODEL,
      };

      writeCachedBlueprint(key, blueprint);
      return finish(blueprint, requestedMode, { usage });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const notice = /402|payment|credit/i.test(message)
        ? "AI credits are exhausted — showing the free Draft version. Top up credits to use Standard or Deep."
        : /429|rate limit/i.test(message)
          ? "AI is rate limited right now — showing the free Draft version. Try again in a minute."
          : "AI generation failed — showing the free Draft version.";
      return finish(base, "draft", { notice });
    }
  });

export const getUsageSummary = createServerFn({ method: "GET" }).handler(async () => ({
  ...usageSummary(),
  cachedBlueprints: cacheSize(),
}));
