-- ==============================================================================
-- SIDDHIVINAYAK MARRIAGE GARDEN - REALISTIC SEED DATA
-- 25 Bookings across past 3 months (Jul-Sep 2026) and next 3 months (Oct 2026 - Jan 2027)
-- Complete with associated Payments and categorized Expenses
-- ==============================================================================

-- Clear existing data
TRUNCATE TABLE payments CASCADE;
TRUNCATE TABLE expenses CASCADE;
TRUNCATE TABLE bookings CASCADE;

-- ==============================================================================
-- 1. SEED BOOKINGS (25 Real-world Indian venue bookings)
-- ==============================================================================
INSERT INTO bookings (id, customer_name, phone, event_type, event_date, time_slot, guests, total_amount, advance_paid, status, notes, created_at)
VALUES
-- --- Past Month 1: July 2026 ---
('b0000000-0000-0000-0000-000000000001', 'Rameshwar Sharma', '+91 98290 12345', 'wedding', '2026-07-08', 'full day', 800, 350000.00, 0, 'confirmed', 'Grand royal wedding setup, mandap with fresh marigold flowers', '2026-06-05 10:30:00+05:30'),
('b0000000-0000-0000-0000-000000000002', 'Manoj Tiwari', '+91 94140 23456', 'reception', '2026-07-15', 'evening', 500, 220000.00, 0, 'confirmed', 'Buffet dining setup with AC banquet hall access', '2026-06-18 16:45:00+05:30'),
('b0000000-0000-0000-0000-000000000003', 'Sunita Agarwal', '+91 98281 34567', 'engagement', '2026-07-22', 'morning', 300, 150000.00, 0, 'confirmed', 'Ring ceremony and high-tea arrangement', '2026-06-25 11:15:00+05:30'),
('b0000000-0000-0000-0000-000000000004', 'Suresh Kumar Patel', '+91 97850 45678', 'other', '2026-07-22', 'evening', 350, 180000.00, 0, 'confirmed', 'Sangeet & musical night with stage and DJ truss', '2026-06-28 14:00:00+05:30'),

-- --- Past Month 2: August 2026 ---
('b0000000-0000-0000-0000-000000000005', 'Vikramaditya Rathore', '+91 98299 56789', 'wedding', '2026-08-04', 'full day', 1000, 450000.00, 0, 'confirmed', 'Baraat procession route clearance, vintage car entry', '2026-07-02 09:30:00+05:30'),
('b0000000-0000-0000-0000-000000000006', 'Anita Joshi', '+91 94133 67890', 'reception', '2026-08-12', 'evening', 600, 240000.00, 0, 'confirmed', 'Photo booth and floral photo wall required', '2026-07-12 15:20:00+05:30'),
('b0000000-0000-0000-0000-000000000007', 'Sanjay Singhal', '+91 98285 78901', 'other', '2026-08-18', 'morning', 250, 120000.00, 0, 'confirmed', 'Yagyopaveet ceremony, traditional seating required', '2026-07-28 17:00:00+05:30'),
('b0000000-0000-0000-0000-000000000008', 'Dharmendra Jain', '+91 97841 89012', 'wedding', '2026-08-25', 'full day', 850, 380000.00, 0, 'confirmed', 'Strict Jain catering coordination, dinner before sunset', '2026-07-15 12:45:00+05:30'),

-- --- Past Month 3: September 2026 ---
('b0000000-0000-0000-0000-000000000009', 'Santosh Meena', '+91 98292 90123', 'engagement', '2026-09-05', 'evening', 400, 160000.00, 0, 'confirmed', 'LED backdrop and ring exchange stage', '2026-08-10 18:00:00+05:30'),
('b0000000-0000-0000-0000-000000000010', 'Rajendra Prasad Yadav', '+91 94142 01234', 'wedding', '2026-09-14', 'full day', 950, 420000.00, 0, 'confirmed', 'Fireworks display permit arranged, generator backup essential', '2026-08-01 10:00:00+05:30'),
('b0000000-0000-0000-0000-000000000011', 'Ashok Verma', '+91 98288 12340', 'other', '2026-09-20', 'evening', 300, 180000.00, 0, 'confirmed', 'Silver Jubilee 25th Wedding Anniversary celebration', '2026-08-20 11:30:00+05:30'),
('b0000000-0000-0000-0000-000000000012', 'Kavita Rajput', '+91 97855 23450', 'engagement', '2026-09-28', 'morning', 350, 140000.00, 0, 'confirmed', 'Daytime ceremony with pastel themed floral setup', '2026-09-01 14:15:00+05:30'),
('b0000000-0000-0000-0000-000000000013', 'Deepali Saxena', '+91 98294 34560', 'reception', '2026-09-28', 'evening', 400, 200000.00, 0, 'cancelled', 'Client shifted destination venue; advance refunded after deduction', '2026-08-25 16:30:00+05:30'),

