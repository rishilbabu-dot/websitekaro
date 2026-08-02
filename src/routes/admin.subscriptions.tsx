import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusPill } from "@/components/app/AppShell";
import { businesses } from "@/data/businesses";

export const Route = createFileRoute("/admin/subscriptions")({ component: SubscriptionsPage });

function SubscriptionsPage() {
  return (
    <>
      <PageHeader title="Subscriptions" subtitle="Plan assignment per business. Payment collection is intentionally out of MVP scope." />
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr><th scope="col" className="px-6 py-3 font-medium">Business</th><th scope="col" className="px-6 py-3 font-medium">Plan</th><th scope="col" className="hidden px-6 py-3 font-medium sm:table-cell">Renews</th><th scope="col" className="px-6 py-3 font-medium">Website</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {businesses.map((b, i) => (
              <tr key={b.id}>
                <td className="px-6 py-4 font-medium">{b.name}</td>
                <td className="px-6 py-4">{["Growth", "Launch", "Agency"][i % 3]}</td>
                <td className="hidden px-6 py-4 text-muted-foreground sm:table-cell">Not billed yet</td>
                <td className="px-6 py-4"><StatusPill status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
