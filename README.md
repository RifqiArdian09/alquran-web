# Al-Quran Web (React + Vite)

Aplikasi web Al-Quran modern berbasis React + Vite dengan fokus pada pengalaman baca yang nyaman, cepat, dan estetis. Mendukung bookmark ayat, penyimpanan ayat terakhir dibaca, pemutar audio ayat, tema gelap/terang, dan pilihan aksen warna.

## Fitur Utama

- Modern UI/UX dengan tipografi dan animasi halus
- Daftar surah dan halaman detail surah
- Pemutar audio per ayat dengan kontrol play/pause dan auto-lanjut
- Bookmark ayat (simpan/hapus) tersimpan di `localStorage`
- Fitur "Terakhir dibaca" otomatis saat memutar ayat
- Tema Light/Dark dan pilihan aksen warna (Indigo, Emerald, Amber)
- Responsif untuk mobile dan desktop
- Aksesibilitas lebih baik (aria-label, focus states, kontras)

## Teknologi

- React 18 + Vite
- React Router (navigasi)
- CSS murni dengan CSS custom properties (variabel) dan animasi

## Menjalankan Proyek

Persyaratan:
- Node.js 18+ dan npm

Langkah pengembangan:

```bash
npm install
npm run dev
```

Buka di browser (Vite akan menampilkan URL, biasanya http://localhost:5173).

Build untuk produksi:

```bash
npm run build
npm run preview
```

## Struktur Proyek

```text
alquran-web/
├─ public/
├─ src/
│  ├─ assets/
│  ├─ components/
│  │  ├─ AyahItem.jsx
│  │  ├─ Navbar.jsx
│  │  └─ SurahListItem.jsx
│  ├─ context/
│  │  └─ AudioContext.jsx
│  ├─ hooks/
│  │  └─ useLocalStorage.js
│  ├─ pages/
│  │  └─ SurahDetail.jsx
│  ├─ services/
│  │  └─ quranApi.js
│  ├─ index.css
│  └─ main.jsx
├─ index.html
├─ package.json
└─ vite.config.js
```

## Penjelasan Modul Penting

- `src/services/quranApi.js`
  - Abstraksi pemanggilan API/berkas untuk data surah dan ayat.
  - Contoh fungsi: `getSurahDualEdition(id)` yang mengembalikan metadata surah dan daftar ayat (Arab + terjemah + audio).

- `src/pages/SurahDetail.jsx`
  - Halaman detail surah: memuat data, menampilkan daftar ayat dengan komponen `AyahItem`, navigasi Prev/Next surah, dan skeleton loading.

- `src/components/AyahItem.jsx`
  - Menampilkan satu ayat: nomor, teks Arab, terjemahan, tombol bookmark, dan kontrol audio.
  - Menggunakan `AudioContext` untuk memastikan hanya satu audio yang bermain pada satu waktu.
  - Menyimpan status "terakhir dibaca" saat tombol play ditekan.

- `src/context/AudioContext.jsx`
  - Mengelola audio yang sedang aktif secara global agar tidak tumpang tindih.

- `src/hooks/useLocalStorage.js`
  - Hook utilitas untuk persistensi nilai ke `localStorage` (tema, aksen, dsb).

## Penyimpanan Lokal (localStorage)

- Bookmark ayat
  - Key: `alquran.bookmarks`
  - Format array objek: `{ surahNumber, ayahNumberInSurah, arabText, idText, audioUrl, timestamp }`
- Terakhir dibaca
  - Key: `alquran.lastRead`
  - Format: `{ surahNumber, ayahNumberInSurah, updatedAt }`
- Tema dan aksen
  - `alquran.theme` = `light | dark`
  - `alquran.accent` = `indigo | emerald | amber`

## Gaya & Tema

- Seluruh styling utama berada di `src/index.css`.
- Memanfaatkan CSS variables untuk warna utama, border, shadow, dan gradient.
- Mode gelap diaktifkan dengan menambahkan class `dark` pada `:root` (dikelola oleh hook `useTheme`).
- Aksen warna diatur melalui attribute `data-accent` pada `:root`.

## Skrip npm

- `dev` — Menjalankan server pengembangan Vite.
- `build` — Build untuk produksi.
- `preview` — Menjalankan pratinjau build produksi.

## Kualitas Kode

- Proyek menyertakan konfigurasi ESLint. Jalankan lint sesuai kebutuhan Anda.
- Struktur komponen dipecah menjadi bagian-bagian kecil agar mudah dirawat.

## Kontribusi

Kontribusi sangat terbuka! Saran fitur, perbaikan bug, atau peningkatan performa/aksesibilitas sangat dihargai.

Langkah umum kontribusi:
1. Fork repo ini.
2. Buat branch fitur/bugfix: `git checkout -b fitur/nama-fitur`.
3. Lakukan perubahan dan pastikan lulus build.
4. Ajukan Pull Request dengan deskripsi perubahan yang jelas.

## Lisensi

MIT — bebas digunakan dan dimodifikasi dengan menyertakan lisensi ini.

---

Terima kasih telah menggunakan aplikasi Al-Quran Web. Semoga bermanfaat!
