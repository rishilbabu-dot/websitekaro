import { createFileRoute, notFound } from "@tanstack/react-router";
import { GeneratedSite } from "@/features/website-generation";
import { getBusiness } from "@/features/businesses";

export const Route = createFileRoute("/site/$slug")({
  loader: ({ params }) => {
    const business = getBusiness(params.slug);
    if (!business) throw notFound();
    return { business };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
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
  return <GeneratedSite data={business} />;
}
