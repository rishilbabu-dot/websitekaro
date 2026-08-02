/** Shared domain types, re-exported from their owning feature modules. */
export type {
  BusinessBlueprint,
  Faq,
  Industry,
  Lead,
  Review,
  Service,
  TeamMember,
  WebsiteStatus,
} from "@/features/businesses/business.types";
export type { AuthSession, AuthUser, UserRole } from "@/features/auth/auth.types";
export type { ResearchInput, ResearchResult, ResearchStage } from "@/features/ai/ai.types";
