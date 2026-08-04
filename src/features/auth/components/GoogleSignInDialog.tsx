import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../useAuth";

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.2-2.2H12v4.1h6.6a5.7 5.7 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.4-5.2 3.4-8.6Z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3a7.2 7.2 0 0 1-10.7-3.8H1.4v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.4 14.3a7.1 7.1 0 0 1 0-4.6V6.6H1.4a12 12 0 0 0 0 10.8l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.4 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8Z" />
    </svg>
  );
}

/** Simulated Google sign-in. Swap the service call for a real provider later. */
export function GoogleSignInDialog({
  open,
  onOpenChange,
  onSignedIn,
  message,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignedIn?: () => void;
  message?: string;
}) {
  const { signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signInWithGoogle(email);
      toast.success("Signed in", { description: "Reconnected to your business workspace." });
      onOpenChange(false);
      onSignedIn?.();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Sign in to WebsiteKaro</DialogTitle>
          <DialogDescription>
            {message ?? "Continue with Google to manage the website we built for your business."}
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-3" onSubmit={submit}>
          <label htmlFor="wk-email" className="text-xs font-medium text-muted-foreground">Google account</label>
          <Input
            id="wk-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourbusiness.in"
            className="h-11"
          />
          <Button type="submit" size="lg" variant="outline" disabled={busy} className="h-11 justify-center gap-2.5">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <GoogleGlyph />}
            {busy ? "Connecting…" : "Continue with Google"}
          </Button>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            MVP preview: sign-in is simulated locally and reconnects you to your generated website.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}