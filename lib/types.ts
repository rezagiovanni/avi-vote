export type AdminRow = {
  token: string;
  kelas: string;
  nama_walikelas: string;
};

export type VoterRow = {
  token: string;
  nama: string;
  kelas: string;
  voted: boolean;
  osis_vote: string | null;
  mpk_vote: string | null;
  voted_at: string | null;
};

export type Candidate = {
  id: string;
  name: string;
  visi: string;
};

export const ADMIN_POLL_INTERVAL_MS = Number(
  process.env.ADMIN_POLL_INTERVAL_MS || 5000
);

export const VOTING_MODE = process.env.VOTING_MODE || "manual";
