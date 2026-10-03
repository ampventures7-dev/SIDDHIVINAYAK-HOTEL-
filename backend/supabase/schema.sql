-- ==============================================================================
-- SIDDHIVINAYAK MARRIAGE GARDEN - DATABASE SCHEMA
-- Compatible with PostgreSQL & Supabase
-- ==============================================================================

-- 1. Enable UUID generator if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean existing objects (if re-running)
DROP TRIGGER IF EXISTS trg_check_double_booking ON bookings;
DROP FUNCTION IF EXISTS check_double_booking();
DROP TRIGGER IF EXISTS trg_sync_booking_advance_paid_insert_update ON payments;
DROP TRIGGER IF EXISTS trg_sync_booking_advance_paid_delete ON payments;
DROP FUNCTION IF EXISTS sync_booking_advance_paid();

DROP VIEW IF EXISTS view_monthly_financial_summary;
DROP VIEW IF EXISTS view_daily_revenue_expenses;

DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;

-- ==============================================================================
-- 2. BOOKINGS TABLE
-- ==============================================================================
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('wedding', 'engagement', 'reception', 'other')),
    event_date DATE NOT NULL,
    time_slot TEXT NOT NULL CHECK (time_slot IN ('morning', 'evening', 'full day')),
    guests INTEGER NOT NULL DEFAULT 0 CHECK (guests >= 0),
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (total_amount >= 0),
    advance_paid NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (advance_paid >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('confirmed', 'pending', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indices for rapid queries & calendar loading
CREATE INDEX idx_bookings_event_date ON bookings(event_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_customer_phone ON bookings(phone);

-- ==============================================================================
-- 3. DOUBLE BOOKING PREVENTION (TRIGGER)
-- Prevents double booking on the same date and overlapping time slot.
-- Rules:
--   - Cancelled bookings are ignored.
--   - 'full day' conflicts with ANY other booking on that date ('morning', 'evening', 'full day').
--   - 'morning' conflicts with 'morning' or 'full day'.
--   - 'evening' conflicts with 'evening' or 'full day'.
-- ==============================================================================
CREATE OR REPLACE FUNCTION check_double_booking()
RETURNS TRIGGER AS $$
DECLARE
    conflict_record RECORD;
BEGIN
    -- Only check active bookings (confirmed or pending)
    IF NEW.status IN ('confirmed', 'pending') THEN
        SELECT id, customer_name, time_slot, status INTO conflict_record
        FROM bookings
        WHERE event_date = NEW.event_date
          AND status IN ('confirmed', 'pending')
          AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
          AND (
              time_slot = NEW.time_slot
              OR NEW.time_slot = 'full day'
              OR time_slot = 'full day'
          )
        LIMIT 1;

        IF FOUND THEN
            RAISE EXCEPTION 'DOUBLE BOOKING ERROR: Date % is already booked for "%" slot by % (Status: %). Cannot book "%" slot.',
                NEW.event_date, conflict_record.time_slot, conflict_record.customer_name, conflict_record.status, NEW.time_slot;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_double_booking
BEFORE INSERT OR UPDATE OF event_date, time_slot, status ON bookings
FOR EACH ROW
EXECUTE FUNCTION check_double_booking();


-- ==============================================================================
-- 4. PAYMENTS TABLE
-- ==============================================================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    mode TEXT NOT NULL CHECK (mode IN ('cash', 'UPI', 'bank')),
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);

-- Trigger: keep bookings.advance_paid automatically synchronized with total payments
CREATE OR REPLACE FUNCTION sync_booking_advance_paid()
RETURNS TRIGGER AS $$
DECLARE
    target_booking_id UUID;
BEGIN
    target_booking_id := COALESCE(NEW.booking_id, OLD.booking_id);
    
    UPDATE bookings
    SET advance_paid = COALESCE((
        SELECT SUM(amount) FROM payments WHERE booking_id = target_booking_id
    ), 0.00)
    WHERE id = target_booking_id;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_booking_advance_paid_insert_update
AFTER INSERT OR UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION sync_booking_advance_paid();

CREATE TRIGGER trg_sync_booking_advance_paid_delete
AFTER DELETE ON payments
FOR EACH ROW
EXECUTE FUNCTION sync_booking_advance_paid();


-- ==============================================================================
-- 5. EXPENSES TABLE
-- ==============================================================================
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    category TEXT NOT NULL CHECK (category IN ('electricity', 'staff salary', 'decoration', 'maintenance', 'catering', 'other')),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);


-- ==============================================================================
-- 6. REPORTING VIEWS (DAILY & MONTHLY REVENUE / EXPENSES)
-- ==============================================================================

-- Daily Revenue & Expenses aggregation
CREATE OR REPLACE VIEW view_daily_revenue_expenses AS
WITH daily_revenue AS (
    SELECT payment_date AS report_date, SUM(amount) AS total_revenue
    FROM payments
    GROUP BY payment_date
),
daily_expense AS (
    SELECT date AS report_date, SUM(amount) AS total_expense
    FROM expenses
    GROUP BY date
),
all_dates AS (
    SELECT report_date FROM daily_revenue
    UNION
    SELECT report_date FROM daily_expense
)
SELECT 
    d.report_date,
    COALESCE(r.total_revenue, 0.00) AS revenue,
    COALESCE(e.total_expense, 0.00) AS expenses,
    (COALESCE(r.total_revenue, 0.00) - COALESCE(e.total_expense, 0.00)) AS net_profit
FROM all_dates d
LEFT JOIN daily_revenue r ON d.report_date = r.report_date
LEFT JOIN daily_expense e ON d.report_date = e.report_date
ORDER BY d.report_date DESC;

-- Monthly Financial Summary (Bookings count, Revenue, Expenses, Net Profit)
CREATE OR REPLACE VIEW view_monthly_financial_summary AS
WITH monthly_revenue AS (
    SELECT to_char(payment_date, 'YYYY-MM') AS month_key, SUM(amount) AS total_revenue
    FROM payments
    GROUP BY to_char(payment_date, 'YYYY-MM')
),
monthly_expense AS (
    SELECT to_char(date, 'YYYY-MM') AS month_key, SUM(amount) AS total_expense
    FROM expenses
    GROUP BY to_char(date, 'YYYY-MM')
),
monthly_bookings AS (
    SELECT to_char(event_date, 'YYYY-MM') AS month_key, 
           COUNT(*) AS total_bookings,
           SUM(total_amount) AS total_booking_value
    FROM bookings
    WHERE status != 'cancelled'
    GROUP BY to_char(event_date, 'YYYY-MM')
),
all_months AS (
    SELECT month_key FROM monthly_revenue
    UNION
    SELECT month_key FROM monthly_expense
    UNION
    SELECT month_key FROM monthly_bookings
)
SELECT 
    m.month_key,
    COALESCE(b.total_bookings, 0) AS total_bookings,
    COALESCE(b.total_booking_value, 0.00) AS total_booking_value,
    COALESCE(r.total_revenue, 0.00) AS total_revenue_collected,
    COALESCE(e.total_expense, 0.00) AS total_expenses,
    (COALESCE(r.total_revenue, 0.00) - COALESCE(e.total_expense, 0.00)) AS net_profit
FROM all_months m
LEFT JOIN monthly_revenue r ON m.month_key = r.month_key
LEFT JOIN monthly_expense e ON m.month_key = e.month_key
LEFT JOIN monthly_bookings b ON m.month_key = b.month_key
ORDER BY m.month_key DESC;

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- Enables public read/write for the initial single-tenant garden owner app.
-- (Can be restricted with Supabase Auth later)
-- ==============================================================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public full access to bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access to payments" ON payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access to expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);
