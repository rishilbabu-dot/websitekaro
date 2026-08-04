import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOwnerBusiness } from "@/features/owner";
import { useAuth } from "@/features/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/owner/settings")({ component: OwnerSettings });

function OwnerSettings() {
  const { business: b } = useOwnerBusiness();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <PageHeader title="Settings" subtitle="Your account, brand assets and social links." />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg">Account</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between"><dt className="text-muted-foreground">Signed in as</dt><dd>{user?.name ?? "Business owner"}</dd></div>
            <div className="flex items-center justify-between"><dt className="text-muted-foreground">Email</dt><dd>{user?.email ?? "—"}</dd></div>
            <div className="flex items-center justify-between"><dt className="text-muted-foreground">Business</dt><dd>{b.name}</dd></div>
          </dl>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => { signOut(); navigate({ to: "/" }); }}
          >
            <LogOut className="size-4" /> Sign out
          </Button>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg">Brand & social links</h2>
          <form
            className="mt-4 grid gap-3"
            onSubmit={(e) => { e.preventDefault(); toast.success("Settings saved"); }}
          >
            <label className="text-xs text-muted-foreground" htmlFor="logo">Logo URL</label>
            <Input id="logo" placeholder="https://…/logo.png" />
            <label className="text-xs text-muted-foreground" htmlFor="insta">Instagram</label>
            <Input id="insta" placeholder="https://instagram.com/yourbusiness" />
            <label className="text-xs text-muted-foreground" htmlFor="fb">Facebook</label>
            <Input id="fb" placeholder="https://facebook.com/yourbusiness" />
            <Button type="submit" className="mt-2 justify-self-start">Save changes</Button>
          </form>
        </section>
      </div>
    </>
  );
}