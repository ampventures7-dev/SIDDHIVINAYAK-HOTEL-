import { Booking, Payment, Expense } from '@/types/database';

export const INITIAL_BOOKINGS: Booking[] = [
  // Past Month 1: July 2026
  {
    id: 'b0000000-0000-0000-0000-000000000001',
    customer_name: 'Rameshwar Sharma',
    phone: '+91 98290 12345',
    event_type: 'wedding',
    event_date: '2026-07-08',
    time_slot: 'full day',
    guests: 800,
    total_amount: 350000,
    advance_paid: 350000,
    status: 'confirmed',
    notes: 'Grand royal wedding setup, mandap with fresh marigold flowers',
    created_at: '2026-06-05T10:30:00Z'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000002',
    customer_name: 'Manoj Tiwari',
    phone: '+91 94140 23456',
    event_type: 'reception',
    event_date: '2026-07-15',
    time_slot: 'evening',
    guests: 500,
    total_amount: 220000,
    advance_paid: 220000,
    status: 'confirmed',
    notes: 'Buffet dining setup with AC banquet hall access',
    created_at: '2026-06-18T16:45:00Z'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000003',
    customer_name: 'Sunita Agarwal',
    phone: '+91 98281 34567',
    event_type: 'engagement',
    event_date: '2026-07-22',
    time_slot: 'morning',
    guests: 300,
    total_amount: 150000,
    advance_paid: 150000,
    status: 'confirmed',
    notes: 'Ring ceremony and high-tea arrangement',
    created_at: '2026-06-25T11:15:00Z'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000004',
    customer_name: 'Suresh Kumar Patel',
    phone: '+91 97850 45678',
    event_type: 'other',
    event_date: '2026-07-22',
    time_slot: 'evening',
    guests: 350,
    total_amount: 180000,
    advance_paid: 180000,
    status: 'confirmed',
    notes: 'Sangeet & musical night with stage and DJ truss',
    created_at: '2026-06-28T14:00:00Z'
  },

  // Past Month 2: August 2026
  {
    id: 'b0000000-0000-0000-0000-000000000005',
    customer_name: 'Vikramaditya Rathore',
    phone: '+91 98299 56789',
    event_type: 'wedding',
    event_date: '2026-08-04',
    time_slot: 'full day',
    guests: 1000,
    total_amount: 450000,
    advance_paid: 450000,
    status: 'confirmed',
    notes: 'Baraat procession route clearance, vintage car entry',
    created_at: '2026-07-02T09:30:00Z'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000006',
    customer_name: 'Anita Joshi',
    phone: '+91 94133 67890',
    event_type: 'reception',
    event_date: '2026-08-12',
    time_slot: 'evening',
    guests: 600,
    total_amount: 240000,
    advance_paid: 240000,
    status: 'confirmed',
    notes: 'Photo booth and floral photo wall required',
    created_at: '2026-07-12T15:20:00Z'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000007',
    customer_name: 'Sanjay Singhal',
    phone: '+91 98285 78901',
    event_type: 'other',
    event_date: '2026-08-18',
    time_slot: 'morning',
    guests: 250,
    total_amount: 120000,
    advance_paid: 120000,
    status: 'confirmed',
    notes: 'Yagyopaveet ceremony, traditional seating required',
    created_at: '2026-07-28T17:00:00Z'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000008',
    customer_name: 'Dharmendra Jain',
    phone: '+91 97841 89012',
    event_type: 'wedding',
    event_date: '2026-08-25',
    time_slot: 'full day',
    guests: 850,
    total_amount: 380000,
    advance_paid: 380000,
    status: 'confirmed',
    notes: 'Strict Jain catering coordination, dinner before sunset',
    created_at: '2026-07-15T12:45:00Z'
  },

  // Past Month 3: September 2026
  {
    id: 'b0000000-0000-0000-0000-000000000009',
    customer_name: 'Santosh Meena',
    phone: '+91 98292 90123',
    event_type: 'engagement',
    event_date: '2026-09-05',
    time_slot: 'evening',
    guests: 400,
    total_amount: 160000,
    advance_paid: 160000,
    status: 'confirmed',
    notes: 'LED backdrop and ring exchange stage',
    created_at: '2026-08-10T18:00:00Z'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000010',
    customer_name: 'Rajendra Prasad Yadav',
    phone: '+91 94142 01234',
    event_type: 'wedding',
    event_date: '2026-09-14',
    time_slot: 'full day',
    guests: 950,
    total_amount: 420000,
    advance_paid: 420000,
    status: 'confirmed',
    notes: 'Fireworks display permit arranged, generator backup essential',
    created_at: '2026-08-01T10:00:00Z'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000011',
    customer_name: 'Ashok Verma',
    phone: '+91 98288 12340',
    event_type: 'other',
    event_date: '2026-09-20',
    time_slot: 'evening',
    guests: 300,
    total_amount: 180000,
    advance_paid: 180000,
    status: 'confirmed',
    notes: 'Silver Jubilee 25th Wedding Anniversary celebration',
    created_at: '2026-08-20T11:30:00Z'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000012',
    customer_name: 'Kavita Rajput',
    phone: '+91 97855 23450',
    event_type: 'engagement',
    event_date: '2026-09-28',
    time_slot: 'morning',
    guests: 350,
    total_amount: 140000,
    advance_paid: 140000,
    status: 'confirmed',
    notes: 'Daytime ceremony with pastel themed floral setup',
    created_at: '2026-09-01T14:15:00Z'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000013',
    customer_name: 'Deepali Saxena',
    phone: '+91 98294 34560',
    event_type: 'reception',
    event_date: '2026-09-28',
    time_slot: 'evening',
    guests: 400,
    total_amount: 200000,
    advance_paid: 25000,
    status: 'cancelled',
    notes: 'Client shifted destination venue; advance refunded after deduction',
    created_at: '2026-08-25T16:30:00Z'
  },

  // Current Month: October 2026 (Local simulated today: 2026-10-01)
  {
    id: 'b0000000-0000-0000-0000-000000000014',
    customer_name: 'Anil Solanki',
    phone: '+91 94139 45670',
    whatsapp: '+91 94139 45670',
    is_whatsapp_same: true,
    address: '12, Mahaveer Nagar, Kota, Rajasthan - 324005',
    booking_reason: 'Royal Marriage Ceremony & Pre-Wedding Sangeet (Groom Family)',
    event_type: 'wedding',
    event_date: '2026-10-05',
    time_slot: 'full day',
    guests: 1100,
    total_amount: 480000,
    advance_paid: 200000,
    status: 'confirmed',
    notes: 'Premium lighting package and crystal chandelier dome',
    created_at: '2026-09-05T10:15:00Z'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000015',
    customer_name: 'Pooja Shekhawat',
    phone: '+91 98284 56780',
    whatsapp: '+91 98284 56780',
    is_whatsapp_same: true,
    address: 'Civil Lines, Near Circuit House, Jaipur, Rajasthan - 302006',
    booking_reason: 'Grand Wedding Reception & Gala Dinner (Bride Side)',
    event_type: 'reception',
    event_date: '2026-10-12',
    time_slot: 'evening',
    guests: 550,
    total_amount: 260000,
    advance_paid: 100000,
    status: 'confirmed',
    notes: 'Live orchestra acoustic stage, 50 VIP round tables',
    created_at: '2026-09-12T13:00:00Z'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000016',
    customer_name: 'Rahul Khandelwal',
    phone: '+91 97843 67890',
    whatsapp: '+91 98290 88771',
    is_whatsapp_same: false,
    address: 'B-22, Raja Park, Jaipur, Rajasthan - 302004',
    booking_reason: 'Auspicious Ring & Tilak Ceremony (सगाई व गोद भराई)',
    event_type: 'engagement',
    event_date: '2026-10-18',
    time_slot: 'morning',
    guests: 280,
    total_amount: 150000,
    advance_paid: 50000,
    status: 'pending',
    notes: 'Tentative inquiry, awaiting confirmation of priest timings',
    created_at: '2026-09-22T17:30:00Z'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000017',
    customer_name: 'Dinesh Bagaria',
    phone: '+91 98297 78900',
    whatsapp: '+91 98297 78900',
    is_whatsapp_same: true,
    address: 'Plot 48, Near Laxmi Mandir Cinema, Tonk Road, Jaipur, Rajasthan - 302015',
    booking_reason: 'Grand Royal Marriage Ceremony & Barat Reception (Bride Side)',
    event_type: 'wedding',
    event_date: '2026-10-24',
    time_slot: 'full day',
    guests: 1200,
    total_amount: 500000,
    advance_paid: 200000,
    status: 'confirmed',
    notes: 'Grand entry elephant gate and royal carpet walkway',
    created_at: '2026-09-08T09:45:00Z'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000018',
    customer_name: 'Vinod Bansal',
    phone: '+91 94145 89010',
    whatsapp: '+91 94145 89010',
    is_whatsapp_same: true,
    address: 'C-55, Malviya Industrial Area, Jaipur, Rajasthan - 302017',
    booking_reason: 'Pre-Diwali Corporate Gala & Family Celebration Dinner',
    event_type: 'other',
    event_date: '2026-10-30',
    time_slot: 'evening',
    guests: 450,
    total_amount: 220000,
    advance_paid: 75000,
    status: 'confirmed',
    notes: 'Pre-Diwali corporate gala dinner and award presentation',
    created_at: '2026-09-25T12:00:00Z'
  },

  // Next Month 1: November 2026
  {
    id: 'b0000000-0000-0000-0000-000000000019',
    customer_name: 'Shailendra Mishra',
    phone: '+91 98289 90120',
    event_type: 'wedding',
    event_date: '2026-11-06',
    time_slot: 'full day',
    guests: 1200,
    total_amount: 520000,
    advance_paid: 200000,
    status: 'confirmed',
    notes: 'Dev Uthani auspicious date; requires 2 generator setups',
    created_at: '2026-08-15T11:00:00Z'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000020',
    customer_name: 'Bhupendra Soni',
    phone: '+91 97858 01230',
    event_type: 'reception',
    event_date: '2026-11-15',
    time_slot: 'evening',
    guests: 700,
    total_amount: 300000,
    advance_paid: 100000,
    status: 'confirmed',
    notes: 'Gold theme decoration with artificial fountain backdrop',
    created_at: '2026-09-10T15:45:00Z'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000021',
    customer_name: 'Mukesh Jangid',
    phone: '+91 98291 12349',
    event_type: 'wedding',
    event_date: '2026-11-22',
    time_slot: 'full day',
    guests: 1000,
    total_amount: 460000,
    advance_paid: 150000,
    status: 'confirmed',
    notes: 'Wooden carved mandap setup with 4 guest rooms reserved',
    created_at: '2026-09-18T10:30:00Z'
  },

  // Next Month 2: December 2026
  {
    id: 'b0000000-0000-0000-0000-000000000022',
    customer_name: 'Hemant Kulshreshtha',
    phone: '+91 94131 23459',
    event_type: 'wedding',
    event_date: '2026-12-04',
    time_slot: 'full day',
    guests: 1300,
    total_amount: 550000,
    advance_paid: 250000,
    status: 'confirmed',
    notes: 'Premium winter wedding, gas heaters across lawn required',
    created_at: '2026-09-02T16:15:00Z'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000023',
    customer_name: 'Alok Kulhari',
    phone: '+91 98283 34569',
    event_type: 'reception',
    event_date: '2026-12-14',
    time_slot: 'evening',
    guests: 650,
    total_amount: 280000,
    advance_paid: 100000,
    status: 'confirmed',
    notes: 'Bonfire and outdoor heaters for lawn buffet area',
    created_at: '2026-09-20T14:00:00Z'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000024',
    customer_name: 'Rajesh Gupta',
    phone: '+91 97844 45679',
    event_type: 'engagement',
    event_date: '2026-12-25',
    time_slot: 'evening',
    guests: 350,
    total_amount: 175000,
    advance_paid: 50000,
    status: 'pending',
    notes: 'Christmas holiday event inquiry, awaiting date lock',
    created_at: '2026-09-28T11:20:00Z'
  },

  // Next Month 3: January 2027
  {
    id: 'b0000000-0000-0000-0000-000000000025',
    customer_name: 'Mahendra Choudhary',
    phone: '+91 98295 56788',
    event_type: 'wedding',
    event_date: '2027-01-16',
    time_slot: 'full day',
    guests: 1150,
    total_amount: 500000,
    advance_paid: 150000,
    status: 'confirmed',
    notes: 'Makar Sankranti weekend wedding, kite theme decoration request',
    created_at: '2026-09-15T13:30:00Z'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  // Today's simulated payment (2026-10-01)
  {
    id: 'p001',
    booking_id: 'b0000000-0000-0000-0000-000000000014',
    amount: 50000,
    payment_date: '2026-10-01',
    mode: 'cash',
    note: "Today's installment received in cash at office",
    created_at: '2026-10-01T09:00:00Z'
  },
  {
    id: 'p002',
    booking_id: 'b0000000-0000-0000-0000-000000000015',
    amount: 35000,
    payment_date: '2026-10-01',
    mode: 'UPI',
    note: "Today's UPI payment via PhonePe",
    created_at: '2026-10-01T11:15:00Z'
  },
  // Earlier in October 2026
  {
    id: 'p003',
    booking_id: 'b0000000-0000-0000-0000-000000000014',
    amount: 150000,
    payment_date: '2026-10-01',
    mode: 'bank',
    note: 'Initial token RTGS',
    created_at: '2026-09-05T10:15:00Z'
  },
  {
    id: 'p004',
    booking_id: 'b0000000-0000-0000-0000-000000000015',
    amount: 65000,
    payment_date: '2026-10-01',
    mode: 'UPI',
    note: 'Advance via Google Pay',
    created_at: '2026-09-12T13:00:00Z'
  },
  {
    id: 'p005',
    booking_id: 'b0000000-0000-0000-0000-000000000016',
    amount: 50000,
    payment_date: '2026-10-01',
    mode: 'cash',
    note: 'Token booking cash',
    created_at: '2026-09-22T17:30:00Z'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  // October 2026 Expenses
  {
    id: 'e001',
    date: '2026-10-01',
    category: 'staff salary',
    amount: 56000,
    note: 'Monthly staff wages for security, maintenance, and supervisor',
    created_at: '2026-10-01T10:00:00Z'
  },
  {
    id: 'e002',
    date: '2026-10-01',
    category: 'electricity',
    amount: 34000,
    note: 'Commercial meter power bill payment',
    created_at: '2026-10-01T11:00:00Z'
  },
  {
    id: 'e003',
    date: '2026-10-01',
    category: 'other',
    amount: 18500,
    note: 'Diesel fuel stock purchase for upcoming October wedding bookings',
    created_at: '2026-10-01T14:30:00Z'
  },
  {
    id: 'e004',
    date: '2026-10-01',
    category: 'maintenance',
    amount: 12000,
    note: 'Fire extinguisher refill and lawn pesticide treatment',
    created_at: '2026-10-01T16:00:00Z'
  }
];
