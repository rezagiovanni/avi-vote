import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function getCookie(name: string) {
  const v = document.cookie.split("; ").find((c) => c.startsWith(name + "="));
  return v ? decodeURIComponent(v.split("=")[1]) : "";
}

export default function Confirm() {
  const router = useRouter();
  const [osis, setOsis] = useState<string>("");
  const [mpk, setMpk] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const o = getCookie("osis_vote");
    const m = getCookie("mpk_vote");
    if (!o || !m) {
      router.push("/vote/osis");
      return;
    }
    setOsis(o === "osis_a" ? "Calon OSIS A" : "Calon OSIS B");
    setMpk(m === "mpk_a" ? "Calon MPK A" : "Calon MPK B");
  }, []);

  async function submit() {
    setSubmitting(true);
    const res = await fetch("/api/vote/submit", { method: "POST" });
    if (res.ok) {
      document.cookie = "osis_vote=; path=/; max-age=0";
      document.cookie = "mpk_vote=; path=/; max-age=0";
      router.push("/vote/done");
    } else {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-dots px-4">
      <div className="relative w-full max-w-lg">
        {/* decorative */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 animate-float rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 animate-pulse-soft rounded-full bg-purple-500/10 blur-3xl" />

        <div className="glass relative z-10 rounded-3xl p-8 glow-blue">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 glow-blue">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold txt-gradient">Konfirmasi Pilihan</h1>
            <p className="mt-1 text-sm text-slate-400">Pastikan pilihanmu sudah benar sebelum submit</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <p className="text-xs text-blue-400">OSIS</p>
              <p className="mt-1 text-lg font-semibold">{osis}</p>
            </div>
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
              <p className="text-xs text-purple-400">MPK</p>
              <p className="mt-1 text-lg font-semibold">{mpk}</p>
            </div>
          </div>

          <button
            disabled={submitting}
            onClick={submit}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:from-blue-500 hover:to-purple-500 hover:shadow-blue-500/30 disabled:opacity-60"
          >
            {submitting ? "Mengirim..." : "Submit & Kunci Pilihan"}
          </button>
          <p className="mt-3 text-center text-xs text-slate-500">
            Setelah submit, pilihan tidak bisa diganti lagi
          </p>
        </div>
      </div>
    </main>
  );
}
