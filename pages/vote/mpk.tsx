import { useRouter } from "next/router";
import CandidateCard from "@/components/CandidateCard";

const MPK_CANDIDATES = [
  { id: "mpk_a", name: "Calon MPK A", visi: "Visi A" },
  { id: "mpk_b", name: "Calon MPK B", visi: "Visi B" },
];

export default function VoteMPK() {
  const router = useRouter();
  return (
    <div className="relative min-h-screen bg-dots px-4 py-10">
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-[0.04]">
        <HexLogo />
      </div>
      <CandidateCard
        label="MPK"
        candidates={MPK_CANDIDATES}
        onSubmit={(id) => {
          document.cookie = `mpk_vote=${id}; path=/; max-age=900`;
          window.location.href = "/vote/confirm";
        }}
      />
      <div className="mx-auto max-w-3xl pt-6 text-center">
        <button
          onClick={() => router.push("/vote/osis")}
          className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-50"
        >
          ← Kembali
        </button>
      </div>
    </div>
  );
}

function HexLogo() {
  return (
    <svg viewBox="0 0 56 56" className="h-[40rem] w-[40rem]">
      <polygon points="28,2 50,14 50,42 28,54 6,42 6,14" fill="none" stroke="#0051a8" strokeWidth="4" />
      <polygon points="28,6 47,16 47,40 28,50 9,40 9,16" fill="none" stroke="#f5a623" strokeWidth="3" />
      <rect x="15" y="32" width="6" height="12" fill="#00a651" rx="1" />
      <rect x="23" y="24" width="6" height="20" fill="#e53935" rx="1" />
      <rect x="31" y="18" width="6" height="26" fill="#0051a8" rx="1" />
      <rect x="39" y="12" width="6" height="32" fill="#f5a623" rx="1" />
    </svg>
  );
}
