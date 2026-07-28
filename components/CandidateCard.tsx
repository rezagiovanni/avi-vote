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
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-center text-3xl font-semibold">Pilih Calon {label}</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {candidates.map((c) => (
          <button
            key={c.id}
            onClick={() => onSubmit(c.id)}
            className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 text-left transition hover:border-blue-500"
          >
            <div className="text-lg font-medium">{c.name}</div>
            <div className="mt-2 text-sm text-slate-300">{c.visi}</div>
            <div className="mt-4 text-xs text-slate-400">Klik untuk pilih</div>
          </button>
        ))}
      </div>
    </div>
  );
}
