import { BarChart3, Coins, Building2, CreditCard, LayoutDashboard, LayoutTemplate, Settings, Users, Wand2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { NavItem } from "@/components/layout";
import type { UserRole } from "./auth.types";

/** Source list of every admin nav item (Super Admin sees all). */
export const adminNav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/businesses", label: "Businesses", icon: Building2 },
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
  "/admin/analytics",
  "/admin/usage",
]);

/** Which nav items a given staff role can see. */
export function adminNavForRole(role: UserRole | undefined): NavItem[] {
  if (role === "super-admin") return adminNav;
  if (role === "admin") return adminNav.filter((item) => ADMIN_ALLOWED_ROUTES.has(item.to));
  return [];
}

export type StaffAction =
  | "generate"
  | "templates"
  | "users"
  | "billing"
  | "settings"
  | "delete"
  | "suspend";

const SUPER_ADMIN_ONLY: Record<StaffAction, boolean> = {
  generate: true,
  templates: true,
  users: true,
  billing: true,
  settings: true,
  delete: true,
  suspend: true,
};

/** Whether a staff role may perform a privileged action. */
export function can(role: UserRole | undefined, action: StaffAction): boolean {
  if (role === "super-admin") return true;
  if (role === "admin") return !SUPER_ADMIN_ONLY[action];
  return false;
}

/** Staff roles that can enter the /admin control room. */
export const STAFF_ROLES: UserRole[] = ["admin", "super-admin"];

/** Display label for a role, used in the app shell. */
export function roleLabelFor(role: UserRole | undefined): string {
  switch (role) {
    case "super-admin":
      return "Super Admin";
    case "admin":
      return "Admin";
    case "business-owner":
      return "Business Owner";
    default:
      return "Guest";
  }
}

/** Required icon type kept for parity with adminNav usage sites. */
export type { NavItem };
export type { LucideIcon };
