interface Stats {
  total: number;
  done: number;
  processing: number;
  openActions: number;
}

const ITEMS = [
  { key: "total"       as const, label: "Total Meetings",    colorClass: "text-foreground"                             },
  { key: "done"        as const, label: "Processed",         colorClass: "text-emerald-600 dark:text-emerald-400"      },
  { key: "processing"  as const, label: "Processing",        colorClass: "text-primary"                                },
  { key: "openActions" as const, label: "Open Action Items", colorClass: "text-amber-600 dark:text-amber-400"          },
];

export function StatsBar({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {ITEMS.map(({ key, label, colorClass }) => (
        <div
          key={key}
          className="bg-card border border-border rounded-xl p-3 sm:p-4 transition-colors"
        >
          <p className={`text-xl sm:text-2xl font-bold ${colorClass}`}>
            {stats[key]}
          </p>
          <p className="body-sm mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}
