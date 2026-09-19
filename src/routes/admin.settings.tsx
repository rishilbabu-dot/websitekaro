import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { RequireRole } from "@/features/auth";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

function SettingsPage() {
  return (
    <RequireRole role="super-admin">
    <>
      <PageHeader title="Settings" subtitle="Global branding, generation defaults and feature flags." />
      <form
        className="grid max-w-3xl gap-6"
        onSubmit={(e) => { e.preventDefault(); toast.success("Settings saved"); }}
      >
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg">Agency branding</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2"><label htmlFor="an" className="text-sm font-medium">Agency name</label><Input id="an" defaultValue="WebsiteKaro" /></div>
            <div className="grid gap-2"><label htmlFor="ae" className="text-sm font-medium">Support email</label><Input id="ae" type="email" defaultValue="ops@websitekaro.in" /></div>
          </div>
          <div className="mt-4 grid gap-2">
            <label htmlFor="fb" className="text-sm font-medium">Footer credit</label>
            <Input id="fb" defaultValue="Website by WebsiteKaro" />
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg">Generation defaults</h2>
          <div className="mt-5 grid gap-2">
            <label htmlFor="prompt" className="text-sm font-medium">Base blueprint prompt</label>
            <Textarea id="prompt" rows={5} defaultValue="Write in confident, plain Indian English. Never invent credentials or reviews. Lead every page with the patient's problem, not the clinic's history." />
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg">Feature flags</h2>
          <ul className="mt-5 grid gap-4">
            {[["Auto-publish after approval", false], ["Show WhatsApp button on all sites", true], ["Collect newsletter signups", true]].map(([label, on]) => (
              <li key={label as string} className="flex items-center justify-between gap-4">
                <span className="text-sm">{label}</span>
                <Switch defaultChecked={on as boolean} aria-label={label as string} />
              </li>
            ))}
          </ul>
        </section>
        <Button type="submit" className="justify-self-start">Save settings</Button>
      </form>
    </>
    </RequireRole>
  );
}
