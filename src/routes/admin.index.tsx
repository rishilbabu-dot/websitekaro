import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Wand2 } from "lucide-react";
import { PageHeader, StatCard, StatusPill } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { businesses, leads } from "@/data/businesses";

export const Route = createFileRoute("/admin/")({ component: AdminHome });

function AdminHome() {
  return (
    <>
      <PageHeader
        title="Control room"
        subtitle="Every generated website, its status and what needs your attention today."
        actions={<Button asChild><Link to="/admin/generate"><Wand2 className="size-4" /> Generate website</Link></Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total businesses" value={String(businesses.length)} hint="Mumbai · dental pilot" />
        <StatCard label="Websites generated" value={String(businesses.filter((b) => b.status !== "draft").length)} hint="Last 30 days" />
        <StatCard label="Pending review" value={String(businesses.filter((b) => b.status === "in-review").length)} hint="Awaiting owner approval" />
        <StatCard label="Published" value={String(businesses.filter((b) => b.status === "published").length)} hint="Live on custom domains" />
        <StatCard label="Revenue" value="₹—" hint="Billing arrives later" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <header className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-lg">Recent businesses</h2>
            <Link to="/admin/businesses" className="text-sm text-primary">View all</Link>
          </header>
          <ul className="divide-y divide-border">
            {businesses.map((b) => (
              <li key={b.id} className="flex items-center gap-4 px-6 py-4">
                <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-sm font-semibold">{b.logoMark}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{b.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{b.category} · {b.city} · generated {b.generatedAt}</p>
                </div>
                <StatusPill status={b.status} />
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/businesses/$id" params={{ id: b.id }}>Open <ArrowRight className="size-4" /></Link>
                </Button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg">Latest leads across network</h2>
          <ul className="mt-4 grid gap-4">
            {leads.slice(0, 4).map((l) => (
              <li key={l.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{l.name}</p>
                  <span className="text-xs text-muted-foreground">{l.createdAt}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{l.message}</p>
                <p className="mt-1 text-xs text-primary">{l.channel}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
