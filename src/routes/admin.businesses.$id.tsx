import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Eye, Globe, Mail, MapPin, Phone, RefreshCw, Trash2, UserCog } from "lucide-react";
import { PageHeader, StatusPill } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { getBusiness } from "@/features/businesses";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/businesses/$id")({
  loader: ({ params }) => {
    const business = getBusiness(params.id);
    if (!business) throw notFound();
    return { business };
  },
  component: BusinessDetail,
});

function BusinessDetail() {
  const { business: b } = Route.useLoaderData();

  return (
    <>
      <PageHeader
        title={b.name}
        subtitle={`${b.category} · ${b.city} · blueprint generated ${b.generatedAt}`}
        actions={
          <>
            <Button variant="outline" asChild><Link to="/admin/preview/$slug" params={{ slug: b.slug }}><Eye className="size-4" /> Preview</Link></Button>
            <Button variant="outline" onClick={() => toast("Regenerating from blueprint…")}><RefreshCw className="size-4" /> Regenerate</Button>
            <Button onClick={() => toast.success("Publish queued", { description: "Hosting and domains arrive in a later release." })}><Globe className="size-4" /> Publish</Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-start gap-4">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground">{b.logoMark}</span>
            <div>
              <h2 className="text-xl">{b.name}</h2>
              <p className="text-sm text-muted-foreground">{b.tagline}</p>
              <div className="mt-3"><StatusPill status={b.status} /></div>
            </div>
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3 text-sm"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" /><span>{b.address}</span></div>
            <div className="flex gap-3 text-sm"><Phone className="mt-0.5 size-4 shrink-0 text-primary" />{b.phone}</div>
            <div className="flex gap-3 text-sm"><Mail className="mt-0.5 size-4 shrink-0 text-primary" />{b.email}</div>
            <div className="flex gap-3 text-sm"><UserCog className="mt-0.5 size-4 shrink-0 text-primary" />Admin: {b.email}</div>
          </dl>
          <div className="mt-6 border-t border-border pt-6">
            <h3 className="text-sm font-semibold">Blueprint summary</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {b.personality.map((p: string) => <span key={p} className="rounded-full bg-secondary px-3 py-1 text-xs">{p}</span>)}
            </div>
          </div>
        </section>

        <div className="grid content-start gap-6">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h3 className="text-lg">Generated pages</h3>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              {["Home", "About", "Services", "Doctors", "Gallery", "Testimonials", "FAQ", "Contact", "Privacy", "Terms", "404"].map((p) => (
                <li key={p} className="rounded-lg bg-secondary/70 px-3 py-2">{p}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h3 className="text-lg">SEO</h3>
            <p className="mt-2 text-sm font-medium">{b.seo.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{b.seo.metaDescription}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {b.seo.keywords.map((k: string) => <span key={k} className="rounded-full border border-border px-2.5 py-1 text-xs">{k}</span>)}
            </div>
          </section>
          <section className="rounded-2xl border border-destructive/25 bg-card p-6">
            <h3 className="text-lg">Danger zone</h3>
            <p className="mt-1 text-sm text-muted-foreground">Suspending hides the live site immediately. Deleting removes the blueprint.</p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toast("Website suspended")}>Suspend website</Button>
              <Button variant="destructive" size="sm" onClick={() => toast.error("Business deleted")}><Trash2 className="size-4" /> Delete</Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
