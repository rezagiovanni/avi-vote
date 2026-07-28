import type { NextApiRequest, NextApiResponse } from "next";
import { bq, ADMIN_TABLE, VOTERS_TABLE } from "@/lib/bigquery";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { token } = req.body as { token?: string };
  const clean = String(token || "").trim().toUpperCase();

  if (!clean) return res.status(400).json({ error: "Token kosong" });

  try {
    const [adminRows] = await bq.query({
      query: `SELECT token, kelas, nama_walikelas FROM \`${ADMIN_TABLE}\` WHERE token = @token`,
      params: { token: clean },
      type: "text" as any,
    });

    const admin = (adminRows as any[])[0];
    if (!admin) return res.status(401).json({ error: "Token admin tidak valid" });

    res.setHeader("Set-Cookie", `admin_token=${clean}; Path=/; HttpOnly; Max-Age=86400`);
    res.status(200).json({ token: clean, kelas: admin.kelas, nama_walikelas: admin.nama_walikelas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal autentikasi admin" });
  }
}
