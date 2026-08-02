import { createFileRoute } from "@tanstack/react-router";
import { Upload } from "lucide-react";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import img from "@/assets/dental-hero.jpg";

export const Route = createFileRoute("/owner/gallery")({ component: GalleryEditor });

function GalleryEditor() {
  return (
    <>
      <PageHeader title="Gallery" subtitle="Clinic photos shown on the website. Landscape images at least 1600px wide work best." actions={<Button onClick={() => toast("Upload arrives with storage")}><Upload className="size-4" /> Upload photos</Button>} />
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <figure key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
            <img src={img} alt={`Clinic photo ${i + 1}`} loading="lazy" width={1600} height={1000} className="aspect-4/3 w-full object-cover" />
            <figcaption className="flex items-center justify-between px-4 py-3 text-xs text-muted-foreground">
              Photo {i + 1}
              <button className="text-destructive" onClick={() => toast.error("Photo removed")}>Remove</button>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
