import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  Mic, Zap, CheckSquare2, Bell, ArrowRight, Code
} from "lucide-react";

const FEATURES = [
  {
    icon: Mic,
    title: "Upload & Transcribe",
    description:
      "Upload MP3, WAV, or M4A recordings up to 25MB. Groq Whisper converts audio to text at 200× realtime speed.",
    color: "text-blue-500",
    bg:    "bg-blue-500/10",
  },
  {
    icon: Zap,
    title: "AI Summarization",
    description:
      "Gemini Flash analyses your transcript and extracts a structured summary, key decisions, and topics.",
    color: "text-violet-500",
    bg:    "bg-violet-500/10",
  },
  {
    icon: CheckSquare2,
    title: "Action Item Extraction",
    description:
      "Every task, owner, and deadline is pulled from the conversation and stored in a searchable dashboard.",
    color: "text-emerald-500",
    bg:    "bg-emerald-500/10",
  },
  {
    icon: Bell,
    title: "Automated Reminders",
    description:
      "A daily cron agent scans upcoming deadlines and emails reminders before anything slips through the cracks.",
    color: "text-amber-500",
    bg:    "bg-amber-500/10",
  },
];

const STACK = [
  "Next.js 16", "TypeScript", "Supabase", "Groq Whisper",
  "Gemini Flash", "Tailwind CSS", "Vercel", "Nodemailer",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* ── Nav ──────────────────────────────────────────── */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-foreground">🎙️ EchoNote</span>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <a href="https://github.com/Devnil434/echonote" target="_blank" rel="noreferrer">
                <Code className="h-4 w-4 mr-2" /> GitHub
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Get Started</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <Badge variant="outline" className="mb-6 text-xs gap-1.5">
          <Zap className="h-3 w-3 text-amber-500" />
          Built with Groq Whisper + Gemini Flash
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-5">
          Turn meeting recordings into<br />
          <span className="text-primary">structured intelligence</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Upload a recording or paste a transcript. EchoNote generates AI summaries,
          extracts action items with deadlines, and sends you reminder emails —
          automatically.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/signup">
              Start for free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="https://github.com/Devnil434/echonote" target="_blank" rel="noreferrer">
              <Code className="h-4 w-4 mr-2" /> View source
            </a>
          </Button>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="bg-muted/40 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">
            Everything after the meeting, automated
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, description, color, bg }) => (
              <div key={title} className="bg-card border border-border/40 rounded-xl p-5 hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
                <div className={`${bg} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <h3 className="font-semibold text-card-foreground mb-1.5">{title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section className="py-16 max-w-3xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-foreground text-center mb-10">
          How it works
        </h2>
        <div className="space-y-6">
          {[
            { step: "01", title: "Upload your recording", desc: "Drag and drop an MP3, WAV, or M4A file — or paste a raw transcript directly." },
            { step: "02", title: "AI processes in seconds", desc: "Groq Whisper transcribes the audio. Gemini Flash extracts the summary, key decisions, and action items with deadlines." },
            { step: "03", title: "Review your dashboard", desc: "Search all your meetings. See summaries, key points, and a prioritised action item list with owner and deadline." },
            { step: "04", title: "Get reminded automatically", desc: "A daily cron scans upcoming deadlines and sends targeted email reminders before anything is missed." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-5">
              <div className="text-2xl font-black text-muted/60 dark:text-muted-foreground/20 w-10 shrink-0 mt-0.5 select-none">
                {step}
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stack ─────────────────────────────────────────── */}
      <section className="bg-muted/40 py-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Built with
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {STACK.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-16 text-center px-6">
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Ready to reclaim your meetings?
        </h2>
        <p className="text-muted-foreground mb-6 text-sm">Free to use. No credit card required.</p>
        <Button asChild size="lg">
          <Link href="/signup">Get started for free →</Link>
        </Button>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        Built by{" "}
        <a
          href="https://github.com/Devnil434"
          className="hover:text-foreground underline underline-offset-2 transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          Nilanjan Saha
        </a>{" "}
        · Open source on{" "}
        <a
          href="https://github.com/Devnil434/echonote"
          className="hover:text-foreground underline underline-offset-2 transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
