import type { UserRole } from "./auth.types";

/** Staff roles that can enter the /admin control room. */
export const STAFF_ROLES: UserRole[] = ["admin", "super-admin"];

export type StaffAction =
  | "generate"
  | "templates"
  | "users"
  | "billing"
  | "settings"
  | "delete"
  | "suspend";

/** Actions reserved for the Super Admin only. Admins may not perform these. */
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
