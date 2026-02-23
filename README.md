# 🚀 VibeBuild — AI Driven Solutions & Vibe Coding

A modern, animated workshop platform built for hackathon-style AI workshops. Teams log in, submit projects, get AI-powered guidance, and showcase their work — all from one beautiful dashboard.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-FF0055?logo=framer)
![MongoDB](https://img.shields.io/badge/MongoDB-Optional-47A248?logo=mongodb)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Auth System** | JWT login with pre-assigned Team IDs & admin role |
| 📊 **Team Dashboard** | Countdown timer, progress tracker, project submission with confetti |
| 🌍 **Project Showcase** | Public grid with domain filters, search, and hover animations |
| 🤖 **AI Chatbot** | Floating assistant with OpenAI integration (works without API key too) |
| 🖼️ **Gallery** | Masonry layout with lightbox & video modal |
| 📋 **Attendance** | Admin CRUD with first/second half toggles & CSV export |
| 📈 **Reports** | Analytics dashboard with PDF/CSV export |
| 🛠️ **Admin Panel** | Manage teams, toggle submissions, control workshop timer |
| 🎓 **Certificates** | Auto-generated PDF with team & project details |
| 🗓️ **Schedule** | Animated timeline for workshop agenda |
| ❓ **FAQ** | Smooth accordion section |

## 🎨 Design

- **White / Light theme** with soft glassmorphism
- Smooth page transitions & micro-interactions
- Animated counters & floating particle effects
- Glow hover buttons & scroll reveal animations
- Premium AI startup aesthetic

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + Custom CSS
- **Animations**: Framer Motion
- **Database**: MongoDB (optional — falls back to in-memory store)
- **Auth**: JWT (jose) + bcryptjs
- **AI**: OpenAI API (optional — built-in fallback responses)
- **PDF**: jsPDF + QRCode
- **Icons**: Lucide React

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

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔑 Login Credentials

The app comes pre-loaded with dummy data. No database setup needed!

| Role | ID | Password |
|------|-----|----------|
| **Admin** | `ADMIN001` | `admin2024` |
| **Teams** | `TEAM001` – `TEAM008` | `vibebuild2024` |

### Sample Teams

| Team | Domain |
|------|--------|
| Team AlphaNova | Healthcare AI |
| Team CodeCatalyst | Agriculture AI |
| Team NeuralForge | Smart Cities |
| Team DataVibe | Education Tech |
| Team PixelPulse | Healthcare AI |
| Team AI Innovators | Agriculture AI |
| Team Tech Titans | Smart Cities |
| Team Quantum Coders | Education Tech |

---

## 📁 Project Structure

```
├── app/
│   ├── api/            # API routes (auth, projects, attendance, gallery, etc.)
│   ├── admin/          # Admin panel, attendance, reports
│   ├── dashboard/      # Team dashboard & submission
│   ├── showcase/       # Public project showcase
│   ├── gallery/        # Media gallery
│   ├── certificates/   # PDF certificate generation
│   ├── schedule/       # Workshop timeline
│   ├── faq/            # FAQ accordion
│   └── login/          # Authentication page
├── components/         # Navbar, ChatBot, ParticleBackground, UIComponents
├── lib/                # DB connection, auth utils, models, in-memory store
└── scripts/            # Database seed script
```

---

## 📄 License

MIT
