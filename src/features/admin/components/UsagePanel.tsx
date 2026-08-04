import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Coins, Database, Gauge, Sparkles } from "lucide-react";
import { getUsageSummary, generationModeInfo, type GenerationMode } from "@/features/ai";

const Metric = ({ icon: Icon, label, value, hint }: { icon: typeof Coins; label: string; value: string; hint: string }) => (
  <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      <Icon className="size-3.5" /> {label}
    </div>
    <p className="mt-3 text-3xl tracking-tight">{value}</p>
    <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
  </div>
);

export function UsagePanel() {
  const fetchUsage = useServerFn(getUsageSummary);
  const { data, isLoading } = useQuery({
    queryKey: ["usage-summary"],
    queryFn: () => fetchUsage(),
    refetchInterval: 30_000,
  });

  if (isLoading || !data) {
    return <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading usage…</div>;
  }

  const capPct = Math.min(100, Math.round((data.aiGenerationsToday / data.dailyCap) * 100));

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Sparkles} label="Generations today" value={String(data.generationsToday)} hint={`${data.aiGenerationsToday} used AI, the rest were free`} />
        <Metric icon={Coins} label="Est. credits today" value={data.estimatedCreditsToday.toFixed(3)} hint="Estimated from token usage" />
        <Metric icon={Database} label="Cache hit rate" value={`${data.cacheHitRate}%`} hint={`${data.cachedBlueprints} blueprints cached`} />
        <Metric icon={Gauge} label="Daily AI cap" value={`${data.aiGenerationsToday}/${data.dailyCap}`} hint="Extra requests fall back to free Draft" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
        <h2 className="text-lg">Spend by quality mode</h2>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${capPct}%` }} />
        </div>
        <ul className="mt-5 grid gap-3">
          {data.byMode.map((row) => {
            const info = generationModeInfo(row.mode as GenerationMode);
            return (
              <li key={row.mode} className="flex items-center justify-between gap-4 border-b border-border/60 pb-3 text-sm last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{info.label}</p>
                  <p className="text-xs text-muted-foreground">{info.costLabel}</p>
                </div>
                <div className="text-right">
                  <p>{row.count} generations</p>
                  <p className="text-xs text-muted-foreground">~{row.estimatedCredits} credits</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
        <h2 className="text-lg">Recent generations</h2>
        {data.recent.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No generations in the last 24 hours.</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {data.recent.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-4 border-b border-border/60 pb-3 text-sm last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{entry.business}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.industry} · {generationModeInfo(entry.mode as GenerationMode).label}
                    {entry.cached ? " · cached" : ""}
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>{new Date(entry.at).toLocaleTimeString()}</p>
                  <p>{entry.estimatedCredits ? `~${entry.estimatedCredits} credits` : "free"}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
