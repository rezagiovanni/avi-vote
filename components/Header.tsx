import Head from "next/head";
import Link from "next/link";

export default function Header({ active }: { active: "profile" | "vote" }) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/profile" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-[10px] font-bold text-white">
            AL
          </div>
          <span className="hidden sm:inline">Avicenna Voting</span>
        </Link>

        <nav className="flex gap-2">
          <Link
            href="/profile"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              active === "profile"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            Profile
          </Link>
          <Link
            href="/vote/osis"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              active === "vote"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            Vote
          </Link>
        </nav>
      </div>
    </header>
  );
}
