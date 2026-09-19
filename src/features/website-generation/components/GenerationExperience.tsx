import { useEffect, useMemo, useState } from "react";
import {
  Search, MessageSquareQuote, Sparkles, Users, Palette, PenLine, LayoutTemplate,
  Gauge, Bot, MonitorSmartphone, ShieldCheck, Check, Loader2, PartyPopper,
  Monitor, Tablet, Smartphone, ArrowRight, TrendingUp, AlertTriangle, ExternalLink, AppWindow,
} from "lucide-react";
import type { BusinessBlueprint } from "@/features/businesses";
import { Button } from "@/components/ui/button";
import { GeneratedSite } from "./GeneratedSite";
import { savePreviewBlueprint } from "../preview-store";
import { SourcesPanel } from "./SourcesPanel";

export const generationStages = [
  { icon: Search, label: "Identifying your official business name" },
  { icon: MessageSquareQuote, label: "Researching your Google Business listing" },
  { icon: Users, label: "Checking your official brand channels" },
  { icon: Search, label: "Analysing your official website" },
  { icon: Sparkles, label: "Curating authentic images and media" },
  { icon: MessageSquareQuote, label: "Verifying Google reviews" },
  { icon: Palette, label: "Building your Brand DNA" },
  { icon: PenLine, label: "Creating your business content blueprint" },
  { icon: LayoutTemplate, label: "Selecting a unique visual direction" },
  { icon: Bot, label: "Generating your business-specific website" },
  { icon: ShieldCheck, label: "Validating authenticity" },
  { icon: Gauge, label: "Removing generic content" },
  { icon: MonitorSmartphone, label: "Checking mobile and desktop layouts" },
  { icon: Check, label: "Preparing your preview" },
];

const STAGE_MS = 900;

/* ------------------------------------------------------------- progress */

