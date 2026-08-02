import { createFileRoute, notFound } from "@tanstack/react-router";
import { GeneratedSite } from "@/components/site/GeneratedSite";
import { getBusiness } from "@/data/businesses";

export const Route = createFileRoute("/site/$slug")({
  loader: ({ params }) => {
    const business = getBusiness(params.slug);
    if (!business) throw notFound();
    return { business };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Website unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const b = loaderData.business;
    return {
      meta: [
        { title: b.seo.title },
        { name: "description", content: b.seo.metaDescription },
        { name: "keywords", content: b.seo.keywords.join(", ") },
        { property: "og:title", content: b.seo.title },
        { property: "og:description", content: b.seo.metaDescription },
      ],
    };
  },
  component: SitePage,
});

function SitePage() {
  const { business } = Route.useLoaderData();
  return <GeneratedSite data={business} />;
}
