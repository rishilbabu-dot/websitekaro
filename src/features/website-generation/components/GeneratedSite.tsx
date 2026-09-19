import { useState } from "react";
import {
  Phone, MessageCircle, MapPin, Clock, Star, Check, ArrowRight, Mail, Menu, X, ShieldCheck,
} from "lucide-react";
import type { BusinessBlueprint } from "@/features/businesses";
import type { IndustryDesign, SectionId } from "@/features/industries";
import { getIndustryDesign, industryCssVars } from "@/features/industries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { siteImages } from "@/features/website-generation/media";
import { youtubeEmbed } from "@/features/website-generation/brand-links";

interface Ctx {
  data: BusinessBlueprint;
  design: IndustryDesign;
  tone: boolean;
}

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

/* ---------------------------------------------------------------- heroes */

function HeroSplit({ data, image }: { data: BusinessBlueprint; image: string }) {
  return (
    <div id="top" className="aura relative overflow-hidden">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-2">
        <div className="rise">
          <Eyebrow>{data.category} · {data.city}</Eyebrow>
          <h1 className="display text-balance text-4xl leading-[1.05] sm:text-5xl md:text-[4rem]">{data.name}</h1>
          {data.tagline ? <p className="mt-5 text-xl font-medium">{data.tagline}</p> : null}
          {data.description ? <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">{data.description}</p> : null}
          <div className="rise-2 mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild><a href="#contact">{data.cta.primary} <ArrowRight className="size-4" /></a></Button>
            {data.phone ? <Button size="lg" variant="outline" asChild><a href={`tel:${data.phone}`}><Phone className="size-4" /> {data.phone}</a></Button> : null}
          </div>
          <TrustRow data={data} className="rise-3 mt-12 border-t border-border pt-8" />
        </div>
        <div className="rise-2 relative">
          <div className="absolute -right-4 -top-4 hidden size-40 rounded-full bg-sand/60 blur-2xl md:block" aria-hidden />
          <img
            src={image}
            alt={`Inside ${data.name} in ${data.city}`}
            width={1600}
            height={1000}
            className="relative aspect-4/5 w-full rounded-[calc(var(--radius)+1rem)] object-cover shadow-[var(--shadow-lift)] sm:aspect-4/3"
          />
          {data.reviews.verified ? (
            <div className="absolute -bottom-6 left-6 hidden rounded-2xl border border-border bg-card/95 p-4 shadow-[var(--shadow-lift)] backdrop-blur sm:block">
              <div className="flex items-center gap-2">
                <Star className="size-4 fill-accent text-accent" />
                <span className="text-sm font-semibold">{data.reviews.rating}</span>
                <span className="text-sm text-muted-foreground">· {data.reviews.count} Google reviews</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function HeroFull({ data, image }: { data: BusinessBlueprint; image: string }) {
  return (
    <div id="top" className="relative isolate overflow-hidden">
      <img src={image} alt={`${data.name} in ${data.city}`} width={2000} height={1200} className="absolute inset-0 -z-10 size-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-ink/85 via-ink/70 to-ink/95" aria-hidden />
      <div className="mx-auto w-full max-w-6xl px-5 py-28 sm:px-8 md:py-40">
        <div className="rise max-w-3xl text-ink-foreground">
          <p className="eyebrow mb-5 opacity-80">{data.category} · {data.city}</p>
          <h1 className="display text-balance text-5xl leading-[1.02] sm:text-6xl md:text-[5rem]">{data.name}</h1>
          {data.tagline ? <p className="mt-5 text-xl font-medium">{data.tagline}</p> : null}
          {data.description ? <p className="mt-5 max-w-xl text-base leading-relaxed opacity-80">{data.description}</p> : null}
          <div className="rise-2 mt-9 flex flex-wrap gap-3">
            <Button size="lg" asChild><a href="#contact">{data.cta.primary} <ArrowRight className="size-4" /></a></Button>
            {data.phone ? <Button size="lg" variant="outline" asChild className="border-current/30 bg-transparent text-ink-foreground hover:bg-white/10">
              <a href={`tel:${data.phone}`}><Phone className="size-4" /> {data.cta.secondary}</a>
            </Button> : null}
          </div>
        </div>
        <dl className="rise-3 mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/15 pt-8 text-ink-foreground sm:grid-cols-4">
          {data.trust.map((t) => (
            <div key={t.label}>
              <dd className="display text-3xl leading-none">{t.value}</dd>
              <dt className="mt-2 text-[11px] uppercase tracking-[0.12em] opacity-70">{t.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function HeroEditorial({ data, image }: { data: BusinessBlueprint; image: string }) {
  return (
    <div id="top" className="aura relative overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-5 pb-10 pt-20 text-center sm:px-8 md:pt-28">
        <p className="eyebrow rise mb-5 text-primary">{data.category} · {data.city}</p>
        <h1 className="display rise mx-auto max-w-4xl text-balance text-5xl leading-[1.02] sm:text-6xl md:text-[5.25rem]">
          {data.name}
        </h1>
        {data.tagline ? <p className="rise-2 mx-auto mt-5 text-xl font-medium">{data.tagline}</p> : null}
        {data.description ? <p className="rise-2 mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">{data.description}</p> : null}
        <div className="rise-2 mt-9 flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild><a href="#contact">{data.cta.primary} <ArrowRight className="size-4" /></a></Button>
          {data.phone ? <Button size="lg" variant="outline" asChild><a href={`tel:${data.phone}`}><Phone className="size-4" /> {data.cta.secondary}</a></Button> : null}
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <img
          src={image}
          alt={`${data.name} in ${data.city}`}
          width={2000}
          height={1000}
          className="rise-3 aspect-16/9 w-full rounded-[calc(var(--radius)+1rem)] object-cover shadow-[var(--shadow-lift)]"
        />
        <TrustRow data={data} className="mt-10 border-t border-border pt-8" />
      </div>
    </div>
  );
}

function TrustRow({ data, className = "" }: { data: BusinessBlueprint; className?: string }) {
  return (
    <dl className={`grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4 ${className}`}>
      {data.trust.map((t) => (
        <div key={t.label}>
          <dd className="display text-2xl leading-none">{t.value}</dd>
          <dt className="mt-2 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{t.label}</dt>
        </div>
      ))}
    </dl>
  );
}

/* -------------------------------------------------------------- sections */

const sectionRenderers: Record<SectionId, (ctx: Ctx, tinted: boolean) => React.ReactNode> = {
  about: ({ data, design }, tinted) => (
    <Section id="about" key="about" className={tinted ? "bg-secondary/60" : "border-t border-border/70"}>
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Eyebrow>About us</Eyebrow>
          <h2 className="text-3xl sm:text-4xl">{design.words.aboutTitle}</h2>
        </div>
        <div>
          <p className="text-lg leading-relaxed text-muted-foreground">{data.audience}</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {data.usp.map((u) => (
              <li key={u} className="flex items-start gap-3 rounded-[calc(var(--radius)+0.5rem)] border border-border bg-card p-4">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-sm font-medium">{u}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  ),

  services: ({ data, design }, tinted) => (
    <Section id="services" key="services" className={tinted ? "bg-secondary/60" : ""}>
      <Eyebrow>{design.words.servicesEyebrow}</Eyebrow>
      <h2 className="max-w-2xl text-3xl sm:text-4xl">{design.words.servicesTitle}</h2>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.services.map((s) => (
          <article key={s.id} className="card-quiet group p-7">
            <h3 className="text-xl">{s.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm">
               {s.priceFrom ? <span className="font-semibold">{s.priceFrom.startsWith("₹") ? `From ${s.priceFrom}` : s.priceFrom}</span> : <span />}
               {s.duration ? <span className="text-muted-foreground">{s.duration}</span> : null}
            </div>
            <a href="#contact" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Enquire <ArrowRight className="size-3.5" />
            </a>
          </article>
        ))}
      </div>
    </Section>
  ),

  team: ({ data, design }, tinted) => (
    <Section id="team" key="team" className={tinted ? "bg-secondary/60" : ""}>
      <Eyebrow>{design.words.teamEyebrow}</Eyebrow>
      <h2 className="max-w-2xl text-3xl sm:text-4xl">{design.words.teamTitle}</h2>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.team.map((m, i) => (
          <article key={m.id} className="card-quiet overflow-hidden">
            <img
              src={siteImages(data).team[i]}
              alt={`${m.name}, ${m.role}`}
              loading="lazy"
              width={1024}
              height={1024}
              className="aspect-4/5 w-full object-cover"
            />
            <div className="p-7">
              <h3 className="text-xl">{m.name}</h3>
              <p className="text-sm text-primary">{m.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
              <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{m.qualification} · {m.experience}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  ),

  gallery: ({ data, design }, tinted) => (
    <Section id="gallery" key="gallery" className={tinted ? "bg-secondary/60" : ""}>
      <Eyebrow>{design.words.galleryNav}</Eyebrow>
      <h2 className="text-3xl sm:text-4xl">{design.words.galleryTitle}</h2>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {siteImages(data).gallery.map((src, i) => (
          <figure
            key={src}
            className={`group relative overflow-hidden rounded-[calc(var(--radius)+0.75rem)] ${i === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}
          >
            <img
              src={src}
              alt={`${design.seed.gallery[i] ?? design.words.galleryNav} at ${data.name}`}
              loading="lazy"
              width={1200}
              height={1200}
              className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] ${i === 0 ? "aspect-square lg:h-full" : "aspect-4/3"}`}
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/70 to-transparent p-4 text-xs font-medium text-ink-foreground">
              {design.seed.gallery[i] ?? design.words.galleryNav}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  ),

  // Reviews are only branded as Google reviews when they actually came from the
  // business's Google listing. Otherwise they are labelled as sample wording.
  reviews: ({ data }, tinted) => {
    const verified = data.reviews.verified === true;
    const reviewsUrl = data.reviews.url ?? data.mapsUrl;
    return (
      <Section id="reviews" key="reviews" className={tinted ? "bg-secondary/60" : ""}>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Eyebrow>{verified ? "Google reviews" : "What customers say"}</Eyebrow>
            {verified ? (
              <>
                <h2 className="text-3xl sm:text-4xl">{data.reviews.rating} out of 5</h2>
                <p className="mt-3 text-sm text-muted-foreground">Based on {data.reviews.count} Google reviews</p>
              </>
            ) : (
              <h2 className="text-3xl sm:text-4xl">Loved by our customers</h2>
            )}
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">{data.reviews.summary}</p>
            {reviewsUrl ? (
              <a
                href={reviewsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline underline-offset-4"
              >
                View reviews on Google <ArrowRight className="size-3.5" />
              </a>
            ) : null}
          </div>
          <div className="grid gap-4">
            {data.reviews.items.map((r) => (
              <figure key={r.id} className="rounded-[calc(var(--radius)+0.75rem)] border border-border bg-card p-6">
                <div className="flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed">{r.text}</blockquote>
                <figcaption className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{r.author}</span>
                  <span>·</span>
                  <span>{r.verified ? "Google Review" : "Sample review"}</span>
                  <span>·</span>
                  <span>{r.date}</span>
                  {r.verified && (r.url ?? reviewsUrl) ? (
                    <a
                      href={r.url ?? reviewsUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="ml-auto font-medium text-primary underline underline-offset-4"
                    >
                      View on Google →
                    </a>
                  ) : null}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Section>
    );
  },

  faq: ({ data }, tinted) => (
    <Section id="faq" key="faq" className={tinted ? "bg-secondary/60" : ""}>
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
  ),

  contact: ({ data, design }, tinted) => (
    <Section id="contact" key="contact" className={tinted ? "bg-secondary/60" : ""}>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <Eyebrow>{design.words.contactEyebrow}</Eyebrow>
          <h2 className="text-3xl sm:text-4xl">{design.words.contactTitle}</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Share what you need and the best way to reach you.
          </p>
          <form
            className="mt-8 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Request received", { description: `${data.name} will get back to you shortly.` });
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
              <Textarea id="ap-msg" name="message" rows={4} placeholder="A line or two is plenty" />
            </div>
            <Button type="submit" size="lg" className="justify-self-start">{design.words.ctaPrimary}</Button>
          </form>
        </div>
        <div className="grid content-start gap-4">
          <div className="rounded-[calc(var(--radius)+0.75rem)] border border-border bg-card p-7">
            <h3 className="text-xl">Visit us</h3>
            <ul className="mt-5 grid gap-4 text-sm">
               {data.address ? <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" /><span>{data.address}{data.landmarks.length ? <><br /><span className="text-muted-foreground">{data.landmarks.join(" · ")}</span></> : null}</span></li> : null}
               {data.phone ? <li className="flex gap-3"><Phone className="mt-0.5 size-4 shrink-0 text-primary" /><a href={`tel:${data.phone}`}>{data.phone}</a></li> : null}
               {data.email ? <li className="flex gap-3"><Mail className="mt-0.5 size-4 shrink-0 text-primary" /><a href={`mailto:${data.email}`}>{data.email}</a></li> : null}
               {data.hours.length ? <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{data.hours.map((h) => <span key={h.day} className="block">{h.day}: <span className="text-muted-foreground">{h.open}</span></span>)}</span>
               </li> : null}
            </ul>
          </div>
          <iframe
            title={`Map showing ${data.name}`}
            loading="lazy"
            className="h-64 w-full rounded-[calc(var(--radius)+0.75rem)] border border-border"
            src={`https://www.google.com/maps?q=${encodeURIComponent(data.mapEmbedQuery)}&output=embed`}
          />
          <a
            href={data.mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.mapEmbedQuery)}`}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline underline-offset-4"
          >
            View on Google Maps <ArrowRight className="size-3.5" />
          </a>
        </div>
      </div>
    </Section>
  ),
};

/* ----------------------------------------------------------------- shell */

export function GeneratedSite({ data }: { data: BusinessBlueprint }) {
  const [open, setOpen] = useState(false);
  const categoryDesign = getIndustryDesign(data.industry);
  const design: IndustryDesign = {
    ...categoryDesign,
    heroVariant: data.designStrategy?.heroVariant ?? categoryDesign.heroVariant,
    sections: data.designStrategy?.sectionOrder ?? categoryDesign.sections,
  };
  const heroImage = siteImages(data).hero;
  // Official YouTube embed only — never re-hosted video.
  const youtubeSource = data.sources?.find((s) => s.kind === "youtube");
  const youtubeSrc = youtubeSource ? youtubeEmbed(youtubeSource.url) : null;
  const video = youtubeSource && youtubeSrc ? { src: youtubeSrc, href: youtubeSource.url } : null;

  // Category-aware social section copy — the section only renders when the
  // owner actually supplied official channels.
  const socialCopy: Record<string, { title: string; blurb: string }> = {
    wedding: { title: "Real weddings & celebrations", blurb: "Recent weddings, decor and behind-the-scenes moments from our official channels." },
    event: { title: "Events we've brought to life", blurb: "Recent setups, themes and celebrations from our official channels." },
    restaurant: { title: "Fresh from the kitchen", blurb: "New dishes, specials and moments from our official channels." },
    salon: { title: "Latest looks & transformations", blurb: "Recent styles and client transformations from our official channels." },
    gym: { title: "Training in action", blurb: "Workouts, transformations and community moments from our official channels." },
    photographer: { title: "Recent shoots", blurb: "Fresh work and behind-the-scenes from our official channels." },
    hotel: { title: "Moments from the property", blurb: "Rooms, dining and guest experiences from our official channels." },
    resort: { title: "Moments from the property", blurb: "Rooms, dining and guest experiences from our official channels." },
  };
  const social = socialCopy[data.industry] ?? { title: "Follow us", blurb: "Latest work, offers and updates from our official channels." };

  const available = (section: SectionId) =>
    section === "services" ? data.services.length > 0
    : section === "team" ? data.team.length > 0
    : section === "gallery" ? data.photos.length > 0 || (data.media?.length ?? 0) > 0 || !data.verifiedIdentity
    : section === "reviews" ? data.reviews.verified === true && data.reviews.items.length > 0
    : section === "faq" ? data.faqs.length > 0
    : section === "about" ? Boolean(data.audience || data.usp.length)
    : true;
  const sections = design.sections.filter(available);
  const nav = sections
    .filter((s) => s !== "contact")
    .map((s) => ({
      id: s,
      label:
        s === "services" ? design.words.servicesNav
        : s === "team" ? design.words.teamNav
        : s === "gallery" ? design.words.galleryNav
        : s === "about" ? "About"
        : s === "reviews" ? "Reviews"
        : "FAQ",
    }));

  const ctx: Ctx = { data, design, tone: true };

  return (
    <div
      className="bg-background text-foreground"
      data-brand-archetype={data.brandDNA?.archetype}
      data-brand-energy={data.brandDNA?.energy}
      data-image-treatment={data.designStrategy?.imageTreatment}
      style={industryCssVars(design)}
    >
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-[calc(var(--radius)-0.125rem)] bg-primary text-sm font-semibold text-primary-foreground">
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
             {data.phone ? <Button variant="outline" size="sm" asChild>
              <a href={`tel:${data.phone}`}><Phone className="size-4" /> Call</a>
             </Button> : null}
            <Button size="sm" asChild>
              <a href="#contact">{data.cta.primary}</a>
            </Button>
          </div>
          <button
            className="inline-flex size-10 items-center justify-center rounded-lg border border-border sm:hidden"
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

      {design.heroVariant === "full" ? (
        <HeroFull data={data} image={heroImage} />
      ) : design.heroVariant === "editorial" ? (
        <HeroEditorial data={data} image={heroImage} />
      ) : (
        <HeroSplit data={data} image={heroImage} />
      )}

      {/* Credibility strip */}
      {data.trust.length ? <div className="overflow-hidden border-y border-border bg-secondary/50 py-4">
        <div className="marquee-track gap-12 px-6">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={dup === 1}>
               {data.trust.map((c) => (
                 <span key={c.label} className="flex items-center gap-2 whitespace-nowrap text-sm text-muted-foreground">
                   <ShieldCheck className="size-4 text-primary" /> {c.label}: {c.value}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div> : null}

      {sections.map((s, i) => sectionRenderers[s](ctx, i % 2 === 1))}

      {video ? (
        <Section id="video" className="bg-secondary/60">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Eyebrow>Watch</Eyebrow>
              <h2 className="text-3xl sm:text-4xl">See us in action</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Straight from the official {data.name} YouTube channel.
              </p>
              <a
                href={video.href}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline underline-offset-4"
              >
                Watch on YouTube <ArrowRight className="size-3.5" />
              </a>
            </div>
            <iframe
              title={`${data.name} on YouTube`}
              src={video.src}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
              className="aspect-video w-full rounded-[calc(var(--radius)+0.75rem)] border border-border bg-card"
            />
          </div>
        </Section>
      ) : null}

      {data.social.length ? (
        <Section className="py-14">
          <div className="flex flex-col items-start justify-between gap-5 rounded-[calc(var(--radius)+0.75rem)] border border-border bg-card p-8 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl">Follow us</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">Latest work, offers and updates from our official channels.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.social.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      <footer className="border-t border-border px-5 py-14 sm:px-8">
        <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-4">
          <div>
            <span className="flex size-9 items-center justify-center rounded-[calc(var(--radius)-0.125rem)] bg-primary text-sm font-semibold text-primary-foreground">{data.logoMark}</span>
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
            <h3 className="text-sm font-semibold">{design.words.servicesNav}</h3>
            <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
              {data.services.slice(0, 5).map((s) => <li key={s.id}><a className="hover:text-foreground" href="#services">{s.name}</a></li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Official channels</h3>
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
      {data.phone || data.whatsapp ? <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-50 flex flex-col gap-3">
        {data.whatsapp ? <a
          href={`https://wa.me/${data.whatsapp}`}
          aria-label="Chat on WhatsApp"
          className="flex size-13 items-center justify-center rounded-full bg-success text-success-foreground shadow-[var(--shadow-lift)] transition-transform hover:scale-105"
        >
          <MessageCircle className="size-5" />
        </a> : null}
        {data.phone ? <a
          href={`tel:${data.phone}`}
          aria-label={`Call ${data.name}`}
          className="flex size-13 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-lift)] transition-transform hover:scale-105 sm:hidden"
        >
          <Phone className="size-5" />
        </a> : null}
      </div> : null}
    </div>
  );
}
