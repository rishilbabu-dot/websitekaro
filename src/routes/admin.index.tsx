import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Wand2, Activity, CheckCircle2, Clock3, Eye } from "lucide-react";
import { PageHeader, StatCard, StatusPill } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { businesses, leads } from "@/data/businesses";

export const Route = createFileRoute("/admin/")({ component: AdminHome });

const activity = [
  { icon: CheckCircle2, text: "The Dental Loft published to thedentalloft.in", time: "12m ago" },
  { icon: Eye, text: "Pearl Avenue Dental preview opened by owner", time: "1h ago" },
  { icon: Wand2, text: "SmileCraft Dental Studio blueprint regenerated", time: "3h ago" },
  { icon: Clock3, text: "2 blueprints queued for research", time: "Yesterday" },
];

function AdminHome() {
  return (
    <>
      <PageHeader
        title="Control room"
        subtitle="Every generated website, its status and what needs your attention today."
        actions={
          <>
            <Button variant="outline" asChild><Link to="/admin/businesses">All businesses</Link></Button>
            <Button asChild><Link to="/admin/generate"><Wand2 className="size-4" /> Generate website</Link></Button>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total businesses" value={String(businesses.length)} delta="+2" hint="Mumbai · dental pilot" trend={[1, 1, 2, 2, 3, 3]} />
        <StatCard label="Websites generated" value={String(businesses.filter((b) => b.status !== "draft").length)} delta="+3" hint="Last 30 days" trend={[0, 1, 1, 2, 2, 3]} />
        <StatCard label="Pending review" value={String(businesses.filter((b) => b.status === "in-review").length)} delta="-1" hint="Awaiting owner approval" trend={[2, 2, 3, 2, 1, 1]} />
        <StatCard label="Leads captured" value={String(leads.length)} delta="+18%" hint="Across all live sites" trend={[3, 5, 4, 7, 6, 9]} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid gap-6">
          <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
            <header className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg">Recent businesses</h2>
              <Link to="/admin/businesses" className="text-sm text-primary hover:underline">View all</Link>
            </header>
            <ul className="divide-y divide-border">
              {businesses.map((b) => (
                <li key={b.id} className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-secondary/50">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-semibold">{b.logoMark}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{b.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{b.category} · {b.city} · generated {b.generatedAt}</p>
                  </div>
                  <StatusPill status={b.status} />
                  <Button variant="ghost" size="sm" asChild className="opacity-60 transition-opacity group-hover:opacity-100">
                    <Link to="/admin/businesses/$id" params={{ id: b.id }}>Open <ArrowRight className="size-4" /></Link>
                  </Button>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="flex items-center gap-2 text-lg"><Activity className="size-4 text-primary" /> Activity</h2>
            <ol className="mt-5 grid gap-0">
              {activity.map((a, i) => (
                <li key={a.text} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < activity.length - 1 && <span className="absolute left-[15px] top-8 h-full w-px bg-border" aria-hidden />}
                  <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                    <a.icon className="size-3.5 text-muted-foreground" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{a.text}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.time}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <section className="h-fit rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <header className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-lg">Latest leads</h2>
            <span className="rounded-full bg-success/12 px-2 py-0.5 text-[11px] font-medium text-success">Live</span>
          </header>
          <ul className="divide-y divide-border">
            {leads.slice(0, 5).map((l) => (
              <li key={l.id} className="px-6 py-4 transition-colors hover:bg-secondary/50">
                <div className="flex items-center justify-between gap-3">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <span className="flex size-6 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold">
                      {l.name.split(" ").map((p) => p[0]).join("")}
                    </span>
                    {l.name}
                  </p>
                  <span className="shrink-0 text-xs text-muted-foreground">{l.createdAt}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{l.message}</p>
                <p className="mt-2 text-xs text-primary">{l.channel}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
