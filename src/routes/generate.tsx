import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { buildBlueprint, getIndustryDesign } from "@/features/industries";
import { GenerationComplete, GenerationProgress } from "@/features/website-generation/components/GenerationExperience";

interface GenerateSearch {
  url: string;
  industry: string;
  name: string;
}

export const Route = createFileRoute("/generate")({
  validateSearch: (search: Record<string, unknown>): GenerateSearch => ({
    url: typeof search.url === "string" ? search.url : "",
    industry: typeof search.industry === "string" ? search.industry : "dental",
    name: typeof search.name === "string" ? search.name : "",
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
  const { url, industry, name } = Route.useSearch();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  const design = getIndustryDesign(industry);
  const businessName = name.trim() || nameFromUrl(url, `${design.label} Studio`);

  const blueprint = useMemo(
    () => buildBlueprint({ name: businessName, city: "Mumbai", industry, sourceUrl: url }),
    [businessName, industry, url],
  );

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="size-4" /></span>
            <span className="text-sm font-semibold tracking-tight">WebsiteKaro</span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Start over
          </Link>
        </div>
      </header>

      {done ? (
        <GenerationComplete
          data={blueprint}
          onPublish={() => {
            toast.success("Launch requested", { description: "Our team will confirm your domain and go live." });
            navigate({ to: "/owner" });
          }}
        />
      ) : (
        <GenerationProgress businessName={businessName} onDone={() => setDone(true)} />
      )}
    </div>
  );
}