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

-- (RLS policies removed; tables are created without row-level security)
