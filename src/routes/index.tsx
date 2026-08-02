import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight, Sparkles, Link2, Wand2, Rocket, ShieldCheck, Gauge, Search, Star, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import heroImg from "@/assets/landing-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WebsiteKaro — Websites for Local Business, Built Before You Pay" },
      { name: "description", content: "Paste your Google Maps business link and WebsiteKaro's AI digital agency builds a premium, ready-to-launch website for your clinic or shop — before you pay a rupee." },
      { property: "og:title", content: "WebsiteKaro — Built before you pay" },
      { property: "og:description", content: "An AI digital agency that ships premium websites for local businesses in Mumbai." },
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

const steps = [
  { n: "01", title: "Paste your link", body: "Your Google Maps listing, or just business name and city." },
  { n: "02", title: "We research", body: "We assemble a structured Business Blueprint — services, team, hours, reviews, positioning." },
  { n: "03", title: "Your site appears", body: "A complete, production-ready website you can review on desktop, tablet and mobile." },
  { n: "04", title: "You decide", body: "Love it? Publish. Don't? You've paid nothing." },
];

function Landing() {
  const [link, setLink] = useState("");

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="size-4" /></span>
            <span className="text-sm font-semibold tracking-tight">WebsiteKaro</span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            <a href="#how" className="text-sm text-muted-foreground hover:text-foreground">How it works</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild><Link to="/admin">Sign in</Link></Button>
            <Button size="sm" asChild><a href="#start">Generate my website</a></Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-5 pb-20 pt-16 sm:px-8 md:pt-24" id="start">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium">
              <span className="size-1.5 rounded-full bg-success" /> Now building for dental clinics in Mumbai
            </span>
            <h1 className="mt-6 text-4xl leading-[1.03] sm:text-6xl md:text-7xl">Paste your Google Maps business link</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              We'll build your professional business website before you pay. Not a builder, not a template — an AI digital agency that delivers finished work.
            </p>
            <form
              className="mt-9 flex max-w-xl flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Blueprint queued", { description: "We'll research this business and generate a preview." });
                setLink("");
              }}
            >
              <div className="relative flex-1">
                <Link2 className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <label htmlFor="maps" className="sr-only">Google Maps business link</label>
                <Input id="maps" required value={link} onChange={(e) => setLink(e.target.value)} placeholder="maps.app.goo.gl/… or business name + city" className="h-12 pl-10" />
              </div>
              <Button type="submit" size="lg" className="h-12">Generate my website <ArrowRight className="size-4" /></Button>
            </form>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <Link to="/site/$slug" params={{ slug: "smilecraft-dental-bandra" }} className="font-medium text-foreground underline underline-offset-4">
                View sample website
              </Link>
              <span className="flex items-center gap-1.5"><Star className="size-3.5 fill-accent text-accent" /> No payment until you approve</span>
            </div>
          </div>
          <div className="relative">
            <img src={heroImg} alt="Preview of a website generated by WebsiteKaro" width={1400} height={1000} className="w-full rounded-3xl object-cover shadow-[var(--shadow-lift)]" />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/50 px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="max-w-2xl text-3xl sm:text-4xl">You hired an agency. It just happens to be very fast.</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <article key={f.title} className="rounded-3xl border border-border bg-card p-7 transition-transform hover:-translate-y-1">
                <f.icon className="size-5 text-primary" />
                <h3 className="mt-5 text-xl">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto w-full max-w-6xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">How it works</p>
          <h2 className="max-w-2xl text-3xl sm:text-4xl">Four steps. Nothing for you to configure.</h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n}>
                <span className="display text-4xl text-muted-foreground/50">{s.n}</span>
                <h3 className="mt-3 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
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
            <figure key={t.a} className="rounded-3xl border border-border bg-card p-7">
              <blockquote className="text-base leading-relaxed">"{t.q}"</blockquote>
              <figcaption className="mt-5 text-sm"><span className="font-medium">{t.a}</span><br /><span className="text-muted-foreground">{t.r}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-y border-border bg-secondary/50 px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-3xl sm:text-4xl">Simple pricing, once you're convinced</h2>
          <p className="mt-3 text-sm text-muted-foreground">Indicative plans. Billing arrives in a later release.</p>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { name: "Launch", price: "₹14,999", note: "one-time", perks: ["8-page website", "Mobile-first design", "Google Maps + reviews", "Enquiry forms"] },
              { name: "Growth", price: "₹2,499", note: "per month", perks: ["Everything in Launch", "Owner dashboard", "Unlimited content edits", "Lead inbox"], featured: true },
              { name: "Agency", price: "Custom", note: "for chains", perks: ["Multiple locations", "Priority generation", "Custom domain setup", "Dedicated manager"] },
            ].map((p) => (
              <article key={p.name} className={`rounded-3xl border p-7 ${p.featured ? "surface-ink border-transparent" : "border-border bg-card"}`}>
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
            <Link to="/admin">Super Admin</Link>
            <Link to="/owner">Business Owner</Link>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
          <p>© {new Date().getFullYear()} WebsiteKaro, Mumbai</p>
        </div>
      </footer>
    </div>
  );
}
