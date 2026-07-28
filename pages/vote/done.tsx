export default function Done() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-dots px-4">
      <div className="relative w-full max-w-md text-center">
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 animate-float rounded-full bg-green-100/60 blur-3xl" />

        <div className="glass animate-slide-up relative z-10 p-10">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-100">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Suara Berhasil</h1>
          <p className="mt-2 text-sm text-gray-500">Terima kasih, pilihan kamu sudah tercatat</p>
          <p className="mt-1 text-xs text-gray-400">Silakan tutup halaman ini</p>
        </div>
      </div>
    </main>
  );
}
