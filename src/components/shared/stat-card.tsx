import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Sparkline } from "./sparkline";

export function StatCard({
  label,
  value,
  hint,
  delta,
  trend,
}: {
  label: string;
  value: string;
  hint?: string;
  delta?: string;
  trend?: number[];
}) {
  const up = delta?.startsWith("-") === false;
  return (
    <div className="group rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
        {delta && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium ${
              up ? "bg-success/12 text-success" : "bg-destructive/10 text-destructive"
            }`}
          >
            {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {delta.replace("-", "")}
          </span>
        )}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      {trend && <Sparkline points={trend} />}
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