-- --- Current Month: October 2026 ---
('b0000000-0000-0000-0000-000000000014', 'Anil Solanki', '+91 94139 45670', 'wedding', '2026-10-05', 'full day', 1100, 480000.00, 0, 'confirmed', 'Premium lighting package and crystal chandelier dome', '2026-09-05 10:15:00+05:30'),
('b0000000-0000-0000-0000-000000000015', 'Pooja Shekhawat', '+91 98284 56780', 'reception', '2026-10-12', 'evening', 550, 260000.00, 0, 'confirmed', 'Live orchestra acoustic stage, 50 VIP round tables', '2026-09-12 13:00:00+05:30'),
('b0000000-0000-0000-0000-000000000016', 'Rahul Khandelwal', '+91 97843 67890', 'engagement', '2026-10-18', 'morning', 280, 150000.00, 0, 'pending', 'Tentative inquiry, awaiting confirmation of priest timings', '2026-09-22 17:30:00+05:30'),
('b0000000-0000-0000-0000-000000000017', 'Dinesh Bagaria', '+91 98297 78900', 'wedding', '2026-10-24', 'full day', 1200, 500000.00, 0, 'confirmed', 'Grand entry elephant gate and royal carpet walkway', '2026-09-08 09:45:00+05:30'),
('b0000000-0000-0000-0000-000000000018', 'Vinod Bansal', '+91 94145 89010', 'other', '2026-10-30', 'evening', 450, 220000.00, 0, 'confirmed', 'Pre-Diwali corporate gala dinner and award presentation', '2026-09-25 12:00:00+05:30'),

-- --- Next Month 1: November 2026 (Dev Uthani Gyaras / Peak Season) ---
('b0000000-0000-0000-0000-000000000019', 'Shailendra Mishra', '+91 98289 90120', 'wedding', '2026-11-06', 'full day', 1200, 520000.00, 0, 'confirmed', 'Dev Uthani auspicious date; requires 2 generator setups', '2026-08-15 11:00:00+05:30'),
('b0000000-0000-0000-0000-000000000020', 'Bhupendra Soni', '+91 97858 01230', 'reception', '2026-11-15', 'evening', 700, 300000.00, 0, 'confirmed', 'Gold theme decoration with artificial fountain backdrop', '2026-09-10 15:45:00+05:30'),
('b0000000-0000-0000-0000-000000000021', 'Mukesh Jangid', '+91 98291 12349', 'wedding', '2026-11-22', 'full day', 1000, 460000.00, 0, 'confirmed', 'Wooden carved mandap setup with 4 guest rooms reserved', '2026-09-18 10:30:00+05:30'),

-- --- Next Month 2: December 2026 ---
('b0000000-0000-0000-0000-000000000022', 'Hemant Kulshreshtha', '+91 94131 23459', 'wedding', '2026-12-04', 'full day', 1300, 550000.00, 0, 'confirmed', 'Premium winter wedding, gas heaters across lawn required', '2026-09-02 16:15:00+05:30'),
('b0000000-0000-0000-0000-000000000023', 'Alok Kulhari', '+91 98283 34569', 'reception', '2026-12-14', 'evening', 650, 280000.00, 0, 'confirmed', 'Bonfire and outdoor heaters for lawn buffet area', '2026-09-20 14:00:00+05:30'),
('b0000000-0000-0000-0000-000000000024', 'Rajesh Gupta', '+91 97844 45679', 'engagement', '2026-12-25', 'evening', 350, 175000.00, 0, 'pending', 'Christmas holiday event inquiry, awaiting date lock', '2026-09-28 11:20:00+05:30'),

-- --- Next Month 3: January 2027 ---
('b0000000-0000-0000-0000-000000000025', 'Mahendra Choudhary', '+91 98295 56788', 'wedding', '2027-01-16', 'full day', 1150, 500000.00, 0, 'confirmed', 'Makar Sankranti weekend wedding, kite theme decoration request', '2026-09-15 13:30:00+05:30');


-- ==============================================================================
-- 2. SEED PAYMENTS (Tokens, Advances, and Final Settlements)
-- Automatic trigger syncs bookings.advance_paid!
-- ==============================================================================
INSERT INTO payments (booking_id, amount, payment_date, mode, note)
VALUES
-- Rameshwar Sharma (Total: 3,50,000 - Fully settled)
('b0000000-0000-0000-0000-000000000001', 100000.00, '2026-06-05', 'bank', 'Initial token advance via NEFT'),
('b0000000-0000-0000-0000-000000000001', 250000.00, '2026-07-07', 'cash', 'Final cash settlement before event'),

