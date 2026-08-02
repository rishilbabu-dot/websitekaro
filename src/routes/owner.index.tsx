import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Inbox } from "lucide-react";
import { PageHeader, StatCard, StatusPill } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { businesses, leads } from "@/features/businesses";

export const Route = createFileRoute("/owner/")({ component: OwnerHome });

function OwnerHome() {
  const b = businesses[0]!;
  return (
    <>
      <PageHeader
        title={b.name}
        subtitle="Your website is live-ready. Keep content fresh and answer enquiries fast — that's the whole job."
        actions={
          <Button variant="outline" asChild>
            <Link to="/site/$slug" params={{ slug: b.slug }} target="_blank"><ExternalLink className="size-4" /> View website</Link>
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="New leads" value={String(leads.filter((l) => l.status === "new").length)} hint="Awaiting response" />
        <StatCard label="Website status" value="Ready" hint="Last updated today" />
        <StatCard label="Services listed" value={String(b.services.length)} />
        <StatCard label="Google rating" value={`${b.reviews.rating}`} hint={`${b.reviews.count} reviews`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <header className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-lg">Recent enquiries</h2>
            <Link to="/owner/leads" className="text-sm text-primary">Open inbox</Link>
          </header>
          <ul className="divide-y divide-border">
            {leads.slice(0, 4).map((l) => (
              <li key={l.id} className="flex items-start gap-4 px-6 py-4">
                <Inbox className="mt-1 size-4 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{l.name} · <span className="font-normal text-muted-foreground">{l.phone}</span></p>
                  <p className="mt-1 text-sm text-muted-foreground">{l.message}</p>
                </div>
                <span className="whitespace-nowrap text-xs text-muted-foreground">{l.createdAt}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg">Website</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Status</span><StatusPill status={b.status} /></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Address</span><span className="text-right">{b.city}</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Phone</span><span>{b.phone}</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Generated</span><span>{b.generatedAt}</span></div>
          </div>
          <p className="mt-6 rounded-xl bg-secondary/70 p-4 text-xs leading-relaxed text-muted-foreground">
            Design system, deletion and billing are managed by WebsiteKaro. Everything about your content is yours to change.
          </p>
        </section>
      </div>
    </>
  );
}
