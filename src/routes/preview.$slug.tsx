import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Monitor, Tablet, Smartphone, ExternalLink, Copy, Rocket, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand";
import { getBusiness } from "@/features/businesses";
import { toast } from "sonner";

export const Route = createFileRoute("/preview/$slug")({
  loader: ({ params }) => {
    const business = getBusiness(params.slug);
    if (!business) throw notFound();
    return { business };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.business.name ?? "Website";
    return {
      meta: [
        { title: `${name} — Full preview | WebsiteKaro` },
        { name: "description", content: `Full-screen desktop, tablet and mobile preview of the WebsiteKaro-generated website for ${name}.` },
        { property: "og:title", content: `${name} — Full preview | WebsiteKaro` },
        { property: "og:description", content: `Preview the generated website for ${name} across desktop, tablet and mobile.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: FullPreview,
});

const devices = {
  desktop: { label: "Desktop", w: "100%", icon: Monitor },
  tablet: { label: "Tablet", w: "834px", icon: Tablet },
  mobile: { label: "Mobile", w: "390px", icon: Smartphone },
} as const;

function FullPreview() {
  const { business } = Route.useLoaderData();
  const [device, setDevice] = useState<keyof typeof devices>("desktop");
  const path = `/site/${business.slug}`;

  const copyLink = async () => {
    const url = typeof window === "undefined" ? path : new URL(path, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Preview link copied", { description: url });
    } catch {
      toast(url);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-secondary/40">
      <header className="sticky top-0 z-40 flex flex-wrap items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-xl sm:px-6">
        <BrandMark size="sm" tagline={false} />
        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-sm font-medium">{business.name}</p>
          <p className="text-[11px] text-muted-foreground">Simulated deployment · not live yet</p>
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
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={copyLink}><Copy className="size-4" /> Copy link</Button>
          <Button variant="outline" size="sm" asChild>
            <a href={path} target="_blank" rel="noreferrer"><ExternalLink className="size-4" /> New window</a>
          </Button>
          <Button size="sm" onClick={() => toast("Deployment arrives with hosting", { description: "We'll connect your domain and publish for you." })}>
            <Rocket className="size-4" /> Deploy
          </Button>
        </div>
      </header>

      <div className="flex flex-1 justify-center p-4 sm:p-8">
        <div
          className="h-[82dvh] w-full overflow-hidden rounded-2xl border border-border bg-background shadow-[var(--shadow-lift)] transition-all duration-500"
          style={{ maxWidth: devices[device].w }}
        >
          <iframe title={`${business.name} full website preview`} src={path} className="size-full" />
        </div>
      </div>

      <footer className="flex items-center justify-center gap-2 pb-6 text-xs text-muted-foreground">
        <Link to="/" className="inline-flex items-center gap-1.5 hover:text-foreground"><ArrowLeft className="size-3.5" /> Back to WebsiteKaro</Link>
      </footer>
    </div>
  );
}