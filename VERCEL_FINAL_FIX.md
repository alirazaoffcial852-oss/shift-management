# 🔧 Final Fix: Node.js 24.x Override Issue

## 🔍 Problem Identified

The warning shows:
```
Warning: Due to "engines": { "node": ">=20.0.0 <25.0.0" } in your `package.json` file, 
the Node.js Version defined in your Project Settings ("20.x") will not apply, 
Node.js Version "24.x" will be used instead.
```

**Why this happens:**
- Vercel reads the `engines.node` field in `package.json`
- If it says `">=20.0.0 <25.0.0"`, Vercel interprets this as "use the highest version in range" = 24.x
- This overrides your Vercel Dashboard setting of 20.x
- Node.js 24.x has compatibility issues with pnpm 8.15.6

## ✅ Solution Applied

### 1. Fixed `package.json` engines field

Changed from:
```json
"node": ">=20.0.0 <25.0.0"
```

Changed to:
```json
"node": ">=20.0.0 <24.0.0"
```

This **excludes Node.js 24.x**, so Vercel will respect your Dashboard setting of 20.x.

### 2. Updated Install Command Strategy

Since `corepack` might not work properly with Node.js 24.x, use this **new Install Command** in Vercel:

**New Install Command:**
```bash
npm install -g pnpm@8.15.6 && pnpm install --frozen-lockfile
```

This:
1. Installs pnpm 8.15.6 globally using npm (which is always available)
2. Then uses that pnpm version to install dependencies

## 📋 Complete Vercel Settings

For **ALL 3 projects** (auth, admin, client):

### Install Command (enable Override):
```
npm install -g pnpm@8.15.6 && pnpm install --frozen-lockfile
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
- **Set to**: `20.x` (now it will work because package.json excludes 24.x)

### Environment Variable:
- **Key**: `ENABLE_EXPERIMENTAL_COREPACK`
- **Value**: `1`
- **Apply to**: Production, Preview, Development

### Root Directory:
- **Keep EMPTY** (monorepo root)

## 🚀 Next Steps

1. **Commit the package.json change:**
   ```bash
   git add package.json
   git commit -m "Fix: Exclude Node.js 24.x from engines to allow Vercel 20.x setting"
   git push
   ```

2. **Update Install Command in Vercel:**
   - Go to Settings → Build and Deployment
   - Change Install Command to: `npm install -g pnpm@8.15.6 && pnpm install --frozen-lockfile`
   - Save

3. **Clear Build Cache:**
   - Settings → General → Clear Build Cache

4. **Redeploy**

## 🎯 Why This Will Work

1. **`engines.node: ">=20.0.0 <24.0.0"`** - Excludes 24.x, so Vercel will use 20.x from Dashboard
2. **`npm install -g pnpm@8.15.6`** - Installs correct pnpm version before install
3. **Node.js 20.x** - Compatible with pnpm 8.15.6
4. **No more version conflicts!**

## ⚠️ Important

After committing the `package.json` change, Vercel will:
- ✅ Use Node.js 20.x (from Dashboard setting)
- ✅ Install pnpm 8.15.6 explicitly
- ✅ Run install with correct versions
- ✅ Build successfully!
