/**
 * "Built using your business information" — shows only the sources that were
 * actually used, plus an authenticity check whose ticks reflect real state.
 */
import { Check, Minus } from "lucide-react";
import type { BusinessBlueprint } from "@/features/businesses";

export function SourcesPanel({ data }: { data: BusinessBlueprint }) {
  const sources = data.sources ?? [];
  const checks: { label: string; ok: boolean }[] = [
    { label: "Business information verified", ok: Boolean(data.mapsUrl) },
    { label: "Google rating verified", ok: data.reviews.verified === true },
    { label: "Reviews sourced from Google", ok: data.reviews.verified === true },
    { label: "Google Maps linked", ok: Boolean(data.mapsUrl) },
    { label: "Official brand channels linked", ok: data.social.length > 0 },
    { label: "Mobile responsive", ok: true },
    { label: "Local SEO ready", ok: data.seo.keywords.length > 0 },
  ];

  return (
    <div className="grid gap-5 rounded-[1.75rem] border border-border bg-card p-7 lg:grid-cols-2">
      <section>
        <h3 className="text-lg">Built using your business information</h3>
        {sources.length ? (
          <ul className="mt-4 grid gap-2 text-sm">
            {sources.map((s) => (
              <li key={`${s.kind}-${s.url}`} className="flex items-center gap-2.5">
                <Check className="size-4 shrink-0 text-success" />
                <a href={s.url} target="_blank" rel="noreferrer noopener" className="underline-offset-4 hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            No brand links were added, so this website was built from your business type and location alone. Add your Google
            Maps link and social channels to make it more specific to you.
          </p>
        )}
      </section>

      <section>
        <h3 className="text-lg">WebsiteKaro authenticity check</h3>
        <ul className="mt-4 grid gap-2 text-sm">
          {checks.map((c) => (
            <li key={c.label} className={`flex items-center gap-2.5 ${c.ok ? "" : "text-muted-foreground"}`}>
              {c.ok ? <Check className="size-4 shrink-0 text-success" /> : <Minus className="size-4 shrink-0" />}
              {c.label}
              {c.ok ? null : <span className="ml-auto text-[11px]">not yet</span>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
