import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          🎙️ EchoNote
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          Upload a meeting recording. Get AI summaries, action items, and reminders — automatically.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/signup">Get Started Free</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
