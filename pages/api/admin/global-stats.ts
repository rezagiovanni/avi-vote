import type { NextApiRequest, NextApiResponse } from "next";
import { bq, VOTERS_TABLE } from "@/lib/bigquery";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  try {
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
      `,
    }) as Promise<any[]>);

    const agg = (rows as any[])[0];

    const [perKelas] = await (bq.query({
      query: `
        SELECT kelas,
          COUNT(*) AS total,
          COUNTIF(voted) AS voted,
          COUNTIF(NOT voted) AS belum,
          COUNTIF(osis_vote = 'osis_a') AS osis_a,
          COUNTIF(osis_vote = 'osis_b') AS osis_b
        FROM \`${VOTERS_TABLE}\`
        GROUP BY kelas
        ORDER BY kelas
      `,
    }) as Promise<any[]>);

    res.status(200).json({
      global: {
        totalToken: Number(agg.total_token || 0),
        totalVoted: Number(agg.total_voted || 0),
        totalBelum: Number(agg.total_belum || 0),
        osis: { a: Number(agg.osis_a || 0), b: Number(agg.osis_b || 0) },
        mpk: { a: Number(agg.mpk_a || 0), b: Number(agg.mpk_b || 0) },
      },
      perKelas: (perKelas as any[]).map((r) => ({
        kelas: String(r.kelas),
        total: Number(r.total || 0),
        voted: Number(r.voted || 0),
        belum: Number(r.belum || 0),
        osis_a: Number(r.osis_a || 0),
        osis_b: Number(r.osis_b || 0),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal memuat data global" });
  }
}
