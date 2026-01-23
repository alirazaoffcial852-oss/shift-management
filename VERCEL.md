# 🚀 Vercel Monorepo Deployment Guide

Complete guide for deploying a pnpm + Turborepo monorepo with multiple Next.js apps to Vercel.

## 📋 Project Structure

This monorepo contains three Next.js applications:

- **Auth** (`apps/auth`) - Authentication service → `https://shift-management-auth.vercel.app`
- **Admin** (`apps/admin`) - Admin dashboard → `https://shift-management-admin-eight.vercel.app`
- **Client** (`apps/client`) - Client application → `https://shift-management-client.vercel.app`

## 🏗️ Monorepo Setup

### Technology Stack

- **Package Manager**: pnpm 10.5.2
- **Build Tool**: Turborepo
- **Framework**: Next.js 15.3.8
- **Node.js**: 20.x or 22.x (NOT 24.x)
- **Lockfile Version**: 9.0 (pnpm 10.x format)

### Key Files

```
sms-frontend/
├── package.json              # Root package.json with workspace config
├── pnpm-workspace.yaml        # pnpm workspace configuration
├── pnpm-lock.yaml            # Lockfile (MUST be committed)
├── turbo.json                # Turborepo configuration
├── .npmrc                    # Network timeout settings
├── apps/
│   ├── auth/
│   │   ├── package.json
│   │   └── vercel.json       # Vercel config for auth
│   ├── admin/
│   │   ├── package.json
│   │   └── vercel.json       # Vercel config for admin
│   └── client/
│       ├── package.json
│       ├── vercel.json       # Vercel config for client
│       └── app/
│           └── api/
│               └── proxy/    # API proxy route for HTTPS→HTTP
└── packages/
    └── ui/                   # Shared UI components
```

## ⚙️ Root Configuration Files

### `package.json` (Root)

```json
{
  "name": "shift-managment-frontend",
  "version": "0.0.1",
  "private": true,
  "packageManager": "pnpm@10.5.2",
  "engines": {
    "node": ">=20.0.0 <24.0.0",
    "pnpm": ">=10.0.0"
  },
  "workspaces": ["apps/*", "packages/*"]
}
```

**Important:**

- `packageManager` must match your pnpm version
- `engines.node` must exclude 24.x (use `<24.0.0` not `<25.0.0`)
- `pnpm-lock.yaml` must be committed (NOT in `.gitignore`)

### `.npmrc` (Root)

```
registry=https://registry.npmjs.org/
network-timeout=300000
fetch-retries=5
fetch-retry-factor=2
fetch-retry-mintimeout=10000
fetch-retry-maxtimeout=60000
auto-install-peers=true
strict-peer-dependencies=false
```

### `.gitignore`

**IMPORTANT:** `pnpm-lock.yaml` must NOT be in `.gitignore`

```gitignore
node_modules
.next
.turbo
dist
build
*.log
.DS_Store
.env.local
.env*.local
.pnpm-store
# Note: pnpm-lock.yaml should be committed
```

### `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

## 🔧 Vercel Project Settings

### For Each Project (Auth, Admin, Client)

Create **separate Vercel projects** for each app. Configure as follows:

#### 1. General Settings

- **Project Name**:
  - Auth: `shift-management-auth`
  - Admin: `shift-management-admin`
  - Client: `shift-management-client`

- **Root Directory**:
  - **Set to app directory** (NOT empty!)
  - Auth: `apps/auth`
  - Admin: `apps/admin`
  - Client: `apps/client`

#### 2. Build and Deployment Settings

**Framework Preset:**

