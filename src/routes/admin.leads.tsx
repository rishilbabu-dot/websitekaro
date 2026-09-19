import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageHeader, StatusPill } from "@/components/shared";
import { listLaunchLeads, type LaunchLead } from "@/features/leads";
import { getStaffToken } from "@/features/auth/staff-token";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({
    meta: [
      { title: "Launch requests — WebsiteKaro Admin" },
      { name: "description", content: "Every customer who approved their generated website and asked WebsiteKaro to launch it, with contact details and notification status." },
      { property: "og:title", content: "Launch requests — WebsiteKaro Admin" },
      { property: "og:description", content: "Customer launch requests with contact details, generated website and notification status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LeadsPage,
});

const emailTone = (status: string) => (status === "sent" ? "success" : status === "failed" ? "danger" : "neutral");

function LeadsPage() {
  const load = useServerFn(listLaunchLeads);
  const [leads, setLeads] = useState<LaunchLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    load({ data: { token: getStaffToken() } })
      .then((rows) => { if (active) setLeads(rows); })
      .catch(() => { if (active) setLeads([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [load]);

  return (
    <>
      <PageHeader title="Launch requests" subtitle="Customers who approved their website and asked us to take it live." />
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Business</th>
              <th className="px-6 py-3 font-medium">Website</th>
              <th className="px-6 py-3 font-medium">Requested</th>
              <th className="px-6 py-3 font-medium">Notification</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">Loading…</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">No launch requests yet.</td></tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="border-b border-border/70 last:border-0">
                  <td className="px-6 py-4">
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.phone} · {lead.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p>{lead.businessName ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{lead.businessType ?? ""}</p>
                  </td>
                  <td className="px-6 py-4">
                    {lead.generatedWebsiteUrl ? (
                      <a href={lead.generatedWebsiteUrl} target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">
                        Open preview
                      </a>
                    ) : "—"}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(lead.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4"><StatusPill tone={emailTone(lead.emailStatus)}>{lead.emailStatus}</StatusPill></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
