import { MeetingCardSkeleton } from "@/components/shared/LoadingSkeleton";

export default function DashboardLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1.5">
          <div className="h-7 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="h-9 w-32 bg-slate-200 rounded animate-pulse" />
      </div>

      {/* Search skeleton */}
      <div className="h-10 w-64 bg-slate-200 rounded animate-pulse mb-6" />

      {/* Card grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <MeetingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
