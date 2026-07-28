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
    const [adminRows] = await (bq.query({
      query: `SELECT token, kelas FROM \`${ADMIN_TABLE}\` WHERE token = @token`,
      params: { token: adminToken },
    }) as Promise<any[]>);

    const admin = (adminRows as any[])[0];
    if (!admin) return res.status(401).json({ error: "Token admin tidak valid" });

    const kelas = admin.kelas;

    const [rows] = await (bq.query({
      query: `
        SELECT
          COUNT(*) AS total_token,
          COUNTIF(voted) AS total_voted,
          COUNTIF(NOT voted) AS total_belum,
          COUNTIF(osis_vote = 'osis_a') AS osis_a,
          COUNTIF(osis_vote = 'osis_b') AS osis_b,
          COUNTIF(mpk_vote = 'mpk_a') AS mpk_a,
          COUNTIF(mpk_vote = 'mpk_b') AS mpk_b
        FROM \`${VOTERS_TABLE}\`
        WHERE kelas = @kelas
      `,
      params: { kelas },
    }) as Promise<any[]>);

    const agg = (rows as any[])[0];

    res.status(200).json({
      kelas,
      quickCount: {
        totalToken: Number(agg.total_token || 0),
        totalVoted: Number(agg.total_voted || 0),
        totalBelum: Number(agg.total_belum || 0),
        osis: {
          a: Number(agg.osis_a || 0),
          b: Number(agg.osis_b || 0),
        },
        mpk: {
          a: Number(agg.mpk_a || 0),
          b: Number(agg.mpk_b || 0),
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal memuat quick count" });
  }
}
