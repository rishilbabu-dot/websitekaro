import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { businesses } from "@/features/businesses";
import { toast } from "sonner";

export const Route = createFileRoute("/owner/contact")({ component: ContactEditor });

function ContactEditor() {
  const b = businesses[0]!;
  return (
    <>
      <PageHeader title="Contact & hours" subtitle="Wrong hours cost more appointments than bad design. Keep these current." />
      <form className="grid max-w-3xl gap-6" onSubmit={(e) => { e.preventDefault(); toast.success("Details updated"); }}>
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg">Contact</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2"><label htmlFor="ph" className="text-sm font-medium">Phone</label><Input id="ph" defaultValue={b.phone} /></div>
            <div className="grid gap-2"><label htmlFor="wa" className="text-sm font-medium">WhatsApp</label><Input id="wa" defaultValue={b.whatsapp} /></div>
            <div className="grid gap-2"><label htmlFor="em" className="text-sm font-medium">Email</label><Input id="em" type="email" defaultValue={b.email} /></div>
            <div className="grid gap-2"><label htmlFor="ad" className="text-sm font-medium">Address</label><Input id="ad" defaultValue={b.address} /></div>
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg">Opening hours</h2>
          <div className="mt-5 grid gap-4">
            {b.hours.map((h, i) => (
              <div key={h.day} className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2"><label htmlFor={`d${i}`} className="text-sm font-medium">Days</label><Input id={`d${i}`} defaultValue={h.day} /></div>
                <div className="grid gap-2"><label htmlFor={`t${i}`} className="text-sm font-medium">Hours</label><Input id={`t${i}`} defaultValue={h.open} /></div>
              </div>
            ))}
          </div>
        </section>
        <Button type="submit" className="justify-self-start">Save details</Button>
      </form>
    </>
  );
}
