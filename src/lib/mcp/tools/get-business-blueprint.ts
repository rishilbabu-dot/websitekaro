import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getBusiness } from "@/features/businesses";

export default defineTool({
  name: "get_business_blueprint",
  title: "Get a business blueprint",
  description:
    "Return the full Business Blueprint (services, team, hours, reviews, FAQs, SEO copy) for one sample business, addressed by its slug from list_sample_businesses.",
  inputSchema: {
    slug: z.string().trim().min(1).describe("Business slug, e.g. smilecraft-dental-bandra."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const business = getBusiness(slug);
    if (!business) throw new ToolError(`No business found for slug "${slug}".`);
    return {
      content: [{ type: "text", text: JSON.stringify(business, null, 2) }],
      structuredContent: { business },
    };
  },
});