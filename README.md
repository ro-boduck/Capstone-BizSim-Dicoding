# BizSim – Platform Simulasi Arus Kas & Analisis Kesehatan Finansial UMKM

BizSim adalah platform simulasi finansial interaktif yang dirancang khusus untuk membantu pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia memantau, menganalisis, dan memproyeksikan daya tahan arus kas (*cash runway*) mereka. Aplikasi ini mengintegrasikan pemodelan dual-inference (regresi & klasifikasi) untuk mengidentifikasi tingkat risiko kesehatan modal sebelum kas operasional mengering.

---

## 🚀 Fitur Utama

- **Simulasi Proyeksi Instan**: Lakukan simulasi cepat dengan memasukkan modal awal, biaya tetap, biaya variabel, dan proyeksi pendapatan untuk memprediksi ketahanan kas dalam hitungan bulan.
- **Klasifikasi Kesehatan Modal**: Menganalisis kondisi operasional untuk mengklasifikasikan bisnis ke dalam tingkat kesehatan finansial (`Critical`, `Struggling`, `Growth`, `Elite`).
- **Dashboard Log Finansial Bulanan**: Pantau sejarah arus kas riil secara berkala. Pengguna dapat menambah, mengedit, atau menghapus catatan log kas bulanan.
- **Grafik Interaktif & Responsif**:
  - **Tren Kas Bulanan**: Grafik batang komparatif pendapatan vs. total pengeluaran bulanan.
  - **Kurva Proyeksi Sisa Modal Kerja**: Grafik garis proyeksi kas yang dilengkapi dengan titik koordinat hover interaktif.
- **Sistem Tema HSL Adaptif**: Tampilan modern premium berbasis HSL design tokens yang mendukung Light Mode & Dark Mode manual (class-based) di semua resolusi layar perangkat (Mobile, Tablet, Desktop).
- **Row-Level Security (RLS) Supabase**: Keamanan data log dijamin terproteksi penuh di tingkat baris tabel database, mencegah data bocor atau tercampur antar pengguna.

---

## 🛠️ Tech Stack & Arsitektur

### Frontend & Core
- **Framework**: Next.js (App Router) & React (TypeScript)
- **Styling**: Vanilla CSS + Tailwind CSS v4 (Class-based dark mode)
- **State & Auth**: React Context Provider + Supabase JWT Session
- **Visuals**: Lucide Icons & Custom SVG Charts

### Backend & Database
- **Server Gateway**: Express.js (dihubungkan via Next.js Dev Server / Vercel API routes)
- **Database**: PostgreSQL (Supabase)
- **Networking**: Axios Client Instance dengan custom interceptor
- **API Convention**: RESTful API (/api/predict, /api/simulations, /api/monthly-logs)

---

## ⚙️ Panduan Instalasi Lokal

### Prasyarat
- Node.js versi 18 atau yang lebih baru.
- Akun Supabase (opsional, aplikasi otomatis berjalan dalam **Mode Demo** menggunakan penyimpanan memori lokal jika kredensial tidak dikonfigurasi).

### Langkah 1: Kloning Repositori
```bash
git clone https://github.com/ro-boduck/Capstone-BizSim-Dicoding.git
cd Capstone-BizSim-Dicoding
```

### Langkah 2: Instalasi Dependensi
```bash
npm install
```

### Langkah 3: Konfigurasi Environment Variables
Buat file `.env` di direktori utama proyek Anda, lalu masukkan kredensial berikut (jika ingin menggunakan integrasi database Supabase):
```env
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
PORT=3000
JWT_SECRET=your-custom-jwt-secret-key
```

### Langkah 4: Jalankan Server Pengembangan
Jalankan dev server yang menggabungkan server Express.js dan compiler Next.js:
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat aplikasinya secara langsung.

---

## 🧪 Struktur API Endpoints (RESTful)

Seluruh route Express API diawali dengan `/api` dan dilindungi oleh otentikasi JWT:

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/api/predict` | Menghitung burn rate bulanan, prediksi cash runway, dan klasifikasi kesehatan finansial. |
| `POST` | `/api/simulations` | Menyimpan riwayat hasil kalkulasi simulasi instan. |
| `GET` | `/api/simulations` | Mengambil seluruh riwayat simulasi milik pengguna aktif. |
| `GET` | `/api/monthly-logs` | Mengambil seluruh data catatan log bulanan pada dashboard. |
| `POST` | `/api/monthly-logs` | Menyimpan atau memperbarui data log bulanan baru ke database. |
| `DELETE` | `/api/monthly-logs/:id` | Menghapus entitas data log bulanan spesifik berdasarkan ID. |

---

## ☁️ Deployment ke Vercel

Aplikasi ini siap dideploy ke **Vercel** menggunakan konfigurasi build `vercel.json` yang terintegrasi.

1. Hubungkan repositori Anda ke dashboard Vercel.
2. Atur Environment Variables di panel pengaturan Vercel (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, dll.).
3. Vercel akan membaca berkas `vercel.json` dan secara otomatis mengompilasi build statis Next.js serta menjalankan server Express.js di lingkungan Serverless Functions.

---

## 👥 Kontributor (Capstone Team CC26-PRU422)
Dikembangkan sebagai bagian dari inisiatif Coding Camp 2026 didukung oleh DBS Foundation untuk kemajuan literasi keuangan UMKM Indonesia.
