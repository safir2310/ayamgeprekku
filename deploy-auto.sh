#!/bin/bash

# Automated Vercel Deployment with Database Setup
# This script will:
# 1. Login to Vercel using token
# 2. Create Vercel Postgres database
# 3. Setup environment variables
# 4. Deploy to production

set -e  # Exit on error

echo "🚀 Automated Vercel Deployment with Database Setup"
echo "=================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Use npx for vercel command
VERCEL_CMD="npx vercel"

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

echo -e "${BLUE}Step 1: Checking Vercel CLI...${NC}"
echo "----------------------------------------"
echo "Using npx for Vercel CLI..."
echo -e "${GREEN}✅ Vercel CLI ready (via npx)${NC}"

echo ""
echo -e "${BLUE}Step 2: Authenticating with Vercel...${NC}"
echo "----------------------------------------"
echo "$VERCEL_TOKEN" | $VERCEL_CMD login --token
echo -e "${GREEN}✅ Authenticated to Vercel${NC}"

echo ""
echo -e "${BLUE}Step 3: Linking project...${NC}"
echo "----------------------------------------"
if [ ! -d ".vercel" ]; then
    $VERCEL_CMD link --yes --token="$VERCEL_TOKEN"
    echo -e "${GREEN}✅ Project linked${NC}"
else
    echo -e "${GREEN}✅ Project already linked${NC}"
fi

echo ""
echo -e "${BLUE}Step 4: Creating Vercel Postgres Database...${NC}"
echo "----------------------------------------"
echo "Creating database: ayamgeprekku"
echo "yes
yes" | $VERCEL_CMD postgres create --name=ayamgeprekku --region=sin1 --token="$VERCEL_TOKEN"
echo -e "${GREEN}✅ Database created${NC}"

echo ""
echo -e "${BLUE}Step 5: Getting environment variables...${NC}"
echo "----------------------------------------"
$VERCEL_CMD env pull .env.vercel --environment=production --token="$VERCEL_TOKEN"
echo -e "${GREEN}✅ Environment variables pulled${NC}"

echo ""
echo -e "${BLUE}Step 6: Adding NEXTAUTH_SECRET...${NC}"
echo "----------------------------------------"
NEXTAUTH_SECRET_PROD=$(openssl rand -base64 32)
echo "yes
$NEXTAUTH_SECRET_PROD" | $VERCEL_CMD env add NEXTAUTH_SECRET production --token="$VERCEL_TOKEN"
echo -e "${GREEN}✅ NEXTAUTH_SECRET added${NC}"

echo ""
echo -e "${BLUE}Step 7: Updating .env file...${NC}"
echo "----------------------------------------"
if [ -f ".env" ]; then
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo -e "${YELLOW}Backup created${NC}"
fi

if [ -f ".env.vercel" ]; then
    source .env.vercel
    cat > .env << EOF
# Vercel Postgres - $(date)
POSTGRES_PRISMA_URL="\${POSTGRES_PRISMA_URL}"
POSTGRES_URL_NON_POOLING="\${POSTGRES_URL_NON_POOLING}"
POSTGRES_URL="\${POSTGRES_URL}"
NEXTAUTH_SECRET="$NEXTAUTH_SECRET_PROD"
NEXTAUTH_URL="http://localhost:3000"
EOF
    echo -e "${GREEN}✅ .env updated${NC}"
fi

echo ""
echo -e "${BLUE}Step 8: Syncing database schema...${NC}"
echo "----------------------------------------"
bun run db:push
echo -e "${GREEN}✅ Schema synced${NC}"

echo ""
echo -e "${BLUE}Step 9: Deploying to Vercel...${NC}"
echo "----------------------------------------"
$VERCEL_CMD --prod --token="$VERCEL_TOKEN"

echo ""
echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}==================================================${NC}"
echo ""

echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Test your app at the production URL"
echo "2. Register a user to test database"
echo "3. Check Vercel Dashboard for logs"
echo ""
echo -e "${YELLOW}Database:${NC}"
echo "• Provider: Vercel Postgres"
echo "• Region: Singapore"
echo "• Name: ayamgeprekku"
echo ""
