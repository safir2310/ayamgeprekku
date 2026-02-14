#!/bin/bash

# Vercel Deployment Script for Ayam Geprek with Prisma Cloud Database
# This script will help you deploy your app to Vercel

set -e  # Exit on error

echo "🚀 Starting Vercel Deployment for Ayam Geprek App"
echo "=============================================="

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

echo -e "${GREEN}✅ Vercel CLI is ready${NC}"

# Step 1: Check if logged in
echo ""
echo "Step 1: Checking Vercel login status..."
vercel whoami &> /dev/null || {
    echo -e "${YELLOW}⚠️  Not logged in to Vercel. Please login...${NC}"
    vercel login
}

echo -e "${GREEN}✅ Logged in to Vercel${NC}"

# Step 2: Link project
echo ""
echo "Step 2: Linking project to Vercel..."
if [ ! -d ".vercel" ]; then
    vercel link --yes
    echo -e "${GREEN}✅ Project linked${NC}"
else
    echo -e "${GREEN}✅ Project already linked${NC}"
fi

# Step 3: Add environment variables
echo ""
echo "Step 3: Adding environment variables..."
echo "=============================================="

# Load .env file
if [ -f ".env" ]; then
    source .env

    # Add POSTGRES_PRISMA_URL
    echo -e "${YELLOW}Adding POSTGRES_PRISMA_URL...${NC}"
    vercel env add POSTGRES_PRISMA_URL production <<EOF
yes
$POSTGRES_PRISMA_URL
EOF

    # Add POSTGRES_URL_NON_POOLING
    echo -e "${YELLOW}Adding POSTGRES_URL_NON_POOLING...${NC}"
    vercel env add POSTGRES_URL_NON_POOLING production <<EOF
yes
$POSTGRES_URL_NON_POOLING
EOF

    # Add POSTGRES_URL
    echo -e "${YELLOW}Adding POSTGRES_URL...${NC}"
    vercel env add POSTGRES_URL production <<EOF
yes
$POSTGRES_URL
EOF

    # Generate and add NEXTAUTH_SECRET
    echo -e "${YELLOW}Generating and adding NEXTAUTH_SECRET...${NC}"
    NEXTAUTH_SECRET_PROD=$(openssl rand -base64 32)
    vercel env add NEXTAUTH_SECRET production <<EOF
yes
$NEXTAUTH_SECRET_PROD
EOF

    echo -e "${GREEN}✅ Environment variables added${NC}"
else
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    exit 1
fi

# Step 4: Deploy to Vercel
echo ""
echo "Step 4: Deploying to Vercel..."
echo "=============================================="
vercel --prod

# Step 5: Get deployment URL
DEPLOY_URL=$(vercel ls --prod 2>/dev/null | grep -oP 'https://[^ ]+' | head -1)

echo ""
echo -e "${GREEN}==============================================${NC}"
echo -e "${GREEN}🎉 Deployment Successful!${NC}"
echo -e "${GREEN}==============================================${NC}"
echo ""
echo -e "${YELLOW}Your app is live at: ${NC}${GREEN}$DEPLOY_URL${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Update NEXTAUTH_URL in Vercel Dashboard to: ${GREEN}$DEPLOY_URL${NC}"
echo "   Go to: Settings → Environment Variables → Edit NEXTAUTH_URL"
echo ""
echo "2. Test your application at: ${GREEN}$DEPLOY_URL${NC}"
echo "3. Check deployment logs for any errors"
echo ""
echo -e "${YELLOW}To manage your database:${NC}"
echo "   Run: ${GREEN}bunx prisma studio${NC}"
echo ""
