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
| 🔐 **Individual Auth** | JWT login with unique User IDs — each participant has their own account |
| 👥 **Self-Service Teams** | Participants create teams from the dashboard (team name, members, domain) |
| 📊 **Dashboard** | Countdown timer, progress tracker, team creation, project submission with confetti |
| 🌍 **Project Showcase** | Public grid with domain filters, search, hover animations & student submission form |
| 🤖 **AI Chatbot** | Floating assistant with OpenAI integration + built-in fallback guides for GitHub & Vercel deployment |
| 🖼️ **Gallery** | Masonry layout with lightbox, video model & admin upload/approval system |
| 📋 **Attendance** | Admin CRUD with first/second half toggles & CSV export |
| 📈 **Reports** | Upload & manage event materials (PDFs, images, presentations) with category filtering |
| 🛠️ **Admin Panel** | Manage participants, toggle submissions, control workshop timer |
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

### Admins
- Pre-configured admin accounts are set up in the system
- First login requires setting a new password
- Admins can add participants via the **Admin Panel** (User ID, Password, Name)

### Participants
- Log in with credentials assigned by the admin
- Create a team from the **Dashboard**: enter team name, domain, and add teammates (name + User ID)
- Submit projects with GitHub links, live demos, and tech stack details

> **Note:** Login credentials are managed privately by workshop organizers and are not published here.

> **Note:** Without MongoDB, data is stored in-memory and persists across hot reloads during development. A full server restart will reset all data to defaults.

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
│       ├── auth/            # Login, set-password, verify, logout
│       ├── projects/        # Project CRUD
│       ├── teams/           # Participant team creation & management
│       ├── attendance/      # Attendance CRUD
│       ├── gallery/         # Gallery upload & approval
│       ├── certificates/    # Certificate issuance
│       ├── reports/         # Reports management
│       ├── chat/            # AI chatbot endpoint
│       ├── admin/           # Participant management & settings
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

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy — Vercel auto-detects Next.js

### Other Platforms

The app is a standard Next.js application and can be deployed on any platform that supports Node.js:

```bash
npm run build
npm start
```

---

## 📄 License

MIT
