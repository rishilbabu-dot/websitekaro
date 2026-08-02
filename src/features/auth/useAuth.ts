import type { UserRole } from "./auth.types";
import { getSession } from "./auth.service";

/** Reads the current session. Swap the service implementation to go live. */
export const useAuth = (role: UserRole = "super-admin") => getSession(role);
