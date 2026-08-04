import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Link2, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { industryPresets } from "@/features/businesses";

export const Route = createFileRoute("/admin/generate")({ component: GeneratePage });

const stages = [
  "Finding your business",
  "Analyzing reviews",
  "Understanding services",
  "Researching competitors",
  "Creating brand identity",
  "Writing website content",
  "Designing website",
  "Optimizing SEO",
  "Optimizing AI Search",
  "Generating responsive layouts",
  "Final quality checks",
];

function GeneratePage() {
  const [industry, setIndustry] = useState("dental");
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const run = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/generate", search: { url, industry, name, mode } });
  };

  return (
    <>
      <PageHeader title="Generate website" subtitle="One link in, a complete business website out. The generator consumes a structured blueprint, never Google Maps directly." />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={run} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="grid gap-2">
            <label htmlFor="gmaps" className="text-sm font-medium">Google Maps business link</label>
            <div className="relative">
              <Link2 className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="gmaps" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://maps.app.goo.gl/…" className="h-11 pl-10" />
            </div>
          </div>
          <p className="my-4 text-xs uppercase tracking-wide text-muted-foreground">or</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="bname" className="text-sm font-medium">Business name</label>
              <Input id="bname" value={name} onChange={(e) => setName(e.target.value)} placeholder="SmileCraft Dental Studio" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="bcity" className="text-sm font-medium">City</label>
              <Input id="bcity" defaultValue="Mumbai" />
            </div>
          </div>
          <fieldset className="mt-6">
            <legend className="text-sm font-medium">Industry preset</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {industryPresets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  disabled={!p.ready}
                  onClick={() => setIndustry(p.id)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors disabled:opacity-40 ${
                    industry === p.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"
                  }`}
                >
                  {p.label}{!p.ready && " · soon"}
                </button>
              ))}
            </div>
          </fieldset>
          <Button type="submit" size="lg" className="mt-7">
            <Wand2 className="size-4" /> Generate website
          </Button>
        </form>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg">Generation pipeline</h2>
          <ol className="mt-5 grid gap-3">
            {stages.map((s, i) => (
              <li key={s} className="flex items-center gap-3 text-sm">
                <span className="flex size-6 items-center justify-center rounded-full border border-border text-[11px] text-muted-foreground">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{s}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            The pipeline outputs a Business Blueprint object. Any future AI research engine that emits this shape can plug in without touching the renderer.
          </p>
        </section>
      </div>
    </>
  );
}
