# 🔧 Troubleshooting Guide - Moniqo

## Common Issues and Solutions

---

## Issue: "404 Not Found" on API Calls

### Symptoms
```
POST http://localhost:4000/api/auth/forgot-password 404 (Not Found)
```

### Solutions

#### Solution 1: Backend Not Running
```bash
# Check if backend is running
curl http://localhost:4000/

# If no response, start backend
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Server is running on http://localhost:4000
📧 Email verification system enabled
🔐 Password reset system enabled
```

#### Solution 2: Wrong Port
Check if backend is running on a different port:
```bash
# Check what's running on port 4000
lsof -i :4000

# Check what's running on port 5001
lsof -i :5001
```

If backend is on port 5001, update `backend/.env`:
```env
PORT=4000
```

Then restart backend.

#### Solution 3: Routes Not Registered
The backend `src/index.ts` should have:
```typescript
app.use('/api/auth', authRoutes);
```

NOT:
```typescript
app.use('/auth', authRoutes);
```

#### Solution 4: Database Not Migrated
```bash
cd backend
npx prisma migrate dev --name add_email_verification
npx prisma generate
npm run dev
```

---

## Issue: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

### Symptoms
```
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

### Cause
The API is returning HTML (404 page) instead of JSON.

### Solutions

#### Solution 1: Verify Backend is Running
```bash
# Test the API
curl http://localhost:4000/

# Should return JSON, not HTML
```

#### Solution 2: Check API URL in Frontend
Frontend should use:
```typescript
fetch('http://localhost:4000/api/auth/forgot-password', ...)
```

NOT:
```typescript
fetch('http://localhost:4000/forgot-password', ...)
```

#### Solution 3: Restart Both Servers
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

---

## Issue: Database Connection Failed

### Symptoms
```
Error: Can't reach database server
```

### Solutions

#### Solution 1: Start PostgreSQL
```bash
# macOS (Homebrew)
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Check if running
psql --version
```

#### Solution 2: Check DATABASE_URL
In `backend/.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/moniqo"
```

Replace:
- `username` with your PostgreSQL username
- `password` with your PostgreSQL password
- `moniqo` with your database name

#### Solution 3: Create Database
```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE moniqo;

# Exit
\q
```

#### Solution 4: Run Migrations
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

---

## Issue: Port Already in Use

### Symptoms
```
Error: listen EADDRINUSE: address already in use :::4000
```

### Solutions

#### Solution 1: Kill Process on Port
```bash
# macOS/Linux
lsof -ti:4000 | xargs kill -9

# Or find and kill manually
lsof -i :4000
kill -9 <PID>
```

#### Solution 2: Use Different Port
In `backend/.env`:
```env
PORT=4001
```

Update frontend API calls to use new port.

---

## Issue: Emails Not Showing

### Symptoms
- Verification email not received
- Reset email not received

### Solutions

#### Solution 1: Check Backend Terminal
Emails are logged to the **backend terminal**, not browser console.

Look for:
```
📧 Email would be sent:
To: test@example.com
Subject: Verify Your Email - Moniqo
```

#### Solution 2: Email Service Not Configured
Currently using mock email service (console only).

To send real emails, integrate:
- SendGrid
- AWS SES
- Resend

Update `backend/src/services/email.service.ts`

---

## Issue: Verification Banner Not Showing

### Symptoms
- Created account but no banner on dashboard

### Solutions

#### Solution 1: Check User Data
Open browser console (F12):
```javascript
// Check localStorage
console.log(localStorage.getItem('user'));

