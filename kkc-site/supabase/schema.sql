-- KKC Quincaillerie - Supabase Schema
-- Run this in Supabase SQL Editor to create tables
--
-- Also create a Storage bucket named "products" in Supabase Dashboard:
-- Storage → New bucket → Name: products → Public bucket: Yes

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  category text not null,
  image_url text not null,
  price numeric,
  currency text check (currency in ('RWF', 'USD')),
  show_price boolean not null default false,
  visible boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_visible_updated on products (visible, updated_at desc);
create index if not exists products_featured on products (visible, featured) where visible = true and featured = true;

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  visible boolean not null default true,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Favorites (requires auth.users)
create table if not exists public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- Roles (admin check)
create table if not exists public.roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user',
  admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- RLS policies
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.favorites enable row level security;
alter table public.roles enable row level security;

-- Products: anyone can read, only admins can write
create policy "products_read" on public.products for select using (true);
create policy "products_insert" on public.products for insert with check (
  exists (select 1 from public.roles r where r.user_id = auth.uid() and r.admin = true)
);
create policy "products_update" on public.products for update using (
  exists (select 1 from public.roles r where r.user_id = auth.uid() and r.admin = true)
);
create policy "products_delete" on public.products for delete using (
  exists (select 1 from public.roles r where r.user_id = auth.uid() and r.admin = true)
);

-- Categories: anyone can read, only admins can write
create policy "categories_read" on public.categories for select using (true);
create policy "categories_insert" on public.categories for insert with check (
  exists (select 1 from public.roles r where r.user_id = auth.uid() and r.admin = true)
);
create policy "categories_update" on public.categories for update using (
  exists (select 1 from public.roles r where r.user_id = auth.uid() and r.admin = true)
);
create policy "categories_delete" on public.categories for delete using (
  exists (select 1 from public.roles r where r.user_id = auth.uid() and r.admin = true)
);

-- Favorites: users can only manage their own
create policy "favorites_read" on public.favorites for select using (auth.uid() = user_id);
create policy "favorites_insert" on public.favorites for insert with check (auth.uid() = user_id);
create policy "favorites_delete" on public.favorites for delete using (auth.uid() = user_id);

-- Roles: authenticated users can read their own
create policy "roles_read" on public.roles for select using (auth.uid() = user_id);
-- Only allow insert/update via service role or manually in dashboard
create policy "roles_insert" on public.roles for insert with check (auth.uid() = user_id);
