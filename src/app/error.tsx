"use client";

import Image from "next/image";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-[70dvh] place-items-center p-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <Image src="/jubilee-logo.png" alt="Jubilee Insurance" width={112} height={112} className="mx-auto h-auto w-28" />
        <h1 className="mt-8 text-3xl font-bold tracking-tight text-slate-900">Unable to load this page</h1>
        <button type="button" onClick={reset} className="mt-8 h-11 rounded-lg bg-[#9b1b36] px-5 text-sm font-semibold text-white hover:bg-[#7b172e]">
          Try again
        </button>
      </section>
    </main>
  );
}
