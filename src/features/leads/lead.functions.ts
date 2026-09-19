/**
 * Launch lead server functions.
 *
 * Leads are written with the privileged server client: the table is not
 * reachable from the browser at all, so customer contact details can never be
 * read by visitors. Reading leads back requires a staff passcode.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ADMIN_PASSCODE, SUPER_ADMIN_PASSCODE } from "@/features/auth/auth.service";
import type { LaunchEmailStatus, LaunchLead, LaunchLeadResult, LaunchStatus } from "./lead.types";

const phonePattern = /^\+?[0-9][0-9\s\-()]{7,19}$/;

const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .regex(phonePattern, "Please enter a valid contact number"),
  email: z.string().trim().email("Please enter a valid email address").max(160),
  businessName: z.string().trim().max(120).optional(),
  businessType: z.string().trim().max(80).optional(),
  googleMapsUrl: z.string().trim().max(600).optional(),
  generatedWebsiteId: z.string().trim().max(120).optional(),
  generatedWebsiteUrl: z.string().trim().max(600).optional(),
  socialSourcesUsed: z.array(z.string().trim().max(60)).max(20).optional(),
  userAgent: z.string().trim().max(400).optional(),
});

export const submitLaunchLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => leadSchema.parse(input))
  .handler(async ({ data }): Promise<LaunchLeadResult> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendLaunchNotification } = await import("./lead-email.server");

    const row = {
      name: data.name,
      phone: data.phone,
      email: data.email.toLowerCase(),
      business_name: data.businessName ?? null,
      business_type: data.businessType ?? null,
      google_maps_url: data.googleMapsUrl ?? null,
      generated_website_id: data.generatedWebsiteId ?? null,
      generated_website_url: data.generatedWebsiteUrl ?? null,
      social_sources_used: data.socialSourcesUsed ?? [],
      user_agent: data.userAgent ?? null,
    };

    // Same person + same generated website = the same request. An accidental
    // second submit updates the existing row instead of creating a duplicate.
    const { data: saved, error } = await supabaseAdmin
      .from("website_launch_leads")
      .upsert(row, { onConflict: "email,generated_website_id" })
      .select("id")
      .single();

    if (error || !saved) {
      return {
        ok: false,
        message: "We couldn't complete the launch request right now. Please try again in a moment.",
      };
    }

    const attempt = await sendLaunchNotification(data);
    await supabaseAdmin
      .from("website_launch_leads")
      .update({ email_status: attempt.status, email_error: attempt.error ?? null })
      .eq("id", saved.id);

    return { ok: true, id: saved.id, emailStatus: attempt.status };
  });

const listSchema = z.object({ token: z.string().max(60) });

export const listLaunchLeads = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => listSchema.parse(input))
  .handler(async ({ data }): Promise<LaunchLead[]> => {
    const token = data.token.trim();
    if (token !== SUPER_ADMIN_PASSCODE && token !== ADMIN_PASSCODE) return [];

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("website_launch_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error || !rows) return [];

    return rows.map((r) => ({
      id: r.id,
      createdAt: r.created_at,
      name: r.name,
      phone: r.phone,
      email: r.email,
      businessName: r.business_name,
      businessType: r.business_type,
      googleMapsUrl: r.google_maps_url,
      generatedWebsiteId: r.generated_website_id,
      generatedWebsiteUrl: r.generated_website_url,
      socialSourcesUsed: r.social_sources_used ?? [],
      launchStatus: r.launch_status as LaunchStatus,
      emailStatus: r.email_status as LaunchEmailStatus,
    }));
  });
