import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/shared/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "EchoNote — AI Meeting Notes",
    template: "%s | EchoNote",
  },
  description:
    "Upload a meeting recording and get AI-generated summaries, action items, and automated deadline reminders — in seconds.",
  keywords: [
    "AI meeting notes", "meeting summarizer", "action items", "Groq Whisper",
    "Gemini Flash", "meeting assistant", "transcript AI",
  ],
  authors: [{ name: "Nilanjan Saha", url: "https://github.com/Devnil434" }],
  openGraph: {
    title: "EchoNote — AI Meeting Notes",
    description: "Transform meeting recordings into structured summaries, action items, and reminders automatically.",
    type: "website",
    url: "https://echonote.vercel.app",
    siteName: "EchoNote",
  },
  twitter: {
    card: "summary_large_image",
    title: "EchoNote — AI Meeting Notes",
    description: "Transform meeting recordings into structured summaries, action items, and reminders automatically.",
    creator: "@yourtwitter",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
