-- Liberty Enterprises virtual showroom schema
-- Run this in the Supabase SQL editor (or via the Supabase CLI) to create
-- the tables, RLS policies, storage bucket and seed data the app expects.
--
-- After running it:
--   1. Create an auth user in Supabase (Authentication -> Users).
--   2. Insert that user's id into public.admin_users.
--   3. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  slug text not null unique,
  model_number text not null default '',
  description text,
  specifications jsonb not null default '{}'::jsonb,
  images text[] not null default '{}',
  price numeric(12, 2),
  stock_status text not null default 'enquire'
    check (stock_status in ('in_stock', 'low_stock', 'out_of_stock', 'enquire')),
  is_featured boolean not null default false,
  showroom_section text
    check (showroom_section is null or showroom_section in ('left', 'right', 'centre', 'back')),
  showroom_position jsonb,
  status text not null default 'draft'
    check (status in ('published', 'draft')),
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_status_idx on public.products (status);
create index if not exists products_section_idx on public.products (showroom_section);

-- ---------------------------------------------------------------------------
-- Enquiries
-- ---------------------------------------------------------------------------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products (id) on delete set null,
  customer_name text not null,
  phone text not null,
  email text,
  message text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists enquiries_status_idx on public.enquiries (status);
create index if not exists enquiries_created_idx on public.enquiries (created_at desc);

-- ---------------------------------------------------------------------------
-- Site settings (single row, id = 1)
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  business_name text not null default 'Liberty Enterprises',
  tagline text,
  whatsapp_number text not null default '',
  phone text,
  email text,
  address text,
  city text default 'Chennai',
  state text default 'Tamil Nadu',
  map_url text,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Admin users
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.enquiries enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_users enable row level security;

-- Categories: public read, admin write
drop policy if exists "categories are readable by everyone" on public.categories;
create policy "categories are readable by everyone"
  on public.categories for select
  using (true);

drop policy if exists "admins manage categories" on public.categories;
create policy "admins manage categories"
  on public.categories for all
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Products: published products readable by everyone; admins see/manage all
drop policy if exists "published products are readable by everyone" on public.products;
create policy "published products are readable by everyone"
  on public.products for select
  using (status = 'published' or exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "admins manage products" on public.products;
create policy "admins manage products"
  on public.products for all
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Enquiries: anyone can submit; only admins can read/manage
drop policy if exists "anyone can submit an enquiry" on public.enquiries;
create policy "anyone can submit an enquiry"
  on public.enquiries for insert
  with check (true);

drop policy if exists "admins read enquiries" on public.enquiries;
create policy "admins read enquiries"
  on public.enquiries for select
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "admins manage enquiries" on public.enquiries;
create policy "admins manage enquiries"
  on public.enquiries for update
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "admins delete enquiries" on public.enquiries;
create policy "admins delete enquiries"
  on public.enquiries for delete
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Site settings: public read, admin write
drop policy if exists "site settings are readable by everyone" on public.site_settings;
create policy "site settings are readable by everyone"
  on public.site_settings for select
  using (true);

drop policy if exists "admins manage site settings" on public.site_settings;
create policy "admins manage site settings"
  on public.site_settings for all
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Admin users: only admins can read the table
drop policy if exists "admins read admin_users" on public.admin_users;
create policy "admins read admin_users"
  on public.admin_users for select
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- Storage bucket for product images
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product images are publicly readable" on storage.objects;
create policy "product images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "admins upload product images" on storage.objects;
create policy "admins upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from public.admin_users where user_id = auth.uid())
  );

drop policy if exists "admins update product images" on storage.objects;
create policy "admins update product images"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.admin_users where user_id = auth.uid())
  );

drop policy if exists "admins delete product images" on storage.objects;
create policy "admins delete product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.admin_users where user_id = auth.uid())
  );
