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
  return <img src="/logo-avicenna.png" alt="Avicenna" className="h-[40rem] w-[40rem] object-contain" />;
}
