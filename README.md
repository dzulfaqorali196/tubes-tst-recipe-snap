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

## 🔑 Dokumentasi API

### Base URL
```
https://tubes-tst-recipe-snap-production.up.railway.app/api
```

### Autentikasi
Semua endpoint memerlukan API key yang valid dalam header request:
```
X-API-Key: YOUR_API_KEY
```

### Endpoints

#### 1. Generate Resep
```http
POST /recipes/generate
```
Menghasilkan resep berdasarkan daftar bahan.

**Request Body:**
```json
{
  "ingredients": ["bawang", "tomat", "cabai"]
}
```

**Response:**
```json
{
  "success": true,
  "recipes": [
    {
      "name": "Nasi Goreng Spesial",
      "description": "Nasi goreng dengan bumbu spesial",
      "ingredients": ["bawang", "tomat", "cabai"],
      "instructions": [
        "1. Tumis bumbu halus hingga harum",
        "2. Masukkan nasi dan aduk rata",
        "3. Tambahkan kecap dan bumbu lainnya"
      ]
    }
  ]
}
```

#### 2. Analisis Gambar
```http
POST /recipes/analyze
```
Menganalisis gambar makanan dan mendeteksi bahan-bahan.

**Request Body:**
```
Form Data:
- image: File (gambar makanan)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ingredients": [
      {
        "name": "tomat",
        "confidence": 0.95
      }
    ],
    "image_url": "https://example.com/image.jpg",
    "timestamp": "2024-01-20T12:00:00Z"
  }
}
```

#### 3. Daftar Resep
```http
GET /recipes
```
Mendapatkan daftar resep dengan pagination.

**Query Parameters:**
- page (optional): Nomor halaman (default: 1)
- limit (optional): Jumlah item per halaman (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "recipes": [
      {
        "id": 1,
        "name": "Nasi Goreng",
        "ingredients": ["nasi", "bawang", "telur"],
        "thumbnail": "https://example.com/nasi-goreng.jpg"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10
    }
  }
}
```

#### 4. Riwayat Analisis
```http
GET /recipes/history
```
Mendapatkan riwayat analisis gambar pengguna.

**Query Parameters:**
- page (optional): Nomor halaman (default: 1)
- limit (optional): Jumlah item per halaman (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "id": 1,
        "timestamp": "2024-01-20T12:00:00Z",
        "recipe_name": "Nasi Goreng Spesial",
        "ingredients": ["bawang", "tomat", "cabai"],
        "image_url": "https://example.com/nasi-goreng.jpg"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10
    }
  }
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Invalid ingredients data"
}
```

#### 401 Unauthorized
```json
{
  "error": "API key tidak valid atau tidak ditemukan"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Gagal menghasilkan resep. Silakan coba lagi."
}
```

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
