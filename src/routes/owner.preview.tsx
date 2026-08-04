import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { businesses } from "@/features/businesses";
import { DevicePreview } from "@/features/website-generation";

export const Route = createFileRoute("/owner/preview")({ component: OwnerPreview });

function OwnerPreview() {
  const b = businesses[0]!;
  return (
    <>
      <PageHeader
        title="Website preview"
        subtitle="See exactly how your website looks on desktop, tablet and mobile before it goes live."
        actions={
          <Button variant="outline" asChild>
            <Link to="/preview/$slug" params={{ slug: b.slug }} target="_blank">
              <ExternalLink className="size-4" /> Open full preview
            </Link>
          </Button>
        }
      />
      <DevicePreview data={b} />
    </>
  );
}