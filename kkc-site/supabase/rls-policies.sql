-- RLS Policies for KKC Quincaillerie
-- Run this in Supabase SQL Editor after creating the schema

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Categories policies
-- Allow anyone to read visible categories
CREATE POLICY "Categories: Select visible" ON public.categories
  FOR SELECT USING (visible = true);

-- Allow admins to read all categories
CREATE POLICY "Categories: Select all for admins" ON public.categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.roles 
      WHERE roles.user_id = auth.uid() 
      AND roles.admin = true
    )
  );

-- Allow admins to insert categories
CREATE POLICY "Categories: Insert for admins" ON public.categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.roles 
      WHERE roles.user_id = auth.uid() 
      AND roles.admin = true
    )
  );

-- Allow admins to update categories
CREATE POLICY "Categories: Update for admins" ON public.categories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.roles 
      WHERE roles.user_id = auth.uid() 
      AND roles.admin = true
    )
  );

-- Allow admins to delete categories
CREATE POLICY "Categories: Delete for admins" ON public.categories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.roles 
      WHERE roles.user_id = auth.uid() 
      AND roles.admin = true
    )
  );

-- Products policies
-- Allow anyone to read visible products
CREATE POLICY "Products: Select visible" ON public.products
  FOR SELECT USING (visible = true);

-- Allow admins to read all products
CREATE POLICY "Products: Select all for admins" ON public.products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.roles 
      WHERE roles.user_id = auth.uid() 
      AND roles.admin = true
    )
  );

-- Allow admins to insert products
CREATE POLICY "Products: Insert for admins" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.roles 
      WHERE roles.user_id = auth.uid() 
      AND roles.admin = true
    )
  );

-- Allow admins to update products
CREATE POLICY "Products: Update for admins" ON public.products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.roles 
      WHERE roles.user_id = auth.uid() 
      AND roles.admin = true
    )
  );

-- Allow admins to delete products
CREATE POLICY "Products: Delete for admins" ON public.products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.roles 
      WHERE roles.user_id = auth.uid() 
      AND roles.admin = true
    )
  );

-- Favorites policies
-- Allow authenticated users to manage their own favorites
CREATE POLICY "Favorites: Select own" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Favorites: Insert own" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Favorites: Delete own" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Roles policies
-- Allow users to read their own role
CREATE POLICY "Roles: Select own" ON public.roles
  FOR SELECT USING (auth.uid() = user_id);

-- Allow service role to manage roles (for admin setup)
CREATE POLICY "Roles: Service role full access" ON public.roles
  FOR ALL USING (auth.role() = 'service_role');
