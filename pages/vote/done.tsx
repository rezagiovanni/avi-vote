import { useRouter } from "next/router";

export default function Done() {
  const router = useRouter();
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-dots px-4">
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-[0.04]">
        <HexLogo />
      </div>
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 animate-float rounded-full bg-green-100/60 blur-3xl" />

      <div className="glass animate-slide-up relative z-10 w-full max-w-md p-10 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-100">
          <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Suara Berhasil</h1>
        <p className="mt-2 text-sm text-gray-500">Terima kasih, pilihan kamu sudah tercatat</p>
        <p className="mt-1 text-xs text-gray-400">Suara kamu sangat berarti untuk kemajuan sekolah</p>

        <button
          onClick={() => router.push("/")}
          className="mt-6 w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          ← Kembali ke Login
        </button>
      </div>
    </main>
  );
}

function HexLogo() {
  return <img src="/logo-avicenna.png" alt="Avicenna" className="h-[40rem] w-[40rem] object-contain" />;
}
