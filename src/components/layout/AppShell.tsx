import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, LogOut, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand";
import { useAuth } from "@/features/auth";

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
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh w-full bg-secondary/40">
      <aside className="sticky top-0 hidden h-dvh w-[248px] shrink-0 flex-col border-r border-border bg-sidebar px-3 py-4 lg:flex">
        <div className="rounded-xl border border-transparent px-2 py-2 transition-colors hover:border-border hover:bg-sidebar-accent/60">
          <BrandMark />
        </div>
        <p className="mt-6 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{roleLabel}</p>
        <nav className="mt-2 grid gap-0.5" aria-label="Sidebar">
          {nav.map((item) => {
            const active = pathname === item.to || (item.to !== role && pathname.startsWith(item.to + "/"));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                }`}
              >
                <span
                  className={`absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary transition-opacity ${active ? "opacity-100" : "opacity-0"}`}
                  aria-hidden
                />
                <item.icon className={`size-4 ${active ? "text-primary" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium">Dental pilot</p>
            <span className="text-[11px] text-muted-foreground">3 / 25</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-[12%] rounded-full bg-primary" />
          </div>
          <p className="mt-2.5 text-[11px] leading-relaxed text-muted-foreground">
            More industries unlock as blueprints are approved.
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            className="hidden h-9 w-full max-w-sm items-center gap-2.5 rounded-lg border border-border bg-secondary/60 px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary sm:flex"
          >
            <Search className="size-4" />
            <span className="flex-1 text-left">Search businesses, leads, templates</span>
            <span className="kbd">⌘</span>
            <span className="kbd">K</span>
          </button>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="size-4" />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-destructive" />
            </Button>
            <div className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3">
              <span className="flex size-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">WK</span>
              <span className="text-xs font-medium">{user?.name ?? roleLabel}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                signOut();
                navigate({ to: "/" });
              }}
            >
              <LogOut className="size-4" /> Logout
            </Button>
          </div>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-background px-4 py-2 lg:hidden" aria-label="Sections">
          {nav.map((item) => (
            <Link key={item.to} to={item.to} className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs text-muted-foreground [&.active]:bg-secondary [&.active]:text-foreground" activeProps={{ className: "active" }}>
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
