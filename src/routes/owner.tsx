import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout";
import { ownerNav } from "@/features/owner";
import { RequireRole } from "@/features/auth";

export const Route = createFileRoute("/owner")({
  head: () => ({
    meta: [
      { title: "Business Dashboard — WebsiteKaro" },
      { name: "description", content: "Edit your website content, manage enquiries and keep your clinic details current." },
      { property: "og:title", content: "Business Dashboard — WebsiteKaro" },
      { property: "og:description", content: "Owner controls for a WebsiteKaro-generated business website." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RequireRole role="business-owner">
      <AppShell nav={ownerNav} role="/owner" roleLabel="Business Owner">
        <Outlet />
      </AppShell>
    </RequireRole>
  ),
});
