# Vercel Postgres Setup Script

## Prerequisites

Before running this script, make sure you have:
- A GitHub repository with this code
- A Vercel account
- Node.js/Bun installed

## Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

## Step 2: Login to Vercel

```bash
vercel login
```

## Step 3: Link Project

```bash
vercel link
```

Follow the prompts to link to your existing project or create a new one.

## Step 4: Create Postgres Database

Option A - Via Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Click **Create Database**

Option B - Via CLI:
```bash
vercel postgres create
```

## Step 5: Pull Environment Variables

```bash
vercel env pull .env.local
```

This will pull all environment variables including:
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_URL`

## Step 6: Generate Prisma Client

```bash
bun run db:generate
```

## Step 7: Initialize Database

For first-time setup:

```bash
bun run db:push
```

This will create all tables based on your Prisma schema.

## Step 8: Test Database Connection

```bash
bunx prisma studio
```

This will open Prisma Studio in your browser where you can view and edit your database.

## Step 9: Deploy

```bash
vercel --prod
```

Or push to GitHub and let Vercel auto-deploy:

```bash
git add .
git commit -m "feat: Add Vercel Postgres support"
git push origin master
```

## Verify Deployment

1. Go to Vercel Dashboard
2. Check deployment logs
3. Visit your deployed URL
4. Test database operations (register user, create product, etc.)

## Troubleshooting

### Can't connect to database

```bash
# Check environment variables
vercel env ls

# Verify .env.local exists
cat .env.local

# Test connection locally
bun run db:push
```

### Migration fails

```bash
# Try using push instead
bun run db:push

# Or reset database (WARNING: deletes all data)
bun run db:reset
```

### Build errors

```bash
# Clear Next.js cache
rm -rf .next
bun run build

# Regenerate Prisma Client
bun run db:generate
```

## Environment Variables

Your `.env.local` should contain:

```env
POSTGRES_PRISMA_URL="postgres://default:xxxxx@xxxxx-postgres.xxxxx.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgres://default:xxxxx@xxxxx-postgres.xxxxx.vercel-storage.com:5432/verceldb"
POSTGRES_URL="postgres://default:xxxxx@xxxxx-postgres.xxxxx.vercel-storage.com:5432/verceldb?pgbouncer=true"
```

## Next Steps

After successful deployment:

1. [ ] Register first admin account
2. [ ] Add products to store
3. [. Test user registration
4. [ ] Test point redemption system
5. [ ] Set up custom domain (optional)

## Useful Commands

```bash
# View database
bunx prisma studio

# Create migration
bun run db:migrate --name add_new_field

# Reset database
bun run db:reset

# Pull latest env vars
vercel env pull .env.local

# View deployment logs
vercel logs

# Open deployment in browser
vercel open
```

---

Need help? Check out [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
