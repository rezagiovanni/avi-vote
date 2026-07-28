import CandidateCard from "@/components/CandidateCard";

const MPK_CANDIDATES = [
  { id: "mpk_a", name: "Calon MPK A", visi: "Visi A" },
  { id: "mpk_b", name: "Calon MPK B", visi: "Visi B" },
];

export default function VoteMPK() {
  return (
    <CandidateCard
      label="MPK"
      candidates={MPK_CANDIDATES}
      onSubmit={(id) => {
        document.cookie = `mpk_vote=${id}; path=/; max-age=900`;
        window.location.href = "/vote/confirm";
      }}
    />
  );
}
