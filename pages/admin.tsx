import Head from "next/head";
import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

type QuickCount = {
  totalToken: number;
  totalVoted: number;
  totalBelum: number;
  osis: { a: number; b: number };
  mpk: { a: number; b: number };
};

type PerKelas = {
  kelas: string;
  total: number;
  voted: number;
  belum: number;
  osis_a: number;
  osis_b: number;
  mpk_a: number;
  mpk_b: number;
};

export default function Admin() {
  const [loginToken, setLoginToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [classInfo, setClassInfo] = useState("");
  const [view, setView] = useState<"global" | "local">("global");

  // Global data
  const [globalStats, setGlobalStats] = useState<QuickCount | null>(null);
  const [perKelas, setPerKelas] = useState<PerKelas[]>([]);

  // Local data
  const [stats, setStats] = useState<QuickCount | null>(null);
  const [voters, setVoters] = useState<any[]>([]);
  const [showVoters, setShowVoters] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) {
      setLoginToken(saved);
      setLoggedIn(true);
      loadGlobal();
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
      loadGlobal();
    } else {
      const data = await res.json();
      setError(data.error || "Token admin tidak valid");
    }
    setLoading(false);
  }

  async function loadGlobal() {
    setView("global");
    const res = await fetch("/api/admin/global-stats");
    if (res.ok) {
      const data = await res.json();
      setGlobalStats(data.global);
      setPerKelas(data.perKelas);
    }
  }

  async function loadLocal() {
    setView("local");
    setShowVoters(true);
    const [statsRes, votersRes] = await Promise.all([
      fetch("/api/admin/stats"),
      fetch("/api/admin/voters"),
    ]);
    if (statsRes.ok) {
      const data = await statsRes.json();
      setStats(data.quickCount);
    }
    if (votersRes.ok) {
      const data = await votersRes.json();
      setVoters(data.voters);
    }
  }

  function logout() {
    sessionStorage.removeItem("admin_token");
    document.cookie = "admin_token=; path=/; max-age=0";
    setLoggedIn(false);
    setGlobalStats(null);
    setStats(null);
    setVoters([]);
    setShowVoters(false);
  }

  if (!loggedIn) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-dots px-4">
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-[0.04]"><HexLogo /></div>
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
              <input type="password" value={loginToken} onChange={(e) => setLoginToken(e.target.value)} placeholder="cth: admin01"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                onKeyDown={(e) => e.key === "Enter" && login()} />
            </div>
            {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>}
            <button onClick={login} disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-60">
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </div>
          <p className="mt-6 text-center"><a href="/" className="text-xs text-gray-400 underline hover:text-blue-600 transition">← Kembali ke halaman voter</a></p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Head><title>Admin Dashboard</title></Head>
      <main className="relative min-h-screen bg-dots px-4 py-10">
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-[0.04]"><HexLogo /></div>

        <div className="mx-auto max-w-5xl">
          {/* header */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
              <p className="text-sm text-gray-500">
                {view === "global" ? "Rekap seluruh kelas" : `Kelas: ${classInfo}`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <NavBtn active={view === "global"} onClick={loadGlobal} icon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              } label="Home" />
              <NavBtn active={view === "local"} onClick={loadLocal} icon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              } label="Kelas Saya" />
              <button onClick={view === "global" ? () => loadGlobal() : () => loadLocal()}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-50">
                ⟳ Refresh
              </button>
              <button onClick={logout}
                className="rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50">
                Keluar
              </button>
            </div>
          </div>

          {/* GLOBAL VIEW */}
          {view === "global" && globalStats && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Pemilih" value={String(globalStats.totalToken)} color="blue" icon={<PeopleIcon />} />
                <StatCard title="Sudah Vote" value={String(globalStats.totalVoted)} color="green" icon={<CheckIcon />}
                  sub={`${Math.round((globalStats.totalVoted / (globalStats.totalToken || 1)) * 100)}% partisipasi`} />
                <StatCard title="Belum Vote" value={String(globalStats.totalBelum)} color="yellow" icon={<ClockIcon />} />
                <StatCard title="Partisipasi" value={`${globalStats.totalVoted}/${globalStats.totalToken}`} color="purple" icon={<ChartIcon />} />
              </div>

              {/* global quick count - pie charts */}
              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <PieChartCard title="Quick Count OSIS (Global)" data={[
                  { label: "Calon A", value: globalStats.osis.a, color: "#0051a8" },
                  { label: "Calon B", value: globalStats.osis.b, color: "#f5a623" },
                ]} total={globalStats.totalVoted} />
                <PieChartCard title="Quick Count MPK (Global)" data={[
                  { label: "Calon A", value: globalStats.mpk.a, color: "#0051a8" },
                  { label: "Calon B", value: globalStats.mpk.b, color: "#f5a623" },
                ]} total={globalStats.totalVoted} />
              </div>

              {/* per-class table */}
              <div className="glass mt-8 overflow-hidden">
                <div className="border-b border-gray-100 px-5 py-4">
                  <h2 className="text-sm font-semibold text-gray-700">Rekap per Kelas</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500">
                      <tr>
                        <th className="px-5 py-3 font-medium">Kelas</th>
                        <th className="px-5 py-3 font-medium">Total</th>
                        <th className="px-5 py-3 font-medium">Sudah Vote</th>
                        <th className="px-5 py-3 font-medium">Sudah %</th>
                        <th className="px-5 py-3 font-medium">Belum</th>
                        <th className="px-5 py-3 font-medium">Belum %</th>
                        <th className="px-5 py-3 font-medium">OSIS A</th>
                        <th className="px-5 py-3 font-medium">OSIS A %</th>
                        <th className="px-5 py-3 font-medium">OSIS B</th>
                        <th className="px-5 py-3 font-medium">OSIS B %</th>
                        <th className="px-5 py-3 font-medium">MPK A</th>
                        <th className="px-5 py-3 font-medium">MPK A %</th>
                        <th className="px-5 py-3 font-medium">MPK B</th>
                        <th className="px-5 py-3 font-medium">MPK B %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {perKelas.map((k, i) => {
                        const votedPct = k.total ? Math.round((k.voted / k.total) * 100) : 0;
                        const belumPct = k.total ? Math.round((k.belum / k.total) * 100) : 0;
                        const osisAPct = k.voted ? Math.round((k.osis_a / k.voted) * 100) : 0;
                        const osisBPct = k.voted ? Math.round((k.osis_b / k.voted) * 100) : 0;
                        const mpkAPct = k.voted ? Math.round((k.mpk_a / k.voted) * 100) : 0;
                        const mpkBPct = k.voted ? Math.round((k.mpk_b / k.voted) * 100) : 0;
                        return (
                        <tr key={k.kelas} className={`${i % 2 === 0 ? "" : "bg-gray-50/50"} hover:bg-blue-50/50`}>
                          <td className="px-5 py-3 font-semibold text-gray-800">{k.kelas}</td>
                          <td className="px-5 py-3 text-gray-600">{k.total}</td>
                          <td className="px-5 py-3 font-medium text-green-600">{k.voted}</td>
                          <td className="px-5 py-3 text-gray-500">{votedPct}%</td>
                          <td className="px-5 py-3 text-yellow-600">{k.belum}</td>
                          <td className="px-5 py-3 text-gray-500">{belumPct}%</td>
                          <td className="px-5 py-3 text-blue-600">{k.osis_a}</td>
                          <td className="px-5 py-3 text-blue-400">{osisAPct}%</td>
                          <td className="px-5 py-3 text-yellow-600">{k.osis_b}</td>
                          <td className="px-5 py-3 text-yellow-500">{osisBPct}%</td>
                          <td className="px-5 py-3 text-purple-600">{k.mpk_a}</td>
                          <td className="px-5 py-3 text-purple-400">{mpkAPct}%</td>
                          <td className="px-5 py-3 text-orange-600">{k.mpk_b}</td>
                          <td className="px-5 py-3 text-orange-400">{mpkBPct}%</td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* LOCAL VIEW */}
          {view === "local" && stats && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Pemilih" value={String(stats.totalToken)} color="blue" icon={<PeopleIcon />} />
                <StatCard title="Sudah Vote" value={String(stats.totalVoted)} color="green" icon={<CheckIcon />}
                  sub={`${Math.round((stats.totalVoted / (stats.totalToken || 1)) * 100)}%`} />
                <StatCard title="Belum Vote" value={String(stats.totalBelum)} color="yellow" icon={<ClockIcon />} />
                <StatCard title="Partisipasi" value={`${stats.totalVoted}/${stats.totalToken}`} color="purple" icon={<ChartIcon />} />
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <QCcard title="Quick Count OSIS" data={[
                  { label: "Calon A", value: stats.osis.a, color: "bg-blue-500" },
                  { label: "Calon B", value: stats.osis.b, color: "bg-yellow-500" },
                ]} total={stats.totalVoted} />
                <QCcard title="Quick Count MPK" data={[
                  { label: "Calon A", value: stats.mpk.a, color: "bg-blue-500" },
                  { label: "Calon B", value: stats.mpk.b, color: "bg-yellow-500" },
                ]} total={stats.totalVoted} />
              </div>

              {/* voter table */}
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
                        <tr key={v.token} className={`${i % 2 === 0 ? "" : "bg-gray-50/50"} hover:bg-blue-50/50`}>
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
            </>
          )}
        </div>
      </main>
    </>
  );
}

/* -- Shared subcomponents -- */

function NavBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
        active ? "bg-blue-600 text-white shadow-sm" : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
      }`}>
      {icon}{label}
    </button>
  );
}

function StatCard({ title, value, color, icon, sub }: { title: string; value: string; color: string; icon: React.ReactNode; sub?: string }) {
  const cm: Record<string, { bg: string; text: string; iconBg: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-700", iconBg: "bg-blue-100" },
    green: { bg: "bg-green-50", text: "text-green-700", iconBg: "bg-green-100" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-700", iconBg: "bg-yellow-100" },
    purple: { bg: "bg-purple-50", text: "text-purple-700", iconBg: "bg-purple-100" },
  };
  const c = cm[color] || cm.blue;
  return (
    <div className="glass p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500">{title}</p>
          <p className={`mt-1 text-2xl font-bold ${c.text}`}>{value}</p>
          {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.iconBg} ${c.text}`}>{icon}</div>
      </div>
    </div>
  );
}

