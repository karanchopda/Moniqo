-- Add email verification fields to User table
-- Run this in Supabase SQL Editor

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
