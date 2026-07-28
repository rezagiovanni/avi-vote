import type { NextApiRequest, NextApiResponse } from "next";
import { bq, VOTERS_TABLE } from "@/lib/bigquery";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { osis_vote, mpk_vote } = req.body as { osis_vote?: string; mpk_vote?: string };

  const token = req.cookies?.voter_token;
  if (!token) return res.status(401).json({ error: "Belum login" });
  if (!osis_vote || !mpk_vote) return res.status(400).json({ error: "Pilihan belum lengkap" });

  try {
    const [rows] = await (bq.query({
      query: `
        UPDATE \`${VOTERS_TABLE}\`
        SET osis_vote = @osis_vote, mpk_vote = @mpk_vote, voted = TRUE, voted_at = CURRENT_TIMESTAMP()
        WHERE token = @token AND voted = FALSE
        RETURNING token
      `,
      params: { token, osis_vote, mpk_vote },
      type: "text" as any,
    }) as Promise<any[]>);

    const updated = (rows as any[])[0];
    if (!updated) return res.status(409).json({ error: "Token sudah pernah digunakan" });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menyimpan vote" });
  }
}
