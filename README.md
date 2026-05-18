# Arca - Unified Ecommerce Website

Arca is a role-based unified ecommerce platform built with Next.js App Router, Supabase, and Stripe.  
It combines a luxury storefront with internal dashboards for admin, manager, and staff workflows.

## Project Status

The project is actively in development with core flows implemented across:

- Storefront browsing, product detail, category filtering, and cart
- Account area (profile, orders, appointments, service, wishlist)
- Role-specific dashboards (`admin`, `manager`, `staff`)
- Catalog management and internal operations screens
- Checkout API route with Stripe integration hooks
- Auth flows: signup, login, verify, reset password, update password, signout

## Tech Stack

- `Next.js 16` (App Router)
- `React 19`
- `TypeScript`
- `Supabase` (`@supabase/ssr`, `@supabase/supabase-js`)
- `Stripe`
- `Tailwind CSS 4`
- `Radix UI`, `Zod`, `React Hook Form`, `Zustand`, `Framer Motion`

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create your env file:

```bash
cp .env.local.example .env.local
```

If `.env.local.example` does not exist in your clone, create `.env.local` manually.

3. Add required environment variables (see below).

4. Run development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Required Environment Variables

The codebase currently expects these values:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
```

## Scripts

- `npm run dev` - Start local dev server
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## App Structure

- `app/(storefront)` - Public shopping experience and customer account pages
- `app/auth` - Authentication pages and signout route
- `app/dashboard/admin` - Admin operations (catalog, reports, pricing, inventory, users, stores, audit)
- `app/dashboard/manager` - Manager workflows (inventory, transfers, orders, events, analytics, discrepancies)
- `app/dashboard/staff` - Staff workflows (sell, clients, appointments, catalog, looks, service)
- `app/api/checkout/route.ts` - Checkout API endpoint
- `components/` - Shared UI and domain-specific components
- `lib/` - Integrations and utility modules (`supabase`, `stripe`, helpers)

## Notes

- This repository contains ongoing feature work. You may see local uncommitted changes depending on branch/worktree state.
- Stripe is optional at runtime if `STRIPE_SECRET_KEY` is not provided (the Stripe server client is initialized conditionally).

## Deployment

Deploy on Vercel (recommended) or any Node runtime that supports Next.js 16.

Before deploying, ensure:

- All required environment variables are configured in the target environment
- `npm run build` passes locally
