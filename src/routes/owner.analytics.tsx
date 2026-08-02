import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/app/AppShell";

export const Route = createFileRoute("/owner/analytics")({ component: OwnerAnalytics });

function OwnerAnalytics() {
  return (
    <>
      <PageHeader title="Analytics" subtitle="Traffic and enquiry reporting switches on once your website is published." />
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Visits" value="—" hint="Available after publish" />
        <StatCard label="Calls" value="—" hint="Available after publish" />
        <StatCard label="WhatsApp taps" value="—" hint="Available after publish" />
        <StatCard label="Form enquiries" value="—" hint="Available after publish" />
      </div>
      <div className="mt-6 rounded-2xl border border-dashed border-border p-12 text-center">
        <p className="text-sm text-muted-foreground">Once we publish your site, this page fills with real numbers — visits, calls, enquiries and where they came from.</p>
      </div>
    </>
  );
}
