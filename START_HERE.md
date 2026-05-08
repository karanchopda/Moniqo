# 🚀 Moniqo - Start Here

## What is Moniqo?

Moniqo is an AI-powered financial analysis platform that helps users:
- Upload bank statements (PDF/CSV)
- Automatically categorize transactions
- Identify spending leaks
- Get AI-powered financial insights
- Track income and expenses
- Chat with an AI financial coach

---

## ✅ What's Already Built

### Backend (Node.js + Express + Prisma + PostgreSQL)
- ✅ User authentication (signup, login, email verification, password reset)
- ✅ Bank statement upload (PDF/CSV with password support)
- ✅ Smart transaction parsing and deduplication
- ✅ AI-powered categorization
- ✅ Report generation with OpenAI insights
- ✅ Transaction API
- ✅ Chat API for AI coach
- ✅ Supabase integration for file storage

### Frontend (Next.js + React + TypeScript + Tailwind)
- ✅ Landing page with features, pricing, testimonials
- ✅ Authentication pages (login, signup, forgot password, reset password, verify email)
- ✅ Dashboard with real transaction data
- ✅ Transaction list with advanced filters
- ✅ Upload page with beautiful UI
- ✅ AI Coach page (needs connection to backend)
- ✅ Professional design system
- ✅ Fully responsive
- ✅ Custom Moniqo logo

---

## 🎯 Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Set Up Environment Variables

#### Backend `.env`:
```env
PORT=4000
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-change-this
OPENAI_API_KEY=your-openai-api-key
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key
```

#### Frontend `.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 3. Set Up Database

```bash
cd backend

# Pull schema from Supabase
npx prisma db pull

# Generate Prisma client
npx prisma generate
```

### 4. Start Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Should start on http://localhost:4000

# Terminal 2 - Frontend
cd frontend
npm run dev
# Should start on http://localhost:3000
```

### 5. Test It Out!

1. Go to `http://localhost:3000`
2. Click "Get Started"
3. Sign up for an account
4. Check backend console for verification email (currently logs to console)
5. Go to `/dashboard/sync`
6. Upload a bank statement
7. See AI analysis!
8. Go to `/dashboard` to see your data
9. Go to `/dashboard/transactions` to see all transactions

---

## 📁 Project Structure

```
moniqo/
├── backend/
│   ├── src/
│   │   ├── controllers/      # API logic
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Helpers (PDF parser, CSV parser, categorizer)
│   │   ├── middleware/       # Auth middleware
│   │   ├── routes/           # API routes
│   │   └── index.ts          # Server entry point
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/       # Auth pages
│   │   │   ├── dashboard/    # Dashboard pages
│   │   │   ├── features/     # Features page
│   │   │   ├── pricing/      # Pricing page
│   │   │   └── page.tsx      # Landing page
│   │   ├── components/
│   │   │   ├── Landing/      # Landing page components
│   │   │   ├── Features/     # Feature components
│   │   │   └── ui/           # Reusable UI components
│   │   └── lib/
│   │       ├── api.ts        # API client
│   │       └── auth.ts       # Auth helpers
│   └── package.json
│
└── Documentation/
    ├── START_HERE.md                           ← You are here
    ├── IMPLEMENTATION_COMPLETE_REAL_DATA.md    ← Latest changes
    ├── NEXT_STEPS_IMPLEMENTATION.md            ← Roadmap
    ├── QUICK_START.md                          ← Setup guide
    ├── SETUP_AND_TEST_GUIDE.md                 ← Detailed setup
    ├── TROUBLESHOOTING.md                      ← Common issues
    └── SUPABASE_SETUP.md                       ← Database setup
```

---

## 🔑 Key Features

### 1. Bank Statement Upload
- **Location**: `/dashboard/sync`
- **Supports**: PDF (with password), CSV
- **Features**:
  - Drag & drop or click to upload
  - Password protection detection
  - Real-time parsing
  - AI categorization
  - Duplicate detection
  - Supabase storage

### 2. Dashboard
- **Location**: `/dashboard`
- **Shows**:
  - Current balance
  - Total income/expenses
  - Net flow
  - Top spending categories
  - Last 7 days chart
  - Recent activity
  - Quick actions

### 3. Transactions
- **Location**: `/dashboard/transactions`
- **Features**:
  - Complete transaction list
  - Search by description
  - Filter by type (income/expense)
  - Filter by category
  - Sort by date/amount
  - Summary cards

### 4. AI Analysis
- **Location**: After upload at `/dashboard/sync`
- **Provides**:
  - Total waste identified
  - Category breakdown
  - Spending trends
  - AI insights
  - Action recommendations
  - Confidence score

### 5. AI Coach (Needs Connection)
- **Location**: `/dashboard/coach`
- **Will provide**:
  - Financial advice
  - Answer questions
  - Personalized recommendations
  - Budget suggestions

---

## 🛠️ Technology Stack

### Backend:
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **AI**: OpenAI GPT-4
- **Storage**: Supabase Storage
- **PDF Parsing**: pdf-parse, pdfjs-dist
- **CSV Parsing**: csv-parser
- **Auth**: JWT

