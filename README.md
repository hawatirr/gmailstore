# Digital Store - Website Jual Produk Digital

Proyek website jual produk digital dengan auto-payment Binance Pay dan auto-delivery.

## 📁 Struktur Folder

```
/workspace
├── app/                    # Frontend Next.js
│   ├── app/               # App Router pages
│   │   ├── globals.css    # Global styles (Tailwind)
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Homepage
│   ├── components/        # Reusable React components
│   ├── lib/              # Utility functions & helpers
│   ├── public/           # Static assets
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── tsconfig.json
│
├── server/                # Backend Express.js
│   ├── src/
│   │   ├── index.js      # Entry point
│   │   ├── routes/       # API routes
│   │   │   ├── auth.js
│   │   │   ├── payment.js
│   │   │   └── products.js
│   │   ├── controllers/  # Business logic
│   │   │   ├── authController.js
│   │   │   ├── paymentController.js
│   │   │   └── productController.js
│   │   ├── middleware/   # Express middleware
│   │   │   ├── auth.js
│   │   │   └── validation.js
│   │   └── utils/        # Helper functions
│   └── package.json
│
├── db/                    # Database schema & migrations
│   └── schema.prisma     # Prisma ORM schema
│
├── public/               # Public static files (shared)
│
├── .env.example          # Template environment variables
├── .gitignore
├── roadmap.html          # Roadmap pengembangan interaktif
└── README.md            # This file
```

## 🚀 Cara Menjalankan

### 1. Setup Environment

```bash
# Copy file environment
cp .env.example .env

# Edit .env dan sesuaikan konfigurasi
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
cd app
npm install

# Install backend dependencies
cd ../server
npm install

# Install Prisma CLI
npm install -g prisma
```

### 3. Setup Database

```bash
cd server

# Generate Prisma Client
npx prisma generate

# Run migration (buat database SQLite)
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

### 4. Jalankan Development Server

```bash
# Terminal 1 - Backend
cd server
npm run dev
# Server berjalan di http://localhost:3001

# Terminal 2 - Frontend
cd app
npm run dev
# Frontend berjalan di http://localhost:3000
```

## 🔧 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TailwindCSS**
- **TypeScript**
- **Lucide Icons**

### Backend
- **Express.js**
- **Prisma ORM**
- **SQLite** (dev) / **PostgreSQL** (prod)
- **JWT** untuk autentikasi
- **Bcrypt** untuk password hashing

### Payment Gateway
- **Binance Pay Sandbox** (testnet)

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - List semua produk
- `GET /api/products/:id` - Detail produk
- `POST /api/products` - Create produk (auth required)
- `PUT /api/products/:id` - Update produk (auth required)
- `DELETE /api/products/:id` - Delete produk (auth required)

### Payment
- `POST /api/payment/create-order` - Buat order pembayaran (auth required)
- `POST /api/payment/binance-webhook` - Webhook callback dari Binance
- `GET /api/payment/status/:orderId` - Cek status order (auth required)

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Connection string database | `file:./dev.db` |
| `JWT_SECRET` | Secret key untuk JWT | `your-secret-key` |
| `BINANCE_API_KEY` | Binance Pay API Key | `your-api-key` |
| `BINANCE_SECRET_KEY` | Binance Pay Secret Key | `your-secret` |
| `APP_URL` | URL aplikasi frontend | `http://localhost:3000` |
| `PORT` | Port backend server | `3001` |

## 📌 Next Steps (Phase Berikutnya)

1. ✅ **Phase 1**: Setup Proyek & Arsitektur Dasar (SELESAI)
2. ⏳ **Phase 2**: Autentikasi & Database Schema
3. ⏳ **Phase 3**: Integrasi Binance Pay (Sandbox)
4. ⏳ **Phase 4**: Sistem Auto-Delivery Produk
5. ⏳ **Phase 5**: Frontend UI (Simple & Elegan)
6. ⏳ **Phase 6**: Testing, Keamanan & Deploy

## 📄 License

MIT License