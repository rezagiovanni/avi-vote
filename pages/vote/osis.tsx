import CandidateCard from "@/components/CandidateCard";

const OSIS_CANDIDATES = [
  {
    id: "osis_a",
    name: "Adriana Salsabila Pradana & Kireina Sarazi Filiajaya",
    visi: "",
    img: "/candidates/osis_a.jpg",
  },
  { id: "osis_b", name: "Muhammad Jeeva Khalfani Akbar & Alodie Belva Syakira Novianto", visi: "", img: "/candidates/osis_b.jpg" },
];

export default function VoteOSIS() {
  return (
    <div className="relative min-h-screen bg-dots px-4 py-10">
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-[0.04]">
        <HexLogo />
      </div>
      <CandidateCard
        label="OSIS"
        candidates={OSIS_CANDIDATES}
        onSubmit={(id) => {
          document.cookie = `osis_vote=${id}; path=/; max-age=900`;
          window.location.href = "/vote/mpk";
        }}
      />
    </div>
  );
}

function HexLogo() {
  return <img src="/logo-avicenna.png" alt="Avicenna" className="h-[40rem] w-[40rem] object-contain" />;
}
