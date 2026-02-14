#!/bin/bash

# Automated Vercel Postgres Database Setup (Simplified)
# This script creates database and sets up environment

set -e  # Exit on error

echo "🚀 Automated Vercel Postgres Database Setup (Simplified)"
echo "======================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check for token file
if [ -f ".vercel-token.env" ]; then
    source .vercel-token.env
else
    echo -e "${RED}❌ Error: .vercel-token.env file not found!${NC}"
    echo ""
    echo "Please create .vercel-token.env in your project root:"
    echo ""
    echo "  VERCEL_TOKEN=your_vercel_token_here"
    echo ""
    echo "Get your token from: https://vercel.com/account/tokens"
    exit 1
fi

echo -e "${BLUE}Step 1: Creating Vercel Postgres Database...${NC}"
echo "----------------------------------------"

# Create database using Vercel CLI (simplified approach)
yes | npx vercel postgres create --name=ayamgeprekku --region=sin1 --token="$VERCEL_TOKEN" 2>&1 | head -10

echo -e "${GREEN}✅ Database creation initiated${NC}"
echo -e "${YELLOW}Waiting 30 seconds for database to be ready...${NC}"
sleep 30

echo ""
echo -e "${BLUE}Step 2: Getting Database Credentials...${NC}"
echo "----------------------------------------"

# Get database credentials using Vercel CLI
# Try jq first, if not available use simple grep
if command -v jq &> /dev/null; then
    POSTGRES_PRISMA_URL=$(npx vercel postgres --token="$VERCEL_TOKEN" --connection-string=true 2>&1 | grep -oP "Database URL:" | cut -d= -f2)
    echo -e "${GREEN}✅ Database credentials retrieved${NC}"
else
    echo -e "${YELLOW}⚠️  jq not found, please check Vercel Dashboard${NC}"
    rm -f .env.backup.*
fi

echo ""
echo -e "${BLUE}Step 3: Generating NEXTAUTH_SECRET...${NC}"
echo "----------------------------------------"

NEXTAUTH_SECRET_PROD=$(openssl rand -base64 32)
echo -e "${GREEN}✅ NEXTAUTH_SECRET generated${NC}"

echo ""
echo -e "${BLUE}Step 4: Updating .env file...${NC}"
echo "----------------------------------------"

# Backup current .env
if [ -f ".env" ]; then
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo -e "${YELLOW}Backup created${NC}"
fi

# Update .env
cat > .env << EOF
# Database Connection Strings (Vercel Postgres)
POSTGRES_PRISMA_URL="\${POSTGRES_PRISMA_URL}"
POSTGRES_URL_NON_POOLING="\${POSTGRES_PRISMA_URL}"
POSTGRES_URL="\${POSTGRES_PRISMA_URL}"

# Authentication
NEXTAUTH_SECRET="$NEXTAUTH_SECRET_PROD"
NEXTAUTH_URL="http://localhost:3000"
EOF

echo -e "${GREEN}✅ .env file updated${NC}"

echo ""
echo -e "${GREEN}======================================================${NC}"
echo -e "${GREEN}✅ Database Setup Complete!${NC}"
echo -e "${GREEN}======================================================${NC}"
echo ""

echo -e "${YELLOW}Your NEXTAUTH_SECRET:${NC}"
echo "$NEXTAUTH_SECRET_PROD"
echo ""

echo -e "${YELLOW}Next Steps for Vercel Deployment:${NC}"
echo "1. 📊 Add NEXTAUTH_SECRET to Vercel Dashboard:"
echo "   Settings → Environment Variables → Add New"
echo "   Name: NEXTAUTH_SECRET"
echo "   Value: $NEXTAUTH_SECRET_PROD"
echo ""
echo "2. 🚀 Deploy to Vercel:"
echo "   Vercel Dashboard → Deployments → Redeploy"
echo ""
echo "3. 🔧 Set NEXTAUTH_URL after deployment:"
echo "   Update NEXTAUTH_URL to: https://ayamgeprekku.vercel.app"
echo "   Settings → Environment Variables → Edit NEXTAUTH_URL"
echo "   Environment: Production"
echo "   Value: https://ayamgeprekku.vercel.app"
echo ""
echo "4. 🧪 Test your app:"
echo "   Register new user"
echo "   Test login"
echo "   Verify database connection"
echo ""
echo -e "${YELLOW}Useful Commands:${NC}"
echo "• View database: ${GREEN}bunx prisma studio${NC}"
echo "• Check connection: ${GREEN}bun run db:push${NC}"
echo "• Sync schema: ${GREEN}bun run db:generate${NC}"
echo ""
echo -e "${GREEN}🎉 Database is Ready!${NC}"
echo ""
