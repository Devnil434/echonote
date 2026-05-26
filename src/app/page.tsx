import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    bg:    "bg-blue-50",
  },
  {
    icon: Zap,
    title: "AI Summarization",
    description:
      "Gemini Flash analyses your transcript and extracts a structured summary, key decisions, and topics.",
    color: "text-violet-500",
    bg:    "bg-violet-50",
  },
  {
    icon: CheckSquare2,
    title: "Action Item Extraction",
    description:
      "Every task, owner, and deadline is pulled from the conversation and stored in a searchable dashboard.",
    color: "text-emerald-500",
    bg:    "bg-emerald-50",
  },
  {
    icon: Bell,
    title: "Automated Reminders",
    description:
      "A daily cron agent scans upcoming deadlines and emails reminders before anything slips through the cracks.",
    color: "text-amber-500",
    bg:    "bg-amber-50",
  },
];

const STACK = [
  "Next.js 14", "TypeScript", "Supabase", "Groq Whisper",
  "Gemini Flash", "Tailwind CSS", "Vercel", "Nodemailer",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Nav ──────────────────────────────────────────── */}
      <nav className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-slate-900">🎙️ EchoNote</span>
          <div className="flex items-center gap-3">
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
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <Badge variant="outline" className="mb-6 text-xs gap-1.5">
          <Zap className="h-3 w-3 text-amber-500" />
          Built with Groq Whisper + Gemini Flash
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-5">
          Turn meeting recordings into<br />
          <span className="text-blue-600">structured intelligence</span>
        </h1>
        <p className="text-lg text-slate-500 mb-8 max-w-2xl mx-auto leading-relaxed">
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
      <section className="bg-slate-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">
            Everything after the meeting, automated
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, description, color, bg }) => (
              <div key={title} className="bg-white border rounded-xl p-5">
                <div className={`${bg} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1.5">{title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section className="py-16 max-w-3xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">
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
              <div className="text-2xl font-black text-slate-100 w-10 shrink-0 mt-0.5">
                {step}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stack ─────────────────────────────────────────── */}
      <section className="bg-slate-50 py-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
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
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Ready to reclaim your meetings?
        </h2>
        <p className="text-slate-500 mb-6 text-sm">Free to use. No credit card required.</p>
        <Button asChild size="lg">
          <Link href="/signup">Get started for free →</Link>
        </Button>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t py-6 text-center text-xs text-slate-400">
        Built by{" "}
        <a
          href="https://github.com/Devnil434"
          className="hover:text-slate-600 underline underline-offset-2"
          target="_blank"
          rel="noreferrer"
        >
          Nilanjan Saha
        </a>{" "}
        · Open source on{" "}
        <a
          href="https://github.com/Devnil434/echonote"
          className="hover:text-slate-600 underline underline-offset-2"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
