import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useOwnerBusiness } from "@/features/owner";
import { toast } from "sonner";

export const Route = createFileRoute("/owner/seo")({ component: SeoEditor });

function SeoEditor() {
  const { business: b } = useOwnerBusiness();
  return (
    <>
      <PageHeader title="SEO" subtitle="How your clinic appears on Google. We generated these — adjust only if you know what you want." />
      <form className="grid max-w-3xl gap-6" onSubmit={(e) => { e.preventDefault(); toast.success("SEO updated"); }}>
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="grid gap-4">
            <div className="grid gap-2"><label htmlFor="t" className="text-sm font-medium">Page title</label><Input id="t" defaultValue={b.seo.title} /></div>
            <div className="grid gap-2"><label htmlFor="d" className="text-sm font-medium">Meta description</label><Textarea id="d" rows={3} defaultValue={b.seo.metaDescription} /></div>
            <div className="grid gap-2"><label htmlFor="k" className="text-sm font-medium">Keywords</label><Input id="k" defaultValue={b.seo.keywords.join(", ")} /></div>
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Google preview</p>
          <p className="mt-3 text-lg text-primary">{b.seo.title}</p>
          <p className="text-xs text-success">websitekaro.in/{b.slug}</p>
          <p className="mt-1 text-sm text-muted-foreground">{b.seo.metaDescription}</p>
        </section>
        <Button type="submit" className="justify-self-start">Save SEO</Button>
      </form>
    </>
  );
}
