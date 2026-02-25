# 🚀 VibeBuild — AI Driven Solutions & Vibe Coding

A modern, animated workshop platform built for hackathon-style AI workshops. Participants log in individually, form their own teams, submit projects, get AI-powered guidance, and showcase their work — all from one beautiful dashboard.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-FF0055?logo=framer)
![MongoDB](https://img.shields.io/badge/MongoDB-Optional-47A248?logo=mongodb)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Individual Auth** | JWT login via User ID or Email, rate-limited (5 attempts/15min), HTTP-only cookies |
| 👥 **Self-Service Teams** | Participants create teams from the dashboard (team name, members, domain) |
| 📊 **Dashboard** | Projects Submitted summary with **Nexus Rating** & **Audit Score** (Admin reviewed) |
| 🚀 **Submission** | Dedicated page with **unique domains** (Fintech, Health, Space Tech, etc.) + Custom domain support |
| 🌍 **Project Showcase** | **Nexus Grid** with 3D hover effects, domain filtering, and expert ratings |
| 🛠️ **Admin Panel** | Manage participants, **Audit missions** (rate 1-5, score 0-100, technical feedback) |
| 🎓 **Certificates** | Admin-issued certificates (name, ID, type) with PDF generation & QR code |
| ❓ **FAQ** | Smooth accordion section powered by Radix UI |

---

## 🎨 Design

- **White / Light theme** with soft glassmorphism
- Smooth page transitions & micro-interactions
- Animated counters & floating particle effects
- Glow hover buttons & scroll reveal animations
- Premium AI startup aesthetic

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4 + Custom CSS |
| **Animations** | Framer Motion |
| **Database** | MongoDB via Mongoose (optional — falls back to in-memory store) |
| **Auth** | JWT (jose + jsonwebtoken) + bcryptjs |
| **AI** | OpenAI API (optional — built-in fallback responses) |
| **PDF** | jsPDF + QRCode |
| **CSV** | PapaParse |
| **UI Components** | Radix UI (Accordion, Dialog) |
| **Icons** | Lucide React |
| **Effects** | React Confetti |

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file and edit as needed:

```bash
cp .env.local.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | ✅ | Secret key for JWT tokens |
| `MONGODB_URI` | ❌ | MongoDB connection string (app works without it) |
| `OPENAI_API_KEY` | ❌ | OpenAI key for chatbot (has built-in fallback) |
| `NEXT_PUBLIC_APP_URL` | ❌ | App URL, defaults to `http://localhost:3000` |

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### 4. Build for production

```bash
npm run build
npm start
```

---

## 🔑 How It Works

### Admins (3 predefined accounts)
| Admin ID | Role |
|----------|------|
| `DMP001` | Faculty Coordinator |
| `25EC080` | Student Coordinator |
| `25EC112` | Student Coordinator |

- Auto-seeded on first MongoDB connection (default password: `temppass2024`)
- First login prompts for password change
- Can add participants (User ID, Password, Name, Email), edit, delete, and reset passwords

### Participants (40 pre-seeded)

All 40 participants from `UserIDP.xlsx` are auto-seeded into both MongoDB and the in-memory fallback store.

<details>
<summary>📋 Click to view all participants</summary>

| # | Student ID | Name |
|---|-----------|------|
| 1 | `25EC072` | Parmar Prerakkumar Pradipkumar |
| 2 | `25EC034` | Shardul Manish Gundekar |
| 3 | `25EC119` | Rudra Shah |
| 4 | `25EC063` | Arnav Pandya |
| 5 | `25EC117` | Jinesh Divyesh Shah |
| 6 | `25EC113` | Bhavyarajsinh Raulji |
| 7 | `25EC118` | Maan Niraj Shah |
| 8 | `25EC147` | Harmit Viradiya |
| 9 | `25EC075` | Patel Hari Mehulbhai |
| 10 | `25EC138A` | Vaghani Dev |
| 11 | `25EC142` | Prashant Valiyan |
| 12 | `25EC035` | Tirth italiya |
| 13 | `25EC026` | Parth Dudhat |
| 14 | `25EC071` | Kaushal Parmar |
| 15 | `25EC137` | Mantra Vadaliya |
| 16 | `25EC091` | Rohan Tarunkumar Patel |
| 17 | `25EC061` | Khushi Palande |
| 18 | `25EC101` | Yash Patel |
| 19 | `25EC090` | Richa Rakeshkumar Patel |
| 20 | `25EC145` | Shlok Vekariya |
| 21 | `25EC079` | Patel Jeel Nileshbhai |
| 22 | `25EC124` | Sumit Solanki |
| 23 | `25EC104` | Dhrumil Prajapati |
| 24 | `25EC130` | Aditya Tailor |
| 25 | `25EC033` | Gujarati Ishan Bharatbhai |
| 26 | `25EC149` | Meet Sakariya |
| 27 | `25EC030` | Ghetia Riya Miteshbhai |
| 28 | `25EC087` | Prince prajulkumar patel |
| 29 | `25EC125` | Hitansh soni |
| 30 | `25EC121` | SHARMA HARSH MEGHA |
| 31 | `25EC022` | Tvisha Dhokai |
| 32 | `25EC096` | Smeet Hetalkumar Patel |
| 33 | `25EC120` | Vraj Jaykumar Shah |
| 34 | `25EC006` | Yogi Bambharoliya |
| 35 | `25EC081` | Patel Kris Bharatbhai |
| 36 | `25EC132` | Thakkar Meera Jitendrakumar |
| 37 | `25EC109` | Suhani Rana |
| 38 | `25EC076` | Harsh Maulikbhai Patel |
| 39 | `25EC115` | Dharman Savaliya |
| 40 | `25EC039` | Swastik Kachhadiya |

</details>

- Log in with **Student ID** + assigned password
- Build your team from the **Dashboard**
- Launch your **Mission** from the dedicated **Project Submission** page:
  - Choose a unique domain (Fintech, Health, etc.)
  - Define technical specifications & problem statement
  - Deploy to the Nexus grid with GitHub & Live Demo
- Monitor your **Expert Audit Review** on the dashboard once finalized by an admin

### 🛸 Mission Domains
| Domain | Focus Area |
|--------|------------|
| **Fintech** | Financial intelligence & digital economy |
| **Education** | Next-gen learning & skill acquisition |
| **Agriculture** | Food technology & sustainable farming |
| **Health** | Bio-tech & AI-driven wellness |
| **Space Tech** | Orbital logistics & aerospace innovation |
| **AI/ML** | Core neural algorithms & generic intelligence |
| **Custom** | Specialized missions outside standard protocols |

### Security
- 🔒 JWT stored in HTTP-only secure cookies
- 🔒 bcrypt password hashing (10 salt rounds)
- 🔒 Rate limiting: 5 login attempts per IP per 15 minutes
- 🔒 Minimum password length: 8 characters
- 🔒 No public registration API
- 🔒 Middleware route protection for `/admin` and `/dashboard`

> **Note:** Without MongoDB, data is stored in-memory with file-based persistence (`.data/store.json`). Full data persists across server restarts locally.

---

## 📁 Project Structure

```
├── app/
│   ├── page.js              # Landing page
│   ├── layout.js            # Root layout with Navbar, Footer, ChatBot
│   ├── globals.css           # Global styles & design tokens
│   ├── login/               # Authentication page
│   ├── dashboard/           # Participant dashboard, team creation & project submission
│   ├── showcase/            # Public project showcase + student submissions
│   ├── gallery/             # Media gallery with admin approval
│   ├── certificates/        # Certificate viewer & PDF generation
│   ├── faq/                 # FAQ accordion section
│   ├── admin/
│   │   ├── page.js          # Admin panel — manage participants
│   │   ├── attendance/      # Attendance tracking
│   │   └── reports/         # Reports & materials management
│   └── api/
│       ├── auth/            # Login, set-password, change-password, verify, logout
│       ├── projects/        # Project CRUD
│       ├── teams/           # Participant team creation & management
│       ├── attendance/      # Attendance CRUD
│       ├── gallery/         # Gallery upload & approval
│       ├── certificates/    # Certificate issuance
│       ├── reports/         # Reports management
│       ├── chat/            # AI chatbot endpoint
│       ├── admin/           # Participant management, create-user, reset-password & settings
│       └── stats/           # Workshop statistics
├── components/
│   ├── Navbar.js            # Navigation bar
│   ├── Footer.js            # Site footer
│   ├── ChatBot.js           # Floating AI chatbot
│   ├── ParticleBackground.js # Animated particle effects
│   └── UIComponents.js      # Reusable UI primitives
├── lib/
│   ├── db.js                # MongoDB connection
│   ├── tryDb.js             # DB connection attempt wrapper
│   ├── auth.js              # JWT verification utilities
│   ├── AuthContext.js       # React auth context provider
│   ├── memoryStore.js       # In-memory fallback data store
│   └── models/
│       ├── User.js          # User account schema (admins + participants)
│       ├── Team.js          # User-created team schema
│       ├── Project.js       # Project submission schema
│       ├── Attendance.js    # Attendance record schema
│       ├── Gallery.js       # Gallery item schema
│       └── Settings.js      # Workshop settings schema
├── middleware.js             # Route protection & JWT verification
└── public/                  # Static assets
```

---

## 🚢 Deployment

### Vercel + MongoDB Atlas (Recommended)

1. **MongoDB Atlas** (free): Create a cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Create a database user
   - Set Network Access to `0.0.0.0/0` (Allow All)
   - Copy connection string

2. **GitHub**: Push your code
   ```bash
   git add . && git commit -m "deploy" && git push origin main
   ```

3. **Vercel**: Import repo at [vercel.com](https://vercel.com) and add environment variables:
   | Variable | Value |
   |----------|-------|
   | `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/vibebuild` |
   | `JWT_SECRET` | Any secure random string |
   | `OPENAI_API_KEY` | (Optional) OpenAI API key for chatbot |

4. Deploy — admin accounts auto-seed on first connection

### Local / Self-Hosted

```bash
npm run build
npm start
```

Without MongoDB, data persists locally via `.data/store.json`.

---

## 📄 License

MIT
