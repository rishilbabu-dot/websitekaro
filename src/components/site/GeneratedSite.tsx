import { useState } from "react";
import {
  Phone, MessageCircle, MapPin, Clock, Star, Check, ArrowRight, Mail, Menu, X, ShieldCheck,
} from "lucide-react";
import type { BusinessBlueprint } from "@/data/blueprint";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import heroImg from "@/assets/dental-hero.jpg";
import { galleryImages, doctorPhotos } from "@/data/media";

const nav = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "team", label: "Doctors" },
  { id: "gallery", label: "Gallery" },
  { id: "reviews", label: "Reviews" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`px-5 py-20 sm:px-8 md:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow mb-4 flex items-center gap-2.5 text-primary">
      <span className="inline-block h-px w-6 bg-primary/50" />
      {children}
    </p>
  );
}

export function GeneratedSite({ data }: { data: BusinessBlueprint }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
              {data.logoMark}
            </span>
            <span className="text-sm font-semibold tracking-tight">{data.name}</span>
          </a>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="outline" size="sm" asChild>
              <a href={`tel:${data.phone}`}><Phone className="size-4" /> Call</a>
            </Button>
            <Button size="sm" asChild>
              <a href="#contact">{data.cta.primary}</a>
            </Button>
          </div>
          <button
            className="lg:hidden sm:hidden inline-flex size-10 items-center justify-center rounded-lg border border-border"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open && (
          <nav className="border-t border-border bg-background px-5 py-4 sm:hidden" aria-label="Mobile">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)} className="block py-2.5 text-sm">
                {n.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Hero */}
      <div id="top" className="aura relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-2">
          <div className="rise">
            <Eyebrow>{data.category} · {data.city}</Eyebrow>
            <h1 className="display text-balance text-4xl leading-[1.05] sm:text-5xl md:text-[4rem]">{data.tagline}</h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">{data.description}</p>
            <div className="mt-8 flex flex-wrap gap-3 rise-2">
              <Button size="lg" asChild><a href="#contact">{data.cta.primary} <ArrowRight className="size-4" /></a></Button>
              <Button size="lg" variant="outline" asChild><a href={`tel:${data.phone}`}><Phone className="size-4" /> {data.phone}</a></Button>
            </div>
            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-border pt-8 sm:grid-cols-4 rise-3">
              {data.trust.map((t) => (
                <div key={t.label}>
                  <dd className="display text-2xl leading-none">{t.value}</dd>
                  <dt className="mt-2 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{t.label}</dt>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative rise-2">
            <div className="absolute -right-4 -top-4 hidden size-40 rounded-full bg-sand/60 blur-2xl md:block" aria-hidden />
            <img
              src={heroImg}
              alt={`Interior of ${data.name} in ${data.city}`}
              width={1600}
              height={1000}
              className="relative aspect-4/5 w-full rounded-[2rem] object-cover shadow-[var(--shadow-lift)] sm:aspect-4/3"
            />
            <div className="absolute -bottom-6 left-6 hidden rounded-2xl border border-border bg-card/95 p-4 shadow-[var(--shadow-lift)] backdrop-blur sm:block">
              <div className="flex items-center gap-2">
                <Star className="size-4 fill-accent text-accent" />
                <span className="text-sm font-semibold">{data.reviews.rating}</span>
                <span className="text-sm text-muted-foreground">· {data.reviews.count} Google reviews</span>
              </div>
            </div>
            <div className="absolute -left-5 top-8 hidden rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur lg:block">
              <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Today</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                <span className="size-1.5 rounded-full bg-success" /> Slots available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Credibility strip */}
      <div className="overflow-hidden border-y border-border bg-secondary/50 py-4">
        <div className="marquee-track gap-12 px-6">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={dup === 1}>
              {[
                "ISO-certified sterilisation",
                "Digital OPG on site",
                "Zero-cost EMI",
                "Same-day emergency slots",
                "Indian Dental Association member",
                "Wheelchair accessible",
              ].map((c) => (
                <span key={c} className="flex items-center gap-2 whitespace-nowrap text-sm text-muted-foreground">
                  <ShieldCheck className="size-4 text-primary" /> {c}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <Section id="about" className="border-t border-border/70">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Eyebrow>About us</Eyebrow>
            <h2 className="text-3xl sm:text-4xl">Why patients choose {data.name}</h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-muted-foreground">{data.audience}</p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {data.usp.map((u) => (
                <li key={u} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-sm font-medium">{u}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Services */}
      <Section id="services" className="bg-secondary/60">
        <Eyebrow>Treatments</Eyebrow>
        <h2 className="max-w-2xl text-3xl sm:text-4xl">Care planned before it begins</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.services.map((s) => (
            <article key={s.id} className="group rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
              <h3 className="text-xl">{s.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm">
                <span className="font-semibold">{s.priceFrom ? `From ${s.priceFrom}` : "On consultation"}</span>
                <span className="text-muted-foreground">{s.duration}</span>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section id="team">
        <Eyebrow>The team</Eyebrow>
        <h2 className="max-w-2xl text-3xl sm:text-4xl">Specialists you'll actually meet</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.team.map((m) => (
            <article key={m.id} className="rounded-3xl border border-border bg-card p-7">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-accent text-lg font-semibold text-accent-foreground">
                {m.name.split(" ").slice(-2).map((p) => p[0]).join("")}
              </div>
              <h3 className="mt-5 text-xl">{m.name}</h3>
              <p className="text-sm text-primary">{m.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
              <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">{m.qualification} · {m.experience}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Gallery */}
      <Section id="gallery" className="bg-secondary/60">
        <Eyebrow>Gallery</Eyebrow>
        <h2 className="text-3xl sm:text-4xl">Inside the clinic</h2>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <img
              key={i}
              src={heroImg}
              alt={`${data.name} clinic photo ${i + 1}`}
              loading="lazy"
              width={1600}
              height={1000}
              className={`w-full rounded-2xl object-cover ${i % 3 === 0 ? "aspect-3/4" : "aspect-square"}`}
            />
          ))}
        </div>
      </Section>

      {/* Reviews */}
      <Section id="reviews">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Eyebrow>Google reviews</Eyebrow>
            <h2 className="text-3xl sm:text-4xl">{data.reviews.rating} out of 5</h2>
            <p className="mt-3 text-sm text-muted-foreground">Based on {data.reviews.count} verified Google reviews</p>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">{data.reviews.summary}</p>
          </div>
          <div className="grid gap-4">
            {data.reviews.items.map((r) => (
              <figure key={r.id} className="rounded-3xl border border-border bg-card p-6">
                <div className="flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed">{r.text}</blockquote>
                <figcaption className="mt-4 text-xs text-muted-foreground">{r.author} · {r.source} · {r.date}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="bg-secondary/60">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="text-3xl sm:text-4xl">Good to know</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {data.faqs.map((f) => (
              <AccordionItem key={f.id} value={f.id}>
                <AccordionTrigger className="text-left text-base">{f.question}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* Contact / appointment */}
      <Section id="contact">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>Appointments</Eyebrow>
            <h2 className="text-3xl sm:text-4xl">{data.cta.primary}</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Tell us when suits you. We confirm within business hours, usually in minutes.
            </p>
            <form
              className="mt-8 grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Request received", { description: "The clinic will confirm your slot shortly." });
                (e.target as HTMLFormElement).reset();
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label htmlFor="ap-name" className="text-sm font-medium">Full name</label>
                  <Input id="ap-name" name="name" required placeholder="Your name" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="ap-phone" className="text-sm font-medium">Phone</label>
                  <Input id="ap-phone" name="phone" type="tel" required placeholder="+91" />
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="ap-msg" className="text-sm font-medium">What do you need help with?</label>
                <Textarea id="ap-msg" name="message" rows={4} placeholder="Briefly describe your concern" />
              </div>
              <Button type="submit" size="lg" className="justify-self-start">Request appointment</Button>
            </form>
          </div>
          <div className="grid content-start gap-4">
            <div className="rounded-3xl border border-border bg-card p-7">
              <h3 className="text-xl">Visit us</h3>
              <ul className="mt-5 grid gap-4 text-sm">
                <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" /><span>{data.address}<br /><span className="text-muted-foreground">{data.landmarks.join(" · ")}</span></span></li>
                <li className="flex gap-3"><Phone className="mt-0.5 size-4 shrink-0 text-primary" /><a href={`tel:${data.phone}`}>{data.phone}</a></li>
                <li className="flex gap-3"><Mail className="mt-0.5 size-4 shrink-0 text-primary" /><a href={`mailto:${data.email}`}>{data.email}</a></li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{data.hours.map((h) => <span key={h.day} className="block">{h.day}: <span className="text-muted-foreground">{h.open}</span></span>)}</span>
                </li>
              </ul>
            </div>
            <iframe
              title={`Map showing ${data.name}`}
              loading="lazy"
              className="h-64 w-full rounded-3xl border border-border"
              src={`https://www.google.com/maps?q=${encodeURIComponent(data.mapEmbedQuery)}&output=embed`}
            />
          </div>
        </div>
      </Section>

      {/* Newsletter */}
      <Section className="pb-10">
        <div className="surface-ink flex flex-col gap-6 rounded-3xl p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <h2 className="text-2xl text-ink-foreground sm:text-3xl">Dental care notes, twice a month</h2>
            <p className="mt-2 text-sm opacity-70">Practical advice from our specialists. No spam, unsubscribe anytime.</p>
          </div>
          <form
            className="flex w-full max-w-md gap-2"
            onSubmit={(e) => { e.preventDefault(); toast.success("Subscribed"); (e.target as HTMLFormElement).reset(); }}
          >
            <label htmlFor="nl" className="sr-only">Email address</label>
            <Input id="nl" type="email" required placeholder="you@email.com" className="bg-background text-foreground" />
            <Button type="submit" variant="secondary">Subscribe</Button>
          </form>
        </div>
      </Section>

      <footer className="border-t border-border px-5 py-14 sm:px-8">
        <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-4">
          <div>
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">{data.logoMark}</span>
            <p className="mt-4 text-sm font-semibold">{data.name}</p>
            <p className="mt-2 text-sm text-muted-foreground">{data.address}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Explore</h3>
            <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
              {nav.map((n) => <li key={n.id}><a className="hover:text-foreground" href={`#${n.id}`}>{n.label}</a></li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Treatments</h3>
            <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
              {data.services.slice(0, 5).map((s) => <li key={s.id}><a className="hover:text-foreground" href="#services">{s.name}</a></li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
              <li><a className="hover:text-foreground" href="#">Privacy policy</a></li>
              <li><a className="hover:text-foreground" href="#">Terms of use</a></li>
            </ul>
            <div className="mt-5 flex gap-3 text-sm text-muted-foreground">
              {data.social.map((s) => <a key={s.label} href={s.url} className="hover:text-foreground">{s.label}</a>)}
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 flex w-full max-w-6xl flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {data.name}. All rights reserved.</p>
          <p className="flex items-center gap-1.5"><ShieldCheck className="size-3.5" /> Website by WebsiteKaro</p>
        </div>
      </footer>

      {/* Floating call / WhatsApp */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
        <a
          href={`https://wa.me/${data.whatsapp}`}
          aria-label="Chat on WhatsApp"
          className="flex size-13 items-center justify-center rounded-full bg-success text-success-foreground shadow-[var(--shadow-lift)] transition-transform hover:scale-105"
        >
          <MessageCircle className="size-5" />
        </a>
        <a
          href={`tel:${data.phone}`}
          aria-label="Call the clinic"
          className="flex size-13 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-lift)] transition-transform hover:scale-105 sm:hidden"
        >
          <Phone className="size-5" />
        </a>
      </div>
    </div>
  );
}
