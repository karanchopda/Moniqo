# 🚀 Setup and Test Guide - Moniqo

## Complete Setup Instructions

---

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- Git installed

---

## 🔧 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create or update `backend/.env`:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/moniqo"

# JWT Secret
JWT_SECRET="your_super_secret_jwt_key_change_this_in_production"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# Server Port
PORT=4000
```

### 4. Run Database Migration
```bash
npx prisma migrate dev --name add_email_verification
npx prisma generate
```

### 5. Start Backend Server
```bash
npm run dev
```

Backend should now be running on `http://localhost:4000`

---

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create or update `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 4. Start Frontend Server
```bash
npm run dev
```

Frontend should now be running on `http://localhost:3000`

---

## ✅ Testing the Application

### Test 1: Responsive Design

#### Mobile (375px width)
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone SE or custom 375px width
4. Navigate through all pages:
   - Landing page (/)
   - Features (/features)
   - Pricing (/#pricing)
   - Login (/login)
   - Signup (/signup)
   - Dashboard (/dashboard)

**Check:**
- ✅ Text is readable
- ✅ Buttons are tappable (44x44px minimum)
- ✅ No horizontal scroll
- ✅ Images scale correctly
- ✅ Navigation works

#### Tablet (768px width)
1. Set width to 768px in DevTools
2. Test all pages again

**Check:**
- ✅ Layout adapts correctly
- ✅ Grid columns adjust
- ✅ Spacing is appropriate

#### Desktop (1440px width)
1. Set width to 1440px or use full screen
2. Test all pages

**Check:**
- ✅ Full layout displays
- ✅ Max-width containers work
- ✅ Content is centered

---

### Test 2: Email Verification Flow

#### Step 1: Sign Up
1. Go to `http://localhost:3000/signup`
2. Enter email: `test@example.com`
3. Enter password: `password123`
4. Click "Create Account"

**Expected Result:**
- ✅ Account created successfully
- ✅ Redirected to dashboard
- ✅ Yellow verification banner appears
- ✅ Console shows verification email (since we're using mock email service)

#### Step 2: Check Console for Verification Link
1. Open browser console (F12)
2. Look for email log output
3. Copy the verification URL (looks like: `http://localhost:3000/verify-email?token=...`)

#### Step 3: Verify Email
1. Paste the verification URL in browser
2. Wait for verification

**Expected Result:**
- ✅ "Email Verified Successfully!" message
- ✅ Redirected to dashboard after 3 seconds
- ✅ Verification banner disappears

#### Step 4: Test Resend Verification
1. Create another account
2. On dashboard, click "Resend Verification Email"

**Expected Result:**
- ✅ Success message appears
- ✅ New verification email logged in console

---

### Test 3: Password Reset Flow

#### Step 1: Request Password Reset
1. Go to `http://localhost:3000/forgot-password`
2. Enter email: `test@example.com`
3. Click "Send Reset Link"

**Expected Result:**
- ✅ Success message appears
- ✅ Reset email logged in console

#### Step 2: Check Console for Reset Link
1. Open browser console
2. Look for password reset email log
3. Copy the reset URL (looks like: `http://localhost:3000/reset-password?token=...`)

#### Step 3: Reset Password
1. Paste the reset URL in browser
2. Enter new password: `newpassword123`
3. Confirm password: `newpassword123`
4. Click "Reset Password"

**Expected Result:**
- ✅ "Password Reset Successful!" message
- ✅ Redirected to login after 3 seconds

#### Step 4: Login with New Password
1. Go to login page
2. Enter email and new password
3. Click "Sign in"

**Expected Result:**
- ✅ Successfully logged in
- ✅ Redirected to dashboard

---

### Test 4: API Endpoints

#### Test Signup
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"api@test.com","password":"password123"}'
```

**Expected Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "api@test.com",
    "emailVerified": false
  },
  "message": "Account created! Please check your email to verify your account."
}
```

#### Test Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"api@test.com","password":"password123"}'
```

**Expected Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "api@test.com",
    "emailVerified": false
  }
}
```

#### Test Forgot Password
```bash
curl -X POST http://localhost:4000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"api@test.com"}'
```

**Expected Response:**
```json
{
  "message": "If an account exists, a password reset email has been sent."
}
```

---

## 🐛 Troubleshooting

### Issue: Database Connection Error
**Solution:**
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in `.env`
3. Run `npx prisma migrate dev`

### Issue: Port Already in Use
**Solution:**
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Issue: Email Not Showing in Console
**Solution:**
1. Check backend console (not browser console)
2. Look for "📧 Email would be sent:" message
3. Ensure backend server is running

### Issue: Verification Banner Not Showing
**Solution:**
1. Check localStorage for user data
2. Ensure `emailVerified` is `false`
3. Refresh the page

### Issue: 404 on API Calls
**Solution:**
1. Ensure backend is running on port 4000
2. Check API URL in frontend code
3. Verify routes are registered in backend

---

## 📊 Database Inspection

### View Users
```bash
cd backend
npx prisma studio
```

This opens Prisma Studio at `http://localhost:5555` where you can:
- View all users
- Check verification status
- See tokens
- Manually update data

---

## 🔐 Security Notes

### Current Setup (Development)
- ✅ Passwords are hashed with bcrypt
- ✅ JWT tokens for authentication
- ✅ Verification tokens are unique and expire
- ✅ Reset tokens expire in 1 hour
- ⚠️ Emails are logged to console (not sent)

### Production Requirements
1. **Email Service Integration**
   - Use SendGrid, AWS SES, or Resend
   - Update `backend/src/services/email.service.ts`
   - Add API keys to environment variables

2. **Environment Variables**
   - Use strong JWT_SECRET
   - Use production DATABASE_URL
   - Set FRONTEND_URL to production domain

3. **HTTPS**
   - Enable HTTPS for production
   - Update CORS settings
   - Use secure cookies

4. **Rate Limiting**
   - Add rate limiting to auth endpoints
   - Prevent brute force attacks
   - Use express-rate-limit

---

## 📈 Next Steps

### Immediate
- [x] Test responsive design
- [x] Test email verification
- [x] Test password reset
- [ ] Integrate real email service
- [ ] Add rate limiting
- [ ] Add logging

### Short Term
- [ ] User profile page
- [ ] Transaction upload
- [ ] Dashboard with real data
- [ ] AI coach integration

### Long Term
- [ ] Bank integration
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Multi-language support

---

## 🎉 Success Criteria

Your setup is successful if:
- ✅ Backend runs without errors
- ✅ Frontend runs without errors
- ✅ Database migrations complete
- ✅ Can create account
- ✅ Can login
- ✅ Can verify email (via console link)
- ✅ Can reset password (via console link)
- ✅ Verification banner shows/hides correctly
- ✅ All pages are responsive

---

## 📞 Support

### Common Commands

**Backend:**
```bash
npm run dev          # Start development server
npx prisma studio    # Open database GUI
npx prisma migrate   # Run migrations
npx prisma generate  # Generate Prisma client
```

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
```

### Logs Location
- Backend logs: Terminal where `npm run dev` is running
- Frontend logs: Browser console (F12)
- Database logs: Check PostgreSQL logs

---

## ✅ Checklist

### Setup
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Database configured
- [ ] Environment variables set
- [ ] Migrations run
- [ ] Both servers running

### Testing
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Signup flow tested
- [ ] Login flow tested
- [ ] Email verification tested
- [ ] Password reset tested
- [ ] Verification banner tested
- [ ] API endpoints tested

### Production Ready
- [ ] Email service integrated
- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] Rate limiting added
- [ ] Error logging added
- [ ] Performance optimized

---

*Setup guide created: May 7, 2026*  
*For issues, check troubleshooting section or console logs*
