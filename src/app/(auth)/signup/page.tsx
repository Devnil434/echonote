"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");

  async function handleSignup() {
    setLoading(true);
    setError("");

    const redirectTo = typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : "https://echonote-three.vercel.app/auth/callback";

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  async function handleResend() {
    setResending(true);
    setResendError("");
    setResendSuccess(false);

    const redirectTo = typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : "https://echonote-three.vercel.app/auth/callback";

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setResendError(error.message);
    } else {
      setResendSuccess(true);
    }
    setResending(false);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 transition-colors duration-300">
        <Card className="w-full max-w-sm text-center p-6 space-y-4 border-border/40 shadow-xl shadow-primary/5">
          <div>
            <p className="text-2xl mb-2">📬</p>
            <h2 className="font-semibold text-lg mb-1 text-foreground">Check your email</h2>
            <p className="text-muted-foreground text-sm">
              We sent a confirmation link to <strong>{email}</strong>
            </p>
          </div>
          
          <div className="pt-4 border-t border-border/40 space-y-2">
            <p className="text-xs text-muted-foreground">
              Didn't receive the email?
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs" 
              onClick={handleResend} 
              disabled={resending}
            >
              {resending ? "Sending..." : "Resend confirmation email"}
            </Button>
            {resendSuccess && (
              <p className="text-xs text-emerald-500 mt-2">New confirmation link sent!</p>
            )}
            {resendError && (
              <p className="text-xs text-destructive mt-2">{resendError}</p>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 transition-colors duration-300">
      <Card className="w-full max-w-sm border-border/40 shadow-xl shadow-primary/5">
        <CardHeader>
          <CardTitle className="text-foreground">Create your account</CardTitle>
          <CardDescription>Start capturing meeting intelligence</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button className="w-full" onClick={handleSignup} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
