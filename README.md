# Liberty Enterprises — Virtual 3D Showroom

A production-ready Next.js (App Router) website with a first-person, walkable 3D
showroom for Liberty Enterprises, a baby & kids wholesale showroom in Sowcarpet,
Chennai. Includes a product catalogue, category pages, product detail pages,
WhatsApp enquiry flow, and an admin dashboard backed by Supabase.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- React Three Fiber, drei, Three.js (first-person 3D showroom)
- Supabase (Postgres + Storage + Auth) for catalogue, enquiries, settings, admin
- Vercel for hosting

## Getting started

```bash
npm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Open http://localhost:3000. The site runs in **preview mode** (bundled demo
catalogue) until Supabase is configured; a banner indicates this.

## Supabase setup

1. Create a Supabase project.
2. In the SQL editor, run `supabase/schema.sql`.
3. Create an auth user (Authentication → Users).
4. Insert that user's id into `public.admin_users`:
   ```sql
   insert into public.admin_users (user_id) values ('<user-uuid>');
   ```
5. (Optional) Seed categories/products via the admin dashboard or SQL.
6. Set the env vars in `.env.local` and restart.

No service-role key is ever used by the frontend; only the anon/public key is
exposed via `NEXT_PUBLIC_*`.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript

## Routes

- `/` — marketing home
- `/showroom` — 3D showroom (also `?section=left|right|centre|back`)
- `/categories` and `/categories/[slug]`
- `/products/[slug]`
- `/admin` — login; `/admin/dashboard`, `/admin/products`, `/admin/categories`,
  `/admin/enquiries`, `/admin/settings`

## Features

- First-person showroom: WASD/arrows + drag-to-look on desktop, joystick + drag on
  mobile, collisions, clickable products, info panel, WhatsApp enquiry, minimap,
  zone shortcuts, exit, return-to-entrance, catalogue fallback, WebGL fallback,
  lazy-loaded 3D scene.
- Mobile-first, responsive, accessible.
- Admin: product CRUD with image upload, category listing, enquiry management,
  site settings (WhatsApp number), Supabase Auth + RLS.
- WhatsApp number is configurable in admin and URL-encoded in message links.

## Deployment (Vercel)

1. Push the repo to GitHub.
2. Import into Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (and
   `NEXT_PUBLIC_SITE_URL`) in Project Settings → Environment Variables.
4. Deploy. The build runs `next build`.

## What remains / optional

- Replace demo catalogue with real products via `/admin`.
- Add product category create/edit UI (currently managed in Supabase).
- Add automated tests (unit + e2e) for showroom navigation and admin flows.
- Real product photography and tuned lighting after content is available.
- Email notifications for new enquiries (Supabase Edge Function / webhook).
