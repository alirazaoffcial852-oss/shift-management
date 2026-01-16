# Vercel Deployment Guide for Monorepo

This monorepo contains three Next.js applications:

- **Admin** (`apps/admin`) - Admin dashboard
- **Auth** (`apps/auth`) - Authentication service
- **Client** (`apps/client`) - Client application

## Deployment Options

### Option 1: Deploy Each App as Separate Projects (Recommended)

Each app should be deployed as a separate Vercel project for better isolation, independent scaling, and easier management.

This is the recommended approach for better isolation and independent scaling.

#### Steps:

1. **Connect your repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your Git repository

2. **For Admin App:**
   - Project Name: `your-admin-app-name`
   - **Root Directory: `sms-frontend`** (⚠️ IMPORTANT: Use monorepo root, not app directory)
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `pnpm build --filter=admin` (or leave empty to use vercel.json)
   - Install Command: `pnpm install` (or leave empty to use vercel.json)
   - Output Directory: `apps/admin/.next` (⚠️ IMPORTANT: Must specify this)
   - Package Manager: `pnpm` (⚠️ IMPORTANT: Set this in Settings)
   - Node.js Version: `20.x` (⚠️ IMPORTANT: Set this in Settings)

3. **For Auth App:**
   - Project Name: `your-auth-app-name`
   - **Root Directory: `sms-frontend`** (⚠️ IMPORTANT: Use monorepo root, not app directory)
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `pnpm build --filter=auth` (or leave empty to use vercel.json)
   - Install Command: `pnpm install` (or leave empty to use vercel.json)
   - Output Directory: `apps/auth/.next` (⚠️ IMPORTANT: Must specify this)
   - Package Manager: `pnpm` (⚠️ IMPORTANT: Set this in Settings)
   - Node.js Version: `20.x` (⚠️ IMPORTANT: Set this in Settings)

4. **For Client App:**
   - Project Name: `your-client-app-name`
   - **Root Directory: `sms-frontend`** (⚠️ IMPORTANT: Use monorepo root, not app directory)
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `pnpm build --filter=client` (or leave empty to use vercel.json)
   - Install Command: `pnpm install` (or leave empty to use vercel.json)
   - Output Directory: `apps/client/.next` (⚠️ IMPORTANT: Must specify this)
   - Package Manager: `pnpm` (⚠️ IMPORTANT: Set this in Settings)
   - Node.js Version: `20.x` (⚠️ IMPORTANT: Set this in Settings)

#### Environment Variables

Add your environment variables in each project's settings:

- Go to Project Settings → Environment Variables
- Add all required `.env` variables for each app

### ⚠️ Important: Root Directory Configuration

**You MUST set the Root Directory to the monorepo root (`sms-frontend`), NOT the app directory.**

This is the correct approach for monorepos because:
- pnpm install needs to run from the workspace root
- The build commands use `--filter` which works from the root
- Workspace dependencies are resolved correctly

The `vercel.json` files are now configured to work with the monorepo root approach.

### Option 2: Use Vercel CLI

You can also deploy using the Vercel CLI:

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to each app directory and deploy
cd sms-frontend/apps/admin
vercel

cd ../auth
vercel

cd ../client
vercel
```

### Option 3: Using vercel.json Files

The `vercel.json` files in each app directory are configured for monorepo deployment. When you deploy:

1. Each app will automatically use its respective `vercel.json` configuration
2. The build commands will run from the monorepo root
3. Dependencies will be installed correctly using pnpm

## Important Notes

1. **Package Manager**: This project uses `pnpm@9.12.3`. Make sure Vercel is configured to use pnpm:
   - In Vercel Dashboard → Project Settings → General
   - Set "Package Manager" to `pnpm`

2. **Node Version**: The project requires Node.js >= 20
   - In Vercel Dashboard → Project Settings → General
   - Set "Node.js Version" to `20.x` or higher

3. **Turborepo**: The build uses Turborepo for efficient builds. The build commands will:
   - Install all dependencies from the monorepo root
   - Build only the specific app using `--filter` flag
   - Respect workspace dependencies

4. **Workspace Dependencies**: The apps depend on:
   - `@workspace/ui` - Shared UI components
   - `@workspace/translations` - Translation files
   - These will be built automatically as part of the build process

## Troubleshooting

### Build Fails with "ERR_INVALID_THIS" or "ERR_PNPM_META_FETCH_FAIL"

This error usually means:
1. **Root Directory is wrong**: Make sure it's set to `sms-frontend` (monorepo root), NOT `sms-frontend/apps/admin`
2. **Package Manager not set**: Go to Settings → General → Package Manager → Set to `pnpm`
3. **Node.js version too old**: Go to Settings → General → Node.js Version → Set to `20.x` or higher
4. **pnpm version mismatch**: The project uses `pnpm@9.12.3`. Vercel should auto-detect this from `packageManager` field

### Build Fails with "Cannot find module"

- Ensure the root directory is set to `sms-frontend` (monorepo root)
- Verify that `pnpm install` runs from the monorepo root
- Check that Output Directory is set correctly: `apps/[app-name]/.next`

### Build is Slow

- Vercel caches `node_modules` and `.next` directories
- Turborepo caching is also enabled for faster subsequent builds

### Environment Variables Not Working

- Make sure environment variables are set in Vercel Dashboard
- Check that variable names match what your code expects
- Restart the deployment after adding new variables

## Custom Domains

After deployment, you can add custom domains to each app:

- Go to Project Settings → Domains
- Add your custom domain
- Configure DNS as instructed by Vercel
