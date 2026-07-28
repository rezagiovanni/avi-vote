export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-center text-3xl font-semibold">Voting OSIS & MPK</h1>
      <p className="mt-4 text-center text-slate-300">
        Masukkan token yang diberikan panitia untuk mulai voting.
      </p>
      <form
        action="/api/auth/token-login"
        method="POST"
        className="mx-auto mt-6 max-w-sm"
      >
        <input
          name="token"
          required
          placeholder="Token"
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3"
        />
        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-blue-600 py-3 font-medium hover:bg-blue-500"
        >
          Masuk
        </button>
      </form>
    </main>
  );
}