function QCcard({ title, data, total }: { title: string; data: { label: string; value: number; color: string }[]; total: number }) {
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

function PieChartCard({ title, data, total }: { title: string; data: { label: string; value: number; color: string }[]; total: number }) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [{
      data: data.map((d) => d.value),
      backgroundColor: data.map((d) => d.color),
      borderWidth: 0,
      borderRadius: 6,
      cutout: "55%",
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false as const,
    plugins: {
      legend: { position: "bottom" as const, labels: { padding: 20, usePointStyle: true, pointStyle: "circle" } },
      datalabels: {
        display: true,
        color: "#fff",
        font: { weight: "bold" as const, size: 12 },
        formatter: (val: number, ctx: any) => {
          const total = ctx.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
          if (total === 0) return null;
          return `${val}`;
        },
      },
    },
  };

  const sum = data.reduce((a, b) => a + b.value, 0);

  return (
    <div className="glass p-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">{title}</h3>
      <div className="flex items-center gap-6">
        <div className="relative h-28 w-28">
          <Pie data={chartData} options={chartOptions} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-center text-xs text-gray-500">Total: {sum}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {data.map((d) => {
            const pct = sum ? Math.round((d.value / sum) * 100) : 0;
            return (
              <div key={d.label} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-sm font-medium text-gray-700">{d.label}</span>
                <span className="text-sm text-gray-500">{d.value} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* -- Icons -- */
function PeopleIcon() { return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>; }
function CheckIcon() { return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function ClockIcon() { return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function ChartIcon() { return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>; }

function HexLogo() {
  return <img src="/logo-avicenna.png" alt="Avicenna" className="h-[40rem] w-[40rem] object-contain" />;
}
