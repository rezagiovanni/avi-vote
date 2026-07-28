import { useState, FormEvent } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/token-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (res.ok) {
      router.push("/vote/osis");
    } else {
      const data = await res.json();
      setError(data.error || "Login gagal");
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-dots px-4">
      {/* decorative bg */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 animate-float rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 animate-pulse-soft rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* logo area */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 glow-blue">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight txt-gradient">
            E-Voting OSIS & MPK
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Masukkan token yang diberikan panitia untuk mulai memilih
          </p>
        </div>

        {/* form card */}
        <div className="glass rounded-2xl p-6 glow-blue">
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Token Voting</label>
              <input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                placeholder="cth: 01aa"
                className="w-full rounded-xl border border-slate-600/50 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-blue-500 hover:to-purple-500 hover:shadow-blue-500/30 disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} · Voting Ketua OSIS & MPK
        </p>
      </div>
    </main>
  );
}