-- Manoj Tiwari (Total: 2,20,000 - Fully settled)
('b0000000-0000-0000-0000-000000000002', 80000.00, '2026-06-18', 'UPI', 'Booking token via Google Pay'),
('b0000000-0000-0000-0000-000000000002', 140000.00, '2026-07-14', 'bank', 'Balance payment RTGS'),

-- Sunita Agarwal (Total: 1,50,000 - Fully settled)
('b0000000-0000-0000-0000-000000000003', 50000.00, '2026-06-25', 'UPI', 'Advance token via PhonePe'),
('b0000000-0000-0000-0000-000000000003', 100000.00, '2026-07-21', 'cash', 'Cash payment on lawn inspection'),

-- Suresh Kumar Patel (Total: 1,80,000 - Fully settled)
('b0000000-0000-0000-0000-000000000004', 60000.00, '2026-06-28', 'cash', 'Token amount received at garden office'),
('b0000000-0000-0000-0000-000000000004', 120000.00, '2026-07-22', 'UPI', 'Settlement payment via UPI'),

-- Vikramaditya Rathore (Total: 4,50,000 - Fully settled)
('b0000000-0000-0000-0000-000000000005', 150000.00, '2026-07-02', 'bank', 'Advance payment IMPS transfer'),
('b0000000-0000-0000-0000-000000000005', 300000.00, '2026-08-03', 'cash', 'Cash handed over by father of the bride'),

-- Anita Joshi (Total: 2,40,000 - Fully settled)
('b0000000-0000-0000-0000-000000000006', 80000.00, '2026-07-12', 'UPI', 'Token advance via Paytm'),
('b0000000-0000-0000-0000-000000000006', 160000.00, '2026-08-11', 'bank', 'Balance payment via net banking'),

-- Sanjay Singhal (Total: 1,20,000 - Fully settled)
('b0000000-0000-0000-0000-000000000007', 50000.00, '2026-07-28', 'cash', 'Cash advance token'),
('b0000000-0000-0000-0000-000000000007', 70000.00, '2026-08-17', 'cash', 'Full settlement cash'),

-- Dharmendra Jain (Total: 3,80,000 - Fully settled)
('b0000000-0000-0000-0000-000000000008', 100000.00, '2026-07-15', 'bank', 'Advance via RTGS transfer'),
('b0000000-0000-0000-0000-000000000008', 280000.00, '2026-08-24', 'bank', 'Final payment transfer'),

-- Santosh Meena (Total: 1,60,000 - Fully settled)
('b0000000-0000-0000-0000-000000000009', 60000.00, '2026-08-10', 'UPI', 'Advance via Google Pay'),
('b0000000-0000-0000-0000-000000000009', 100000.00, '2026-09-04', 'cash', 'Cash settlement'),

-- Rajendra Prasad Yadav (Total: 4,20,000 - Fully settled)
('b0000000-0000-0000-0000-000000000010', 150000.00, '2026-08-01', 'bank', 'Booking advance token'),
('b0000000-0000-0000-0000-000000000010', 270000.00, '2026-09-13', 'cash', 'Final settlement cash payment'),

-- Ashok Verma (Total: 1,80,000 - Fully settled)
('b0000000-0000-0000-0000-000000000011', 60000.00, '2026-08-20', 'UPI', 'Token advance'),
('b0000000-0000-0000-0000-000000000011', 120000.00, '2026-09-19', 'bank', 'Final payment transfer'),

-- Kavita Rajput (Total: 1,40,000 - Fully settled)
('b0000000-0000-0000-0000-000000000012', 140000.00, '2026-09-01', 'bank', '100% upfront booking payment'),

-- Deepali Saxena (Cancelled event)
('b0000000-0000-0000-0000-000000000013', 25000.00, '2026-08-25', 'UPI', 'Retained booking cancellation fee'),

-- Anil Solanki (October wedding - 2,00,000 advance received)
('b0000000-0000-0000-0000-000000000014', 200000.00, '2026-09-05', 'bank', '40% advance payment received'),

-- Pooja Shekhawat (October reception - 1,00,000 advance received)
('b0000000-0000-0000-0000-000000000015', 100000.00, '2026-09-12', 'UPI', 'Booking token advance'),

-- Rahul Khandelwal (October engagement - 50,000 token received)
('b0000000-0000-0000-0000-000000000016', 50000.00, '2026-09-22', 'cash', 'Token amount in cash'),

