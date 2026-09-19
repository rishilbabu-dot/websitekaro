/**
 * Optional "tell us more about your brand" inputs. Collapsed by default so the
 * single primary action — paste your Google Maps link — stays the hero.
 */
import { useState } from "react";
import { ChevronDown, Instagram, Facebook, Youtube, Twitter, Linkedin, Globe, CalendarCheck, MessageCircle, Link2, Music2, Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import { brandLinkFields, normaliseLink, type BrandLinkDraft } from "../brand-links";
import type { SourceKind } from "@/features/businesses";

const ICONS: Partial<Record<SourceKind, typeof Instagram>> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  x: Twitter,
  linkedin: Linkedin,
  tiktok: Music2,
  pinterest: Image,
  website: Globe,
  booking: CalendarCheck,
  whatsapp: MessageCircle,
  other: Link2,
};

export function BrandLinksSection({
  value,
  onChange,
}: {
  value: BrandLinkDraft;
  onChange: (next: BrandLinkDraft) => void;
}) {
  const [open, setOpen] = useState(false);
  const filled = Object.values(value).filter((v) => (v ?? "").trim().length > 0).length;

  return (
    <div className="mt-4 max-w-xl">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left text-sm transition-colors hover:bg-secondary/50"
      >
        <span>
          <span className="font-medium">Tell us more about your brand — optional</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {filled ? `${filled} link${filled > 1 ? "s" : ""} added` : "The more you tell us, the more personalised your website can be."}
          </span>
        </span>
        <ChevronDown className={`size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="rise mt-3 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2">
          {brandLinkFields.map((field) => {
            const Icon = ICONS[field.kind] ?? Link2;
            const raw = value[field.kind] ?? "";
            const invalid = raw.trim().length > 0 && normaliseLink(field.kind, raw) === null;
            return (
              <div key={field.kind} className="grid gap-1.5">
                <label htmlFor={`brand-${field.kind}`} className="flex items-center gap-2 text-xs font-medium">
                  <Icon className="size-3.5 text-primary" /> {field.label}
                </label>
                <Input
                  id={`brand-${field.kind}`}
                  inputMode="url"
                  autoComplete="off"
                  value={raw}
                  placeholder={field.placeholder}
                  aria-invalid={invalid}
                  onChange={(e) => onChange({ ...value, [field.kind]: e.target.value })}
                  className={`h-10 text-sm ${invalid ? "border-destructive" : ""}`}
                />
                {invalid ? (
                  <p className="text-[11px] text-destructive">That doesn't look like a valid link — we'll skip it.</p>
                ) : field.hint ? (
                  <p className="text-[11px] text-muted-foreground">{field.hint}</p>
                ) : null}
              </div>
            );
          })}
          <p className="text-[11px] leading-relaxed text-muted-foreground sm:col-span-2">
            We only ever link to channels you give us — we never guess that a profile belongs to your business.
          </p>
        </div>
      ) : null}
    </div>
  );
}
