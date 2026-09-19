import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight, Sparkles, Link2, Wand2, Rocket, ShieldCheck, Gauge, Search, Star, Check,
  MapPin, Brain, Palette, LayoutTemplate, Bot, MonitorSmartphone, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import clinicImg from "@/assets/dental-hero.jpg";
import { industryDesigns } from "@/features/industries";
import { GENERATION_MODES, generationModeInfo, type GenerationMode } from "@/features/ai";
import { BrandMark } from "@/components/brand";
import { GoogleSignInDialog, QUOTA_EXHAUSTED_MESSAGE, useAuth, useGuestQuota } from "@/features/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WebsiteKaro — Websites for Local Business, Built Before You Pay" },
      { name: "description", content: "Paste your Google Maps business link and WebsiteKaro's AI digital agency builds a premium, ready-to-launch website for your clinic or shop — before you pay a rupee." },
      { property: "og:title", content: "WebsiteKaro — Websites for Local Business, Built Before You Pay" },
      { property: "og:description", content: "Paste your Google Maps business link and WebsiteKaro's AI digital agency builds a premium, ready-to-launch website for your clinic or shop — before you pay a rupee." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Wand2, title: "Custom, never templated", body: "Every site is composed from your real business data — services, doctors, hours, reviews — not a theme with your logo dropped in." },
  { icon: Gauge, title: "Fast where it counts", body: "Core Web Vitals tuned, mobile-first layouts, and images sized for Indian networks." },
  { icon: Search, title: "Local SEO built in", body: "Semantic HTML, schema-ready structure and neighbourhood keywords for every page." },
  { icon: ShieldCheck, title: "Trust on every screen", body: "Google ratings, credentials and clear calls to action placed where patients actually look." },
];

const pipeline = [
  { icon: MapPin, title: "Google Maps", body: "One link is the entire brief." },
  { icon: Search, title: "Business research", body: "Listing, reviews, photos and category signals." },
  { icon: Brain, title: "Understanding", body: "Services, audience and positioning extracted." },
  { icon: Palette, title: "Brand identity", body: "Palette, type and tone matched to your industry." },
  { icon: LayoutTemplate, title: "Website generation", body: "Pages composed from your Business Blueprint." },
  { icon: Gauge, title: "SEO optimisation", body: "Schema, metadata and local keywords baked in." },
  { icon: Bot, title: "AI search readiness", body: "Structured so AI assistants can quote you." },
  { icon: MonitorSmartphone, title: "Preview", body: "Desktop, tablet and mobile, side by side." },
  { icon: Rocket, title: "Launch", body: "Approve it and go live. Not before." },
];

