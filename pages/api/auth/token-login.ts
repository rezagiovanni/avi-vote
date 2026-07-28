import type { NextApiRequest, NextApiResponse } from "next";
import { bq, VOTERS_TABLE } from "@/lib/bigquery";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { token } = req.body as { token?: string };
  const clean = String(token || "").trim().toUpperCase();

  if (!clean) return res.status(400).json({ error: "Token kosong" });

  try {
    const [rows] = await bq.query({
      query: `SELECT token, nama, kelas, voted FROM \`${VOTERS_TABLE}\` WHERE token = @token`,
      params: { token: clean },
      type: "text" as any,
    });

    const voter = (rows as any[])[0];
    if (!voter) return res.status(401).json({ error: "Token tidak ditemukan" });

    if (voter.voted) {
      return res.status(403).json({ error: "Token sudah digunakan" });
    }

    res.setHeader("Set-Cookie", `voter_token=${clean}; Path=/; HttpOnly; Max-Age=86400`);
    res.status(200).json({ token: clean, nama: voter.nama, kelas: voter.kelas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal autentikasi" });
  }
}
