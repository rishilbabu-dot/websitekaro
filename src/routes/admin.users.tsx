import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { businesses } from "@/features/businesses";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({ component: UsersPage });

const permissions = {
  "Super Admin": ["Create businesses", "Generate & publish", "Manage users", "Billing & global settings"],
  Admin: ["Edit business content", "Manage leads", "Publish content", "No billing, no deletion"],
  Visitor: ["Browse, call, WhatsApp, enquire"],
};

function UsersPage() {
  return (
    <>
      <PageHeader title="Users & roles" subtitle="Who can touch what across the network." actions={<Button onClick={() => toast("Invite flow arrives with authentication.")}>Invite admin</Button>} />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th scope="col" className="px-6 py-3 font-medium">User</th><th scope="col" className="px-6 py-3 font-medium">Role</th><th scope="col" className="hidden px-6 py-3 font-medium sm:table-cell">Business</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="px-6 py-4"><p className="font-medium">WebsiteKaro</p><p className="text-xs text-muted-foreground">ops@websitekaro.in</p></td><td className="px-6 py-4">Super Admin</td><td className="hidden px-6 py-4 text-muted-foreground sm:table-cell">All</td></tr>
              {businesses.map((b) => (
                <tr key={b.id}>
                  <td className="px-6 py-4"><p className="font-medium">{b.team[0]?.name ?? "Owner"}</p><p className="text-xs text-muted-foreground">{b.email}</p></td>
                  <td className="px-6 py-4">Admin</td>
                  <td className="hidden px-6 py-4 text-muted-foreground sm:table-cell">{b.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="grid content-start gap-4">
          {Object.entries(permissions).map(([role, perms]) => (
            <div key={role} className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg">{role}</h2>
              <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                {perms.map((p) => <li key={p}>· {p}</li>)}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
