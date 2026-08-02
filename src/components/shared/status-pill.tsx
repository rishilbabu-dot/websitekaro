const TONES: Record<string, string> = {
  published: "bg-success/12 text-success",
  generated: "bg-primary/10 text-primary",
  "in-review": "bg-accent text-accent-foreground",
  draft: "bg-secondary text-muted-foreground",
  suspended: "bg-destructive/10 text-destructive",
};

const LABELS: Record<string, string> = {
  published: "Published",
  generated: "Generated",
  "in-review": "In review",
  draft: "Draft",
  suspended: "Suspended",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${TONES[status] ?? TONES['draft']}`}>
      {LABELS[status] ?? status}
    </span>
  );
}
