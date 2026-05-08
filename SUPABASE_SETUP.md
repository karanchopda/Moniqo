# 🔧 Supabase Setup Guide - Email Verification

## Quick Fix for Database Migration

Since you're using Supabase, follow these steps to add email verification fields:

---

## Option 1: Run SQL Directly in Supabase (Recommended)

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project: `iphnetoytxurhwzlcddy`
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"

### Step 2: Run This SQL
Copy and paste this SQL into the editor:

```sql
-- Add email verification fields to User table
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "verificationToken" TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS "verificationExpires" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "resetPasswordToken" TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "User_verificationToken_idx" ON "User"("verificationToken");
CREATE INDEX IF NOT EXISTS "User_resetPasswordToken_idx" ON "User"("resetPasswordToken");
CREATE INDEX IF NOT EXISTS "User_emailVerified_idx" ON "User"("emailVerified");

-- Update existing users to have updatedAt
UPDATE "User" SET "updatedAt" = "createdAt" WHERE "updatedAt" IS NULL;
```

### Step 3: Click "Run" or press Ctrl+Enter

You should see: "Success. No rows returned"

### Step 4: Verify the Changes
Run this query to check:
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'User';
```

You should see the new columns:
- emailVerified
- verificationToken
- verificationExpires
- resetPasswordToken
- resetPasswordExpires
- updatedAt

---

## Option 2: Use the SQL File

I've created a file `backend/add_email_verification.sql` with the migration.

1. Open Supabase SQL Editor
2. Copy contents from `backend/add_email_verification.sql`
3. Paste and run

---

## Step 5: Regenerate Prisma Client

After running the SQL, regenerate Prisma client:

```bash
cd backend
npx prisma db pull  # Pull the schema from database
npx prisma generate # Generate client
```

---

## Step 6: Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server is running on http://localhost:4000
📧 Email verification system enabled
🔐 Password reset system enabled
```

---

## Troubleshooting

### Issue: "Column already exists"
This is fine! It means the column was already added. Continue to next step.

### Issue: "Permission denied"
Make sure you're using the correct Supabase project and have admin access.

### Issue: Prisma still shows errors
```bash
cd backend
npx prisma db pull
npx prisma generate
npm run dev
```

---

## Verify Everything Works

### Test 1: Check Database
In Supabase SQL Editor:
```sql
SELECT * FROM "User" LIMIT 1;
```

Should show all columns including new ones.

### Test 2: Test API
```bash
curl http://localhost:4000/
```

Should return JSON (not error).

### Test 3: Test Signup
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Should return token and user with `emailVerified: false`.

---

## Alternative: Use Supabase Connection Pooler

If direct connection doesn't work, update your `.env`:

```env
# For migrations (direct connection)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# For app (connection pooler)
# Use this in production
```

Get your connection string from:
1. Supabase Dashboard
2. Project Settings
3. Database
4. Connection string
5. Copy "Direct connection" string

---

## Summary

1. ✅ Run SQL in Supabase SQL Editor
2. ✅ Run `npx prisma db pull`
3. ✅ Run `npx prisma generate`
4. ✅ Run `npm run dev`
5. ✅ Test the API

That's it! Your database now has email verification fields. 🎉

---

*Supabase setup guide - Quick database migration*
