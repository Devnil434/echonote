import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function Shimmer({ className }: Props) {
  return (
    <div className={cn("shimmer rounded-md", className)} />
  );
}
