import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/websitekaro-logo.png";
import { SuperAdminPasscodeDialog } from "@/features/auth";

const CLICKS_REQUIRED = 5;
const WINDOW_MS = 5000;

/**
 * WebsiteKaro logo, wordmark and tagline.
 * Five clicks within five seconds opens the hidden Super Admin passcode gate.
 */
export function BrandMark({
  to = "/",
  tagline = true,
  size = "md",
  subtitle,
}: {
  to?: string;
  tagline?: boolean;
  size?: "sm" | "md";
  subtitle?: string;
}) {
  const clicks = useRef<number[]>([]);
  const [open, setOpen] = useState(false);

  const registerClick = () => {
    const now = Date.now();
    clicks.current = [...clicks.current.filter((t) => now - t < WINDOW_MS), now];
    if (clicks.current.length >= CLICKS_REQUIRED) {
      clicks.current = [];
      setOpen(true);
    }
  };

  const box = size === "sm" ? "size-8" : "size-9";

  return (
    <>
      <Link to={to} onClick={registerClick} className="group flex items-center gap-2.5">
        <span
          className={`${box} flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary/70 p-1 ring-1 ring-border transition-all duration-500 group-hover:-rotate-6 group-hover:scale-105 group-hover:ring-primary/40`}
        >
          <img
            src={logo}
            alt="WebsiteKaro logo"
            width={512}
            height={512}
            loading="lazy"
            className="size-full object-contain transition-transform duration-700 group-hover:scale-110 motion-safe:animate-[rise_0.8s_ease-out]"
          />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-sm font-semibold tracking-tight">WebsiteKaro</span>
          {tagline ? (
            <span className="block truncate text-[10px] text-muted-foreground transition-colors group-hover:text-primary">
              {subtitle ?? "Your Professional Website. Ready Before You Pay."}
            </span>
          ) : null}
        </span>
      </Link>
      <SuperAdminPasscodeDialog open={open} onOpenChange={setOpen} />
    </>
  );
}