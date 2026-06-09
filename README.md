# <img src="public/logo.svg" align="left" width="40" height="40" style="margin-right: 12px; vertical-align: middle;"> BizSim

> Platform Simulasi Arus Kas & Analisis Kesehatan Finansial UMKM

BizSim adalah platform simulasi finansial interaktif yang dirancang untuk membantu pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia memantau, menganalisis, dan memproyeksikan daya tahan arus kas (*cash runway*) usaha mereka.

Dengan mengintegrasikan pemodelan dual-inference (regresi & klasifikasi), BizSim mengidentifikasi tingkat risiko kesehatan modal sebelum kas operasional mengering.

## Fitur

* **Simulasi Proyeksi Instan**: Memprediksi ketahanan kas dalam hitungan bulan berdasarkan modal awal, biaya tetap, biaya variabel, dan pendapatan.
* **Klasifikasi Kesehatan Modal**: Menganalisis kondisi operasional untuk mengklasifikasikan bisnis ke dalam tingkat kesehatan finansial (`Critical`, `Struggling`, `Growth`, `Elite`).
* **Dashboard Log Finansial Bulanan**: Mengelola catatan log kas bulanan (tambah, edit, dan hapus data).
* **Grafik Interaktif & Responsif**:
  * **Tren Kas Bulanan**: Grafik batang komparatif pendapatan vs. total pengeluaran bulanan.
  * **Kurva Proyeksi Sisa Modal Kerja**: Grafik garis proyeksi kas dengan titik koordinat hover interaktif.
* **Sistem Tema HSL Adaptif**: Mendukung Light Mode & Dark Mode manual (class-based) di seluruh resolusi layar perangkat (Mobile, Tablet, Desktop).

> [!IMPORTANT]
> Keamanan data log dijamin terproteksi penuh di tingkat baris tabel database menggunakan **Row-Level Security (RLS) Supabase**, mencegah data bocor atau bercampur antar-pengguna.

## Arsitektur

### Frontend & Core
* **Framework**: Next.js (App Router) & React (TypeScript)
* **Styling**: Vanilla CSS + Tailwind CSS v4 (Class-based dark mode)
* **Auth**: React Context Provider + Supabase JWT Session
* **Visuals**: Lucide Icons & Custom SVG Charts

### Backend & Database
* **Server**: Express.js (dihubungkan via Next.js Dev Server / Vercel API routes)
* **Database**: PostgreSQL (Supabase)
* **Networking**: Axios Client Instance
* **API Route**: RESTful API (`/api/predict`, `/api/simulations`, `/api/monthly-logs`)

## Instalasi Lokal

### Prasyarat
* Node.js versi 18 atau lebih baru.

### 1. Kloning Repositori
```bash
git clone https://github.com/ro-boduck/Capstone-BizSim-Dicoding.git
cd Capstone-BizSim-Dicoding
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat berkas `.env` di direktori utama:
```env
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
PORT=3000
JWT_SECRET=your-custom-jwt-secret-key
```

> [!NOTE]
> Jika kredensial Supabase tidak dikonfigurasi, aplikasi akan otomatis berjalan dalam **Mode Demo** menggunakan penyimpanan memori lokal (*in-memory*).

### 4. Jalankan Server Pengembangan
Jalankan dev server yang menggabungkan server Express.js dan compiler Next.js:
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## API Endpoints

Seluruh route Express API diawali dengan `/api` dan dilindungi oleh otentikasi JWT:

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/api/predict` | Menghitung burn rate bulanan, prediksi runway, dan klasifikasi kesehatan. |
| `POST` | `/api/simulations` | Menyimpan riwayat hasil kalkulasi simulasi instan. |
| `GET` | `/api/simulations` | Mengambil seluruh riwayat simulasi milik pengguna aktif. |
| `GET` | `/api/monthly-logs` | Mengambil seluruh data catatan log bulanan pada dashboard. |
| `POST` | `/api/monthly-logs` | Menyimpan atau memperbarui data log bulanan ke database. |
| `DELETE` | `/api/monthly-logs/:id` | Menghapus entitas data log bulanan spesifik berdasarkan ID. |

## Deployment ke Vercel

Aplikasi ini siap dideploy ke **Vercel** menggunakan konfigurasi build `vercel.json` yang terintegrasi.

1. Hubungkan repositori ke dashboard Vercel.
2. Atur Environment Variables di panel pengaturan Vercel (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, dll.).
3. Vercel akan membaca berkas `vercel.json`, mengompilasi build statis Next.js, dan menjalankan server Express.js di lingkungan Serverless Functions.
