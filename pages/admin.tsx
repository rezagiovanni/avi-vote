import Head from "next/head";
import { useEffect, useState } from "react";

export default function Admin() {
  const [loginToken, setLoginToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [classInfo, setClassInfo] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [voters, setVoters] = useState<any[]>([]);
  const [showVoters, setShowVoters] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) {
      setLoginToken(saved);
      setLoggedIn(true);
      loadStats();
    }
  }, []);

  async function login() {
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: loginToken }),
    });
    if (res.ok) {
      const data = await res.json();
      setClassInfo(data.kelas);
      setLoggedIn(true);
      sessionStorage.setItem("admin_token", loginToken);
      loadStats();
    } else {
      const data = await res.json();
      setError(data.error || "Token admin tidak valid");
    }
    setLoading(false);
  }

  async function loadStats() {
    const res = await fetch("/api/admin/stats");
    if (res.ok) {
      const data = await res.json();
      setStats(data.quickCount);
    }
  }

  async function loadVoters() {
    setShowVoters(true);
    const res = await fetch("/api/admin/voters");
    if (res.ok) {
      const data = await res.json();
      setVoters(data.voters);
    }
  }

  function logout() {
    sessionStorage.removeItem("admin_token");
    document.cookie = "admin_token=; path=/; max-age=0";
    setLoggedIn(false);
    setStats(null);
    setVoters([]);
    setShowVoters(false);
  }

  if (!loggedIn) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-dots px-4">
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-[0.04]">
          <HexLogo />
        </div>
        <div className="glass animate-slide-up w-full max-w-sm p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg shadow-blue-100">
              <svg className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Login Admin</h1>
            <p className="mt-1 text-sm text-gray-500">Masukkan token walikelas</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Token Admin</label>
              <input
                type="password"
                value={loginToken}
                onChange={(e) => setLoginToken(e.target.value)}
                placeholder="cth: admin01"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                onKeyDown={(e) => e.key === "Enter" && login()}
              />
            </div>
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}
            <button
              onClick={login}
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </div>

          <p className="mt-6 text-center">
            <a href="/" className="text-xs text-gray-400 underline hover:text-blue-600 transition">
              ← Kembali ke halaman voter
            </a>
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Head><title>Admin Dashboard - {classInfo}</title></Head>
      <main className="relative min-h-screen bg-dots px-4 py-10">
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-[0.04]">
          <HexLogo />
        </div>

        <div className="mx-auto max-w-5xl">
          {/* header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
              <p className="text-sm text-gray-500">Kelas: <span className="font-semibold">{classInfo}</span></p>
            </div>
            <div className="flex gap-3">
              <button onClick={loadStats} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
                ⟳ Refresh
              </button>
              <button onClick={loadVoters} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
                Daftar Pemilih
              </button>
              <button onClick={logout} className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50">
                Keluar
              </button>
            </div>
          </div>

          {/* stats cards */}
          {stats && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Pemilih" value={String(stats.totalToken)} color="blue" icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              } />
              <StatCard title="Sudah Vote" value={String(stats.totalVoted)} color="green" icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              } sub={`${Math.round((stats.totalVoted / (stats.totalToken || 1)) * 100)}% partisipasi`} />
              <StatCard title="Belum Vote" value={String(stats.totalBelum)} color="yellow" icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              } />
              <StatCard title="Partisipasi" value={`${stats.totalVoted}/${stats.totalToken}`} color="purple" icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              } />
            </div>
          )}

          {/* quick count OSIS & MPK */}
          {stats && (
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <QuickCountCard title="Quick Count OSIS" data={[
                { label: "Calon A", value: stats.osis.a, color: "bg-blue-500" },
                { label: "Calon B", value: stats.osis.b, color: "bg-yellow-500" },
              ]} total={stats.totalVoted} />
              <QuickCountCard title="Quick Count MPK" data={[
                { label: "Calon A", value: stats.mpk.a, color: "bg-blue-500" },
                { label: "Calon B", value: stats.mpk.b, color: "bg-yellow-500" },
              ]} total={stats.totalVoted} />
            </div>
          )}

          {/* voter list */}
          {showVoters && voters.length > 0 && (
            <div className="glass mt-8 overflow-hidden">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="text-sm font-semibold text-gray-700">Daftar Pemilih — {classInfo}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500">
                    <tr>
                      <th className="px-5 py-3 font-medium">Nama</th>
                      <th className="px-5 py-3 font-medium">Token</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Vote OSIS</th>
                      <th className="px-5 py-3 font-medium">Vote MPK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {voters.map((v, i) => (
                      <tr key={v.token} className={`${i % 2 ? "bg-gray-50/50" : ""} transition hover:bg-blue-50/50`}>
                        <td className="px-5 py-3 font-medium text-gray-800">{v.nama}</td>
                        <td className="px-5 py-3 font-mono text-xs text-gray-400">{v.token}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            v.voted ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${v.voted ? "bg-green-500" : "bg-yellow-500"}`} />
                            {v.voted ? "Sudah vote" : "Belum vote"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-600">{v.osis_vote || "—"}</td>
                        <td className="px-5 py-3 text-gray-600">{v.mpk_vote || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {showVoters && voters.length === 0 && (
            <div className="glass mt-8 p-8 text-center">
              <p className="text-sm text-gray-400">Tidak ada data pemilih untuk kelas ini</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function StatCard({ title, value, color, icon, sub }: { title: string; value: string; color: string; icon: React.ReactNode; sub?: string }) {
  const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-700", iconBg: "bg-blue-100" },
    green: { bg: "bg-green-50", text: "text-green-700", iconBg: "bg-green-100" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-700", iconBg: "bg-yellow-100" },
    purple: { bg: "bg-purple-50", text: "text-purple-700", iconBg: "bg-purple-100" },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="glass p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500">{title}</p>
          <p className={`mt-1 text-2xl font-bold ${c.text}`}>{value}</p>
          {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.iconBg} ${c.text}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuickCountCard({ title, data, total }: { title: string; data: { label: string; value: number; color: string }[]; total: number }) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="glass p-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">{title}</h3>
      <div className="space-y-4">
        {data.map((d) => {
          const pct = total ? Math.round((d.value / total) * 100) : 0;
          return (
            <div key={d.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{d.label}</span>
                <span className="text-gray-500">{d.value} suara · {pct}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-100">
                <div className={`h-3 rounded-full transition-all ${d.color}`} style={{ width: `${Math.round((d.value / maxVal) * 100)}%` }} />
              </div>
            </div>
          );
        })}
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