function Landing() {
  const [link, setLink] = useState("");
  const [industry, setIndustry] = useState("dental");
  const [mode, setMode] = useState<GenerationMode>("draft");
  const navigate = useNavigate();
  const { isGuest, isOwner, isStaff, user } = useAuth();
  const quota = useGuestQuota();
  const [signIn, setSignIn] = useState(false);
  const blocked = isGuest && quota.exhausted;

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <BrandMark />
          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            <a href="#how" className="text-sm text-muted-foreground hover:text-foreground">How it works</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</a>
            {isStaff ? <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground">Admin</Link> : null}
          </nav>
          <div className="flex items-center gap-2">
            {isOwner || isStaff ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={isStaff ? "/admin" : "/owner"}>Dashboard</Link>
                </Button>
                <Button size="sm" asChild><a href="#start">Generate my website</a></Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => setSignIn(true)}>Login</Button>
                <Button size="sm" asChild><a href="#start">Generate my website</a></Button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="aura relative overflow-hidden px-5 pb-20 pt-16 sm:px-8 md:pt-24" id="start">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium shadow-[var(--shadow-soft)]">
              <span className="size-1.5 rounded-full bg-success" /> 19 industries · each with its own design system
            </span>
            <h1 className="mt-6 text-balance text-4xl leading-[1.03] sm:text-6xl md:text-7xl">
              Paste your Google Maps <span className="italic text-primary">business link</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Our AI digital agency researches your business and delivers a finished, premium website — before you pay a rupee.
            </p>
            <form
              className="rise-2 mt-9 max-w-xl rounded-[1.5rem] border border-border bg-card p-2 shadow-[var(--shadow-lift)]"
              onSubmit={(e) => {
                e.preventDefault();
                if (blocked) {
                  toast.error("Free generations used up", { description: QUOTA_EXHAUSTED_MESSAGE });
                  setSignIn(true);
                  return;
                }
                navigate({ to: "/generate", search: { url: link, industry, name: "", mode } });
              }}
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Link2 className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <label htmlFor="maps" className="sr-only">Google Maps business link</label>
                  <Input id="maps" required value={link} onChange={(e) => setLink(e.target.value)} placeholder="maps.app.goo.gl/… or business name + city" className="h-12 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0" />
                </div>
                <Button type="submit" size="lg" className="h-12">Generate my website <ArrowRight className="size-4" /></Button>
              </div>
              <div className="flex items-center gap-2 px-3 pb-1 pt-2.5 text-xs text-muted-foreground">
                <span>Business type</span>
                <div className="relative">
                  <label htmlFor="ind" className="sr-only">Business type</label>
                  <select
                    id="ind"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="appearance-none rounded-full border border-border bg-secondary/60 py-1 pl-3 pr-7 text-xs font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {industryDesigns.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2" />
                </div>
                <span aria-hidden className="hidden text-border sm:inline">·</span>
                <span className="hidden sm:inline">Quality</span>
                <div className="flex items-center gap-1 rounded-full border border-border bg-secondary/60 p-0.5" role="group" aria-label="Generation quality">
                  {GENERATION_MODES.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id)}
                      aria-pressed={mode === m.id}
                      title={`${m.blurb} (${m.costLabel})`}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${mode === m.id ? "bg-card text-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                <span className="hidden lg:inline">{generationModeInfo(mode).costLabel}</span>
              </div>
            </form>
            <div className="rise-3 mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <Link to="/site/$slug" params={{ slug: "smilecraft-dental-bandra" }} className="font-medium text-foreground underline underline-offset-4">
                View sample website
              </Link>
              <span className="flex items-center gap-1.5"><Star className="size-3.5 fill-accent text-accent" /> No payment until you approve</span>
            </div>
            {isGuest ? (
              blocked ? (
                <div className="rise-3 mt-5 max-w-xl rounded-2xl border border-primary/25 bg-primary/5 p-5">
                  <p className="text-sm font-medium">You've used all 3 free website generations for this week</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    Sign in with Google to continue editing your existing website or contact WebsiteKaro to launch your business online.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => setSignIn(true)}>Sign in with Google</Button>
                    <Button size="sm" variant="outline" asChild><a href="#pricing">Contact WebsiteKaro</a></Button>
                  </div>
                </div>
              ) : (
                <p className="rise-3 mt-4 text-xs text-muted-foreground">
                  {quota.remaining} of {quota.limit} free generations left this week — no account needed.
                </p>
              )
            ) : (
              <p className="rise-3 mt-4 text-xs text-muted-foreground">Signed in as {user?.email} · unlimited generations</p>
            )}
          </div>
          <div className="rise-2 relative">
            <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[var(--shadow-lift)]">
              <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-4 py-3">
                <span className="size-2.5 rounded-full bg-destructive/40" />
                <span className="size-2.5 rounded-full bg-accent" />
                <span className="size-2.5 rounded-full bg-success/50" />
                <span className="ml-3 flex-1 truncate rounded-md bg-background px-3 py-1 text-[11px] text-muted-foreground">
                  smilecraftdental.in
                </span>
              </div>
              {/* Miniature of a generated clinic site */}
              <div className="bg-background p-5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[11px] font-semibold">
                    <span className="flex size-5 items-center justify-center rounded-md bg-primary text-[8px] text-primary-foreground">SC</span>
                    SmileCraft Dental Studio
                  </span>
                  <span className="hidden gap-3 text-[10px] text-muted-foreground sm:flex">
                    <span>About</span><span>Services</span><span>Doctors</span><span>Contact</span>
                  </span>
                  <span className="rounded-full bg-primary px-2.5 py-1 text-[9px] font-medium text-primary-foreground">Book</span>
                </div>
                <div className="mt-5 grid grid-cols-[1.05fr_0.95fr] items-center gap-4">
                  <div>
                    <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-primary">Dental clinic · Mumbai</p>
                    <p className="display mt-2 text-xl leading-tight">Bandra's calm, precise dental care</p>
                    <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
                      Digital dentistry with an unhurried, hospitality-led experience.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <span className="rounded-md bg-primary px-2.5 py-1 text-[9px] text-primary-foreground">Book an appointment</span>
                      <span className="rounded-md border border-border px-2.5 py-1 text-[9px]">Call</span>
                    </div>
                  </div>
                  <img src={clinicImg} alt="Generated dental clinic website hero" width={1600} height={1000} className="aspect-4/3 w-full rounded-xl object-cover" />
                </div>
                <div className="mt-5 grid grid-cols-4 gap-2 border-t border-border pt-4">
                  {[["40,000+", "Patients"], ["4.9 / 5", "Rating"], ["12", "Years"], ["ISO", "Sterilised"]].map(([v, l]) => (
                    <div key={l}>
                      <p className="display text-sm leading-none">{v}</p>
                      <p className="mt-1 text-[8px] uppercase tracking-[0.1em] text-muted-foreground">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 right-6 hidden rounded-2xl border border-border bg-card px-4 py-3 shadow-[var(--shadow-lift)] sm:block">
              <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Generated in</p>
              <p className="display text-2xl leading-none">4m 12s</p>
            </div>
            <div className="absolute -left-8 -top-5 hidden rounded-2xl border border-border bg-card px-4 py-3 shadow-[var(--shadow-soft)] lg:block">
              <p className="flex items-center gap-2 text-sm font-medium"><Check className="size-4 text-success" /> 8 pages ready</p>
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-border bg-secondary/40 py-4">
        <div className="marquee-track gap-10 px-6">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={dup === 1}>
              {industryDesigns.map((d) => d.label).map((c) => (
                <span key={c} className="eyebrow whitespace-nowrap text-muted-foreground">{c}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="border-y border-border bg-secondary/50 px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto w-full max-w-6xl">
          <p className="eyebrow mb-4 text-primary">Why it's different</p>
          <h2 className="max-w-2xl text-balance text-3xl sm:text-4xl">You hired an agency. It just happens to be very fast.</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <article key={f.title} className="card-quiet p-7">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/8 text-primary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-xl">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto w-full max-w-6xl">
          <p className="eyebrow mb-4 text-primary">The AI workflow</p>
          <h2 className="max-w-2xl text-balance text-3xl sm:text-4xl">One link in. A finished agency website out.</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Nine stages run automatically. You don't configure anything — you review the result.
          </p>
          <ol className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pipeline.map((s, i) => (
              <li
                key={s.title}
                className="group relative flex gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <s.icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Step {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 text-lg leading-tight">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8">
        <div className="mx-auto grid w-full max-w-6xl gap-5 md:grid-cols-3">
          {[
            { q: "They sent the finished website first. I approved it the same evening and we were live by Friday.", a: "Dr. Ananya Mehta", r: "SmileCraft Dental Studio, Bandra" },
            { q: "Our old site took four months and a designer. This took one link.", a: "Dr. Vikram Shah", r: "Pearl Avenue Dental, Andheri" },
            { q: "Patients now book through the site instead of calling reception twice.", a: "Dr. Kavita Rao", r: "The Dental Loft, Powai" },
          ].map((t) => (
            <figure key={t.a} className="card-quiet flex flex-col p-7">
              <div className="flex gap-0.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-3.5 fill-accent text-accent" />)}
              </div>
              <blockquote className="mt-5 flex-1 text-base leading-relaxed">"{t.q}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5 text-sm">
                <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
                  {t.a.split(" ").slice(-2).map((p) => p[0]).join("")}
                </span>
                <span><span className="font-medium">{t.a}</span><br /><span className="text-muted-foreground">{t.r}</span></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-y border-border bg-secondary/50 px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto w-full max-w-6xl">
          <p className="eyebrow mb-4 text-primary">Pricing</p>
          <h2 className="text-3xl sm:text-4xl">Simple pricing, once you're convinced</h2>
          <p className="mt-3 text-sm text-muted-foreground">Indicative plans. Billing arrives in a later release.</p>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { name: "Launch", price: "₹14,999", note: "one-time", perks: ["8-page website", "Mobile-first design", "Google Maps + reviews", "Enquiry forms"] },
              { name: "Growth", price: "₹2,499", note: "per month", perks: ["Everything in Launch", "Owner dashboard", "Unlimited content edits", "Lead inbox"], featured: true },
              { name: "Agency", price: "Custom", note: "for chains", perks: ["Multiple locations", "Priority generation", "Custom domain setup", "Dedicated manager"] },
            ].map((p) => (
              <article key={p.name} className={`relative rounded-3xl border p-7 ${p.featured ? "surface-ink border-transparent shadow-[var(--shadow-lift)] md:-mt-4 md:pb-11" : "border-border bg-card"}`}>
                {p.featured && (
                  <span className="absolute right-6 top-6 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
                    Most chosen
                  </span>
                )}
                <h3 className={`text-xl ${p.featured ? "text-ink-foreground" : ""}`}>{p.name}</h3>
                <p className="mt-4 text-4xl font-semibold tracking-tight">{p.price}</p>
                <p className={`text-sm ${p.featured ? "opacity-70" : "text-muted-foreground"}`}>{p.note}</p>
                <ul className="mt-6 grid gap-3 text-sm">
                  {p.perks.map((k) => <li key={k} className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0" />{k}</li>)}
                </ul>
                <Button variant={p.featured ? "secondary" : "outline"} className="mt-7 w-full" asChild><a href="#start">Start with {p.name}</a></Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">FAQ</p>
            <h2 className="text-3xl sm:text-4xl">Questions we get daily</h2>
          </div>
          <Accordion type="single" collapsible>
            {[
              ["Do I really pay nothing upfront?", "Correct. We generate the full website first. You only pay when you decide to publish it."],
              ["Can I edit the content myself?", "Yes. Every published site comes with an owner dashboard for services, team, gallery, hours and enquiries."],
              ["Which businesses do you support today?", "Dental clinics in Mumbai are our first vertical. Restaurants, salons, law firms, gyms and more are queued."],
              ["Do you use my Google reviews?", "We summarise your public rating and highlight reviews with attribution. Nothing is fabricated."],
            ].map(([q, a]) => (
              <AccordionItem key={q} value={q as string}>
                <AccordionTrigger className="text-left text-base">{q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8">
        <div className="surface-ink mx-auto flex w-full max-w-6xl flex-col items-start gap-6 rounded-3xl p-10 md:flex-row md:items-center md:justify-between md:p-14">
          <div>
            <h2 className="text-3xl text-ink-foreground sm:text-4xl">See your website before you decide</h2>
            <p className="mt-3 text-sm opacity-70">One link. One working day. Zero risk.</p>
          </div>
          <div className="flex gap-3">
            <Button size="lg" variant="secondary" asChild><a href="#start"><Rocket className="size-4" /> Generate my website</a></Button>
            <Button size="lg" variant="outline" asChild className="bg-transparent text-ink-foreground">
              <Link to="/site/$slug" params={{ slug: "smilecraft-dental-bandra" }}>View sample</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-12 sm:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 font-medium text-foreground"><Sparkles className="size-4 text-primary" /> WebsiteKaro</p>
          <div className="flex flex-wrap gap-5">
            {isOwner || isStaff ? (
              <Link to={isStaff ? "/admin" : "/owner"}>Dashboard</Link>
            ) : (
              <button type="button" onClick={() => setSignIn(true)}>Login</button>
            )}
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <button type="button" onClick={() => setStaffGate(true)} className="transition-colors hover:text-foreground">Admin</button>
          </div>
          <p>© {new Date().getFullYear()} WebsiteKaro, Mumbai</p>
        </div>
      </footer>

      <GoogleSignInDialog open={signIn} onOpenChange={setSignIn} />
    </div>
  );
}
