import { Shimmer } from "@/components/shared/Shimmer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function MeetingCardSkeleton() {
  return (
    <Card className="h-full">
      <CardContent className="p-4 pb-2 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Shimmer className="h-4 w-3/4" />
          <Shimmer className="h-5 w-16 rounded-full" />
        </div>
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-5/6" />
        <Shimmer className="h-3 w-2/3" />
      </CardContent>
      <CardFooter className="px-4 py-2.5 border-t border-border/50">
        <Shimmer className="h-3 w-24" />
      </CardFooter>
    </Card>
  );
}

export function MeetingDetailSkeleton() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <Shimmer className="h-7 w-2/3" />
        <Shimmer className="h-4 w-1/3" />
      </div>
      <div className="space-y-3">
        <Shimmer className="h-32 w-full rounded-xl" />
        <Shimmer className="h-24 w-full rounded-xl" />
        <Shimmer className="h-20 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function ActionItemSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Shimmer className="h-4 w-4 rounded mt-0.5 shrink-0" />
          <div className="flex-1 space-y-2">
            <Shimmer className="h-4 w-full" />
            <div className="flex gap-3">
              <Shimmer className="h-3 w-20" />
              <Shimmer className="h-3 w-24" />
              <Shimmer className="h-3 w-14" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsBarSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-3 sm:p-4 space-y-2">
          <Shimmer className="h-7 w-12" />
          <Shimmer className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}
