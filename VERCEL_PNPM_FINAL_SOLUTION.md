# 🔧 Final Solution: Force Correct pnpm Version

## 🔍 Problem

Even after `npm install -g pnpm@8.15.6`, the system still uses old pnpm 6.35.1 because:
- The old pnpm is already in PATH
- The `pnpm` command resolves to the old version first

## ✅ Solution: Use `npx` to Force Version

Use `npx` which will use the exact version specified, bypassing PATH issues.

### New Install Command (for Vercel Dashboard):

```
npx -y pnpm@8.15.6 install --frozen-lockfile
```

**What this does:**
- `npx -y` - Runs without prompting, uses exact version
- `pnpm@8.15.6` - Forces this specific version
- `install --frozen-lockfile` - Runs install with that version

## 📋 Complete Vercel Settings

For **ALL 3 projects** (auth, admin, client):

### Install Command (enable Override):
```
npx -y pnpm@8.15.6 install --frozen-lockfile
```

### Build Command (enable Override):
- **Auth**: `pnpm build --filter=auth`
- **Admin**: `pnpm build --filter=admin`  
- **Client**: `pnpm build --filter=client`

### Output Directory (enable Override):
- **Auth**: `apps/auth/.next`
- **Admin**: `apps/admin/.next`
- **Client**: `apps/client/.next`

### Node.js Version:
- **Set to**: `20.x` or `22.x` (package.json now excludes 24.x)

### Environment Variable:
- **Key**: `ENABLE_EXPERIMENTAL_COREPACK`
- **Value**: `1`

### Root Directory:
- **Keep EMPTY** (monorepo root)

## 🎯 Why This Works

- `npx` downloads and uses the exact version specified
- Bypasses any old pnpm in PATH
- No need to uninstall or manage global installs
- Works consistently across all builds

## 🚀 Next Steps

1. **Update Install Command in Vercel Dashboard** to: `npx -y pnpm@8.15.6 install --frozen-lockfile`
2. **Clear Build Cache**
3. **Redeploy**

This should finally work! 🎉
