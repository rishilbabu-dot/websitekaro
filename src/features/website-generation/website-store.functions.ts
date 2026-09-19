/**
 * Cloud persistence for generated websites.
 *
 * Generated blueprints used to live only in browser storage, so a preview link
 * was useless on another device. These functions save each generated site to
 * the database and read it back by slug, which makes preview links shareable
 * and gives staff visibility of what has been generated.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { BusinessBlueprint } from "@/features/businesses";

const saveSchema = z.object({
  slug: z.string().min(1).max(120),
  name: z.string().min(1).max(160),
  city: z.string().max(80).default("Mumbai"),
  industry: z.string().max(60).default("general"),
  sourceUrl: z.string().max(500).optional(),
  officialWebsite: z.string().max(500).optional(),
  mode: z.string().max(20).default("draft"),
  verified: z.boolean().default(false),
  ownerEmail: z.string().max(160).optional(),
  blueprint: z.custom<BusinessBlueprint>(),
});

export const saveGeneratedWebsite = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => saveSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("generated_websites").upsert(
      {
        slug: data.slug,
        name: data.name,
        city: data.city,
        industry: data.industry,
        source_url: data.sourceUrl ?? null,
        official_website: data.officialWebsite ?? null,
        generation_mode: data.mode,
        verified: data.verified,
        owner_email: data.ownerEmail ?? null,
        blueprint: JSON.parse(JSON.stringify(data.blueprint)),
      },
      { onConflict: "slug" },
    );
    if (error) return { saved: false, reason: error.message };
    return { saved: true };
  });

export const getGeneratedWebsite = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("generated_websites")
      .select("blueprint")
      .eq("slug", data.slug)
      .maybeSingle();
    return (row?.blueprint as unknown as BusinessBlueprint) ?? null;
  });

export const listGeneratedWebsites = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("generated_websites")
    .select("slug, name, city, industry, generation_mode, verified, owner_email, launch_status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  return data ?? [];
});
