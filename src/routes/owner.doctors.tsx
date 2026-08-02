import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { businesses } from "@/features/businesses";
import { toast } from "sonner";

export const Route = createFileRoute("/owner/doctors")({ component: DoctorsEditor });

function DoctorsEditor() {
  const b = businesses[0]!;
  return (
    <>
      <PageHeader title="Doctors" subtitle="Profiles shown on your website's team section." actions={<Button onClick={() => toast("New doctor profile added")}><Plus className="size-4" /> Add doctor</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {b.team.map((m) => (
          <article key={m.id} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-accent font-semibold text-accent-foreground">
              {m.name.split(" ").slice(-2).map((p) => p[0]).join("")}
            </span>
            <h2 className="mt-4 text-lg">{m.name}</h2>
            <p className="text-sm text-primary">{m.role}</p>
            <p className="mt-2 text-sm text-muted-foreground">{m.bio}</p>
            <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">{m.qualification} · {m.experience}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => toast("Editing " + m.name)}>Edit profile</Button>
          </article>
        ))}
      </div>
    </>
  );
}
