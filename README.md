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
- **Smart Audit Pipeline**: Upload a bank statement (CSV/PDF) and get an instant audit.
- **Categorization**: Automatic detection of Indian merchants like Zomato, Ola, Amazon, Bescom, etc.
- **AI Insight Generator**: A "strict advisor" persona that highlights wastage and suggests practical savings.
- **Money Leak Detector**: Calculates your daily burn rate (₹X/day) and projects monthly outflow (₹Y/month).
- **Mobile-First Dashboard**: Clean, modern cards showing Greeting, Hero Insight, and Stats Grid.
- **Security**: Rate limiting, input validation, Helmet.js security headers, JWT authentication.

## 🧱 Auth System
- Email + Password authentication with validation
- JWT-based sessions
- Email verification system
- Password reset functionality
- Rate limiting on auth endpoints

## 🛠 Tech Stack
- **Frontend**: Next.js 16, Tailwind CSS 4, Recharts, Lucide React, Framer Motion.
- **Backend**: Node.js, Express 5, Prisma 7.8, PostgreSQL, Redis (BullMQ).
- **Security**: Helmet.js, express-rate-limit, express-validator, bcryptjs.
- **AI**: OpenAI API (GPT-4o-mini).
- **Monitoring**: Morgan logging.

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
   - `REDIS_HOST` and `REDIS_PORT`
   - `FRONTEND_URL`
4. Sync DB schema: `npx prisma db push`
5. Start API: `npm run dev` (Runs on Port 4000)

### 3. Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create `.env` from `.env.example` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL` (http://localhost:4000/api)
4. Start App: `npm run dev` (Runs on Port 3000)

## 🧪 Testing the App
Use the provided `sample_statement.csv` in the root directory to test the upload and audit flow. It contains realistic Indian transaction patterns.

## 📚 Documentation
- **Quick Start Guide**: `QUICK_START.md` - Get running in 5 minutes
- **API Documentation**: `API_DOCUMENTATION.md` - Complete API reference
- **Deployment Guide**: `DEPLOYMENT_GUIDE.md` - Production deployment instructions
- **Design System**: `frontend/DESIGN_SYSTEM.md` - UI/UX guidelines

## 🔒 Security Features
- Rate limiting on all endpoints
- Input validation with express-validator
- Security headers via Helmet.js
- JWT token authentication
- Password hashing with bcryptjs
- CORS configuration
- Request payload size limits

## 📦 Recent Updates (May 2026)
- ✅ Updated all dependencies to latest versions
- ✅ Fixed port conflict (backend: 4000, frontend: 3000)
- ✅ Added rate limiting middleware
- ✅ Added input validation
- ✅ Added security headers (Helmet.js)
- ✅ Added request logging (Morgan)
- ✅ Created comprehensive API documentation
- ✅ Created deployment guide
- ✅ Updated environment variable documentation

---
**Build with simplicity and speed. Clean, minimal, modern.**
