# 🔧 Fix: Vercel Using Old pnpm Version (6.35.1 instead of 8.15.6)

## 🔍 Problem

Vercel is using pnpm **6.35.1** (very old) but your project requires **>=8.15.6**.

Error:
```
ERR_PNPM_UNSUPPORTED_ENGINE  Unsupported environment (bad pnpm and/or Node.js version)
Expected version: >=8.15.6
Got: 6.35.1
```

## ✅ Solution: Update Install Command to Use Corepack

The `ENABLE_EXPERIMENTAL_COREPACK=1` environment variable should work, but we need to ensure Corepack is enabled and using the correct version.

### Option 1: Use Corepack in Install Command (RECOMMENDED)

Update the **Install Command** in Vercel Dashboard for **ALL 3 projects**:

**New Install Command:**
```bash
corepack enable && corepack prepare pnpm@8.15.6 --activate && pnpm install --frozen-lockfile
```

**Steps:**
1. Go to: **Settings → Build and Deployment**
2. Find: **Install Command**
3. Make sure **Override** is **ON** (blue)
4. Replace the command with:
   ```
   corepack enable && corepack prepare pnpm@8.15.6 --activate && pnpm install --frozen-lockfile
   ```
5. Click **Save**

### Option 2: Install pnpm Explicitly First

If Option 1 doesn't work, try this:

**New Install Command:**
```bash
npm install -g pnpm@8.15.6 && pnpm install --frozen-lockfile
```

### Option 3: Use pnpm dlx (Alternative)

```bash
pnpm dlx pnpm@8.15.6 install --frozen-lockfile
```

## 🔧 Complete Settings for All 3 Projects

For **each project** (auth, admin, client):

### Install Command:
```
corepack enable && corepack prepare pnpm@8.15.6 --activate && pnpm install --frozen-lockfile
```

### Build Command (enable Override):
- **Auth**: `pnpm build --filter=auth`
- **Admin**: `pnpm build --filter=admin`
- **Client**: `pnpm build --filter=client`

### Output Directory (enable Override):
- **Auth**: `apps/auth/.next`
- **Admin**: `apps/admin/.next`
- **Client**: `apps/client/.next`

### Environment Variable (CRITICAL):
- **Key**: `ENABLE_EXPERIMENTAL_COREPACK`
- **Value**: `1`
- **Apply to**: Production, Preview, Development

### Node.js Version:
- **Set to**: `20.x` or `22.x` (NOT 24.x)

### Root Directory:
- **Keep EMPTY** (monorepo root)

## 🎯 Why This Works

1. **`corepack enable`**: Enables Corepack (Node.js's built-in package manager manager)
2. **`corepack prepare pnpm@8.15.6 --activate`**: Downloads and activates pnpm 8.15.6
3. **`pnpm install --frozen-lockfile`**: Runs install with the correct pnpm version
4. **`ENABLE_EXPERIMENTAL_COREPACK=1`**: Tells Vercel to use Corepack

## 🚀 After Making Changes

1. **Save all settings** in Vercel Dashboard
2. **Clear build cache**: Settings → General → Clear Build Cache
3. **Redeploy** (push a commit or manually trigger)
4. **Check build logs** - you should see:
   - `corepack enable`
   - `corepack prepare pnpm@8.15.6`
   - `pnpm install` running with version 8.15.6

## ⚠️ Important Notes

- Make sure `ENABLE_EXPERIMENTAL_COREPACK=1` is set in **Environment Variables**
- The `packageManager: "pnpm@8.15.6"` field in `package.json` helps Corepack know which version to use
- Corepack is built into Node.js 16.9+ (Vercel uses Node 20+, so it's available)

## 🐛 If Still Not Working

If you still get pnpm version errors:

1. **Try Option 2** (npm install -g pnpm@8.15.6)
2. **Check Node.js version** - make sure it's 20.x or 22.x (not 24.x)
3. **Verify environment variable** - double-check `ENABLE_EXPERIMENTAL_COREPACK=1` is set
4. **Check build logs** - look for what pnpm version is actually being used
