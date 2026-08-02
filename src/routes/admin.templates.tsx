import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared";
import { industryPresets } from "@/features/businesses";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/templates")({ component: TemplatesPage });

function TemplatesPage() {
  return (
    <>
      <PageHeader title="Templates & prompts" subtitle="Each industry ships a section recipe and a generation prompt. Adding a vertical means adding a preset, not rebuilding the renderer." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {industryPresets.map((p) => (
          <article key={p.id} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg">{p.label}</h2>
              <span className={`rounded-full px-2.5 py-1 text-xs ${p.ready ? "bg-success/12 text-success" : "bg-secondary text-muted-foreground"}`}>
                {p.ready ? "Live" : "Planned"}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {p.ready ? "Hero, services, team, gallery, reviews, FAQ, contact, appointment form." : "Section recipe not authored yet."}
            </p>
            <Button variant="outline" size="sm" className="mt-5" disabled={!p.ready} onClick={() => toast("Prompt editor opens in a later release.")}>
              Edit prompt
            </Button>
          </article>
        ))}
      </div>
    </>
  );
}
