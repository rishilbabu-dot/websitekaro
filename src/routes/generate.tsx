import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Info } from "lucide-react";
import { toast } from "sonner";
import { buildBlueprint, getIndustryDesign } from "@/features/industries";
import { generateBlueprint, generationModeInfo, getGenerationMode, type GenerationMode, type GenerationOutcome } from "@/features/ai";
import { GenerationComplete, GenerationProgress } from "@/features/website-generation/components/GenerationExperience";
import { BrandMark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { GoogleSignInDialog, recordGuestGeneration, readGuestQuota, useAuth } from "@/features/auth";

interface GenerateSearch {
  url: string;
  industry: string;
  name: string;
  mode: GenerationMode;
}

export const Route = createFileRoute("/generate")({
  validateSearch: (search: Record<string, unknown>): GenerateSearch => ({
    url: typeof search["url"] === "string" ? search["url"] : "",
    industry: typeof search["industry"] === "string" ? search["industry"] : "dental",
    name: typeof search["name"] === "string" ? search["name"] : "",
    mode: getGenerationMode(typeof search["mode"] === "string" ? search["mode"] : undefined),
  }),
  head: () => ({
    meta: [
      { title: "Generating your website — WebsiteKaro" },
      { name: "description", content: "Watch WebsiteKaro's AI digital agency research your business and build a premium, launch-ready website in under a minute." },
      { property: "og:title", content: "Generating your website — WebsiteKaro" },
      { property: "og:description", content: "Watch WebsiteKaro's AI digital agency research your business and build a premium, launch-ready website in under a minute." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: GeneratePage,
});

const nameFromUrl = (url: string, fallback: string) => {
  const cleaned = url.trim();
  if (!cleaned) return fallback;
  if (!/^https?:\/\//i.test(cleaned) && !cleaned.includes("/")) return cleaned;
  const last = cleaned.split("?")[0]!.split("/").filter(Boolean).pop() ?? "";
  const words = decodeURIComponent(last).replace(/[+_-]+/g, " ").trim();
  if (words.length < 3 || /^[a-z0-9]{6,}$/i.test(words.replace(/\s/g, ""))) return fallback;
  return words.replace(/\b\w/g, (c) => c.toUpperCase());
};

function GeneratePage() {
  const { url, industry, name, mode } = Route.useSearch();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [outcome, setOutcome] = useState<GenerationOutcome | null>(null);
  const requestedRef = useRef(false);
  const runGeneration = useServerFn(generateBlueprint);
  const { isGuest } = useAuth();
  const [blocked, setBlocked] = useState(false);
  const [signIn, setSignIn] = useState(false);
  const quotaRef = useRef(false);
  const blockedRef = useRef(false);

  // Guests get 3 generations per rolling 7 days; the counter lives in browser
  // storage behind the quota module so it can move server-side later.
  useEffect(() => {
    if (!isGuest || quotaRef.current) return;
    quotaRef.current = true;
    if (readGuestQuota().exhausted) { blockedRef.current = true; setBlocked(true); }
    else recordGuestGeneration();
  }, [isGuest]);

  const design = getIndustryDesign(industry);
  const businessName = name.trim() || nameFromUrl(url, `${design.label} Studio`);

  const draftBlueprint = useMemo(
    () => buildBlueprint({ name: businessName, city: "Mumbai", industry, sourceUrl: url }),
    [businessName, industry, url],
  );

  // Draft costs nothing and resolves locally. Standard/Deep go through the
  // credit-aware server function while the progress animation plays.
  useEffect(() => {
    if (mode === "draft" || requestedRef.current || blockedRef.current) return;
    requestedRef.current = true;
    let active = true;
    runGeneration({ data: { name: businessName, city: "Mumbai", industry, mode, sourceUrl: url } })
      .then((result) => { if (active) setOutcome(result); })
      .catch(() => { if (active) setOutcome(null); });
    return () => { active = false; };
  }, [businessName, industry, mode, url, runGeneration]);

  const blueprint = outcome?.blueprint ?? draftBlueprint;
  const notice = outcome?.notice;

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <BrandMark />
          <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Start over
          </Link>
        </div>
      </header>

      {blocked ? (
        <div className="mx-auto mt-20 w-full max-w-xl rounded-2xl border border-primary/25 bg-primary/5 p-8 text-center">
          <h1 className="text-2xl">You've used all 3 free website generations for this week</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Sign in with Google to continue editing your existing website or contact WebsiteKaro to launch your business online.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button onClick={() => setSignIn(true)}>Sign in with Google</Button>
            <Button variant="outline" asChild><Link to="/">Back to home</Link></Button>
          </div>
          <GoogleSignInDialog open={signIn} onOpenChange={setSignIn} onSignedIn={() => navigate({ to: "/owner" })} />
        </div>
      ) : done ? (
        <>
          {notice ? (
            <div className="mx-auto mt-6 flex w-full max-w-3xl items-start gap-2.5 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0" />
              <span>{notice}</span>
            </div>
          ) : outcome && !outcome.cached ? (
            <div className="mx-auto mt-6 w-full max-w-3xl rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-muted-foreground">
              Written with {generationModeInfo(outcome.mode).label} quality · {generationModeInfo(outcome.mode).costLabel}
              {outcome.usage ? ` · ~${outcome.usage.estimatedCredits} credits` : ""}
            </div>
          ) : outcome?.cached ? (
            <div className="mx-auto mt-6 w-full max-w-3xl rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-muted-foreground">
              Served from cache — this business was already generated, so no credits were used.
            </div>
          ) : null}
          <GenerationComplete data={blueprint} onPublish={() => setLaunch(true)} />
          <LaunchRequestDialog
            open={launch}
            onOpenChange={setLaunch}
            context={{
              name: "",
              phone: "",
              email: "",
              businessName: blueprint.name,
              businessType: blueprint.category,
              googleMapsUrl: url,
              generatedWebsiteId: blueprint.slug,
              generatedWebsiteUrl: typeof window === "undefined" ? `/site/${blueprint.slug}` : `${window.location.origin}/site/${blueprint.slug}`,
              socialSourcesUsed: ["Google Maps"],
            }}
            onContinue={() => navigate({ to: "/" })}
          />
        </>
      ) : (
        <GenerationProgress businessName={businessName} onDone={() => setDone(true)} />
      )}
    </div>
  );
}