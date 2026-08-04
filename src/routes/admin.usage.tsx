import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared";
import { UsagePanel } from "@/features/admin/components/UsagePanel";

export const Route = createFileRoute("/admin/usage")({
  head: () => ({
    meta: [
      { title: "Usage & costs — WebsiteKaro Admin" },
      { name: "description", content: "Track AI generation volume, estimated credit spend, cache efficiency and daily limits across every WebsiteKaro website build." },
      { property: "og:title", content: "Usage & costs — WebsiteKaro Admin" },
      { property: "og:description", content: "Track AI generation volume, estimated credit spend and cache efficiency across every WebsiteKaro website build." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UsagePage,
});

function UsagePage() {
  return (
    <>
      <PageHeader title="Usage & costs" subtitle="Draft generations are free. Standard and Deep call the AI gateway — cached results and daily caps keep spend predictable." />
      <UsagePanel />
    </>
  );
}
