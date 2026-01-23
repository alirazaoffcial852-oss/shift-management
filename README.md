# Shift Management System Frontend

This is a monorepo for the Shift Management System frontend, built with Next.js and shadcn/ui components.

## Project Structure

```
frontend/
├── apps/
│   ├── admin/          # Admin dashboard application
│   ├── auth/           # Authentication application
│   └── app/            # Main application
├── packages/
│   └── ui/            # Shared UI components using shadcn/ui
```

## Technology Stack

- **Framework**: Next.js

- **UI Components**: shadcn/ui
- **Package Manager**: pnpm
- **Build Tool**: Turborepo
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm 9.12.3 or higher

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Run all applications in development mode
pnpm dev

# Run specific app (e.g., admin)
pnpm --filter admin dev
```

### Building

```bash
# Build all applications
pnpm build
```

### Adding UI Components

To add new shadcn/ui components:

```bash
pnpm dlx shadcn@latest add [component-name] -c apps/admin
```

Components will be added to the `packages/ui/src/components` directory.

### Using UI Components

Import components from the shared UI package:

```tsx
import { Button } from "@workspace/ui/components/ui/button";
```

## Available Scripts

- `pnpm dev` - Start development servers
- `pnpm build` - Build all applications
- `pnpm lint` - Run linting
- `pnpm format` - Format code using Prettier

## Package Versioning

The monorepo uses workspace dependencies for internal packages. External dependencies are managed through the root `package.json`.
