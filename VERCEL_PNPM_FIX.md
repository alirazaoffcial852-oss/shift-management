# 🚨 CRITICAL FIX: Vercel Using npm Instead of pnpm

## 🔍 Problem

After removing Root Directory (setting it to empty), Vercel is now using `npm install` instead of `pnpm install`. This causes:

```
npm error Unsupported URL Type "workspace:": workspace:*
```

**Why?** npm doesn't understand pnpm's `workspace:*` protocol. Only pnpm does.

## ✅ Solution: Explicitly Set Install Command in Vercel Dashboard

Since you have **separate Vercel projects** (auth, admin, client), you need to configure each one individually in the Vercel Dashboard.

### For Auth Project (`shift-management-auth`):

1. **Go to**: Settings → Build and Deployment
2. **Find**: "Install Command" field
3. **Enable Override**: Toggle the "Override" switch to **ON** (blue)
4. **Set Install Command to**: `pnpm install --frozen-lockfile`
5. **Set Build Command to**: `pnpm build --filter=auth` (enable Override)
6. **Set Output Directory to**: `apps/auth/.next` (enable Override)
7. **Click "Save"**

### For Admin Project (`shift-management-admin`):

1. **Go to**: Settings → Build and Deployment
2. **Enable Override** for Install Command
3. **Set Install Command to**: `pnpm install --frozen-lockfile`
4. **Set Build Command to**: `pnpm build --filter=admin` (enable Override)
5. **Set Output Directory to**: `apps/admin/.next` (enable Override)
6. **Click "Save"**

### For Client Project (`shift-management-client`):

1. **Go to**: Settings → Build and Deployment
2. **Enable Override** for Install Command
3. **Set Install Command to**: `pnpm install --frozen-lockfile`
4. **Set Build Command to**: `pnpm build --filter=client` (enable Override)
5. **Set Output Directory to**: `apps/client/.next` (enable Override)
6. **Click "Save"**

## 🔧 Additional Required Settings

### 1. Environment Variable (CRITICAL)

For **ALL 3 projects**, add this environment variable:

- **Go to**: Settings → Environment Variables
- **Add**:
  - Key: `ENABLE_EXPERIMENTAL_COREPACK`
  - Value: `1`
  - Apply to: ✅ Production, ✅ Preview, ✅ Development
- **Save**

### 2. Node.js Version

For **ALL 3 projects**:

- **Go to**: Settings → Build and Deployment → Node.js Version
- **Change from**: `24.x`
- **Change to**: `20.x` (or `22.x` to match your local)
- **Save**

### 3. Root Directory

- **Keep it EMPTY** (monorepo root) ✅
- This is correct for monorepos

### 4. Clear Build Cache

After making these changes:

- **Go to**: Settings → General
- **Click**: "Clear Build Cache"
- **Then**: Redeploy

## 📋 Complete Settings Checklist

For each project (auth, admin, client), verify:

- [ ] **Root Directory**: Empty (monorepo root)
- [ ] **Install Command**: `pnpm install --frozen-lockfile` (Override ON)
- [ ] **Build Command**: `pnpm build --filter=[app-name]` (Override ON)
- [ ] **Output Directory**: `apps/[app-name]/.next` (Override ON)
- [ ] **Node.js Version**: `20.x` or `22.x`
- [ ] **Environment Variable**: `ENABLE_EXPERIMENTAL_COREPACK=1`
- [ ] **Build Cache**: Cleared

## 🎯 Why This Works

1. **Explicit Install Command**: Forces Vercel to use pnpm instead of auto-detecting (which failed)
2. **--frozen-lockfile**: Ensures consistent installs using the committed lockfile
3. **--filter flag**: Builds only the specific app in the monorepo
4. **ENABLE_EXPERIMENTAL_COREPACK**: Ensures Vercel respects the `packageManager` field in package.json
5. **Root Directory Empty**: Allows pnpm to see the entire workspace and resolve `workspace:*` dependencies

## 🚀 After Making Changes

1. **Save all settings** in Vercel Dashboard
2. **Clear build cache** for each project
3. **Redeploy** (push a commit or manually trigger)
4. **Monitor build logs** - you should see `pnpm install` instead of `npm install`

## ⚠️ Important Notes

- The `vercel.json` files in `apps/*` directories won't be used when Root Directory is empty
- You MUST set commands explicitly in Vercel Dashboard for each project
- All three projects share the same repository but need separate Vercel project configurations
