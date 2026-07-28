import type { NextApiRequest, NextApiResponse } from "next";
import { bq, ADMIN_TABLE } from "@/lib/bigquery";

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

    res.status(200).json({ kelas: admin.kelas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal memuat kelas" });
  }
}
