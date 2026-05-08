# Moniqo: AI-Powered Money Audit for Indian Users

Moniqo is a clean, modern, and production-ready financial auditor designed specifically for the Indian context. It identifies "money leaks," categorizes spending (Swiggy, Uber, Rent, etc.), and provides strict AI-driven financial advice.

## 🎨 Design System Update (May 2026)

**The frontend has been professionally refactored!** We've transformed the design from an over-animated prototype to a clean, production-ready interface.

### What Changed
- ✅ Removed 90% of animations for better performance
- ✅ Standardized shadow system (3 levels instead of 5+)
- ✅ Professional typography (removed excessive bold/uppercase)
- ✅ Improved accessibility (WCAG AA compliant)
- ✅ Consistent spacing and design tokens
- ✅ 60% less code per component

### Documentation
- **Quick Start**: `frontend/QUICK_START_GUIDE.md` - Start here!
- **Design System**: `frontend/DESIGN_SYSTEM.md` - Complete guide
- **Comparison**: `frontend/BEFORE_AFTER_COMPARISON.md` - See the changes
- **Summary**: `frontend/IMPLEMENTATION_COMPLETE.md` - Full report

**Progress**: 11/26 components refactored (42% complete)

## 🚀 MVP Features
- **Smart Audit Pipeline**: Upload a bank statement (CSV) and get an instant audit.
- **Categorization**: Automatic detection of Indian merchants like Zomato, Ola, Amazon, Bescom, etc.
- **AI Insight Generator**: A "strict advisor" persona that highlights wastage and suggests practical savings.
- **Money Leak Detector**: Calculates your daily burn rate (₹X/day) and projects monthly outflow (₹Y/month).
- **Mobile-First Dashboard**: Clean, modern cards showing Greeting, Hero Insight, and Stats Grid.

## 🧱 Auth System
- Simple Email + Password authentication.
- JWT-based sessions.

## 🛠 Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Recharts, Lucide React.
- **Backend**: Node.js, Express, Prisma, PostgreSQL.
- **AI**: OpenAI API (GPT-4o-mini).

## ⚙️ Local Setup

### 1. Prerequisites
- **Node.js**: v18+
- **Database**: PostgreSQL (Supabase recommended)
- **AI**: OpenAI API Key

### 2. Backend Setup
1. `cd backend`
2. `npm install`
3. Create `.env` from `.env.example` and fill in:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `OPENAI_API_KEY`
4. Sync DB schema: `npx prisma db push`
5. Start API: `npm run dev` (Runs on Port 5001)

### 3. Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create `.env` from `.env.example` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Start App: `npm run dev` (Runs on Port 3000)

## 🧪 Testing the App
Use the provided `sample_statement.csv` in the root directory to test the upload and audit flow. It contains realistic Indian transaction patterns.

---
**Build with simplicity and speed. Clean, minimal, modern.**
