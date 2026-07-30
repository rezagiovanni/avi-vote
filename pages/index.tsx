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
      const data = await res.json();
      sessionStorage.setItem("voter_nama", data.nama);
      sessionStorage.setItem("voter_token", data.token);
      sessionStorage.setItem("voter_kelas", data.kelas);
      router.push("/profile");
    } else {
      const data = await res.json();
      // custom message for already voted tokens
      if (data.error === "Token sudah digunakan") {
        setError("Mohon maaf, Anda tidak bisa masuk karena sudah melakukan voting.");
      } else {
        setError(data.error || "Login gagal");
      }
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-dots px-4">
      {/* backdrop Avicenna logo */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-[0.05]">
        <HexLogo />
      </div>

      {/* decorative */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 animate-float rounded-full bg-blue-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 animate-pulse-soft rounded-full bg-yellow-100/60 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center animate-slide-up">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg shadow-blue-100">
            <img src="/logo-avicenna.png" alt="Avicenna" className="h-14 w-14 object-contain" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">
            AVICENNA
          </h1>
          <p className="text-xs font-medium tracking-wider text-gray-500">
            LEADERSHIP SCHOOL
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Masukkan token voting kamu
          </p>
        </div>

        <div className="glass animate-slide-up p-6" style={{ animationDelay: "0.1s" }}>
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Token Voting</label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                placeholder="cth: 01aa"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-blue-200/50 disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Voting OSIS & MPK
        </p>
        <div className="mt-4 text-center">
          <a href="/admin" className="text-xs text-gray-400 underline hover:text-blue-600 transition">
            Login Admin
          </a>
        </div>
      </div>
    </main>
  );
}

function HexLogo() {
  return <img src="/logo-avicenna.png" alt="Avicenna" className="h-[40rem] w-[40rem] object-contain" />;
}
