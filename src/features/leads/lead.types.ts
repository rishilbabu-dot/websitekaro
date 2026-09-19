/**
 * Website launch requests.
 *
 * A lead is created when a customer approves a generated website and asks
 * WebsiteKaro to launch it. Leads are stored server-side and notified by
 * email; the email status is tracked separately so a delivery failure never
 * loses the lead.
 */

export type LaunchEmailStatus = "pending" | "sent" | "failed";
export type LaunchStatus = "requested" | "contacted" | "launched" | "closed";

export interface LaunchLeadInput {
  name: string;
  phone: string;
  email: string;
  businessName?: string | undefined;
  businessType?: string | undefined;
  googleMapsUrl?: string | undefined;
  generatedWebsiteId?: string | undefined;
  generatedWebsiteUrl?: string | undefined;
  socialSourcesUsed?: string[] | undefined;
}

export interface LaunchLead {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  businessName: string | null;
  businessType: string | null;
  googleMapsUrl: string | null;
  generatedWebsiteId: string | null;
  generatedWebsiteUrl: string | null;
  socialSourcesUsed: string[];
  launchStatus: LaunchStatus;
  emailStatus: LaunchEmailStatus;
}

export interface LaunchLeadResult {
  ok: boolean;
  id?: string;
  emailStatus?: LaunchEmailStatus;
  /** Friendly message for the customer when something went wrong. */
  message?: string;
}