### Frontend:
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Material Symbols

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/resend-verification` - Resend verification
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Transactions
- `GET /api/transactions` - Get all user transactions
- `POST /api/upload` - Upload bank statement

### Reports
- `POST /api/report/generate` - Generate AI report
- `GET /api/report/latest` - Get latest report

### Chat
- `POST /api/chat` - Chat with AI coach

---

## 🎨 Design System

### Colors:
- **Primary**: `#00331c` (Dark green)
- **Secondary**: `#2b685c` (Teal)
- **Accent**: `#3fc580` (Bright green)
- **Muted**: `#707976` (Gray)

### Shadows:
- `shadow-sm` - Default cards
- `shadow-md` - Hover states
- `shadow-lg` - Modals

### Typography:
- `font-bold` - Headings
- Regular weight - Body text
- `text-muted` - Secondary text

### Spacing:
- Cards: `p-6 md:p-8`
- Sections: `py-24 md:py-32`
- Gaps: `gap-4`, `gap-6`, `gap-8`

### Borders:
- Cards: `rounded-xl`
- Buttons: `rounded-full`
- Inputs: `rounded-2xl`

---

## 🚦 Current Status

### ✅ Complete:
- User authentication system
- Email verification (logs to console)
- Bank statement upload (PDF/CSV)
- Transaction parsing and categorization
- AI-powered analysis
- Dashboard with real data
- Transaction list with filters
- Responsive design
- Professional UI

### 🔧 Needs Work:
- AI Coach connection to backend
- Real email service (SendGrid/AWS SES)
- User profile page
- Settings page
- Reports history page
- Bank integration (future)

### 🐛 Known Issues:
- Emails log to console (need real email service)
- Some components still use framer-motion (being removed)
- No user profile/settings yet

---

## 📝 Next Steps

### Priority 1: Connect AI Coach
**File**: `frontend/src/app/dashboard/coach/page.tsx`
- Connect to `/api/chat` endpoint
- Send user messages
- Display AI responses
- Add conversation history

### Priority 2: Real Email Service
**File**: `backend/src/services/email.service.ts`
- Integrate SendGrid or AWS SES
- Update email templates
- Test verification flow

### Priority 3: User Profile
**New file**: `frontend/src/app/dashboard/profile/page.tsx`
- Display user info
- Edit profile
- Change password
- Account settings

### Priority 4: Reports Page
**New file**: `frontend/src/app/dashboard/reports/page.tsx`
- List all reports
- View report details
- Compare over time
- Download as PDF

---

## 🧪 Testing Checklist

### Manual Testing:
- [ ] Sign up new user
- [ ] Verify email (check backend console)
- [ ] Login
- [ ] Upload CSV statement
- [ ] Upload PDF statement
- [ ] Upload password-protected PDF
- [ ] View dashboard with real data
- [ ] Filter transactions
- [ ] Search transactions
- [ ] Test responsive design on mobile
- [ ] Test all navigation links
- [ ] Logout and login again

### Edge Cases:
- [ ] Upload same file twice (deduplication)
- [ ] Upload empty file
- [ ] Upload invalid file
- [ ] Upload very large file
- [ ] Test with no transactions
- [ ] Test with 1000+ transactions

---

## 🆘 Getting Help

### Documentation:
1. `QUICK_START.md` - Fast setup guide
2. `SETUP_AND_TEST_GUIDE.md` - Detailed setup
3. `TROUBLESHOOTING.md` - Common issues
4. `SUPABASE_SETUP.md` - Database setup
5. `IMPLEMENTATION_COMPLETE_REAL_DATA.md` - Latest changes
6. `NEXT_STEPS_IMPLEMENTATION.md` - Roadmap

### Common Issues:

**Backend won't start**:
- Check DATABASE_URL is correct
- Verify password is URL encoded (@ = %40, # = %23)
- Run `npx prisma generate`

**Frontend can't connect to backend**:
- Check backend is running on port 4000
- Verify `NEXT_PUBLIC_API_URL` in `.env`
- Check browser console for errors

**No transactions showing**:
- Upload a statement first
- Click "Refresh Data"
- Check backend console for errors
- Verify database has data

**Upload fails**:
- Check file format (PDF or CSV)
- For PDF, try with password
- Check backend logs
- Verify Supabase credentials

---

## 🎉 Success!

You should now have:
- ✅ Backend running on `http://localhost:4000`
- ✅ Frontend running on `http://localhost:3000`
- ✅ Database connected
- ✅ Upload working
- ✅ Dashboard showing real data
- ✅ Transactions filterable

**Next**: Upload a real bank statement and see the magic happen! 🚀

---

## 📞 Support

For issues or questions:
1. Check `TROUBLESHOOTING.md`
2. Review backend console logs
3. Check browser console
4. Verify environment variables
5. Test API endpoints with Postman

---

**Built with ❤️ using Next.js, Node.js, and OpenAI**
