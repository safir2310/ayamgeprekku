# Vercel Postgres Setup Guide

## 1. Create Postgres Database on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project or create new project
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Click **Create Database**

## 2. Get Environment Variables

After creating the database, you'll get these environment variables:

- `POSTGRES_PRISMA_URL` - Primary connection string (use this in your Prisma schema)
- `POSTGRES_URL_NON_POOLING` - Direct connection for migrations
- `POSTGRES_URL` - Full connection URL with pooling

## 3. Update Environment Variables

### In Vercel Project Settings:

1. Go to your project settings
2. Click **Environment Variables**
3. Add the following variables from your Postgres database:
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_URL`

### For Local Development:

1. Go to your Postgres database page on Vercel
2. Click **.env.local** tab
3. Copy all environment variables
4. Paste them into your project's `.env` file

```env
POSTGRES_PRISMA_URL="postgres://default:xxxxx@xxxxx-postgres.xxxxx.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgres://default:xxxxx@xxxxx-postgres.xxxxx.vercel-storage.com:5432/verceldb"
POSTGRES_URL="postgres://default:xxxxx@xxxxx-postgres.xxxxx.vercel-storage.com:5432/verceldb?pgbouncer=true"
```

## 4. Update Prisma Schema

Your `prisma/schema.prisma` should look like this:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}
```

## 5. Run Migrations

### For Local Development:

```bash
# Generate Prisma Client
bun run db:generate

# Push schema to database (development)
bun run db:push

# Or create migration (production)
bun run db:migrate
```

### For Production (Vercel):

The migrations will automatically run when you deploy to Vercel if you have:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

## 6. Connect to Database from Application

Use the database client in your code:

```typescript
import { db } from '@/lib/db'

// Example usage
const users = await db.user.findMany()
```

## 7. Vercel Postgres CLI

Install the Vercel CLI:

```bash
npm i -g vercel
```

Login:

```bash
vercel login
```

Link project:

```bash
vercel link
```

Pull environment variables:

```bash
vercel env pull .env.local
```

## 8. View Database

You can view your database using:

1. **Vercel Dashboard**: Go to Storage > Your Database > Tables
2. **Prisma Studio**: Run `bunx prisma studio` (for local)
3. **VS Code**: Use the Vercel Postgres extension

## 9. Troubleshooting

### Connection Issues:

Make sure you're using:
- `POSTGRES_PRISMA_URL` for the Prisma schema
- `POSTGRES_URL_NON_POOLING` for migrations

### Migration Issues:

If migrations fail on Vercel:
1. Run migrations locally first
2. Or use `db:push` for development
3. For production, use `db:migrate` with proper migration files

### Timeout Issues:

If you get timeout errors:
- Check your connection string includes `?connect_timeout=15`
- Verify your database is active and not in sleep mode

## 10. Best Practices

1. **Always test migrations locally** before deploying
2. **Backup your database** before major changes
3. **Use connection pooling** for production (already configured in `POSTGRES_PRISMA_URL`)
4. **Monitor usage** in Vercel Dashboard
5. **Keep secrets secure** - never commit `.env` files

## Environment Variables Reference

| Variable | Purpose |
|----------|---------|
| `POSTGRES_PRISMA_URL` | Main connection string for Prisma (with pooling) |
| `POSTGRES_URL_NON_POOLING` | Direct connection for migrations |
| `POSTGRES_URL` | Backup connection string |
| `POSTGRES_USER` | Database username (for some clients) |
| `POSTGRES_PASSWORD` | Database password (for some clients) |
| `POSTGRES_HOST` | Database host (for some clients) |
| `POSTGRES_DATABASE` | Database name (for some clients) |
