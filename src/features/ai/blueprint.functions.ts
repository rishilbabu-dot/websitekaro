import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildBlueprint, getIndustryDesign } from "@/features/industries";
import { cacheKey, readCachedBlueprint, writeCachedBlueprint } from "./blueprint-cache";
import { estimateCredits, GENERATION_LIMITS } from "./generation.limits";
import { getGenerationMode, type GenerationOutcome, type GenerationUsage } from "./generation.types";
import { dailyCapReached, recordGeneration, usageSummary } from "./usage-ledger";
import { aiCopySchema, aiLongFormSchema } from "./blueprint.schema";

const MODEL = "google/gemini-3.6-flash";

const inputSchema = z.object({
  name: z.string().min(1).max(120),
  city: z.string().max(80).default("Mumbai"),
  industry: z.string().max(60),
  mode: z.string().max(20).optional(),
  sourceUrl: z.string().max(500).optional(),
  /** AI imagery is opt-in and off by default; it is the most expensive step. */
  withImages: z.boolean().optional(),
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

    const key = cacheKey({ name: data.name, city, industry: design.id, mode: requestedMode });
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

      const gateway = createLovableAiGatewayProvider(apiKey);
      const model = gateway(MODEL);

      let inputTokens = 0;
      let outputTokens = 0;

      const context = [
        `Business name: ${base.name}`,
        `City: ${city}`,
        `Industry: ${design.label} (${design.category})`,
        `Existing service names: ${base.services.map((s) => s.name).join(", ")}`,
        `Existing FAQ questions: ${base.faqs.map((f) => f.question).join(" | ")}`,
      ].join("\n");

      const copyResult = await generateText({
        model,
        output: Output.object({ schema: aiCopySchema }),
        system:
          "You are a senior copywriter at a premium Indian digital agency. Write warm, specific, non-generic website copy for a local business. Never invent prices, awards, certifications or medical claims.",
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

export const getUsageSummary = createServerFn({ method: "GET" }).handler(async () => {
  const { cacheSize } = await import("./blueprint-cache");
  return { ...usageSummary(), cachedBlueprints: cacheSize() };
});