-- Dinesh Bagaria (October wedding - 2,00,000 advance received)
('b0000000-0000-0000-0000-000000000017', 200000.00, '2026-09-08', 'bank', 'Advance payment via RTGS'),

-- Vinod Bansal (October gala - 75,000 advance received)
('b0000000-0000-0000-0000-000000000018', 75000.00, '2026-09-25', 'UPI', 'Corporate event advance'),

-- Shailendra Mishra (November wedding - 2,00,000 advance received)
('b0000000-0000-0000-0000-000000000019', 200000.00, '2026-08-15', 'bank', 'Peak season wedding advance'),

-- Bhupendra Soni (November reception - 1,00,000 advance received)
('b0000000-0000-0000-0000-000000000020', 100000.00, '2026-09-10', 'UPI', 'Advance via PhonePe'),

-- Mukesh Jangid (November wedding - 1,50,000 advance received)
('b0000000-0000-0000-0000-000000000021', 150000.00, '2026-09-18', 'cash', 'Cash advance token'),

-- Hemant Kulshreshtha (December wedding - 2,50,000 advance received)
('b0000000-0000-0000-0000-000000000022', 250000.00, '2026-09-02', 'bank', 'December winter wedding advance'),

-- Alok Kulhari (December reception - 1,00,000 advance received)
('b0000000-0000-0000-0000-000000000023', 100000.00, '2026-09-20', 'UPI', 'Reception booking token'),

-- Rajesh Gupta (December engagement - 50,000 token received)
('b0000000-0000-0000-0000-000000000024', 50000.00, '2026-09-28', 'cash', 'Token money in cash'),

-- Mahendra Choudhary (January wedding - 1,50,000 advance received)
('b0000000-0000-0000-0000-000000000025', 150000.00, '2026-09-15', 'bank', 'Early booking advance for January wedding');


-- ==============================================================================
-- 3. SEED EXPENSES (Realistic venue operating costs)
-- Categories: electricity, staff salary, decoration, maintenance, catering, other
-- ==============================================================================
INSERT INTO expenses (date, category, amount, note)
VALUES
-- July 2026 Expenses
('2026-07-02', 'staff salary', 48000.00, 'Monthly wages for garden gardeners, watchmen & cleaners (June month)'),
('2026-07-07', 'electricity', 32500.00, 'State electricity board commercial bill payment for lawn & lights'),
('2026-07-08', 'other', 12000.00, 'Diesel 120 Litres for generator backup during Sharma wedding'),
('2026-07-15', 'maintenance', 14500.00, 'Repair of 3 desert coolers and replacement of submersible pump valve'),
('2026-07-22', 'decoration', 22000.00, 'Floral supplies and fabric drapery materials for July double event'),
('2026-07-29', 'catering', 18000.00, 'High-tea kitchen crockery replacement and gas cylinders refilled'),

-- August 2026 Expenses
('2026-08-01', 'staff salary', 52000.00, 'Monthly staff salaries for 6 permanent venue staff'),
('2026-08-04', 'other', 16000.00, 'Diesel 160 Litres for generator backup during Rathore royal wedding'),
('2026-08-08', 'electricity', 38400.00, 'Electricity board power bill for August'),
('2026-08-16', 'maintenance', 28000.00, 'Lawn grass cutting, chemical fertilizing, and hedge trimming'),
('2026-08-20', 'decoration', 35000.00, 'New LED string lights and fairy lights purchased for upcoming festive season'),
('2026-08-25', 'other', 14000.00, 'Generator diesel and mobile toilet unit cleaning fee'),

-- September 2026 Expenses
('2026-09-02', 'staff salary', 54000.00, 'Monthly staff salaries + festive bonus advance'),
('2026-09-05', 'electricity', 31200.00, 'Monthly commercial electricity bill'),
('2026-09-10', 'maintenance', 45000.00, 'Pre-season painting of boundary walls, main gate, and fountain service'),
('2026-09-14', 'other', 15000.00, 'Generator fuel 150L for Yadav wedding'),
('2026-09-22', 'decoration', 42000.00, 'Custom mandap wooden framework and sofa upholstery overhaul'),
('2026-09-26', 'catering', 25000.00, 'Kitchen chimney degreasing, deep cleaning, and stainless steel counter service'),

-- October 2026 (Current Month) Expenses
('2026-10-01', 'staff salary', 56000.00, 'Monthly staff wages for security, maintenance, and supervisor'),
('2026-10-01', 'electricity', 34000.00, 'Electricity bill for October'),
('2026-10-02', 'other', 18500.00, 'Diesel fuel stock purchase for upcoming October wedding bookings'),
('2026-10-03', 'maintenance', 12000.00, 'Fire extinguisher inspection, pest control spray, and lawn lighting audit');
