# Siddhivinayak Marriage Garden - Backend

This folder contains the Supabase database migrations, PostgreSQL schema, double-booking prevention triggers, and realistic seed data.

## Directory Structure

- `supabase/schema.sql`: Contains the complete database DDL, tables (`bookings`, `payments`, `expenses`), constraints, automatic double-booking prevention trigger, advance balance sync triggers, views, and RLS policies.
- `supabase/seed.sql`: Contains 25 realistic Indian wedding and event booking records spanning July 2026 to January 2027, along with real-world payment receipts (cash, UPI, bank) and venue operating expenses.

## How to Apply on Supabase

1. Open your Supabase Dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor**.
3. Open and run `supabase/schema.sql`.
4. Open and run `supabase/seed.sql`.
