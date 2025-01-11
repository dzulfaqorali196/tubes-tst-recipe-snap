# <div align="center">🍳 Recipe Snap 📸</div>

<div align="center">
  <h3>Aplikasi Pendeteksi Resep dari Gambar Makanan</h3>
  <p>Website: <a href="https://tubes-tst-recipe-snap-production.up.railway.app/">https://tubes-tst-recipe-snap-production.up.railway.app/</a></p>
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

### Cara Menggunakan API Service

#### 1. Mendapatkan API Key
1. Buka [Recipe Snap](https://tubes-tst-recipe-snap-production.up.railway.app/)
2. Login menggunakan akun Google
3. Buka halaman API Documentation
4. Masukkan domain aplikasi Anda
5. Klik "Generate API Key"
6. Simpan API key yang dihasilkan

#### 2. Menggunakan API Key
Sertakan API key di header setiap request:
```http
X-API-Key: YOUR_API_KEY
```

#### 3. Contoh Penggunaan

##### Menggunakan cURL
```bash
# Analisis Gambar
curl -X POST https://tubes-tst-recipe-snap-production.up.railway.app/api/recipes/analyze \
  -H "X-API-Key: YOUR_API_KEY" \
  -F "image=@path/to/image.jpg"

# Generate Resep
curl -X POST https://tubes-tst-recipe-snap-production.up.railway.app/api/recipes/generate \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["bawang", "tomat", "cabai"]}'
```

##### Menggunakan JavaScript/TypeScript
```typescript
// Analisis Gambar
const analyzeImage = async (imageFile: File) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch('https://tubes-tst-recipe-snap-production.up.railway.app/api/recipes/analyze', {
    method: 'POST',
    headers: {
      'X-API-Key': 'YOUR_API_KEY'
    },
    body: formData
  });

  return await response.json();
};

// Generate Resep
const generateRecipes = async (ingredients: string[]) => {
  const response = await fetch('https://tubes-tst-recipe-snap-production.up.railway.app/api/recipes/generate', {
    method: 'POST',
    headers: {
      'X-API-Key': 'YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ingredients })
  });

  return await response.json();
};
```

##### Menggunakan Python
```python
import requests

# Analisis Gambar
def analyze_image(image_path):
    with open(image_path, 'rb') as image:
        response = requests.post(
            'https://tubes-tst-recipe-snap-production.up.railway.app/api/recipes/analyze',
            headers={'X-API-Key': 'YOUR_API_KEY'},
            files={'image': image}
        )
    return response.json()

# Generate Resep
def generate_recipes(ingredients):
    response = requests.post(
        'https://tubes-tst-recipe-snap-production.up.railway.app/api/recipes/generate',
        headers={
            'X-API-Key': 'YOUR_API_KEY',
            'Content-Type': 'application/json'
        },
        json={'ingredients': ingredients}
    )
    return response.json()
```

### Autentikasi
Recipe Snap menggunakan Supabase untuk autentikasi. Tersedia dua metode autentikasi:

#### 1. OAuth dengan Google
```http
GET /auth/google/signin
```
Mengalihkan pengguna ke halaman login Google.

**Flow Autentikasi:**
1. User mengklik tombol "Masuk dengan Google"
2. Sistem mengalihkan ke halaman login Google
3. Setelah login berhasil, Google mengarahkan kembali ke `/auth/callback`
4. Sistem menukar kode autentikasi dengan session
5. User diarahkan ke dashboard jika berhasil

**Callback URL:**
```http
GET /auth/callback?code={auth_code}
```

**Response Success:**
- Redirect ke `/dashboard`

**Response Error:**
- Redirect ke `/auth?error=auth_callback_error` (Gagal menukar kode)
- Redirect ke `/auth?error=session_error` (Gagal membuat sesi)
- Redirect ke `/auth?error=no_code` (Tidak ada kode auth)
- Redirect ke `/auth?error=unexpected` (Error tidak terduga)

#### 2. Sign Out
```http
POST /auth/signout
```
Mengakhiri sesi pengguna yang sedang aktif.

**Response Success:**
```json
{
  "success": true,
  "message": "Successfully signed out"
}
```

**Response Error:**
```json
{
  "error": "Failed to sign out",
  "message": "Error detail message"
}
```

### API Endpoints

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
## 📊 Schema Database

### 1. Tabel Users (Managed by Supabase Auth)
```sql
users (
  id            uuid primary key,
  email         text unique,
  created_at    timestamp with time zone,
  updated_at    timestamp with time zone
)
```

### 2. Tabel Image Analysis
```sql
image_analysis (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references users(id),
  image_path    text not null,
  image_url     text not null,
  ingredients   jsonb,
  created_at    timestamp with time zone default now(),
  updated_at    timestamp with time zone default now()
)
```

### 3. Tabel Recipe History
```sql
recipe_history (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references users(id),
  image_id      uuid references image_analysis(id),
  recipe_data   jsonb,
  created_at    timestamp with time zone default now(),
  updated_at    timestamp with time zone default now()
)
```

### 4. Tabel API Keys
```sql
api_keys (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references users(id),
  key_value     text unique not null,
  domain        text not null,
  is_active     boolean default true,
  created_at    timestamp with time zone default now(),
  expires_at    timestamp with time zone
)
```

### Relasi Antar Tabel
- `users` ← `image_analysis`: Satu user dapat memiliki banyak analisis gambar
- `users` ← `recipe_history`: Satu user dapat memiliki banyak riwayat resep
- `image_analysis` ← `recipe_history`: Satu analisis gambar dapat memiliki satu riwayat resep
- `users` ← `api_keys`: Satu user dapat memiliki banyak API key

### Policies
Supabase RLS (Row Level Security) policies diterapkan untuk memastikan:
1. User hanya dapat mengakses data miliknya sendiri
2. API key hanya dapat digunakan oleh pemiliknya
3. Data analisis gambar dan resep terkait dengan user yang membuatnya

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

## 👨‍💻 Developer
- **Nama**: Dzulfaqor A.D
- **NIM**: 18222017
- **Institusi**: Institut Teknologi Bandung
- **Mata Kuliah**: Teknologi Sistem Terintegrasi