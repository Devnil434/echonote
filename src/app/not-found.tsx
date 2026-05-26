import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
      <p className="text-6xl font-bold text-slate-200 mb-4">404</p>
      <h1 className="text-xl font-semibold text-slate-800 mb-2">Page not found</h1>
      <p className="text-slate-500 text-sm mb-6">
        The page you're looking for doesn't exist or was moved.
      </p>
      <Button asChild>
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
