import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/shared";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/admin/analytics")({ component: AnalyticsPage });

const data = [
  { week: "W1", visits: 820, leads: 24 },
  { week: "W2", visits: 1160, leads: 38 },
  { week: "W3", visits: 1490, leads: 51 },
  { week: "W4", visits: 2010, leads: 66 },
  { week: "W5", visits: 2380, leads: 74 },
  { week: "W6", visits: 2940, leads: 92 },
];

function AnalyticsPage() {
  return (
    <>
      <PageHeader title="Analytics" subtitle="Network-wide traffic and enquiry volume. Sample data until hosting is wired up." />
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Visits (30d)" value="10,800" hint="+38% vs prior" />
        <StatCard label="Leads (30d)" value="345" hint="+41% vs prior" />
        <StatCard label="Avg. LCP" value="1.4s" hint="Mobile, 4G" />
        <StatCard label="Conversion" value="3.2%" hint="Visit → enquiry" />
      </div>
      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
        <h2 className="text-lg">Traffic & leads</h2>
        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="week" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
              <Area type="monotone" dataKey="visits" stroke="var(--color-chart-1)" fill="url(#v)" strokeWidth={2} />
              <Area type="monotone" dataKey="leads" stroke="var(--color-chart-3)" fill="transparent" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
