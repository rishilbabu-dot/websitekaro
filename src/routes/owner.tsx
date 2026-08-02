import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, FileText, Stethoscope, Sparkles, Images, Inbox, Phone, Search, BarChart3 } from "lucide-react";
import { AppShell, type NavItem } from "@/components/layout";

const nav: NavItem[] = [
  { to: "/owner", label: "Dashboard", icon: LayoutDashboard },
  { to: "/owner/pages", label: "Pages", icon: FileText },
  { to: "/owner/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/owner/services", label: "Services", icon: Sparkles },
  { to: "/owner/gallery", label: "Gallery", icon: Images },
  { to: "/owner/leads", label: "Leads", icon: Inbox },
  { to: "/owner/contact", label: "Contact & hours", icon: Phone },
  { to: "/owner/seo", label: "SEO", icon: Search },
  { to: "/owner/analytics", label: "Analytics", icon: BarChart3 },
];

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
    <AppShell nav={nav} role="/owner" roleLabel="Business Owner">
      <Outlet />
    </AppShell>
  ),
});
