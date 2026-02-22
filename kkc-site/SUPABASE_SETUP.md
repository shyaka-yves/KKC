# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Choose organization, name (e.g. `kkc`), database password, region
4. Wait for the project to be created

## 2. Get API Keys

1. Project Settings → API
2. Copy **Project URL** and **anon public** key
3. Add to Vercel / `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. Run Database Schema

1. Supabase Dashboard → SQL Editor
2. Copy the contents of `supabase/schema.sql`
3. Paste and click **Run**

## 4. Create Storage Bucket

1. Supabase Dashboard → Storage
2. Click **New bucket**
3. Name: `products`
4. Enable **Public bucket** (so product images can be viewed)
5. Create bucket

## 5. Enable Google Auth

1. Supabase Dashboard → Authentication → Providers
2. Click **Google**
3. Enable and add your Google OAuth Client ID & Secret from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
4. Add authorized redirect: `https://<your-project>.supabase.co/auth/v1/callback`

## 6. Add Admin Role

To make a user an admin, insert into the `roles` table:

```sql
-- Replace USER_UUID with the actual user id from Auth → Users
insert into public.roles (user_id, role, admin)
values ('USER_UUID', 'admin', true)
on conflict (user_id) do update set role = 'admin', admin = true;
```

To find a user's UUID: Authentication → Users → copy the user's UUID

## 7. Add Vercel Domain (for Google OAuth)

1. Supabase Dashboard → Authentication → URL Configuration
2. Add your site URL: `https://your-site.vercel.app`
3. Add redirect URLs: `https://your-site.vercel.app/**`

## Environment Variables Summary

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL from Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key from Supabase |

Firebase env vars can be removed if you're fully on Supabase.
