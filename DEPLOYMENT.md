# 🚀 Deployment Guide: Siddhivinayak Marriage Garden

This guide covers deploying the **Siddhivinayak Marriage Garden** web application to **Vercel** with a **Supabase** PostgreSQL database.

---

## 1. Supabase Database Setup

1. **Sign in / Create Account**: Go to [https://supabase.com](https://supabase.com) and create a new project (e.g. `siddhivinayak-garden`).
2. **Open SQL Editor**: In the left sidebar of your Supabase dashboard, click **SQL Editor**.
3. **Execute Database Schema**:
   - Open [backend/supabase/schema.sql](./backend/supabase/schema.sql).
   - Copy the entire contents, paste into the Supabase SQL Editor, and click **Run**.
   - *This creates all tables (`bookings`, `payments`, `expenses`), views, indices, and the double-booking trigger.*
4. **Seed Realistic Venue Data**:
   - Open [backend/supabase/seed.sql](./backend/supabase/seed.sql).
   - Copy the entire contents, paste into the Supabase SQL Editor, and click **Run**.
   - *This loads the 25 realistic Indian wedding & banquet bookings across 7 months.*
5. **Get Your API Credentials**:
   - In Supabase, go to **Project Settings** → **API**.
   - Copy:
     - **Project URL** (`https://xyzcompany.supabase.co`)
     - **Project API Anon Key** (`eyJh...`)

---

## 2. Deploying to Vercel

### Step 1: Push Code to GitHub / GitLab
In your terminal:
```bash
git add .
git commit -m "Complete Siddhivinayak Marriage Garden App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/siddhivinayak-marriage-garden.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Go to [https://vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Select your `siddhivinayak-marriage-garden` GitHub repository.
3. **IMPORTANT - Root Directory**:
   - Under **Root Directory**, click **Edit** and select **`frontend`** (since the Next.js app lives in `frontend/`).
4. **Environment Variables**:
   Add the following two environment variables:

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-supabase-anon-key` | Your Supabase public anon key |

5. Click **"Deploy"**.

---

## 3. Post-Deployment Verification

1. Once the deployment finishes (takes ~1 minute), Vercel will provide your live URL (e.g. `https://siddhivinayak-marriage-garden.vercel.app`).
2. Open the URL on your mobile phone and test:
   - **Dashboard**: High-contrast financial status cards and giant buttons.
   - **Language Toggle**: Tap the English ⇄ हिंदी button in the header.
   - **Calendar**: Month view and availability checking.
   - **Bookings & Payments**: Viewing booking detail sheets and printing receipts.
   - **Mobile Bottom Navigation**: Effortless thumb navigation on phones.
