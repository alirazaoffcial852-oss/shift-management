# ✅ Complete Fix: Use npx for Both Install and Build

## 🔍 Problem

The old pnpm (6.35.1) is still being used even after installing 8.15.6 because:
- Old pnpm is already in PATH
- `pnpm` command resolves to old version

## ✅ Solution: Use `npx` for Everything

Use `npx` to force the exact pnpm version for BOTH install and build commands.

## 📋 Complete Vercel Settings

For **ALL 3 projects** (auth, admin, client):

### Install Command (enable Override):
```
npx -y pnpm@8.15.6 install --frozen-lockfile
```

### Build Command (enable Override):
- **Auth**: `npx -y pnpm@8.15.6 build --filter=auth`
- **Admin**: `npx -y pnpm@8.15.6 build --filter=admin`
- **Client**: `npx -y pnpm@8.15.6 build --filter=client`

### Output Directory (enable Override):
- **Auth**: `apps/auth/.next`
- **Admin**: `apps/admin/.next`
- **Client**: `apps/client/.next`

### Node.js Version:
- **Set to**: `20.x` or `22.x` (package.json excludes 24.x ✅)

### Environment Variable:
- **Key**: `ENABLE_EXPERIMENTAL_COREPACK`
- **Value**: `1`
- **Apply to**: Production, Preview, Development

### Root Directory:
- **Keep EMPTY** (monorepo root)

## 🎯 Why This Works

- `npx -y pnpm@8.15.6` - Downloads and uses exact version 8.15.6
- Bypasses any old pnpm in PATH
- Works for both install and build
- No PATH or version conflicts

## 🚀 Steps to Fix

1. **Update Install Command** in Vercel Dashboard:
   ```
   npx -y pnpm@8.15.6 install --frozen-lockfile
   ```

2. **Update Build Command** in Vercel Dashboard:
   - **Auth**: `npx -y pnpm@8.15.6 build --filter=auth`
   - **Admin**: `npx -y pnpm@8.15.6 build --filter=admin`
   - **Client**: `npx -y pnpm@8.15.6 build --filter=client`

3. **Clear Build Cache**: Settings → General → Clear Build Cache

4. **Redeploy**

## ✅ What's Already Fixed

- ✅ `package.json` engines.node excludes 24.x
- ✅ `package.json` has `packageManager: "pnpm@8.15.6"`
- ✅ Root Directory is empty (monorepo root)

## 🎉 Expected Result

After these changes:
- ✅ Node.js 22.x will be used (from engines field, excludes 24.x)
- ✅ pnpm 8.15.6 will be used (via npx)
- ✅ Install will succeed
- ✅ Build will succeed
- ✅ Deployment will complete! 🚀
