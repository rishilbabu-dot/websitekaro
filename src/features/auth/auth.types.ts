export type UserRole = "guest" | "admin" | "super-admin" | "business-owner";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessId?: string;
  avatarUrl?: string;
}

export interface AuthSession {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

/** Storage seam — swap for a server-backed implementation later. */
export interface SessionStorageAdapter {
  read(): AuthSession | null;
  write(session: AuthSession | null): void;
}
