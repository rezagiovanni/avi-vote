import CandidateCard from "@/components/CandidateCard";
import { useRouter } from "next/router";

const MPK_CANDIDATES = [
  { id: "mpk_a", name: "Calon MPK A", visi: "Visi A" },
  { id: "mpk_b", name: "Calon MPK B", visi: "Visi B" },
];

export default function VoteMPK() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-dots px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <CandidateCard
          label="MPK"
          candidates={MPK_CANDIDATES}
          onSubmit={(id) => {
            document.cookie = `mpk_vote=${id}; path=/; max-age=900`;
            window.location.href = "/vote/confirm";
          }}
        />
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/vote/osis")}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            ← Kembali ke Vote OSIS
          </button>
        </div>
      </div>
    </div>
  );
}
