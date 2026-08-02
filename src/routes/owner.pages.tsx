import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { businesses } from "@/features/businesses";
import { toast } from "sonner";

export const Route = createFileRoute("/owner/pages")({ component: PagesEditor });

function PagesEditor() {
  const b = businesses[0]!;
  return (
    <>
      <PageHeader title="Pages" subtitle="Edit the words on your website. Layout and design stay locked to keep the site fast and consistent." />
      <form className="grid max-w-3xl gap-6" onSubmit={(e) => { e.preventDefault(); toast.success("Content published"); }}>
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg">Home</h2>
          <div className="mt-5 grid gap-4">
            <div className="grid gap-2"><label htmlFor="h1" className="text-sm font-medium">Headline</label><Input id="h1" defaultValue={b.tagline} /></div>
            <div className="grid gap-2"><label htmlFor="hs" className="text-sm font-medium">Intro paragraph</label><Textarea id="hs" rows={4} defaultValue={b.description} /></div>
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg">About us</h2>
          <div className="mt-5 grid gap-4">
            <div className="grid gap-2"><label htmlFor="au" className="text-sm font-medium">Who you serve</label><Textarea id="au" rows={3} defaultValue={b.audience} /></div>
            <div className="grid gap-2"><label htmlFor="us" className="text-sm font-medium">What makes you different (one per line)</label><Textarea id="us" rows={4} defaultValue={b.usp.join("\n")} /></div>
          </div>
        </section>
        <Button type="submit" className="justify-self-start">Publish changes</Button>
      </form>
    </>
  );
}
