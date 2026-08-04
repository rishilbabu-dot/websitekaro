import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { buildBlueprint, industryMap } from "@/features/industries";

export default defineTool({
  name: "generate_website_blueprint",
  title: "Generate a website blueprint",
  description:
    "Run WebsiteKaro's generator for a business name, city and industry, and return the Business Blueprint the website is rendered from, plus the in-app preview URL.",
  inputSchema: {
    name: z.string().trim().min(1).describe("Business name, e.g. Aurora Banquets."),
    city: z.string().trim().min(1).describe("City, e.g. Mumbai.").default("Mumbai"),
    industry: z
      .string()
      .trim()
      .min(1)
      .describe("Industry id from list_industries, e.g. dental or banquet."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ name, city, industry }) => {
    if (!industryMap[industry]) {
      throw new ToolError(
        `Unknown industry "${industry}". Call list_industries for the supported ids.`,
      );
    }
    const blueprint = buildBlueprint({ name, city, industry });
    const previewUrl = `/generate?url=${encodeURIComponent(name)}&industry=${encodeURIComponent(industry)}`;
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ previewUrl, blueprint }, null, 2),
        },
      ],
      structuredContent: { previewUrl, blueprint },
    };
  },
});