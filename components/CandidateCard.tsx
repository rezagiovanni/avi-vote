type Candidate = {
  id: string;
  name: string;
  visi: string;
};

type Props = {
  label: "OSIS" | "MPK";
  candidates: Candidate[];
  onSubmit: (id: string) => void;
};

export default function CandidateCard({ label, candidates, onSubmit }: Props) {
  return (
    <div className="min-h-screen bg-dots px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 glow-blue">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight txt-gradient">Pilih Calon {label}</h2>
          <p className="mt-1 text-sm text-slate-400">Klik salah satu kandidat pilihan kamu</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {candidates.map((c) => (
            <button
              key={c.id}
              onClick={() => onSubmit(c.id)}
              className="glass card-scale group relative overflow-hidden rounded-2xl p-6 text-left transition"
            >
              {/* subtle gradient accent */}
              <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-blue-500/5 transition group-hover:bg-blue-500/10" />

              {/* avatar placeholder */}
              <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-xl font-bold text-blue-300">
                {c.name.charAt(0)}
              </div>

              <div className="relative">
                <h3 className="text-lg font-semibold">{c.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{c.visi}</p>
              </div>

              <div className="relative mt-4 flex items-center gap-2 text-xs text-blue-400 opacity-0 transition group-hover:opacity-100">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Pilih kandidat ini
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
