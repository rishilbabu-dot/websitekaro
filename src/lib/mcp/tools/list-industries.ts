import { defineTool } from "@lovable.dev/mcp-js";
import { industryDesigns } from "@/features/industries";

export default defineTool({
  name: "list_industries",
  title: "List supported industries",
  description:
    "List every business vertical WebsiteKaro can generate a website for, with the design system (palette, fonts, hero style, section order) assigned to each one.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const items = industryDesigns.map((d) => ({
      id: d.id,
      label: d.label,
      category: d.category,
      heroVariant: d.heroVariant,
      sections: d.sections,
      displayFont: d.theme.displayFont,
      bodyFont: d.theme.bodyFont ?? d.theme.displayFont,
      primaryColor: d.theme.primary,
      accentColor: d.theme.accent,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { count: items.length, industries: items },
    };
  },
});