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
    setOsis(getCookie("osis_vote"));
    setMpk(getCookie("mpk_vote"));
  }, []);

  async function submit() {
    if (!osis || !mpk) return router.push("/vote/osis");
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
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-center text-2xl font-semibold">Konfirmasi Pilihan</h1>
      <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6">
        <p className="mb-2">Kamu memilih <span className="font-medium">{osis}</span> untuk OSIS</p>
        <p className="mb-6">Kamu memilih <span className="font-medium">{mpk}</span> untuk MPK</p>
        <button
          disabled={submitting}
          onClick={submit}
          className="w-full rounded-xl bg-blue-600 py-3 font-medium hover:bg-blue-500 disabled:opacity-60"
        >
          {submitting ? "Mengirim..." : "Submit"}
        </button>
        <p className="mt-3 text-center text-xs text-slate-400">Setelah submit pilihan tidak bisa diganti.</p>
      </div>
    </div>
  );
}
