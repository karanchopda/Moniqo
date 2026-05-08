#!/bin/bash

echo "🧪 Testing Moniqo API Endpoints"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:4000"

# Test 1: Health Check
echo "1️⃣  Testing Health Check..."
response=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/)
if [ $response -eq 200 ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed (HTTP $response)${NC}"
fi
echo ""

# Test 2: Signup
echo "2️⃣  Testing Signup..."
signup_response=$(curl -s -X POST $API_URL/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test'$(date +%s)'@example.com","password":"password123"}')

if echo "$signup_response" | grep -q "token"; then
    echo -e "${GREEN}✓ Signup successful${NC}"
    echo "Response: $signup_response" | head -c 100
    echo "..."
else
    echo -e "${RED}✗ Signup failed${NC}"
    echo "Response: $signup_response"
fi
echo ""

# Test 3: Login
echo "3️⃣  Testing Login..."
login_response=$(curl -s -X POST $API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')

if echo "$login_response" | grep -q "token"; then
    echo -e "${GREEN}✓ Login successful${NC}"
else
    echo -e "${YELLOW}⚠ Login failed (user may not exist yet)${NC}"
fi
echo ""

# Test 4: Forgot Password
echo "4️⃣  Testing Forgot Password..."
forgot_response=$(curl -s -X POST $API_URL/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}')

if echo "$forgot_response" | grep -q "message"; then
    echo -e "${GREEN}✓ Forgot password endpoint working${NC}"
else
    echo -e "${RED}✗ Forgot password failed${NC}"
    echo "Response: $forgot_response"
fi
echo ""

# Test 5: Resend Verification
echo "5️⃣  Testing Resend Verification..."
resend_response=$(curl -s -X POST $API_URL/api/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}')

if echo "$resend_response" | grep -q "message"; then
    echo -e "${GREEN}✓ Resend verification endpoint working${NC}"
else
    echo -e "${YELLOW}⚠ Resend verification response: $resend_response${NC}"
fi
echo ""

echo "================================"
echo "✅ API Testing Complete!"
echo ""
echo "If all tests passed, your backend is working correctly."
echo "If any tests failed, check:"
echo "  1. Backend is running on port 4000"
echo "  2. Database is connected"
echo "  3. Migrations have been run"
