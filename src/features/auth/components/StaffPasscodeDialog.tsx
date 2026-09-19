import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../useAuth";

/** Hidden staff entry. The passcode entered decides whether Admin or Super
 * Admin is granted. Replace the passcodes with real auth later. */
export function StaffPasscodeDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { unlockWithPasscode } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) { setCode(""); setError(false); } }}>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> Enter Staff Passcode</DialogTitle>
          <DialogDescription>Restricted WebsiteKaro control room access.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const granted = unlockWithPasscode(code);
            if (granted) {
              onOpenChange(false);
              setCode("");
              toast.success(granted === "super-admin" ? "Super Admin unlocked" : "Admin unlocked");
              navigate({ to: "/admin" });
            } else {
              setError(true);
            }
          }}
        >
          <Input
            type="password"
            autoFocus
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(false); }}
            placeholder="Passcode"
            aria-invalid={error}
            className="h-11"
          />
          {error ? <p className="text-xs text-destructive">That passcode is not recognised.</p> : null}
          <Button type="submit" className="h-11">Unlock</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
