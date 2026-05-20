# 🚀 Quick Start Guide - Moniqo

## Get Up and Running in 5 Minutes

---

## Step 1: Database Setup

```bash
cd backend

# Run migration to add email verification fields
npx prisma migrate dev --name add_email_verification

# Generate Prisma client
npx prisma generate
```

**Expected Output:**
```
✔ Generated Prisma Client
```

---

## Step 2: Start Backend Server

```bash
# Make sure you're in the backend directory
cd backend

# Start the server
npm run dev
```

**Expected Output:**
```
🚀 Server is running on http://localhost:4000
📧 Email verification system enabled
🔐 Password reset system enabled
```

**Important:** Keep this terminal window open!

---

## Step 3: Start Frontend Server

Open a **NEW terminal window** and run:

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

---

## Step 4: Test the Application

### Test Responsive Design
1. Open `http://localhost:3000`
2. Press F12 to open DevTools
3. Press Ctrl+Shift+M to toggle device toolbar
4. Test different screen sizes:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1440px)

### Test Email Verification
1. Go to `http://localhost:3000/signup`
2. Create account:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Create Account"
4. **Check the backend terminal** for email output
5. Copy the verification URL from the terminal
6. Paste it in your browser
7. You should see "Email Verified Successfully!"

### Test Password Reset
1. Go to `http://localhost:3000/forgot-password`
2. Enter email: `test@example.com`
3. Click "Send Reset Link"
4. **Check the backend terminal** for reset email
5. Copy the reset URL from the terminal
6. Paste it in your browser
7. Enter new password
8. Login with new password

---

## 🐛 Troubleshooting

### Error: "Port 4000 already in use"
```bash
# Kill the process on port 4000
lsof -ti:4000 | xargs kill -9

# Then restart backend
cd backend
npm run dev
```

### Error: "Port 3000 already in use"
```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9

# Then restart frontend
cd frontend
npm run dev
```

### Error: "Cannot find module '@prisma/client'"
```bash
cd backend
npx prisma generate
npm run dev
```

### Error: "Database connection failed"
1. Make sure PostgreSQL is running
2. Check `backend/.env` file has correct DATABASE_URL
3. Run migration again:
```bash
cd backend
npx prisma migrate dev
```

### Error: "404 Not Found" on API calls
1. Make sure backend is running on port 4000
2. Check backend terminal for errors
3. Restart backend server

---

## ✅ Success Checklist

- [ ] Backend running on http://localhost:4000
- [ ] Frontend running on http://localhost:3000
- [ ] Can access landing page
- [ ] Can create account
- [ ] Can see verification banner on dashboard
- [ ] Can verify email (via terminal link)
- [ ] Can reset password (via terminal link)
- [ ] All pages are responsive

---

## 📊 API Endpoints Available

Once backend is running, these endpoints are available:

```
POST /api/auth/signup              - Create account
POST /api/auth/login               - Login
POST /api/auth/verify-email        - Verify email
POST /api/auth/resend-verification - Resend verification
POST /api/auth/forgot-password     - Request password reset
POST /api/auth/reset-password      - Reset password
```

Test with:
```bash
curl http://localhost:4000/
```

Should return:
```json
{
  "message": "Moniqo API is running",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

---

## 🎯 What to Test

### 1. Responsive Design (5 min)
- [ ] Mobile view (375px)
- [ ] Tablet view (768px)
- [ ] Desktop view (1440px)
- [ ] All text is readable
- [ ] All buttons work
- [ ] No horizontal scroll

### 2. Authentication (5 min)
- [ ] Sign up works
- [ ] Login works
- [ ] Logout works
- [ ] Verification banner shows
- [ ] Can resend verification

### 3. Email Flows (5 min)
- [ ] Verification email in terminal
- [ ] Can verify email
- [ ] Reset email in terminal
- [ ] Can reset password
- [ ] Can login with new password

---

## 🔥 Common Issues & Solutions

### Issue: "Emails not showing"
**Solution:** Check the **backend terminal** (not browser console). Emails are logged there.

### Issue: "Verification banner not showing"
**Solution:** 
1. Create a new account
2. Check localStorage has user with `emailVerified: false`
3. Refresh dashboard page

### Issue: "Token expired"
**Solution:** 
- Verification tokens expire in 24 hours
- Reset tokens expire in 1 hour
- Request a new one using "Resend" button

### Issue: "Cannot read properties of null"
**Solution:** Make sure you're logged in. Check localStorage for token.

---

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/moniqo"
JWT_SECRET="your_secret_key_here"
FRONTEND_URL="http://localhost:3000"
PORT=4000
NODE_ENV=development
OPENAI_API_KEY="sk-..."
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🎉 You're All Set!

If you can:
- ✅ See the landing page
- ✅ Create an account
- ✅ See verification banner
- ✅ Verify email (via terminal link)
- ✅ Reset password (via terminal link)

**Then everything is working perfectly!** 🚀

---

## 📚 Next Steps

1. **Integrate Real Email Service**
   - Choose: SendGrid, AWS SES, or Resend
   - Update `backend/src/services/email.service.ts`
   - Add API keys to `.env`

2. **Add More Features**
   - User profile page
   - Transaction upload
   - AI coach integration
   - Bank sync

3. **Deploy to Production**
   - Set up production database
   - Configure environment variables
   - Enable HTTPS
   - Add rate limiting

---

*Quick start guide - Get running in 5 minutes!*
