import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout";
import { adminNavForRole } from "@/features/admin";
import { RequireRole, roleLabelFor, useAuth } from "@/features/auth";

function AdminShell() {
  const { role } = useAuth();
  return (
    <RequireRole roles={["admin", "super-admin"]}>
      <AppShell
        nav={adminNavForRole(role)}
        role="/admin"
        roleLabel={roleLabelFor(role)}
        footer={
          <div className="rounded-xl border border-border bg-card p-4">
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
        }
      >
        <Outlet />
      </AppShell>
    </RequireRole>
  );
}

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Super Admin — WebsiteKaro" },
      { name: "description", content: "Manage businesses, generate websites and publish across the WebsiteKaro network." },
      { property: "og:title", content: "Super Admin — WebsiteKaro" },
      { property: "og:description", content: "The WebsiteKaro control room for generated business websites." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminShell,
});
