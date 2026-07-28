import Head from "next/head";

export default function Header({ active }: { active: "profile" | "vote" }) {
  return (
    <header className="border-b border-slate-700 bg-slate-900/70">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div className="text-sm font-semibold">Voting OSIS & MPK</div>
        <nav className="flex gap-3 text-sm">
          <a
            href="/profile"
            className={`rounded-lg px-3 py-1.5 ${
              active === "profile" ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white"
            }`}
          >
            Profile
          </a>
          <a
            href="/vote/osis"
            className={`rounded-lg px-3 py-1.5 ${
              active === "vote" ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white"
            }`}
          >
            Vote
          </a>
        </nav>
      </div>
    </header>
  );
}
