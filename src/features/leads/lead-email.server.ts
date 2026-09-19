/**
 * Launch-request notification email.
 *
 * Server-only. Delivery runs through Lovable's managed email infrastructure,
 * which needs a verified sender domain for the project. Until that domain is
 * configured the notification is recorded as `pending` and the lead stays
 * safely in the database — nothing is ever lost, and a retry can pick it up.
 */
import type { LaunchEmailStatus, LaunchLeadInput } from "./lead.types";

export const LAUNCH_NOTIFY_TO = "askwikiapps@gmail.com";

export interface EmailAttempt {
  status: LaunchEmailStatus;
  error?: string;
}

export const launchEmailSubject = (lead: LaunchLeadInput) =>
  `WebsiteKaro Launch Request — ${lead.businessName?.trim() || lead.name}`;

export const launchEmailBody = (lead: LaunchLeadInput, submittedAt: Date) =>
  [
    "New WebsiteKaro Launch Request",
    "",
    `Business:\n${lead.businessName ?? "—"}`,
    "",
    `Customer Name:\n${lead.name}`,
    "",
    `Contact Number:\n${lead.phone}`,
    "",
    `Email:\n${lead.email}`,
    "",
    `Business Type:\n${lead.businessType ?? "—"}`,
    "",
    `Google Maps:\n${lead.googleMapsUrl ?? "—"}`,
    "",
    `Generated Website:\n${lead.generatedWebsiteUrl ?? "—"}`,
    "",
    `Social Channels Used:\n${(lead.socialSourcesUsed ?? []).join(", ") || "—"}`,
    "",
    "Requested:\nWebsite Launch",
    "",
    `Submitted:\n${submittedAt.toISOString()}`,
  ].join("\n");

/**
 * Attempts delivery. Returns the status to persist against the lead; never
 * throws, so a mail outage cannot fail the submission.
 */
export const sendLaunchNotification = async (lead: LaunchLeadInput): Promise<EmailAttempt> => {
  const subject = launchEmailSubject(lead);
  const body = launchEmailBody(lead, new Date());

  try {
    // Sender domain not verified for this project yet — queue the notification.
    // Once the project's email domain is set up, the managed send helper is
    // called here and the status becomes "sent".
    console.info("[launch-lead] notification queued", { to: LAUNCH_NOTIFY_TO, subject, chars: body.length });
    return { status: "pending", error: "sender domain not configured" };
  } catch (error) {
    return { status: "failed", error: error instanceof Error ? error.message : "unknown error" };
  }
};
