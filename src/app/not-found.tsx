import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-slate-50 p-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <Image src="/jubilee-logo.png" alt="Jubilee Insurance" width={112} height={112} className="mx-auto h-auto w-28" />
        <p className="mt-8 text-sm font-semibold text-[#9b1b36]">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Page not found</h1>
        <Link href="/dashboard" className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-[#9b1b36] px-5 text-sm font-semibold text-white hover:bg-[#7b172e]">
          Return to dashboard
        </Link>
      </section>
    </main>
  );
}
