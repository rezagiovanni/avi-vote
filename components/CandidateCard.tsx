type Candidate = {
  id: string;
  name: string;
  visi: string;
  img?: string;
};

type Props = {
  label: "OSIS" | "MPK";
  candidates: Candidate[];
  onSubmit: (id: string) => void;
};

export default function CandidateCard({ label, candidates, onSubmit }: Props) {
  return (
    <div className="bg-dots">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center animate-slide-up">
          <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg shadow-blue-100">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Pilih Calon {label}</h2>
          <p className="mt-1 text-sm text-gray-500">Klik salah satu kandidat pilihan kamu</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {candidates.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => onSubmit(c.id)}
              className="glass card-scale group relative overflow-hidden rounded-2xl p-6 text-left transition"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* accent bar */}
              <div className={`absolute left-0 top-0 h-1.5 w-full ${idx === 0 ? "bg-blue-500" : "bg-yellow-500"}`} />

              {/* photo or avatar */}
              {c.img ? (
                <img src={c.img} alt={c.name} className="relative mb-4 h-24 w-24 rounded-full object-cover shadow-sm ring-2 ring-white" />
              ) : (
                <div className={`relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-xl font-bold shadow-sm ${
                  idx === 0 ? "from-blue-100 to-blue-200 text-blue-700" : "from-yellow-100 to-yellow-200 text-yellow-700"
                }`}>
                  {c.name.charAt(0)}
                </div>
              )}

              <div className="relative">
                <h3 className="text-lg font-semibold text-gray-800">{c.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{c.visi}</p>
              </div>

              <div className={`relative mt-4 flex items-center gap-2 text-xs font-medium transition group-hover:opacity-100 ${
                idx === 0 ? "text-blue-600 opacity-0" : "text-yellow-600 opacity-0"
              }`}>
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
