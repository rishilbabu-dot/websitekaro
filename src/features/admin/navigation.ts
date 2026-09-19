import { BarChart3, Coins, Building2, CreditCard, LayoutDashboard, LayoutTemplate, Rocket, Settings, Users, Wand2 } from "lucide-react";
import type { NavItem } from "@/components/layout";
import type { UserRole } from "@/features/auth/auth.types";

export const adminNav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/businesses", label: "Businesses", icon: Building2 },
  { to: "/admin/leads", label: "Launch requests", icon: Rocket },
  { to: "/admin/generate", label: "Generate website", icon: Wand2 },
  { to: "/admin/templates", label: "Templates", icon: LayoutTemplate },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/usage", label: "Usage & costs", icon: Coins },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

/** Routes visible to the Admin role. Super Admin sees all. */
const ADMIN_ALLOWED_ROUTES = new Set([
  "/admin",
  "/admin/businesses",
  "/admin/leads",
  "/admin/analytics",
  "/admin/usage",
]);

/** Which nav items a given staff role can see in the admin shell. */
export function adminNavForRole(role: UserRole | undefined): NavItem[] {
  if (role === "super-admin") return adminNav;
  if (role === "admin") return adminNav.filter((item) => ADMIN_ALLOWED_ROUTES.has(item.to));
  return [];
}
