# 🚀 Vercel Deployment Fix - Step by Step Guide

## 🔍 Problem Identified

Your deployment is failing with `ERR_INVALID_THIS` and `ERR_PNPM_META_FETCH_FAIL` errors. This is caused by:

1. ❌ **Wrong Root Directory**: Currently set to `apps/auth` (should be monorepo root)
2. ❌ **Wrong Node.js Version**: Currently set to `24.x` (should be `20.x` or `22.x`)
3. ❌ **Missing `.npmrc` file**: Network timeout/retry configuration missing
4. ❌ **Missing Environment Variable**: `ENABLE_EXPERIMENTAL_COREPACK` not set

## ✅ Files Fixed

I've created/fixed the following files:

1. ✅ **`.npmrc`** - Added network timeout and retry settings
2. ✅ **`apps/auth/vercel.json`** - Created Vercel config for auth app
3. ✅ **`apps/admin/vercel.json`** - Created Vercel config for admin app
4. ✅ **`apps/client/vercel.json`** - Created Vercel config for client app
5. ✅ **`package.json`** - Updated engines field for better Node.js version compatibility

## 📋 Vercel Dashboard Settings - CRITICAL FIXES

You need to update these settings in **EACH** of your three Vercel projects (auth, admin, client):

### For Auth Project (`shift-management-auth`):

1. **Go to**: Settings → General → Root Directory
   - **CHANGE FROM**: `apps/auth`
   - **CHANGE TO**: *(Leave empty or set to repository root)*
   - ⚠️ **IMPORTANT**: Root Directory must be the monorepo root, NOT the app directory

2. **Go to**: Settings → Build and Deployment → Node.js Version
   - **CHANGE FROM**: `24.x`
   - **CHANGE TO**: `20.x` (or `22.x` to match your local version)
   - This matches your `package.json` engines field

3. **Go to**: Settings → Environment Variables
   - **ADD NEW VARIABLE**:
     - Key: `ENABLE_EXPERIMENTAL_COREPACK`
     - Value: `1`
     - Apply to: ✅ Production, ✅ Preview, ✅ Development
   - **SAVE**

4. **Go to**: Settings → Build and Deployment
   - **Install Command**: Leave empty (will use `vercel.json`)
   - **Build Command**: Leave empty (will use `vercel.json`)
   - **Output Directory**: Leave empty (will use `vercel.json`)

5. **Go to**: Settings → General → Clear Build Cache
   - Click "Clear Build Cache" button

### For Admin Project (`shift-management-admin`):

Repeat the same steps as above, but:
- Root Directory: *(Leave empty or set to repository root)*
- All other settings same as auth

### For Client Project (`shift-management-client`):

Repeat the same steps as above, but:
- Root Directory: *(Leave empty or set to repository root)*
- All other settings same as auth

## 🔧 What Each Fix Does

### 1. `.npmrc` File
- **Network Timeout**: 300 seconds (5 minutes) - prevents timeout errors
- **Retry Logic**: 5 retries with exponential backoff
- **Registry**: Explicitly set to npm registry
- **Fixes**: `ERR_INVALID_THIS` network fetch errors

### 2. `vercel.json` Files
- **Install Command**: `pnpm install --frozen-lockfile` - ensures consistent installs
- **Build Command**: `pnpm build --filter=[app]` - builds only the specific app
- **Output Directory**: Points to correct `.next` folder
- **Fixes**: Monorepo build configuration issues

### 3. `ENABLE_EXPERIMENTAL_COREPACK=1`
- **Purpose**: Tells Vercel to use the pnpm version from `packageManager` field
- **Version Used**: `pnpm@8.15.6` (stable, no bugs)
- **Fixes**: pnpm version compatibility issues

### 4. Root Directory Fix
- **Why**: pnpm workspaces require installation from monorepo root
- **Why**: `--filter` flag only works from workspace root
- **Fixes**: "Cannot find module" and workspace dependency errors

### 5. Node.js Version Fix
- **Why**: Node.js 24.x has compatibility issues with pnpm 8.15.6
- **Why**: Your `package.json` specifies `>=20 <25`
- **Fixes**: Runtime and build compatibility

## 📝 Step-by-Step Action Plan

### Step 1: Commit and Push Changes
```bash
git add .
git commit -m "Fix Vercel deployment: Add .npmrc, vercel.json configs, update Node version"
git push
```

### Step 2: Update Vercel Settings (Do this for ALL 3 projects)

For each project (auth, admin, client):

1. **Root Directory**: Remove `apps/[app-name]`, leave empty
2. **Node.js Version**: Change from `24.x` to `20.x`
3. **Environment Variable**: Add `ENABLE_EXPERIMENTAL_COREPACK=1`
4. **Clear Build Cache**: Settings → General → Clear Build Cache

### Step 3: Redeploy

After updating settings:
- Go to Deployments tab
- Click "Redeploy" on the latest deployment
- Or push a new commit to trigger automatic deployment

## 🎯 Expected Result

After these fixes, your deployment should:
- ✅ Successfully run `pnpm install` without `ERR_INVALID_THIS` errors
- ✅ Build all workspace dependencies correctly
- ✅ Build the specific app using Turbo
- ✅ Deploy successfully

## 🐛 If Still Failing

If you still get errors after these fixes:

1. **Check Build Logs**: Look for specific error messages
2. **Verify Settings**: Double-check Root Directory is empty/root
3. **Check Lockfile**: Ensure `pnpm-lock.yaml` is committed
4. **Node Version**: Try `22.x` if `20.x` doesn't work (matches your local)

## 📞 Quick Reference

**Current Issues:**
- Root Directory: `apps/auth` ❌ → Should be: *(empty/root)* ✅
- Node.js: `24.x` ❌ → Should be: `20.x` or `22.x` ✅
- Missing `.npmrc` ❌ → Now created ✅
- Missing `ENABLE_EXPERIMENTAL_COREPACK` ❌ → Need to add in Vercel ✅

**Files Created:**
- `.npmrc` ✅
- `apps/auth/vercel.json` ✅
- `apps/admin/vercel.json` ✅
- `apps/client/vercel.json` ✅

**Files Updated:**
- `package.json` (engines field) ✅
