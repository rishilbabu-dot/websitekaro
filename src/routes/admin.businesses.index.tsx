import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Wand2 } from "lucide-react";
import { PageHeader, StatusPill } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { businesses } from "@/features/businesses";

export const Route = createFileRoute("/admin/businesses/")({ component: BusinessesPage });

function BusinessesPage() {
  const [q, setQ] = useState("");
  const rows = businesses.filter((b) => (b.name + b.address).toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader
        title="Businesses"
        subtitle="Every business blueprint in the network, with its current website status."
        actions={<Button asChild><Link to="/admin/generate"><Wand2 className="size-4" /> New website</Link></Button>}
      />
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by name or area" className="mb-5 max-w-sm" aria-label="Filter businesses" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">Business</th>
              <th scope="col" className="hidden px-6 py-3 font-medium md:table-cell">Category</th>
              <th scope="col" className="hidden px-6 py-3 font-medium lg:table-cell">Generated</th>
              <th scope="col" className="px-6 py-3 font-medium">Status</th>
              <th scope="col" className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((b) => (
              <tr key={b.id} className="hover:bg-secondary/40">
                <td className="px-6 py-4">
                  <p className="font-medium">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.address}</p>
                </td>
                <td className="hidden px-6 py-4 text-muted-foreground md:table-cell">{b.category}</td>
                <td className="hidden px-6 py-4 text-muted-foreground lg:table-cell">{b.generatedAt}</td>
                <td className="px-6 py-4"><StatusPill status={b.status} /></td>
                <td className="px-6 py-4 text-right">
                  <Button variant="outline" size="sm" asChild><Link to="/admin/businesses/$id" params={{ id: b.id }}>Manage</Link></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="px-6 py-10 text-center text-sm text-muted-foreground">No businesses match "{q}".</p>}
      </div>
    </>
  );
}
