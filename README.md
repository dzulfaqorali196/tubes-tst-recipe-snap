# <div align="center">🍳 Recipe Snap 📸</div>

<div align="center">
  <h3>Aplikasi Pendeteksi Resep dari Gambar Makanan</h3>
  <p>Dibuat oleh:</p>
  <p><strong>Dzulfaqor A.D</strong></p>
  <p><strong>18222017</strong></p>
</div>

## 📖 Deskripsi
Recipe Snap adalah aplikasi web yang memungkinkan pengguna untuk mendapatkan resep makanan hanya dengan mengunggah foto makanan. Aplikasi ini menggunakan teknologi AI Vision untuk mendeteksi makanan dalam gambar dan memberikan rekomendasi resep yang sesuai.

## 🚀 Fitur Utama
- 📸 Upload foto makanan
- 🤖 Deteksi makanan menggunakan AI Vision
- 📝 Mendapatkan resep detail
- 👤 Manajemen profil pengguna
- 📱 Responsive design
- 📊 Riwayat pencarian resep

## 🛠 Teknologi yang Digunakan
- **Frontend**: Next.js 13 dengan App Router
- **Backend**: Next.js API Routes
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **AI Vision**: Azure Computer Vision
- **Styling**: Tailwind CSS
- **Deployment**: Railway
- **Container**: Docker

## 🔑 API yang Digunakan

### 1. Azure Computer Vision API
- **Endpoint**: `https://recipe-snap-vision.cognitiveservices.azure.com/`
- **Fungsi**: Mendeteksi dan menganalisis gambar makanan
- **Fitur**: Object detection, Image analysis

### 2. Recipe API
- **Endpoint**: `https://smart-health-tst.up.railway.app/api/recipes`
- **Fungsi**: Menyediakan data resep makanan
- **Fitur**: 
  - Pencarian resep
  - Detail resep
  - Rekomendasi resep

### 3. Supabase API
- **URL**: `https://mshcrvetdqodotbllogr.supabase.co`
- **Fungsi**: Database dan autentikasi
- **Fitur**:
  - User management
  - Data storage
  - Real-time updates

## 🚀 Cara Menjalankan Aplikasi

### Prerequisites
- Node.js v18+
- Docker (opsional)
- npm atau yarn

### Instalasi Lokal
1. Clone repository
   ```bash
   git clone https://github.com/yourusername/recipe-snap.git
   cd recipe-snap
   ```

2. Install dependencies
   ```bash
   npm install
   # atau
   yarn install
   ```

3. Setup environment variables
   ```bash
   cp .env.example .env.local
   ```
   Isi semua environment variables yang diperlukan

4. Jalankan aplikasi
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

### Menggunakan Docker
1. Build image
   ```bash
   docker-compose build
   ```

2. Jalankan container
   ```bash
   docker-compose up
   ```

## 🌐 Deployment
Aplikasi ini di-deploy menggunakan Railway dengan konfigurasi:
- Production URL: https://tubes-tst-recipe-snap-production.up.railway.app
- Automatic deployment dari branch main
- Container-based deployment dengan Docker

## 📁 Struktur Proyek
```
recipe-snap/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── lib/             # Utility functions
│   ├── contexts/        # React contexts
│   └── types/           # TypeScript types
├── public/              # Static files
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose config
└── package.json        # Dependencies
```

## 🤝 Kontribusi
Jika Anda ingin berkontribusi pada proyek ini:
1. Fork repository
2. Buat branch baru
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## 📝 Lisensi
Proyek ini dilisensikan di bawah MIT License.

## 👨‍💻 Developer
- **Nama**: Dzulfaqor A.D
- **NIM**: 18222017
- **Institusi**: Institut Teknologi Bandung
- **Mata Kuliah**: Teknologi Sistem Terintegrasi