// Should show: {"id":"...","email":"...","emailVerified":false}
```

#### Solution 2: Refresh Page
Sometimes React state doesn't update. Refresh the page.

#### Solution 3: Clear Cache
```javascript
// In browser console
localStorage.clear();
// Then login again
```

---

## Issue: Token Expired

### Symptoms
```
Error: Verification token has expired
Error: Reset token has expired
```

### Solutions

#### Solution 1: Request New Token
- For verification: Click "Resend Verification Email"
- For password reset: Go to forgot password page again

#### Solution 2: Check Token Expiry
- Verification tokens: 24 hours
- Reset tokens: 1 hour

---

## Issue: Cannot Read Properties of Null

### Symptoms
```
TypeError: Cannot read properties of null (reading 'emailVerified')
```

### Solutions

#### Solution 1: Not Logged In
Make sure you're logged in:
```javascript
// Check in browser console
console.log(localStorage.getItem('token'));
```

If null, login again.

#### Solution 2: User Data Missing
```javascript
// Check user data
console.log(localStorage.getItem('user'));
```

If null, login again.

---

## Issue: Prisma Client Not Generated

### Symptoms
```
Error: Cannot find module '@prisma/client'
```

### Solutions

```bash
cd backend
npx prisma generate
npm run dev
```

---

## Issue: Migration Failed

### Symptoms
```
Error: Migration failed to apply
```

### Solutions

#### Solution 1: Reset Database
```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
npx prisma generate
```

⚠️ **Warning:** This deletes all data!

#### Solution 2: Manual Migration
```bash
cd backend
npx prisma db push
npx prisma generate
```

---

## Issue: CORS Error

### Symptoms
```
Access to fetch at 'http://localhost:4000' from origin 'http://localhost:3000' has been blocked by CORS policy
```

### Solutions

#### Solution 1: Check Backend CORS
In `backend/src/index.ts`:
```typescript
app.use(cors());
```

Should be before routes.

#### Solution 2: Specific CORS Config
```typescript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

## Issue: TypeScript Errors

### Symptoms
```
error TS2307: Cannot find module
```

### Solutions

```bash
# Backend
cd backend
npm install
npx prisma generate

# Frontend
cd frontend
npm install
```

---

## Diagnostic Commands

### Check Backend Status
```bash
# Test API
curl http://localhost:4000/

# Test signup
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

### Check Database
```bash
cd backend
npx prisma studio
# Opens GUI at http://localhost:5555
```

### Check Ports
```bash
# Check what's running on ports
lsof -i :3000  # Frontend
lsof -i :4000  # Backend
lsof -i :5432  # PostgreSQL
```

### Check Logs
```bash
# Backend logs
cd backend
npm run dev
# Watch terminal output

# Frontend logs
# Open browser console (F12)
```

---

## Quick Reset (Nuclear Option)

If nothing works, try this:

```bash
# 1. Kill all processes
lsof -ti:3000 | xargs kill -9
lsof -ti:4000 | xargs kill -9

# 2. Reset database
cd backend
npx prisma migrate reset
npx prisma migrate dev
npx prisma generate

# 3. Clear frontend cache
cd frontend
rm -rf .next
npm run dev

# 4. Start backend
cd backend
npm run dev

# 5. Clear browser
# Open browser console (F12)
localStorage.clear()
# Refresh page
```

---

## Still Having Issues?

### Check These Files

1. **backend/.env**
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
FRONTEND_URL="http://localhost:3000"
PORT=4000
```

2. **backend/src/index.ts**
```typescript
app.use('/api/auth', authRoutes);  // Must have /api prefix
```

3. **backend/src/routes/auth.routes.ts**
```typescript
router.post('/forgot-password', forgotPassword);  // Must exist
```

4. **frontend API calls**
```typescript
fetch('http://localhost:4000/api/auth/forgot-password', ...)
```

### Run Test Script
```bash
cd backend
chmod +x test-api.sh
./test-api.sh
```

---

## Getting Help

If you're still stuck:

1. **Check backend terminal** for errors
2. **Check browser console** (F12) for errors
3. **Check database** with `npx prisma studio`
4. **Verify all files** are saved
5. **Restart both servers**

---

*Troubleshooting guide - Solutions to common issues*
