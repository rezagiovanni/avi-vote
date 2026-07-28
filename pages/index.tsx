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
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-center text-3xl font-semibold">Voting OSIS & MPK</h1>
      <p className="mt-4 text-center text-slate-300">
        Masukkan token yang diberikan panitia untuk mulai voting.
      </p>
      <form
        onSubmit={login}
        className="mx-auto mt-6 max-w-sm"
      >
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          placeholder="Token"
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3"
        />
        {error && (
          <p className="mt-2 text-sm text-red-400">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-blue-600 py-3 font-medium hover:bg-blue-500 disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </main>
  );
}
