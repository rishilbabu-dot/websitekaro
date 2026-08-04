import { useAuth } from "@/features/auth";
import { businesses, listLeads, type BusinessBlueprint, type Lead } from "@/features/businesses";

/**
 * Resolves the single business the signed-in owner is allowed to see.
 * Owners never read the full business list — swap the lookup for a
 * server-side, session-scoped fetch when the backend lands.
 */
export const useOwnerBusiness = (): { business: BusinessBlueprint; leads: Lead[] } => {
  const { user } = useAuth();
  const business =
    businesses.find((b) => b.id === user?.businessId || b.slug === user?.businessId) ?? businesses[0]!;
  return { business, leads: listLeads(business.id) };
};
