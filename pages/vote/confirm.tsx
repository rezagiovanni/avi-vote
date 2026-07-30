import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function getCookie(name: string) {
  const v = document.cookie.split("; ").find((c) => c.startsWith(name + "="));
  return v ? decodeURIComponent(v.split("=")[1]) : "";
}

export default function Confirm() {
  const router = useRouter();
  const [osisRaw, setOsisRaw] = useState("");
  const [mpkRaw, setMpkRaw] = useState("");
  const [osis, setOsis] = useState("");
  const [mpk, setMpk] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notif, setNotif] = useState<{ type: "error" | "success"; msg: string } | null>(null);

  useEffect(() => {
    const o = getCookie("osis_vote");
    const m = getCookie("mpk_vote");
    if (!o || !m) {
      router.push("/vote/osis");
      return;
    }
    setOsisRaw(o);
    setMpkRaw(m);
    setOsis(o === "osis_a" ? "Calon OSIS A" : "Calon OSIS B");
    setMpk(m === "mpk_a" ? "Calon MPK A" : "Calon MPK B");
  }, []);

  async function submit() {
    setSubmitting(true);
    setNotif(null);

    const res = await fetch("/api/vote/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ osis_vote: osisRaw, mpk_vote: mpkRaw }),
    });

    if (res.ok) {
      document.cookie = "osis_vote=; path=/; max-age=0";
      document.cookie = "mpk_vote=; path=/; max-age=0";
      router.push("/vote/done");
    } else {
      const data = await res.json();
      setNotif({ type: "error", msg: data.error || "Gagal menyimpan" });
      setSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-dots px-4">
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-[0.04]">
        <HexLogo />
      </div>
      <div className="relative w-full max-w-lg">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 animate-float rounded-full bg-blue-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 animate-pulse-soft rounded-full bg-blue-100/60 blur-3xl" />

        <div className="glass animate-slide-up relative z-10 p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg shadow-blue-100">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Konfirmasi Pilihan</h1>
            <p className="mt-1 text-sm text-gray-500">Pastikan pilihanmu sudah benar sebelum submit</p>
          </div>

          {notif && (
            <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
              notif.type === "error" ? "border-red-200 bg-red-50 text-red-600" : "border-green-200 bg-green-50 text-green-600"
            }`}>
              {notif.msg}
            </div>
          )}

          <div className="space-y-4">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-xs font-medium text-blue-600">OSIS</p>
              <p className="mt-1 text-lg font-semibold text-gray-800">{osis}</p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-xs font-medium text-blue-600">MPK</p>
              <p className="mt-1 text-lg font-semibold text-gray-800">{mpk}</p>
            </div>
          </div>

          <button
            disabled={submitting}
            onClick={submit}
            className="mt-6 w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-blue-200/50 disabled:opacity-60"
          >
            {submitting ? "Mengirim..." : "Submit & Kunci Pilihan"}
          </button>

          <button
            onClick={() => router.push("/vote/mpk")}
            className="mt-3 w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            ← Kembali
          </button>

          <p className="mt-4 text-center text-xs text-gray-400">
            Setelah submit, pilihan tidak bisa diganti lagi
          </p>
        </div>
      </div>
    </main>
  );
}

function HexLogo() {
  return <img src="/logo-avicenna.png" alt="Avicenna" className="h-[40rem] w-[40rem] object-contain" />;
}
