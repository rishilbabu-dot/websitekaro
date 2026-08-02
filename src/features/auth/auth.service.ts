/**
 * Authentication service — integration seam.
 *
 * The MVP has no backend, so this returns a static session. Wiring real auth
 * later means replacing this file, not the dashboards that consume it.
 */
import type { AuthSession, AuthUser, UserRole } from "./auth.types";

const DEMO_USERS: Record<UserRole, AuthUser> = {
  "super-admin": { id: "u_admin", name: "WebsiteKaro Admin", email: "admin@websitekaro.in", role: "super-admin" },
  "business-owner": {
    id: "u_owner",
    name: "Clinic Owner",
    email: "owner@smilecraft.in",
    role: "business-owner",
    businessId: "biz-1",
  },
};

export const getSession = (role: UserRole = "super-admin"): AuthSession => ({
  user: DEMO_USERS[role],
  isAuthenticated: true,
});
