import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { leads } from "@/features/businesses";
import { toast } from "sonner";

export const Route = createFileRoute("/owner/leads")({ component: LeadsPage });

const filters = ["all", "new", "contacted", "closed"] as const;

function LeadsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const rows = leads.filter((l) => filter === "all" || l.status === filter);

  return (
    <>
      <PageHeader title="Leads" subtitle="Every enquiry from your website, in one inbox." />
      <div className="mb-5 flex gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full border px-3.5 py-1.5 text-xs capitalize transition-colors ${filter === f ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}
          >
            {f}
          </button>
        ))}
      </div>
      <ul className="grid gap-4">
        {rows.map((l) => (
          <li key={l.id} className="flex flex-wrap items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="min-w-0 flex-1">
              <p className="font-medium">{l.name}</p>
              <p className="text-sm text-muted-foreground">{l.phone} · {l.channel} · {l.createdAt}</p>
              <p className="mt-2 text-sm">{l.message}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild><a href={`tel:${l.phone}`}>Call</a></Button>
              <Button size="sm" onClick={() => toast.success("Marked as contacted")}>Mark contacted</Button>
            </div>
          </li>
        ))}
      </ul>
      {rows.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">Nothing here yet.</p>}
    </>
  );
}
