import { defineTool } from "@lovable.dev/mcp-js";
import { listBusinesses } from "@/features/businesses";

export default defineTool({
  name: "list_sample_businesses",
  title: "List sample businesses",
  description:
    "List the demo businesses that already have a generated WebsiteKaro website, with their slug, industry, city and publish status.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const items = listBusinesses().map((b) => ({
      slug: b.slug,
      name: b.name,
      industry: b.industry,
      category: b.category,
      city: b.city,
      status: b.status,
      rating: b.reviews.rating,
      previewPath: `/site/${b.slug}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { count: items.length, businesses: items },
    };
  },
});