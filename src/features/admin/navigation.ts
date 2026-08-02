import { BarChart3, Building2, CreditCard, LayoutDashboard, LayoutTemplate, Settings, Users, Wand2 } from "lucide-react";
import type { NavItem } from "@/components/layout";

export const adminNav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/businesses", label: "Businesses", icon: Building2 },
  { to: "/admin/generate", label: "Generate website", icon: Wand2 },
  { to: "/admin/templates", label: "Templates", icon: LayoutTemplate },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];
