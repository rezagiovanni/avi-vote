import Head from "next/head";
import Link from "next/link";

export default function Header({ active }: { active: "profile" | "vote" }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/profile" className="flex items-center gap-2 text-sm font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-[10px] font-bold text-white">
            EV
          </div>
          <span className="hidden sm:inline">E-Voting</span>
        </Link>

        <nav className="flex gap-2">
          <Link
            href="/profile"
            className={`rounded-lg px-3 py-1.5 text-sm transition ${
              active === "profile"
                ? "bg-white/10 text-white shadow-sm"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            Profile
          </Link>
          <Link
            href="/vote/osis"
            className={`rounded-lg px-3 py-1.5 text-sm transition ${
              active === "vote"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            Vote
          </Link>
        </nav>
      </div>
    </header>
  );
}
