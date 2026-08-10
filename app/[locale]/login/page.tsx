"use client";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Logo from "@/components/ui/logo";
// import { useLogin } from "@/hooks/mutations/useLogin";
import { Lock, Mail } from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const locale = useLocale();
  //   const { mutate: login, isPending, isError, error } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // login({ email, password });
  };

  //   const errorMessage =
  // (error as any)?.response?.data?.message ?? "Invalid credentials";

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg) px-4">
      <div className="w-full max-w-sm">
        <Logo className="mb-8" />

        <Card>
          <h1 className="text-xl font-bold text-(--text) mb-6">Sign in</h1>

          {/* Error */}
          {/* {isError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm mb-5">
              <AlertCircle size={15} className="flex-shrink-0" />
              {errorMessage}
            </div>
          )} */}

          <div className="space-y-4">
            <Input
              icon={
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)"
                />
              }
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <Input
              label="Password"
              icon={
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)"
                />
              }
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              hasVisibilityToggle
              visible={showPass}
              onVisibilityClick={() => setShowPass(!showPass)}
            />

            <Button
              onClick={handleSubmit}
              //   disabled={isPending || !email || !password}
            >
              Sign in
              {/* {isPending ? (
                <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )} */}
            </Button>
          </div>
        </Card>

        {/* Back to blog */}
        <p className="text-center font-mono text-xs text-(--muted) mt-6">
          <Link
            href={`/${locale}`}
            className="hover:text-(--text) transition-colors"
          >
            ← back to blog
          </Link>
        </p>
      </div>
    </div>
  );
}
