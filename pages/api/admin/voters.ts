import type { NextApiRequest, NextApiResponse } from "next";
import { bq, ADMIN_TABLE, VOTERS_TABLE } from "@/lib/bigquery";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  const adminToken = req.cookies?.admin_token;
  if (!adminToken) return res.status(401).json({ error: "Belum login sebagai admin" });

  try {
    const [adminRows] = await bq.query({
      query: `SELECT token, kelas FROM \`${ADMIN_TABLE}\` WHERE token = @token`,
      params: { token: adminToken },
      type: "text" as any,
    });

    const admin = (adminRows as any[])[0];
    if (!admin) return res.status(401).json({ error: "Token admin tidak valid" });

    const kelas = String(admin.kelas);

    const [rows] = await (bq.query({
      query: `SELECT token, nama, voted, osis_vote, mpk_vote FROM \`${VOTERS_TABLE}\` WHERE kelas = @kelas ORDER BY nama`,
      params: { kelas },
    }) as Promise<any[]>);

    const voters = (rows as any[]).map((r) => ({
      token: String(r.token),
      nama: String(r.nama),
      voted: Boolean(r.voted),
      osis_vote: r.osis_vote ? String(r.osis_vote) : null,
      mpk_vote: r.mpk_vote ? String(r.mpk_vote) : null,
    }));

    res.status(200).json({ kelas, voters });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal memuat daftar pemilih" });
  }
}
