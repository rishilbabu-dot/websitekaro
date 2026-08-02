import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { businesses } from "@/features/businesses";
import { toast } from "sonner";

export const Route = createFileRoute("/owner/services")({ component: ServicesEditor });

function ServicesEditor() {
  const b = businesses[0]!;
  return (
    <>
      <PageHeader title="Services" subtitle="Treatments shown on your website, in order." actions={<Button onClick={() => toast("New service row added")}><Plus className="size-4" /> Add service</Button>} />
      <ul className="grid gap-4">
        {b.services.map((s) => (
          <li key={s.id} className="flex flex-wrap items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="min-w-0 flex-1">
              <p className="font-medium">{s.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">{s.priceFrom ? `From ${s.priceFrom}` : "On consultation"}{s.duration ? ` · ${s.duration}` : ""}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toast("Editing " + s.name)}>Edit</Button>
              <Button variant="ghost" size="icon" aria-label={`Remove ${s.name}`} onClick={() => toast.error("Service removed")}><Trash2 className="size-4" /></Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
