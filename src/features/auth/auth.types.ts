export type UserRole = "super-admin" | "business-owner";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessId?: string;
}

export interface AuthSession {
  user: AuthUser | null;
  isAuthenticated: boolean;
}
