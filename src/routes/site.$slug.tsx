import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GeneratedSite, loadPreviewBlueprint } from "@/features/website-generation";
import type { BusinessBlueprint } from "@/features/businesses";
import { getBusiness } from "@/features/businesses";

export const Route = createFileRoute("/site/$slug")({
  // A freshly generated site is not in the business service yet, so the
  // loader may legitimately return nothing and the component falls back to the
  // locally stored blueprint.
  loader: ({ params }) => ({ business: getBusiness(params.slug) ?? null }),
  head: ({ params, loaderData }) => {
    if (!loaderData?.business) {
      return { meta: [{ title: "Website unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const b = loaderData.business;
    const path = `/site/${params.slug}`;
    return {
      meta: [
        { title: b.seo.title },
        { name: "description", content: b.seo.metaDescription },
        { name: "keywords", content: b.seo.keywords.join(", ") },
        { property: "og:title", content: b.seo.title },
        { property: "og:description", content: b.seo.metaDescription },
        { property: "og:url", content: path },
      ],
      links: [{ rel: "canonical", href: path }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": b.industry === "dental" ? "Dentist" : "LocalBusiness",
                name: b.name,
                description: b.description,
                telephone: b.phone,
                email: b.email,
                address: {
                  "@type": "PostalAddress",
                  streetAddress: b.address,
                  addressLocality: b.city,
                  addressCountry: "IN",
                },
                openingHours: b.hours.map((h) => `${h.day} ${h.open}`),
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: b.reviews.rating,
                  reviewCount: b.reviews.count,
                },
              },
              {
                "@type": "FAQPage",
                mainEntity: b.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.question,
                  acceptedAnswer: { "@type": "Answer", text: f.answer },
                })),
              },
            ],
          }),
        },
      ],
    };
  },
  component: SitePage,
});

function SitePage() {
  const { business } = Route.useLoaderData();
  const { slug } = Route.useParams();
  const [local, setLocal] = useState<BusinessBlueprint | null>(null);
  useEffect(() => { if (!business) setLocal(loadPreviewBlueprint(slug) ?? null); }, [business, slug]);

  const data = business ?? local;
  if (!data) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-2xl">This preview isn't available</h1>
          <p className="mt-3 text-sm text-muted-foreground">Generate the website again to open its preview.</p>
        </div>
      </div>
    );
  }
  return <GeneratedSite data={data} />;
}
