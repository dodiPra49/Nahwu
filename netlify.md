# Panduan & Rencana Deployment Aplikasi Nahwu & Sharaf AI ke Netlify

Dokumen ini berisi panduan komprehensif langkah-demi-langkah untuk melakukan deployment aplikasi **Nahwu & Sharaf AI** (React.js + Vite) ke platform hosting **[Netlify](https://www.netlify.com/)**.

---

## 1. Ringkasan Kesiapan Proyek (Pre-Deployment Checklist)

Proyek ini telah dilengkapi dengan konfigurasi otomatis yang kompatibel 100% dengan Netlify:

| Komponen | Status | Keterangan |
|:---|:---:|:---|
| **File Konfigurasi Netlify** |  Tersedia | [`netlify.toml`](file:///d:/DODI%20AGUSRI.S.KOM/2026%202026%202026/FELLOW%20DEVELOPER/React.JS/NAHWU/netlify.toml) sudah berisi build command, publish dir, dan header keamanan. |
| **Aturan SPA Routing** |  Tersedia | Rule `/* -> /index.html 200` aktif untuk mencegah error 404 saat refresh halaman. |
| **Build Bundle Produksi** |  Terverifikasi | Perintah `npm run build` menghasilkan bundle teroptimasi di direktori `dist/`. |
| **Repository GitHub** |  Terhubung | Source code telah ter-push lengkap di **[github.com/dodiPra49/Nahwu](https://github.com/dodiPra49/Nahwu)**. |

---

## 2. Opsi Metode Deployment

Tersedia 2 metode untuk mendeploy aplikasi ini ke akun Netlify Anda:
- **Metode A (Rekomendasi Utama)**: *Continuous Deployment via GitHub* (Otomatis re-deploy setiap kali melakukan `git push`).
- **Metode B (Alternatif Cepat)**: *Netlify CLI / Netlify Drop Drag-and-Drop* (Manual upload folder `dist`).

---

### METODE A: Continuous Deployment via GitHub (Sangat Disarankan)

Metode ini menghubungkan repository GitHub Anda ke Netlify. Setiap ada perubahan kode baru, Netlify akan otomatis mengompilasi dan memperbarui website secara instan.

#### Langkah 1: Masuk ke Akun Netlify
1. Buka peramban dan kunjungi dashboard: **[https://app.netlify.com/](https://app.netlify.com/)**.
2. Masuk menggunakan akun Netlify Anda (disarankan klik tombol **"Log in with GitHub"** menggunakan akun GitHub `dodiPra49`).

#### Langkah 2: Tambahkan Proyek Baru
1. Pada dashboard Netlify, klik tombol biru **"Add new site"** di kanan atas.
2. Pilih opsi **"Import an existing project"**.
3. Pada pilihan Git provider, pilih **"GitHub"**.
4. Jika diminta izin otorisasi, klik **Authorize Netlify**.
5. Cari dan pilih repository: **`dodiPra49/Nahwu`**.

#### Langkah 3: Verifikasi Pengaturan Build (Site Configuration)
Netlify akan otomatis membaca file [`netlify.toml`](file:///d:/DODI%20AGUSRI.S.KOM/2026%202026%202026/FELLOW%20DEVELOPER/React.JS/NAHWU/netlify.toml) yang sudah kita buat:
- **Branch to deploy**: `main`
- **Base directory**: (kosongkan / root)
- **Build command**: `npm run build`
- **Publish directory**: `dist`

#### Langkah 4: Konfigurasi Environment Variable (API Key Gemini)
Sebelum menekan tombol deploy, tambahkan API key agar aplikasi langsung aktif:
1. Klik menu dropdown/accordion **"Add environment variables"** atau **"Environment variables"**.
2. Klik **"Add a variable"**:
   - **Key**: `VITE_GEMINI_API_KEY`
   - **Value**: Masukkan API Key Google Gemini Anda (dari [aistudio.google.com](https://aistudio.google.com/app/apikey)).
   *(Catatan: Pengguna juga tetap bisa memasukkan/mengganti API Key langsung di aplikasi melalui tombol "Set API Key" di navbar)*.

#### Langkah 5: Jalankan Deploy
1. Klik tombol hijau **"Deploy Nahwu"**.
2. Netlify akan menjalankan proses build (`npm run build`). Proses ini biasanya memakan waktu sekitar **30–60 detik**.
3. Setelah selesai, status akan berubah menjadi **"Site is live"** disertai URL publik Netlify (contoh: `https://nahwu-xyz123.netlify.app`).

---

### METODE B: Deploy Manual via Netlify CLI (Alternatif Cepat dari Terminal)

Jika Anda ingin mendeploy langsung dari komputer lokal menggunakan terminal PowerShell:

1. Buat bundle produksi terbaru:
   ```powershell
   npm run build
   ```
2. Jalankan deployment menggunakan `npx`:
   ```powershell
   npx netlify deploy --prod
   ```
3. Terminal akan membuka browser untuk login ke akun Netlify Anda.
4. Pilih **"Create & configure a new site"**.
5. Masukkan nama situs (opsional, contoh: `nahwu-quran-ai`).
6. Ketika ditanya **"Publish directory"**, ketik: `dist`.
7. Situs Anda langsung online dalam hitungan detik!

---

## 3. Langkah Pasca-Deployment (Post-Deployment Configuration)

Setelah aplikasi aktif di Netlify, lakukan langkah kustomisasi berikut:

### 1. Mengganti Nama Domain Netlify (Custom Subdomain)
Agar URL website Anda mudah diingat:
1. Di dashboard situs Netlify Anda, buka tab **"Site configuration"** -> **"Site details"**.
2. Klik **"Change site name"**.
3. Masukkan nama yang diinginkan, misalnya: `nahwu-ai` atau `quran-nahwu-sharaf`.
4. URL website Anda akan menjadi: **`https://nahwu-ai.netlify.app`**.

### 2. Pengujian Fungsionalitas Live
Buka URL situs Netlify di browser laptop dan smartphone Anda:
- [ ] Uji input pencarian preset cepat (*Al-Fatihah 1*, *Ayat Kursi*, *Al-Ikhlas 1*).
- [ ] Buka modal analisis kata untuk memeriksa kelancaran tampilan **Bottom Sheet** di smartphone.
- [ ] Uji fitur audio tilawah untuk memastikan pemutaran suara berjalan lancar.
- [ ] Coba masukkan API Key di menu *Set API Key* dan uji koneksi.

---

*Dokumen ini dibuat otomatis sebagai panduan resmi deployment proyek Quran Nahwu & Sharaf AI.*