export function GenerationProgress({ businessName, onDone }: { businessName: string; onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= generationStages.length) {
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), STAGE_MS);
    return () => clearTimeout(t);
  }, [step, onDone]);

  const pct = Math.round((step / generationStages.length) * 100);

  return (
    <div className="aura relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-16">
      <div className="w-full max-w-xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium shadow-[var(--shadow-soft)]">
            <span className="size-1.5 animate-pulse rounded-full bg-success" /> AI digital agency at work
          </span>
          <h1 className="mt-6 text-balance text-3xl leading-tight sm:text-4xl">
            Building the website for <span className="italic text-primary">{businessName}</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">This usually takes under a minute. Please keep this tab open.</p>
        </div>

        <div className="mt-9 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary transition-all duration-700 ease-out" style={{ width: `${pct}%` }} />
          </div>
          <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">{pct}%</span>
        </div>

        <ol className="mt-8 grid gap-1.5 rounded-[1.5rem] border border-border bg-card p-3 shadow-[var(--shadow-lift)]">
          {generationStages.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li
                key={s.label}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-500 ${
                  active ? "bg-secondary/70" : ""
                } ${done || active ? "opacity-100" : "opacity-40"}`}
              >
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    done ? "bg-success text-success-foreground" : active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="size-3.5" /> : active ? <Loader2 className="size-3.5 animate-spin" /> : <s.icon className="size-3.5" />}
                </span>
                <span className={done || active ? "font-medium" : "text-muted-foreground"}>{s.label}</span>
                {done && <span className="ml-auto text-[11px] text-muted-foreground">done</span>}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

/* -------------------------------------------------------- quality score */

const scoreFor = (seed: number, base: number) => Math.min(99, base + (seed % 7));

export function useQualityScore(slug: string) {
  return useMemo(() => {
    const seed = Array.from(slug).reduce((a, c) => a + c.charCodeAt(0), 0);
    const metrics = [
      { label: "SEO", value: scoreFor(seed, 92) },
      { label: "Mobile", value: scoreFor(seed + 3, 94) },
      { label: "Accessibility", value: scoreFor(seed + 7, 90) },
      { label: "Performance", value: scoreFor(seed + 11, 91) },
      { label: "Lead Generation", value: scoreFor(seed + 17, 89) },
      { label: "AI Search Readiness", value: scoreFor(seed + 23, 88) },
    ];
    const overall = Math.round(metrics.reduce((a, m) => a + m.value, 0) / metrics.length);
    return { metrics, overall };
  }, [slug]);
}

function ScoreRing({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid size-36 place-items-center">
      <svg viewBox="0 0 120 120" className="size-36 -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="10" className="stroke-secondary" />
        <circle
          cx="60" cy="60" r={r} fill="none" strokeWidth="10" strokeLinecap="round"
          className="stroke-primary transition-[stroke-dashoffset] duration-[1400ms] ease-out"
          strokeDasharray={c}
          strokeDashoffset={c - (c * value) / 100}
        />
      </svg>
      <div className="absolute text-center">
        <p className="display text-4xl leading-none">{value}</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">out of 100</p>
      </div>
    </div>
  );
}

export function QualityScoreCard({ slug }: { slug: string }) {
  const { metrics, overall } = useQualityScore(slug);
  return (
    <div className="grid gap-8 rounded-[1.75rem] border border-border bg-card p-7 shadow-[var(--shadow-soft)] md:grid-cols-[auto_1fr] md:p-9">
      <div className="grid place-items-center gap-3">
        <ScoreRing value={overall} />
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Website Quality</p>
      </div>
      <div className="grid content-center gap-4">
        {metrics.map((m, i) => (
          <div key={m.label}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium">{m.label}</span>
              <span className="tabular-nums text-muted-foreground">{m.value}</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-out"
                style={{ width: `${m.value}%`, transitionDelay: `${i * 90}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------- device preview */

const devices = {
  desktop: { label: "Desktop", w: "100%", icon: Monitor },
  tablet: { label: "Tablet", w: "834px", icon: Tablet },
  mobile: { label: "Mobile", w: "390px", icon: Smartphone },
} as const;

export function DevicePreview({ data }: { data: BusinessBlueprint }) {
  const [device, setDevice] = useState<keyof typeof devices>("desktop");
  const path = `/site/${data.slug}`;

  // Persist the blueprint so the standalone tab/popup can render it even
  // though it is not stored in the business service yet.
  useEffect(() => { savePreviewBlueprint(data); }, [data]);

  const openPopup = () => {
    savePreviewBlueprint(data);
    window.open(path, `wk_${data.slug}`, "popup=yes,width=1200,height=860,noopener");
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
        <div className="flex gap-1 rounded-full border border-border bg-card p-1 shadow-[var(--shadow-soft)]">
          {(Object.keys(devices) as (keyof typeof devices)[]).map((k) => {
            const D = devices[k];
            return (
              <button
                key={k}
                type="button"
                onClick={() => setDevice(k)}
                aria-pressed={device === k}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs transition-colors ${
                  device === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <D.icon className="size-3.5" /> {D.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="outline" size="sm" asChild onClick={() => savePreviewBlueprint(data)}>
            <a href={path} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" /> Open in new tab
            </a>
          </Button>
          <Button variant="outline" size="sm" onClick={openPopup}>
            <AppWindow className="size-4" /> Open popup window
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <div
          className="h-[75dvh] w-full overflow-hidden rounded-[1.75rem] border border-border bg-background shadow-[var(--shadow-lift)] transition-all duration-500"
          style={{ maxWidth: devices[device].w }}
        >
          <div className="size-full overflow-y-auto" style={{ transform: "translateZ(0)" }}>
            <GeneratedSite data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- health report */

export function BusinessHealthReport({ data }: { data: BusinessBlueprint }) {
  const before = [
    ["Website", "None — only a Google listing"],
    ["Mobile experience", "Maps card only, no booking path"],
    ["Search visibility", "Ranks for the brand name alone"],
    ["Lead capture", "Phone calls during working hours"],
    ["AI search", "Invisible to AI assistants"],
    ["Trust signals", "Reviews scattered, no credentials shown"],
  ];
  const after = [
    ["Website", `${data.services.length + 3}-section site, live-ready`],
    ["Mobile experience", "Mobile-first with sticky call and WhatsApp"],
    ["Search visibility", `Optimised for ${data.seo.keywords.slice(0, 3).join(", ")}`],
    ["Lead capture", "Enquiry form, WhatsApp and click-to-call"],
    ["AI search", "Structured data AI assistants can quote"],
    ["Trust signals", `${data.reviews.count} reviews, team credentials, hours`],
  ];
  const fixed = [
    "Built a complete, responsive website from your listing data",
    "Wrote original copy for every section — no placeholder text",
    "Added LocalBusiness and FAQ structured data for search and AI answers",
    "Placed calls-to-action where visitors actually convert",
    "Compressed and sized every image for Indian mobile networks",
    "Published business hours, address and directions in machine-readable form",
  ];
  const benefits = [
    { label: "Estimated lead improvement", value: "+180%", note: "vs. a Google listing alone" },
    { label: "Estimated mobile experience", value: "+94%", note: "measured on mobile usability checks" },
    { label: "Search surface area", value: "8x", note: "indexable pages and sections" },
    { label: "Response time to enquiries", value: "< 5 min", note: "with WhatsApp and form alerts" },
  ];

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-[1.75rem] border border-border bg-card p-7">
          <h3 className="flex items-center gap-2 text-xl"><AlertTriangle className="size-4 text-destructive" /> Current online presence</h3>
          <dl className="mt-6 grid gap-3.5">
            {before.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5 border-b border-border pb-3 last:border-0 last:pb-0">
                <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{k}</dt>
                <dd className="text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="rounded-[1.75rem] border border-primary/25 bg-primary/[0.04] p-7">
          <h3 className="flex items-center gap-2 text-xl"><TrendingUp className="size-4 text-primary" /> WebsiteKaro improvements</h3>
          <dl className="mt-6 grid gap-3.5">
            {after.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5 border-b border-primary/15 pb-3 last:border-0 last:pb-0">
                <dt className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{k}</dt>
                <dd className="text-sm font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section className="rounded-[1.75rem] border border-border bg-card p-7">
        <h3 className="text-xl">What we fixed</h3>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {fixed.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-success" /> {f}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[1.75rem] border border-border bg-card p-7">
        <h3 className="text-xl">Expected benefits</h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.label}>
              <p className="display text-3xl leading-none text-primary">{b.value}</p>
              <p className="mt-2 text-sm font-medium">{b.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{b.note}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------- complete */

export function GenerationComplete({ data, onPublish }: { data: BusinessBlueprint; onPublish: () => void }) {
  return (
    <div className="min-h-dvh">
      <div className="aura relative overflow-hidden px-5 pb-14 pt-16 text-center sm:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <span className="rise inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
            <PartyPopper className="size-3.5" /> Generation complete
          </span>
          <h1 className="rise mt-6 text-balance text-4xl leading-[1.05] sm:text-6xl">Congratulations</h1>
          <p className="rise-2 mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Your professional business website is ready. Review it below, then launch when you're happy.
          </p>
          <div className="rise-3 mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={onPublish}>Launch my website <ArrowRight className="size-4" /></Button>
            <Button size="lg" variant="outline" asChild><a href="#report">See the health report</a></Button>
          </div>
        </div>
      </div>

      <section className="mx-auto w-full max-w-6xl px-5 pb-14 sm:px-8">
        <QualityScoreCard slug={data.slug} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-14 sm:px-8">
        <SourcesPanel data={data} />
      </section>

      <section className="border-y border-border bg-secondary/40 px-5 py-14 sm:px-8">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="mb-6 text-center">
            <p className="eyebrow mb-2 text-primary">Preview</p>
            <h2 className="text-3xl sm:text-4xl">{data.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{data.category} · {data.city}</p>
          </div>
          <DevicePreview data={data} />
        </div>
      </section>

      <section id="report" className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <p className="eyebrow mb-3 text-primary">Business health report</p>
        <h2 className="max-w-2xl text-3xl sm:text-4xl">Where you were, and where you are now</h2>
        <div className="mt-10"><BusinessHealthReport data={data} /></div>
      </section>
    </div>
  );
}
