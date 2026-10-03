export type EventType = 'wedding' | 'engagement' | 'reception' | 'other';
export type TimeSlot = 'morning' | 'evening' | 'full day';
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled';
export type PaymentMode = 'cash' | 'UPI' | 'bank';
export type ExpenseCategory = 'electricity' | 'staff salary' | 'decoration' | 'maintenance' | 'catering' | 'other';

// --- Banquet & Marriage Garden Booking ---
export interface Booking {
  id: string;
  customer_name: string;
  phone: string;
  whatsapp?: string; // WhatsApp number
  is_whatsapp_same?: boolean; // Whether WhatsApp number is same as mobile
  address?: string; // Full address of the customer
  booking_reason?: string; // Reason / Purpose of booking (e.g. Marriage Ceremony, Reception, Tilak)
  event_type: EventType;
  event_date: string; // YYYY-MM-DD
  time_slot: TimeSlot;
  guests: number;
  total_amount: number;
  advance_paid: number;
  status: BookingStatus;
  notes?: string | null;
  created_at: string;
}

// --- Payment & Installment Ledger ---
export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  payment_date: string; // YYYY-MM-DD
  mode: PaymentMode;
  note?: string | null;
  created_at: string;
}

// --- Expense Voucher ---
export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  category: ExpenseCategory;
  amount: number;
  note?: string | null;
  created_at: string;
}

// --- Hotel Room Management (PMS) ---
export type RoomStatus = 'vacant_clean' | 'occupied' | 'reserved' | 'cleaning' | 'maintenance';
export type RoomType = 'deluxe_ac' | 'super_deluxe' | 'bridal_suite' | 'family_suite';

export interface RoomOrderItem {
  id: string;
  item_name: string;
  quantity: number;
  price: number;
  ordered_at: string;
}

export interface Room {
  room_number: string;
  type: RoomType;
  floor: number;
  rate_per_day: number;
  status: RoomStatus;
  current_guest?: {
    name: string;
    phone: string;
    id_proof?: string; // Aadhaar card / ID
    address?: string; // Full home/city address
    purpose_of_visit?: string; // Reason of visit (e.g. Wedding, Business, Leisure)
    num_guests?: number; // How many people in the room (Pax count)
    check_in: string; // YYYY-MM-DD HH:mm
    check_out?: string; // YYYY-MM-DD HH:mm (Expected check-out)
    total_bill: number;
    paid_amount: number;
    assigned_event_id?: string;
    orders?: RoomOrderItem[];
  };
}

// --- Staff & Payroll Management ---
export interface StaffMember {
  id: string;
  name: string;
  role: 'manager' | 'chef' | 'room_service' | 'housekeeping' | 'security' | 'electrician';
  phone: string;
  monthly_salary: number;
  joined_date: string;
  attendance_today: 'present' | 'absent' | 'half_day';
  advance_taken: number;
}

// --- Asset & Fuel Inventory ---
export interface AssetInventory {
  id: string;
  name: string;
  category: 'fuel' | 'furniture' | 'bedding' | 'appliances' | 'crockery';
  quantity: number;
  unit: string;
  status: 'good' | 'refill_needed' | 'maintenance';
  last_inspected: string;
}

export interface DailyReport {
  report_date: string;
  revenue: number;
  expenses: number;
  net_profit: number;
}

export interface MonthlyFinancialSummary {
  month_key: string; // YYYY-MM
  total_bookings: number;
  total_booking_value: number;
  total_revenue_collected: number;
  total_expenses: number;
  net_profit: number;
}
