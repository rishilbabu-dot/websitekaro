import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Building2, Wand2, LayoutTemplate, Users, BarChart3, CreditCard, Settings } from "lucide-react";
import { AppShell, type NavItem } from "@/components/app/AppShell";

const nav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/businesses", label: "Businesses", icon: Building2 },
  { to: "/admin/generate", label: "Generate website", icon: Wand2 },
  { to: "/admin/templates", label: "Templates", icon: LayoutTemplate },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

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
    <AppShell nav={nav} role="/admin" roleLabel="Super Admin">
      <Outlet />
    </AppShell>
  ),
});
