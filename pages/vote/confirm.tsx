import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function getCookie(name: string) {
  const v = document.cookie.split("; ").find((c) => c.startsWith(name + "="));
  return v ? decodeURIComponent(v.split("=")[1]) : "";
}

export default function Confirm() {
  const router = useRouter();
  const [osis, setOsis] = useState("");
  const [mpk, setMpk] = useState("");
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
      const data = await res.json();
      alert(data.error || "Gagal menyimpan");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-dots px-4">
      <div className="relative w-full max-w-lg">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 animate-float rounded-full bg-blue-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 animate-pulse-soft rounded-full bg-yellow-100/60 blur-3xl" />

        <div className="glass animate-slide-up relative z-10 p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg shadow-blue-100">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold txt-gradient">Konfirmasi Pilihan</h1>
            <p className="mt-1 text-sm text-gray-500">Pastikan pilihanmu sudah benar sebelum submit</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-xs font-medium text-blue-600">OSIS</p>
              <p className="mt-1 text-lg font-semibold text-gray-800">{osis}</p>
            </div>
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-xs font-medium text-yellow-700">MPK</p>
              <p className="mt-1 text-lg font-semibold text-gray-800">{mpk}</p>
            </div>
          </div>

          <button
            disabled={submitting}
            onClick={submit}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-yellow-500 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-yellow-600 hover:shadow-blue-200/50 disabled:opacity-60"
          >
            {submitting ? "Mengirim..." : "Submit & Kunci Pilihan"}
          </button>
          <p className="mt-3 text-center text-xs text-gray-400">
            Setelah submit, pilihan tidak bisa diganti lagi
          </p>
        </div>
      </div>
    </main>
  );
}
