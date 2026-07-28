# PRD — Voting Ketua OSIS

## 1. Overview
Webapp untuk pemilihan Ketua OSIS secara online. Fokus: **sederhana, transparan, real-time, anti-duplikat**. Tidak memerlukan sistem login sekolah yang rumit.

---

## 2. Target Users
| Role | Deskripsi |
|------|-----------|
| **Pemilih** | Siswa yang menerima token voting unik dari panitia. |
| **Admin** | Panitia OSIS yang mengelola kandidat, token, dan periode voting. |

---

## 3. Fitur (MVP)

### 3.1 Pemilih
- Masuk via **token voting** (dibagikan panitia, 1 token = 1 suara).
- Lihat daftar kandidat (foto, nama, visi misi).
- Melihat **hasil realtime** (progress bar & persentase per kandidat).
- Submit 1 suara, tidak bisa vote ulang setelah token terpakai.
- Terima konfirmasi visual: "Suara berhasil".

### 3.2 Admin
- Dashboard ringkas: total suara masuk, perolehan per kandidat.
- Kelola kandidat: tambah/edit/hapus (nama, foto, visi misi).
- Generate token voting (sekalian bisa export CSV untuk dibagikan).
- Auto-deactivate token yang sudah dipakai.
- Set **periode voting** (start time & end time, WIB). Voting ditutup otomatis.
- Tutup voting lebih awal jika perlu.

---

## 4. Non-Fitur (di luar MVP v1)
- Login SSO sekolah (terlalu kompleks dan bergantung infrastruktur sekolah).
- Fitur komentar / debat kandidat.
- Voting multi-kandidat (MVP hanya 1 suara).
- Integrasi Google Sheets / WhatsApp API.

---

## 5. Tech Stack (Rekomendasi)
| Layer | Pilihan A (Paandi) | Pilihan B (Kuat) |
|-------|-------------------|------------------|
| Frontend | HTML + Tailwind + vanilla JS (tanpa bundler) | Next.js + React + Tailwind |
| Backend | Firebase Auth (anon) + Firestore | FastAPI + SQLite |

**Penjelasan:** karena pengguna biasanya sekolah, deploy paling mudah ke **Netlify/Vercel** (Pilihan A) atau **Cloud Run** (Pilihan B).

---

## 6. User Flow
```
Pemilih:
1. Buka halaman web
2. Masukkan token → otomatis lanjut ke halaman voting
3. Pilih kandidat
4. Klik "Submit"
5. Lihat ringkasan hasil (realtime)

Admin:
1. Login ke dashboard
2. Tambah data kandidat + generate token
3. Bagikan token ke siswa
4. Pantau hasil realtime
5. Tutup voting (manual / otomatis)
```

---

## 7. Security (Dasar)
- Token harus acak, panjang 8-12 karakter.
- Voting ditolak jika token expired / sudah dipakai.
- Periode voting dicek server-side (jangan cuma client).
- Minimal tanpa identitas pribadi siswa, cukup token.

---

## 8. Metrics / KPI
- Total suara masuk.
- Persentase partisipasi (total token terpakai vs total token generated).
- Waktu rata-rata pilih kandidat.
- Jumlah kandidat yang dapat vote.

---

## 9. Milestone
| Week | Target |
|------|--------|
| Week 1 | Siap PRD ini (finalisasi) & setup repo starter. |
| Week 2 | MVP siap: token + kandidat + submit vote + realtime result. |
| Week 3 | Admin dashboard siap, test bersama panitia. |
| Week 4 | Deploy live, bagikan link & token ke siswa. |

---

## 10. Pertanyaan untuk Panitia
1. Target pengguna: berapa jumlah siswa pemilih?
2. Apakah ada batas maksimal token yang dibagikan (misal hanya kelas 10 & 11)?
3. Apakah perlu histori log voting (siapa token mana yang vote kapan)?
4. Format saat ini untuk distribusi token: WhatsApp atau Google Sheet?