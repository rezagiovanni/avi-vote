CREATE SCHEMA IF NOT EXISTS `avi_vote`;

CREATE TABLE IF NOT EXISTS `avi_vote.voters` (
  token STRING,
  nama STRING,
  kelas STRING,
  voted BOOL DEFAULT FALSE,
  osis_vote STRING,
  mpk_vote STRING,
  voted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `avi_vote.admin_tokens` (
  token STRING,
  nama_walikelas STRING,
  kelas STRING
);
