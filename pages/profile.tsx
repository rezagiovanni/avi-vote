import Head from "next/head";
import Header from "@/components/Header";

export default function Profile() {
  return (
    <>
      <Head><title>Profile</title></Head>
      <Header active="profile" />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-4 text-2xl font-semibold">Profile</h1>
        <p className="text-slate-300">Halaman profil kamu.</p>
      </main>
    </>
  );
}
