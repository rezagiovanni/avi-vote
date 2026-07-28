import CandidateCard from "@/components/CandidateCard";

const OSIS_CANDIDATES = [
  { id: "osis_a", name: "Calon OSIS A", visi: "Visi A" },
  { id: "osis_b", name: "Calon OSIS B", visi: "Visi B" },
];

export default function VoteOSIS() {
  return (
    <CandidateCard
      label="OSIS"
      candidates={OSIS_CANDIDATES}
      onSubmit={(id) => {
        document.cookie = `osis_vote=${id}; path=/; max-age=900`;
        window.location.href = "/vote/mpk";
      }}
    />
  );
}
