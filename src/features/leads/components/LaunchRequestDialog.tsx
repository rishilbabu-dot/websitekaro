/**
 * "Launch my website" lead capture.
 *
 * Clicking launch no longer publishes anything — it opens this form, saves the
 * request server-side and notifies the WebsiteKaro team.
 */
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitLaunchLead } from "../lead.functions";
import type { LaunchLeadInput } from "../lead.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context: LaunchLeadInput;
  onContinue?: () => void;
}

type Errors = Partial<Record<"name" | "phone" | "email" | "form", string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phonePattern = /^\+?[0-9][0-9\s\-()]{7,19}$/;

export function LaunchRequestDialog({ open, onOpenChange, context, onContinue }: Props) {
  const submit = useServerFn(submitLaunchLead);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const validate = (): boolean => {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Please enter your full name";
    if (!phonePattern.test(phone.trim())) next.phone = "Please enter a valid contact number";
    if (!emailPattern.test(email.trim())) next.email = "Please enter a valid email address";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy || !validate()) return;
    setBusy(true);
    try {
      const result = await submit({
        data: {
          ...context,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          userAgent: typeof navigator === "undefined" ? undefined : navigator.userAgent.slice(0, 400),
        },
      });
      if (result.ok) setDone(true);
      else setErrors({ form: result.message ?? "Something went wrong. Please try again." });
    } catch {
      setErrors({ form: "We couldn't complete the launch request right now. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!busy) onOpenChange(next); }}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-md">
        {done ? (
          <div className="py-2 text-center">
            <CheckCircle2 className="mx-auto size-10 text-success" />
            <DialogHeader className="mt-4">
              <DialogTitle className="text-center text-2xl">Thank you!</DialogTitle>
              <DialogDescription className="text-center">
                Your launch request has been received. We'll use the details you provided to complete your WebsiteKaro launch.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-5 rounded-xl border border-border bg-secondary/40 p-4 text-left text-sm">
              <p><span className="text-muted-foreground">Business:</span> {context.businessName ?? "—"}</p>
              {context.generatedWebsiteUrl ? (
                <p className="mt-1 break-all"><span className="text-muted-foreground">Website:</span> {context.generatedWebsiteUrl}</p>
              ) : null}
            </div>
            <Button className="mt-5 w-full" onClick={() => { onOpenChange(false); onContinue?.(); }}>
              Continue
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <DialogHeader>
              <DialogTitle className="text-2xl">Almost there!</DialogTitle>
              <DialogDescription>Tell us where to send your website launch details.</DialogDescription>
            </DialogHeader>

            <div className="mt-5 grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="lead-name">Full name *</Label>
                <Input id="lead-name" value={name} placeholder="Your name" autoComplete="name"
                  onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} />
                {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="lead-phone">Contact number *</Label>
                <Input id="lead-phone" value={phone} placeholder="+91 XXXXX XXXXX" type="tel" inputMode="tel"
                  autoComplete="tel" onChange={(e) => setPhone(e.target.value)} aria-invalid={!!errors.phone} />
                {errors.phone ? <p className="text-xs text-destructive">{errors.phone}</p> : null}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="lead-email">Email address *</Label>
                <Input id="lead-email" value={email} placeholder="you@example.com" type="email" inputMode="email"
                  autoComplete="email" onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} />
                {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
              </div>

              {context.businessName ? (
                <p className="rounded-lg bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
                  Launching <span className="font-medium text-foreground">{context.businessName}</span>
                </p>
              ) : null}

              {errors.form ? <p className="text-sm text-destructive">{errors.form}</p> : null}

              <p className="text-xs leading-relaxed text-muted-foreground">
                By submitting, you agree that WebsiteKaro may contact you regarding your website and launch.
              </p>

              <Button type="submit" size="lg" className="w-full" disabled={busy}>
                {busy ? <><Loader2 className="size-4 animate-spin" /> Sending…</> : "Submit launch request"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
