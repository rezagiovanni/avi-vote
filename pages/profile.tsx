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
    const n = sessionStorage.getItem("voter_nama");
    const t = sessionStorage.getItem("voter_token");
    const k = sessionStorage.getItem("voter_kelas");
    if (!n || !t) {
      router.push("/");
      return;
    }
    setNama(n);
    setToken(t);
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
  return <img src="/logo-avicenna.png" alt="Avicenna" className="h-[40rem] w-[40rem] object-contain" />;
}
