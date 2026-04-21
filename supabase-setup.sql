-- =============================================
-- Nayo's Dashboard - Supabase Setup
-- Run this SQL in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/rufaydhdedhcbrrsnvbf/sql
-- =============================================

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT now(),
  customer_name    TEXT,
  customer_phone   TEXT,
  customer_address TEXT,
  delivery_method  TEXT CHECK (delivery_method IN ('delivery', 'pickup')),
  payment_method   TEXT CHECK (payment_method IN ('transfer', 'bac_compra_click')),
  subtotal         NUMERIC(10, 2) NOT NULL DEFAULT 0,
  delivery_price   NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total            NUMERIC(10, 2) NOT NULL DEFAULT 0,
  items            JSONB NOT NULL DEFAULT '[]',
  notes            TEXT,
  transfer_image_url TEXT
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon/public) to INSERT orders (from the checkout cart)
CREATE POLICY "allow_insert_orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone to SELECT orders (dashboard handles its own auth at app level)
CREATE POLICY "allow_select_orders"
  ON orders
  FOR SELECT
  TO anon
  USING (true);
