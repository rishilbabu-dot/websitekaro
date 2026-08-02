import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout";
import { adminNav } from "@/features/admin";

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
  component: () => (
    <AppShell nav={adminNav} role="/admin" roleLabel="Super Admin">
      <Outlet />
    </AppShell>
  ),
});
