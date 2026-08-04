import { defineMcp, type AnyToolDefinition } from "@lovable.dev/mcp-js";
import listIndustriesTool from "./tools/list-industries";
import listSampleBusinessesTool from "./tools/list-sample-businesses";
import getBusinessBlueprintTool from "./tools/get-business-blueprint";
import generateWebsiteBlueprintTool from "./tools/generate-website-blueprint";

export default defineMcp({
  name: "website-builder-pro",
  title: "Website Builder Pro",
  version: "0.1.0",
  instructions:
    "Tools for WebsiteKaro, an AI digital agency that generates premium local-business websites. Use list_industries for supported verticals and their design systems, list_sample_businesses and get_business_blueprint for demo sites, and generate_website_blueprint to produce a new Business Blueprint plus its preview URL.",
  tools: [
    listIndustriesTool,
    listSampleBusinessesTool,
    getBusinessBlueprintTool,
    generateWebsiteBlueprintTool,
  ] as unknown as AnyToolDefinition[],
});