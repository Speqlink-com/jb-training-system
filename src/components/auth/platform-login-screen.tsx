"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { DEMO_ACCOUNTS } from "@/lib/local-platform";

function requestedDestination() {
  if (typeof window === "undefined") return "/dashboard";
  const requestedPath = new URLSearchParams(window.location.search).get("next");
  return requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
    ? requestedPath
    : "/dashboard";
}

export function PlatformLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(requestedDestination());
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      router.replace(requestedDestination());
      return;
    }

    setError(result.error || "We could not sign you in. Check your details and try again.");
    setIsSubmitting(false);
  };

  const isBusy = isLoading || isSubmitting;

  return (
    <main className="grid min-h-dvh bg-white lg:grid-cols-[minmax(390px,0.86fr)_minmax(520px,1.14fr)]">
      <section className="relative isolate flex min-h-[300px] overflow-hidden bg-[#ead9dd] px-7 py-8 sm:min-h-[360px] sm:px-12 sm:py-11 lg:min-h-dvh lg:px-[clamp(3rem,6vw,8rem)] lg:py-[clamp(3rem,7vh,6rem)]">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(145deg,#f7eef0_0%,#e4cfd4_46%,#c9abb3_100%)]" />
        <div className="absolute -left-24 bottom-[-12rem] -z-10 h-[34rem] w-[34rem] rounded-full bg-[#9b1b36]/10 blur-3xl" />
        <div className="absolute right-[-10rem] top-[-12rem] -z-10 h-[30rem] w-[30rem] rounded-full bg-white/45 blur-3xl" />

        <div className="flex w-full max-w-[660px] flex-col">
          <div className="flex items-center gap-5">
            <div className="grid h-[68px] w-[132px] shrink-0 place-items-center rounded-[18px] bg-white px-3 shadow-[0_14px_28px_rgba(74,28,39,0.14),0_2px_5px_rgba(15,23,42,0.08)] sm:h-[78px] sm:w-[154px]">
              <Image src="/jubilee-logo.png" alt="Jubilee Insurance" width={132} height={132} className="h-auto w-full" priority />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-600 sm:text-xs">
              Workforce intelligence
            </p>
          </div>

          <div className="mt-12 sm:mt-16 lg:my-auto lg:mt-20">
            <h1 className="max-w-[620px] text-[clamp(3.25rem,7vw,7rem)] font-bold leading-[0.9] tracking-[-0.065em] text-[#171d25]">
              Jubilee
              <span className="block">Learning Hub</span>
            </h1>
            <p className="mt-7 max-w-[520px] text-base leading-7 text-slate-700 sm:text-xl sm:leading-8 lg:mt-10">
              Training, performance and compliance—connected to the people who lead and grow your workforce.
            </p>
          </div>

          <div className="mt-10 hidden items-center gap-3 text-xs font-medium text-slate-600 lg:flex">
            <span className="h-2 w-2 rounded-full bg-[#9b1b36]" />
            Secure, role-based operations workspace
          </div>
        </div>
      </section>

      <section className="relative flex items-center justify-center px-6 py-12 sm:px-12 lg:min-h-dvh lg:px-[clamp(4rem,10vw,12rem)]">
        <div className="w-full max-w-[520px]">
          <div className="mb-10 sm:mb-12">
            <div className="mb-7 flex items-center justify-between gap-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 sm:text-xs">
                Welcome back
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span className="h-2 w-2 rounded-full bg-[#9b1b36] ring-4 ring-[#9b1b36]/10" />
                Protected workspace
              </div>
            </div>
            <h2 className="text-5xl font-bold tracking-[-0.055em] text-[#171d25] sm:text-6xl">
              Sign in
            </h2>
            <p className="mt-5 text-base text-slate-500 sm:text-lg">
              Use your verified Jubilee workspace account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="rounded-lg border-red-200 bg-red-50 text-red-800">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2.5">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isBusy}
                required
                className="h-14 w-full rounded-lg border border-slate-300 bg-white px-4 text-base text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.03)] outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#9b1b36] focus:ring-4 focus:ring-[#9b1b36]/10 disabled:cursor-wait disabled:bg-slate-50 sm:h-[58px]"
                placeholder="name@jubilee.co.ke"
              />
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <LockKeyhole className="h-3.5 w-3.5" /> Persistent local access
                </span>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isBusy}
                  required
                  className="h-14 w-full rounded-lg border border-slate-300 bg-white px-4 pr-14 text-base text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.03)] outline-none transition hover:border-slate-400 focus:border-[#9b1b36] focus:ring-4 focus:ring-[#9b1b36]/10 disabled:cursor-wait disabled:bg-slate-50 sm:h-[58px]"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                  disabled={isBusy}
                  className="absolute inset-y-0 right-0 grid w-14 place-items-center text-slate-500 transition hover:text-[#9b1b36] disabled:cursor-wait disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="flex h-14 w-full items-center justify-center rounded-lg bg-[#9b1b36] px-5 text-base font-semibold text-white shadow-[0_8px_20px_rgba(155,27,54,0.18)] transition hover:bg-[#86172f] hover:shadow-[0_12px_24px_rgba(155,27,54,0.24)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9b1b36]/20 disabled:cursor-wait disabled:opacity-70 sm:h-[58px]"
            >
              {isBusy ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Preparing workspace
                </span>
              ) : (
                "Continue"
              )}
            </button>
          </form>

          <div className="mt-7 border-t border-slate-200 pt-6 text-sm">
            <p className="text-slate-500">Use one of the approved demo accounts. Your session and workspace changes stay available in this browser.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => { setEmail(account.email); setPassword(account.password); setError(""); }}
                  disabled={isBusy}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-[#c99ba6] hover:bg-[#f7ecef] hover:text-[#7b172e] disabled:opacity-50"
                >
                  {account.user.role.replaceAll("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