- Select **"Next.js"** explicitly (don't rely on auto-detection)

**Install Command** (enable Override):

```
cd ../.. && npx -y pnpm@10.5.2 install --frozen-lockfile
```

**Build Command** (enable Override):

- Auth: `cd ../.. && npx -y pnpm@10.5.2 build --filter=auth`
- Admin: `cd ../.. && npx -y pnpm@10.5.2 build --filter=admin`
- Client: `cd ../.. && npx -y pnpm@10.5.2 build --filter=client`

**Output Directory** (enable Override):

```
.next
```

(Relative to Root Directory, NOT `apps/auth/.next`)

**Development Command**: Leave default (or enable Override: `next`)

**Node.js Version:**

- Set to **`20.x`** or **`22.x`** (NOT 24.x)
- Must match `engines.node` in `package.json`

#### 3. Environment Variables

**For Auth Project:**

| Key                            | Value                                                            | Apply To |
| ------------------------------ | ---------------------------------------------------------------- | -------- |
| `NEXT_PUBLIC_API_BASE_URL`     | `https://ec2-3-64-58-144.eu-central-1.compute.amazonaws.com/api` | All      |
| `NEXT_PUBLIC_ADMIN_BASE_URL`   | `https://shift-management-admin-eight.vercel.app`                | All      |
| `NEXT_PUBLIC_CLIENT_BASE_URL`  | `https://shift-management-client.vercel.app`                     | All      |
| `ENABLE_EXPERIMENTAL_COREPACK` | `1`                                                              | All      |

**For Admin Project:**

| Key                            | Value                                                            | Apply To |
| ------------------------------ | ---------------------------------------------------------------- | -------- |
| `NEXT_PUBLIC_API_BASE_URL`     | `https://ec2-3-64-58-144.eu-central-1.compute.amazonaws.com/api` | All      |
| `NEXT_PUBLIC_AUTH_BASE_URL`    | `https://shift-management-auth.vercel.app`                       | All      |
| `ENABLE_EXPERIMENTAL_COREPACK` | `1`                                                              | All      |

**For Client Project:**

| Key                            | Value                                                            | Apply To |
| ------------------------------ | ---------------------------------------------------------------- | -------- |
| `NEXT_PUBLIC_API_BASE_URL`     | `https://ec2-3-64-58-144.eu-central-1.compute.amazonaws.com/api` | All      |
| `NEXT_PUBLIC_AUTH_BASE_URL`    | `https://shift-management-auth.vercel.app`                       | All      |
| `ENABLE_EXPERIMENTAL_COREPACK` | `1`                                                              | All      |

#### 4. Root Directory Settings

- **Root Directory**: `apps/[app-name]` (e.g., `apps/auth`)
- **Include files outside the root directory**: **Enabled** ✅
- **Skip deployments when no changes**: **Disabled**

## 📝 Vercel.json Files

### `apps/auth/vercel.json`

```json
{
  "buildCommand": "cd ../.. && npx -y pnpm@10.5.2 build --filter=auth",
  "installCommand": "cd ../.. && npx -y pnpm@10.5.2 install --frozen-lockfile",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### `apps/admin/vercel.json`

```json
{
  "buildCommand": "cd ../.. && npx -y pnpm@10.5.2 build --filter=admin",
  "installCommand": "cd ../.. && npx -y pnpm@10.5.2 install --frozen-lockfile",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### `apps/client/vercel.json`

```json
{
  "buildCommand": "cd ../.. && npx -y pnpm@10.5.2 build --filter=client",
  "installCommand": "cd ../.. && npx -y pnpm@10.5.2 install --frozen-lockfile",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

## 🔄 API Proxy for Mixed Content (HTTPS → Insecure HTTPS/HTTP)

### Problem

When frontend is HTTPS but backend is HTTP or insecure HTTPS (self-signed certificate), browsers block requests (Mixed Content error).

### Solution: Next.js API Proxy Route

Created proxy routes that forward HTTPS requests to insecure HTTPS/HTTP backend.

### Files Created

**`apps/client/app/api/proxy/[...path]/route.ts`**
**`apps/admin/app/api/proxy/[...path]/route.ts`**

These routes:

- Accept HTTPS requests from frontend
- Forward to insecure HTTPS/HTTP backend (server-to-server, no mixed content)
- Handle insecure HTTPS certificates with `rejectUnauthorized: false`
- Return response to frontend

### HTTP Client Configuration

**`packages/ui/src/lib/http.ts`** and **`packages/ui/src/lib/JsonHttp.ts`**

```typescript
const isProduction =
  typeof window !== "undefined" && window.location.protocol === "https:";
const baseURL = isProduction
  ? "/api/proxy" // Use proxy in production
  : process.env.NEXT_PUBLIC_API_BASE_URL; // Direct URL in development
```

**How it works:**

- **Production (HTTPS)**: Frontend → `/api/proxy/auth/verify-token` → Next.js server → `https://backend/api/auth/verify-token` (insecure cert handled)
- **Development (HTTP)**: Frontend → `http://backend/api/auth/verify-token` (direct)

### Handling Insecure HTTPS Backends

The proxy automatically handles insecure HTTPS certificates (self-signed or expired):

- Uses Node's `https` module with `rejectUnauthorized: false`
- Works with both HTTP and HTTPS backends
- Browser never sees the insecure certificate (proxy handles it server-side)

## 🔐 Authentication & Redirects

### Login Redirect Logic

**File**: `apps/auth/hooks/useSignInForm.ts`

```typescript
const roleName = decodedToken?.role?.name;
const isAdmin = roleName === "ADMIN" || roleName === "ADMIN_STAFF";

const baseRedirectUrl = isAdmin
  ? `${process.env.NEXT_PUBLIC_ADMIN_BASE_URL}/${locale}`
  : `${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/${locale}`;

const redirectUrl = `${baseRedirectUrl}?token=${encodeURIComponent(token)}`;
window.location.href = redirectUrl; // Cross-domain redirect
```

**Redirects:**

- **Admin/ADMIN_STAFF** → `https://shift-management-admin-eight.vercel.app/en?token=...`
- **CLIENT/CLIENT_STAFF/CLIENT_EMPLOYEE** → `https://shift-management-client.vercel.app/en?token=...`

### Logout Redirect Logic

**Files**:

- `apps/client/providers/appProvider.tsx`
- `apps/admin/providers/appProvider.tsx`
- `packages/ui/src/lib/http.ts` (401 handler)
- `packages/ui/src/lib/JsonHttp.ts` (401 handler)

```typescript
const logout = useCallback(() => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  setTokenState(null);
  setUser(null);
  setIsAuthenticated(false);

  // Redirect to auth app
  const authUrl =
    process.env.NEXT_PUBLIC_AUTH_BASE_URL ||
    "https://shift-management-auth.vercel.app";
  window.location.href = `${authUrl}/${locale}/sign-in`;
}, [locale]);
```

**All logout scenarios redirect to:** `https://shift-management-auth.vercel.app/en/sign-in`

## 🐛 Common Issues & Solutions

### Issue 1: `ERR_INVALID_THIS` / `ERR_PNPM_META_FETCH_FAIL`

**Error:**

```
ERR_PNPM_META_FETCH_FAIL GET https://registry.npmjs.org/...
Value of "this" must be of type URLSearchParams
```

**Solution:**

1. ✅ Use pnpm 10.5.2 (not 8.x or 9.x)
2. ✅ Add `.npmrc` with network timeout settings
3. ✅ Set `ENABLE_EXPERIMENTAL_COREPACK=1` environment variable
4. ✅ Use `npx -y pnpm@10.5.2` in install command

### Issue 2: Lockfile Version Mismatch

**Error:**

```
Detected pnpm-lock.yaml version 9 generated by pnpm@10.x
WARN  Ignoring not compatible lockfile
ERR_PNPM_NO_LOCKFILE
```

**Solution:**

1. ✅ Ensure `packageManager: "pnpm@10.5.2"` in root `package.json`
2. ✅ Use `npx -y pnpm@10.5.2` in install/build commands
3. ✅ Ensure `pnpm-lock.yaml` is committed (not in `.gitignore`)

### Issue 3: Node.js Version Override

**Error:**

```
Warning: Due to "engines": { "node": ">=20.0.0 <25.0.0" } in your package.json file,
the Node.js Version defined in your Project Settings ("20.x") will not apply,
Node.js Version "24.x" will be used instead.
```

**Solution:**

1. ✅ Change `engines.node` to `">=20.0.0 <24.0.0"` (exclude 24.x)
2. ✅ Set Node.js version to `20.x` or `22.x` in Vercel Dashboard

### Issue 4: Next.js Not Detected

**Error:**

```
Warning: Could not identify Next.js version
Error: No Next.js version detected
```

**Solution:**

1. ✅ Set **Root Directory** to app directory (`apps/auth`, not empty)
2. ✅ Set **Framework Preset** to "Next.js" explicitly
3. ✅ Verify **Output Directory** is `.next` (relative to Root Directory)

### Issue 5: Mixed Content Error

**Error:**

```
Mixed Content: The page at 'https://...' was loaded over HTTPS,
but requested an insecure XMLHttpRequest endpoint 'http://...'
```

**Solution:**

1. ✅ Create API proxy routes (`apps/[app]/app/api/proxy/[...path]/route.ts`)
2. ✅ Update HTTP clients to use `/api/proxy` in production
3. ✅ Backend can remain HTTP (no SSL needed)

### Issue 6: Logout Redirects to Localhost

**Problem:**
Logout redirects to `http://localhost:3000` instead of production URL.

**Solution:**

1. ✅ Use `window.location.href` instead of `router.replace()` for cross-domain
2. ✅ Use `NEXT_PUBLIC_AUTH_BASE_URL` environment variable
3. ✅ Add fallback: `|| "https://shift-management-auth.vercel.app"`

## 📋 Complete Deployment Checklist

### Pre-Deployment

- [ ] `pnpm-lock.yaml` is committed (not in `.gitignore`)
- [ ] `package.json` has `packageManager: "pnpm@10.5.2"`
- [ ] `package.json` has `engines.node: ">=20.0.0 <24.0.0"`
- [ ] `.npmrc` file exists with network settings
- [ ] `vercel.json` files exist in each app directory
- [ ] API proxy routes created (`apps/[app]/app/api/proxy/[...path]/route.ts`)
- [ ] HTTP clients updated to use proxy in production

### Vercel Dashboard Setup (Per Project)

- [ ] Root Directory set to `apps/[app-name]`
- [ ] Framework Preset set to "Next.js"
- [ ] Install Command: `cd ../.. && npx -y pnpm@10.5.2 install --frozen-lockfile`
- [ ] Build Command: `cd ../.. && npx -y pnpm@10.5.2 build --filter=[app-name]`
- [ ] Output Directory: `.next`
- [ ] Node.js Version: `20.x` or `22.x`
- [ ] Environment Variables set (see above)
- [ ] `ENABLE_EXPERIMENTAL_COREPACK=1` set
- [ ] Build cache cleared

### Post-Deployment

- [ ] Test login flow (redirects to correct app)
- [ ] Test logout flow (redirects to auth app)
- [ ] Test API calls (no mixed content errors)
- [ ] Verify all three apps are accessible

## 🔗 Production URLs

- **Auth App**: `https://shift-management-auth.vercel.app`
- **Admin App**: `https://shift-management-admin-eight.vercel.app`
- **Client App**: `https://shift-management-client.vercel.app`
- **Backend API**: `https://ec2-3-64-58-144.eu-central-1.compute.amazonaws.com/api` (insecure HTTPS - handled by proxy)

## 🎯 Quick Reference: Vercel Settings Template

For each project, use these exact settings:

```
Root Directory: apps/[app-name]
Framework Preset: Next.js
Install Command: cd ../.. && npx -y pnpm@10.5.2 install --frozen-lockfile
Build Command: cd ../.. && npx -y pnpm@10.5.2 build --filter=[app-name]
Output Directory: .next
Node.js Version: 20.x
```

## 📚 Key Learnings

1. **Root Directory**: Must be app directory (`apps/auth`), NOT empty, for Next.js detection
2. **pnpm Version**: Must match lockfile version (10.x for lockfile v9)
3. **Node.js Version**: Exclude 24.x in `engines.node` to allow Vercel setting
4. **Cross-Domain Redirects**: Use `window.location.href`, not `router.push()`
5. **Mixed Content**: Use Next.js API proxy for HTTPS→HTTP requests
6. **Lockfile**: Must be committed for `--frozen-lockfile` to work

## 🚀 Deployment Command Summary

```bash
# 1. Ensure lockfile is committed
git add pnpm-lock.yaml
git commit -m "Add pnpm lockfile"

# 2. Push to trigger Vercel deployment
git push origin main

# 3. Vercel will automatically deploy all 3 projects
# (if connected to same repository)
```

## ✅ Success Indicators

After successful deployment:

- ✅ Build logs show: `Done in Xs using pnpm v10.5.2`
- ✅ No `ERR_INVALID_THIS` or lockfile errors
- ✅ Next.js detected correctly
- ✅ All API calls work (no mixed content errors)
- ✅ Login redirects to correct app based on role
- ✅ Logout redirects to auth app
- ✅ All three apps accessible at their Vercel URLs

---

**Last Updated**: Based on deployment fixes for shift-management monorepo
**Tested With**: pnpm 10.5.2, Node.js 22.x, Next.js 15.3.8, Turborepo 2.7.4
