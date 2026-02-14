# Deployment Guide - Vercel with Postgres

## Quick Start Deployment

### 1. Push to GitHub

```bash
git add .
git commit -m "feat: Add Vercel Postgres support"
git push origin master
```

### 2. Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Select your GitHub repository (ayamgeprekku)
4. Click **"Import"**

### 3. Create Postgres Database

#### Option A: Create New Database

1. During import or in project settings, go to **Storage** tab
2. Click **"Create Database"**
3. Select **Postgres**
4. Choose a region (recommended: Singapore for Indonesian users)
5. Click **"Create Database"**

#### Option B: Use Existing Database

If you already have a Postgres database:
1. Go to your project settings
2. Click **Storage**
3. Add existing database

### 4. Configure Environment Variables

After creating the database, Vercel will automatically add these environment variables:
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_URL`

Make sure they appear in:
- **Settings** → **Environment Variables**

### 5. Deploy

Click **"Deploy"** button and wait for the deployment to complete.

## Post-Deployment Steps

### 1. Run Initial Migration

After first deployment:

1. Go to your project in Vercel
2. Click **Storage** → **Your Database**
3. Click **"Migrate"** or use the Vercel CLI:

```bash
vercel login
vercel link
bun run db:migrate
```

### 2. Verify Database Connection

Check if the deployment logs show successful database connection.

### 3. Test the Application

Visit your deployed application and verify:
- User registration works
- Admin registration works
- Products can be added
- Orders work correctly

## Local Development with Vercel Postgres

### Setup

1. Pull environment variables from Vercel:

```bash
vercel env pull .env.local
```

2. Generate Prisma Client:

```bash
bun run db:generate
```

3. Push schema to database (first time):

```bash
bun run db:push
```

### Make Changes

1. Update `prisma/schema.prisma`
2. Run migration:

```bash
bun run db:migrate
```

Or for quick development:

```bash
bun run db:push
```

## Environment Variables

### Required for Vercel Postgres:

| Variable | Description | Source |
|----------|-------------|--------|
| `POSTGRES_PRISMA_URL` | Prisma connection string | Auto from Vercel Postgres |
| `POSTGRES_URL_NON_POOLING` | Direct connection for migrations | Auto from Vercel Postgres |
| `POSTGRES_URL` | Full connection string | Auto from Vercel Postgres |

### Optional:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXTAUTH_SECRET` | Secret for NextAuth | Auto-generated |
| `NEXTAUTH_URL` | Application URL | Auto from Vercel |

## Troubleshooting

### Build Errors

**Error:** `PrismaClientInitializationError`

**Solution:**
1. Check environment variables are set correctly
2. Ensure database is created and active
3. Verify `POSTGRES_PRISMA_URL` is correct

### Migration Errors

**Error:** `Migration failed`

**Solution:**
1. Make sure `POSTGRES_URL_NON_POOLING` is set
2. Check if there are pending migrations
3. Try running `bun run db:push` instead

### Runtime Errors

**Error:** `Connection timeout`

**Solution:**
1. Check connection string has `?connect_timeout=15`
2. Verify database region is close to your app region
3. Check database is not in sleep mode

### Empty Database

**Issue:** No data in database after deployment

**Solution:**
1. Run migrations: `bun run db:push` or `bun run db:migrate`
2. Or manually create tables using Vercel Dashboard

## Monitoring

### Check Database Usage

1. Go to Vercel Dashboard
2. Click **Storage** → **Your Database**
3. View usage metrics:
   - Connection count
   - Storage usage
   - Read/write operations

### Check Logs

1. Go to your project in Vercel
2. Click **Deployments**
3. Click on a deployment
4. View logs for database connection issues

## Backup & Restore

### Backup

Vercel Postgres automatically creates backups.

### Restore

To restore from backup:
1. Go to **Storage** → **Your Database**
2. Click **Backups**
3. Select a backup point
4. Click **Restore**

## Cost & Limits

### Free Tier
- 256 MB storage
- 60 hours of compute per month
- 1 billion row reads per month

### Pro Plan
- 8 GB storage
- Additional compute hours
- Higher limits

## Best Practices

1. **Always test locally** before deploying
2. **Use connection pooling** (already configured)
3. **Monitor usage** regularly
4. **Keep secrets secure** - never commit `.env`
5. **Use migrations** for production, `db:push` for development
6. **Backup before major changes**

## Updating Schema

### For Development:

```bash
# 1. Update schema.prisma
# 2. Run this command
bun run db:push
```

### For Production:

```bash
# 1. Create migration
bun run db:migrate --name your_migration_name

# 2. Commit migration files
git add prisma/migrations
git commit -m "feat: add migration"

# 3. Push and deploy
git push origin master
```

## Useful Commands

```bash
# Generate Prisma Client
bun run db:generate

# Push schema (development)
bun run db:push

# Create migration
bun run db:migrate

# Reset database (CAUTION: deletes all data)
bun run db:reset

# Open Prisma Studio
bunx prisma studio

# Pull env from Vercel
vercel env pull .env.local

# Push env to Vercel
vercel env push .env.local

# View env in Vercel
vercel env ls
```

## Support & Resources

- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)

## Quick Reference

### File Locations

- Schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`
- Client: Generated automatically in `node_modules/@prisma/client`
- Env vars: `.env` (local), Vercel Dashboard (production)

### Database Connection

```typescript
import { db } from '@/lib/db'

// Your database is now ready to use!
```

---

**Ready to deploy?** Follow the steps above and your app will be live in minutes! 🚀
