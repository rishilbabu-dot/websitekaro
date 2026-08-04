import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Monitor, Tablet, Smartphone, Globe, Pencil, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBusiness } from "@/features/businesses";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/preview/$slug")({
  loader: ({ params }) => {
    const business = getBusiness(params.slug);
    if (!business) throw notFound();
    return { business };
  },
  component: PreviewPage,
});

const devices = {
  desktop: { label: "Desktop", w: "100%", icon: Monitor },
  tablet: { label: "Tablet", w: "834px", icon: Tablet },
  mobile: { label: "Mobile", w: "390px", icon: Smartphone },
} as const;

function PreviewPage() {
  const { business } = Route.useLoaderData();
  const [device, setDevice] = useState<keyof typeof devices>("desktop");

  return (
    <div className="-mx-4 -my-8 flex min-h-dvh flex-col sm:-mx-6 lg:-mx-10">
      <header className="flex flex-wrap items-center gap-3 border-b border-border bg-background px-5 py-3">
        <div>
          <p className="text-sm font-medium">{business.name}</p>
          <p className="text-xs text-muted-foreground">Preview · not yet published</p>
        </div>
        <div className="mx-auto flex gap-1 rounded-full border border-border bg-card p-1">
          {(Object.keys(devices) as (keyof typeof devices)[]).map((k) => {
            const D = devices[k];
            return (
              <button
                key={k}
                onClick={() => setDevice(k)}
                aria-pressed={device === k}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-colors ${device === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
              >
                <D.icon className="size-3.5" /> {D.label}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild><Link to="/owner"><Pencil className="size-4" /> Edit</Link></Button>
          <Button variant="outline" size="sm" onClick={() => toast("Regenerating from blueprint…")}><RefreshCw className="size-4" /> Regenerate</Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/site/$slug" params={{ slug: business.slug }} target="_blank"><ExternalLink className="size-4" /> Open</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/preview/$slug" params={{ slug: business.slug }} target="_blank"><ExternalLink className="size-4" /> Full preview</Link>
          </Button>
          <Button size="sm" onClick={() => toast.success("Publish queued")}><Globe className="size-4" /> Publish</Button>
        </div>
      </header>
      <div className="flex flex-1 justify-center bg-secondary/60 p-4 sm:p-8">
        <div
          className="h-[78dvh] w-full overflow-hidden rounded-2xl border border-border bg-background shadow-[var(--shadow-lift)] transition-all"
          style={{ maxWidth: devices[device].w }}
        >
          <iframe title={`${business.name} website preview`} src={`/site/${business.slug}`} className="size-full" />
        </div>
      </div>
    </div>
  );
}
