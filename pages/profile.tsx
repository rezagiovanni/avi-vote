import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function getCookie(name: string) {
  const v = document.cookie.split("; ").find((c) => c.startsWith(name + "="));
  return v ? decodeURIComponent(v.split("=")[1]) : "";
}

export default function Profile() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [token, setToken] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // try to fetch voter info from BQ using the token cookie
    const t = getCookie("voter_token");
    if (!t) {
      router.push("/");
      return;
    }
    setToken(t);
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.nama) setNama(d.nama);
        else router.push("/");
      })
      .catch(() => router.push("/"));
    setLoaded(true);
  }, []);

  function logout() {
    document.cookie = "voter_token=; path=/; max-age=0";
    document.cookie = "osis_vote=; path=/; max-age=0";
    document.cookie = "mpk_vote=; path=/; max-age=0";
    router.push("/");
  }

  if (!loaded) return null;

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-dots px-4">
      {/* backdrop logo */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-[0.04]">
        <HexLogo />
      </div>

      <div className="glass animate-slide-up relative w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <span className="text-2xl font-bold text-blue-600">{nama.charAt(0) || "?"}</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800">Halo, {nama}!</h1>
        <p className="mt-1 text-sm text-gray-500">Selamat datang di E-Voting Avicenna</p>
        <p className="mt-4 text-xs text-gray-400 font-mono">Token: {token}</p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => router.push("/vote/osis")}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
          >
            Mulai Voting →
          </button>
          <button
            onClick={logout}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-50"
          >
            Keluar
          </button>
        </div>
      </div>
    </main>
  );
}

function HexLogo() {
  return (
    <svg viewBox="0 0 56 56" className="h-96 w-96">
      <polygon points="28,2 50,14 50,42 28,54 6,42 6,14" fill="none" stroke="#0051a8" strokeWidth="4" />
      <polygon points="28,6 47,16 47,40 28,50 9,40 9,16" fill="none" stroke="#f5a623" strokeWidth="3" />
      <rect x="15" y="32" width="6" height="12" fill="#00a651" rx="1" />
      <rect x="23" y="24" width="6" height="20" fill="#e53935" rx="1" />
      <rect x="31" y="18" width="6" height="26" fill="#0051a8" rx="1" />
      <rect x="39" y="12" width="6" height="32" fill="#f5a623" rx="1" />
    </svg>
  );
}
