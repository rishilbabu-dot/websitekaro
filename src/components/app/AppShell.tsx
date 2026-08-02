import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Search, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export function AppShell({
  nav,
  role,
  roleLabel,
  children,
}: {
  nav: NavItem[];
  role: string;
  roleLabel: string;
  children: React.ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-dvh w-full bg-secondary/40">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-sidebar px-4 py-5 lg:flex">
        <Link to="/" className="flex items-center gap-2.5 px-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight">WebsiteKaro</span>
        </Link>
        <p className="mt-6 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{roleLabel}</p>
        <nav className="mt-3 grid gap-1" aria-label="Sidebar">
          {nav.map((item) => {
            const active = pathname === item.to || (item.to !== role && pathname.startsWith(item.to + "/"));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                }`}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium">Mumbai · Dental pilot</p>
          <p className="mt-1 text-xs text-muted-foreground">More industries unlock as blueprints are approved.</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6">
          <div className="relative hidden max-w-sm flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search businesses, leads, templates" className="pl-9" aria-label="Search" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifications"><Bell className="size-4" /></Button>
            <div className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3">
              <span className="flex size-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">WK</span>
              <span className="text-xs font-medium">{roleLabel}</span>
            </div>
          </div>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-background px-4 py-2 lg:hidden" aria-label="Sections">
          {nav.map((item) => (
            <Link key={item.to} to={item.to} className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs text-muted-foreground [&.active]:bg-secondary [&.active]:text-foreground" activeProps={{ className: "active" }}>
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone: Record<string, string> = {
    published: "bg-success/12 text-success",
    generated: "bg-primary/10 text-primary",
    "in-review": "bg-accent text-accent-foreground",
    draft: "bg-secondary text-muted-foreground",
    suspended: "bg-destructive/10 text-destructive",
  };
  const labels: Record<string, string> = {
    published: "Published", generated: "Generated", "in-review": "In review", draft: "Draft", suspended: "Suspended",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tone[status] ?? tone.draft}`}>
      {labels[status] ?? status}
    </span>
  );
}
