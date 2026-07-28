import Head from "next/head";
import { useEffect, useState } from "react";

function getCookie(name: string) {
  const v = document.cookie.split("; ").find((c) => c.startsWith(name + "="));
  return v ? decodeURIComponent(v.split("=")[1]) : "";
}

export default function Admin() {
  const [adminToken, setAdminToken] = useState<string>("");
  const [loginToken, setLoginToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [classInfo, setClassInfo] = useState<string>("");
  const [stats, setStats] = useState<any>(null);
  const [voters, setVoters] = useState<any[]>([]);
  const [loadingVoters, setLoadingVoters] = useState(false);

  useEffect(() => {
    setAdminToken(getCookie("admin_token"));
  }, []);

  useEffect(() => {
    if (adminToken) setLoggedIn(true);
  }, [adminToken]);

  async function login() {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: loginToken }),
    });
    if (res.ok) {
      const data = await res.json();
      setClassInfo(data.kelas);
      setLoggedIn(true);
      loadStats();
    }
  }

  async function loadStats() {
    const res = await fetch("/api/admin/stats");
    if (res.ok) {
      const data = await res.json();
      setStats(data.quickCount);
    }
  }

  async function loadVoters() {
    setLoadingVoters(true);
    const res = await fetch("/api/admin/voters");
    if (res.ok) {
      const data = await res.json();
      setVoters(data.voters);
    }
    setLoadingVoters(false);
  }

  if (!loggedIn) {
    return (
      <>
        <Head><title>Admin</title></Head>
        <main className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-2xl font-semibold">Login Admin</h1>
          <input
            value={loginToken}
            onChange={(e) => setLoginToken(e.target.value)}
            placeholder="Token admin"
            className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3"
          />
          <button
            onClick={login}
            className="mt-4 w-full rounded-xl bg-blue-600 py-3 font-medium hover:bg-blue-500"
          >
            Login
          </button>
        </main>
      </>
    );
  }

  return (
    <>
      <Head><title>Admin Dashboard</title></Head>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Dashboard Admin - {classInfo}</h1>
          <div className="flex gap-3">
            <button onClick={loadStats} className="rounded-xl border border-slate-700 px-4 py-2 hover:bg-slate-800">
              Refresh Quick Count
            </button>
            <button onClick={loadVoters} className="rounded-xl border border-slate-700 px-4 py-2 hover:bg-slate-800">
              Daftar Pemilih
            </button>
          </div>
        </div>

        {stats && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat title="Total Pemilih" value={String(stats.totalToken)} />
            <Stat title="Total Sudah Vote" value={String(stats.totalVoted)} sub={`Progress ${String(Math.round((stats.totalVoted / (stats.totalToken || 1)) * 100))}%`} />
            <Stat title="Belum Vote" value={String(stats.totalBelum)} />
            <Stat title="Partisipasi" value={`${String(stats.totalVoted)}/${String(stats.totalToken)}`} />
          </div>
        )}

        {stats && (
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6">
              <h2 className="text-lg font-medium">Quick Count OSIS</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Bar label="Calon A" value={stats.osis.a} total={stats.totalVoted} />
                <Bar label="Calon B" value={stats.osis.b} total={stats.totalVoted} />
              </div>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6">
              <h2 className="text-lg font-medium">Quick Count MPK</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Bar label="Calon A" value={stats.mpk.a} total={stats.totalVoted} />
                <Bar label="Calon B" value={stats.mpk.b} total={stats.totalVoted} />
              </div>
            </div>
          </div>
        )}

        {loadingVoters && <p className="mt-6 text-slate-400">Memuat data pemilih...</p>}

        {!loadingVoters && voters.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/60 text-xs text-slate-300">
                <tr>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Token</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Vote OSIS</th>
                  <th className="px-4 py-3">Vote MPK</th>
                </tr>
              </thead>
              <tbody>
                {voters.map((v, i) => (
                  <tr key={v.token} className={i % 2 ? "bg-slate-900/40" : ""}>
                    <td className="px-4 py-3">{v.nama}</td>
                    <td className="px-4 py-3 font-mono text-xs">{v.token}</td>
                    <td className="px-4 py-3">
                      <span className={v.voted ? "text-green-400" : "text-red-400"}>
                        {v.voted ? "Sudah vote" : "Belum vote"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{v.osis_vote || "-"}</td>
                    <td className="px-4 py-3">{v.mpk_vote || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}

function Stat({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4">
      <div className="text-xs text-slate-400">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {sub && <div className="text-xs text-slate-300">{sub}</div>}
    </div>
  );
}

function Bar({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <div>{label}</div>
        <div className="text-slate-300">
          {value} suara · {pct}%
        </div>
      </div>
      <div className="mt-2 h-3 w-full rounded-full bg-slate-700">
        <div className="h-3 rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
