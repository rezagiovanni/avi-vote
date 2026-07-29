import type { NextApiRequest, NextApiResponse } from "next";
import { bq, VOTERS_TABLE } from "@/lib/bigquery";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies?.voter_token;
  if (!token) return res.status(401).json({ error: "Belum login" });

  try {
    const [rows] = await (bq.query({
      query: `SELECT token, nama, kelas, voted FROM \`${VOTERS_TABLE}\` WHERE token = @token`,
      params: { token },
    }) as Promise<any[]>);

    const voter = (rows as any[])[0];
    if (!voter) return res.status(404).json({ error: "Token tidak ditemukan" });

    res.status(200).json({ token: voter.token, nama: voter.nama, kelas: voter.kelas, voted: voter.voted });
  } catch (err) {
    res.status(500).json({ error: "Gagal memuat data" });
  }
}
