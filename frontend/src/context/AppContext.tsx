'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Booking, 
  Payment, 
  Expense, 
  TimeSlot, 
  Room, 
  StaffMember, 
  AssetInventory, 
  RoomStatus,
  RoomOrderItem 
} from '@/types/database';
import { INITIAL_BOOKINGS, INITIAL_PAYMENTS, INITIAL_EXPENSES } from '@/data/mockData';
import { translations, Language } from '@/lib/translations';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthUser {
  email: string;
  name?: string;
  isDemo?: boolean;
}

// Initial 25 Hotel Rooms with rich guest, address, purpose & room service orders
const INITIAL_ROOMS: Room[] = [
  { 
    room_number: '101', 
    type: 'deluxe_ac', 
    floor: 1, 
    rate_per_day: 2500, 
    status: 'occupied', 
    current_guest: { 
      name: 'Rajesh Sharma', 
      phone: '+91 98290 12345', 
      id_proof: 'Aadhaar: 4829-1029-4821',
      address: 'Plot 42, Malviya Nagar, Jaipur, Rajasthan - 302017',
      purpose_of_visit: 'Attending Wedding Ceremony (Groom Side)',
      num_guests: 2,
      check_in: '2026-10-01 10:00 AM', 
      check_out: '2026-10-03 11:00 AM',
      total_bill: 5540, 
      paid_amount: 5000,
      orders: [
        { id: 'ord-101-1', item_name: 'Adrak Masala Chai & Poha Breakfast', quantity: 2, price: 90, ordered_at: '10:30 AM' },
        { id: 'ord-101-2', item_name: 'Bisleri Mineral Water 1L', quantity: 2, price: 20, ordered_at: '11:15 AM' },
        { id: 'ord-101-3', item_name: 'Paneer Butter Masala + 4 Tandoori Roti', quantity: 1, price: 320, ordered_at: '01:30 PM' }
      ]
    } 
  },
  { 
    room_number: '102', 
    type: 'deluxe_ac', 
    floor: 1, 
    rate_per_day: 2500, 
    status: 'occupied', 
    current_guest: { 
      name: 'Sunil Verma', 
      phone: '+91 94140 33221', 
      id_proof: 'Aadhaar: 7289-4412-9901',
      address: 'C-18, Vaishali Nagar, Ajmer, Rajasthan - 305001',
      purpose_of_visit: 'Wedding Reception & Banquet Event',
      num_guests: 2,
      check_in: '2026-10-01 12:30 PM', 
      check_out: '2026-10-02 11:00 AM',
      total_bill: 2760, 
      paid_amount: 1000,
      orders: [
        { id: 'ord-102-1', item_name: 'Special Elaichi Tea (2 Cups)', quantity: 2, price: 30, ordered_at: '01:00 PM' },
        { id: 'ord-102-2', item_name: 'Mix Veg Pakoda Platter', quantity: 1, price: 160, ordered_at: '04:30 PM' },
        { id: 'ord-102-3', item_name: 'Mineral Water Bottle', quantity: 2, price: 20, ordered_at: '04:35 PM' }
      ]
    } 
  },
  { room_number: '103', type: 'super_deluxe', floor: 1, rate_per_day: 3500, status: 'vacant_clean' },
  { room_number: '104', type: 'super_deluxe', floor: 1, rate_per_day: 3500, status: 'vacant_clean' },
  { 
    room_number: '105', 
    type: 'bridal_suite', 
    floor: 1, 
    rate_per_day: 6500, 
    status: 'reserved', 
    current_guest: { 
      name: 'Pooja Agarwal (Bride Family)', 
      phone: '+91 98281 99887', 
      id_proof: 'Aadhaar: 8901-2345-6789',
      address: 'B-4, Civil Lines, Kota, Rajasthan - 324001',
      purpose_of_visit: 'Bride Main Suite (Bridal Makeup & Stay)',
      num_guests: 3,
      check_in: '2026-10-02 08:00 AM', 
      check_out: '2026-10-04 12:00 PM',
      total_bill: 13850, 
      paid_amount: 13000,
      orders: [
        { id: 'ord-105-1', item_name: 'Bridal Welcome Dry-Fruits & Kaju Katli', quantity: 1, price: 650, ordered_at: 'Pre-ordered' },
        { id: 'ord-105-2', item_name: 'Fresh Nimbu Pani & Soda', quantity: 4, price: 50, ordered_at: 'Pre-ordered' }
      ]
    } 
  },
  { room_number: '106', type: 'deluxe_ac', floor: 1, rate_per_day: 2500, status: 'cleaning' },
  { room_number: '107', type: 'deluxe_ac', floor: 1, rate_per_day: 2500, status: 'vacant_clean' },
  { 
    room_number: '108', 
    type: 'family_suite', 
    floor: 1, 
    rate_per_day: 5000, 
    status: 'occupied', 
    current_guest: { 
      name: 'Mahesh Joshi Family (Groom VIPs)', 
      phone: '+91 97850 66554', 
      id_proof: 'Aadhaar: 9812-3490-1289',
      address: '15, Shastri Nagar, Jodhpur, Rajasthan - 342003',
      purpose_of_visit: 'VIP Wedding Family Guests',
      num_guests: 4,
      check_in: '2026-09-30 06:00 PM', 
      check_out: '2026-10-02 12:00 PM',
      total_bill: 11960, 
      paid_amount: 5000,
      orders: [
        { id: 'ord-108-1', item_name: 'Extra AC Mattress + Quilt & Linen Set', quantity: 2, price: 400, ordered_at: '08:00 PM' },
        { id: 'ord-108-2', item_name: 'Rajasthani Deluxe Thali Dinner', quantity: 4, price: 250, ordered_at: '08:45 PM' },
        { id: 'ord-108-3', item_name: 'Morning Bed Tea & Cookies', quantity: 4, price: 40, ordered_at: '07:30 AM' }
      ]
    } 
  },
  { room_number: '109', type: 'deluxe_ac', floor: 1, rate_per_day: 2500, status: 'maintenance' },
  { room_number: '110', type: 'deluxe_ac', floor: 1, rate_per_day: 2500, status: 'vacant_clean' },
  { room_number: '111', type: 'deluxe_ac', floor: 1, rate_per_day: 2500, status: 'vacant_clean' },
  { 
    room_number: '112', 
    type: 'super_deluxe', 
    floor: 1, 
    rate_per_day: 3500, 
    status: 'occupied', 
    current_guest: { 
      name: 'Vikram Singh', 
      phone: '+91 91660 11223', 
      id_proof: 'Aadhaar: 6621-8844-1920',
      address: 'Sector 7, Vidyadhar Nagar, Jaipur, Rajasthan - 302039',
      purpose_of_visit: 'Business & Event Logistics',
      num_guests: 1,
      check_in: '2026-10-01 02:00 PM', 
      check_out: '2026-10-02 11:00 AM',
      total_bill: 3840, 
      paid_amount: 3500,
      orders: [
        { id: 'ord-112-1', item_name: 'Cheese Grilled Club Sandwich', quantity: 2, price: 120, ordered_at: '03:15 PM' },
        { id: 'ord-112-2', item_name: 'Cold Drink (Thumbs Up 750ml)', quantity: 2, price: 50, ordered_at: '03:15 PM' }
      ]
    } 
  },
  { room_number: '201', type: 'deluxe_ac', floor: 2, rate_per_day: 2500, status: 'vacant_clean' },
  { room_number: '202', type: 'deluxe_ac', floor: 2, rate_per_day: 2500, status: 'vacant_clean' },
  { room_number: '203', type: 'deluxe_ac', floor: 2, rate_per_day: 2500, status: 'cleaning' },
  { 
    room_number: '204', 
    type: 'super_deluxe', 
    floor: 2, 
    rate_per_day: 3500, 
    status: 'occupied', 
    current_guest: { 
      name: 'Harish Meena', 
      phone: '+91 94600 44556', 
      id_proof: 'Aadhaar: 7721-9988-1209',
      address: 'Ward 12, Tonk Road, Dausa, Rajasthan - 303303',
      purpose_of_visit: 'Family Gathering & Marriage Ceremony',
      num_guests: 2,
      check_in: '2026-10-01 11:00 AM', 
      check_out: '2026-10-03 11:00 AM',
      total_bill: 7480, 
      paid_amount: 7000,
      orders: [
        { id: 'ord-204-1', item_name: 'Dal Tadka, Rice & Jeera Aloo', quantity: 1, price: 220, ordered_at: '01:00 PM' },
        { id: 'ord-204-2', item_name: 'Gulab Jamun (2 Pcs)', quantity: 2, price: 60, ordered_at: '01:45 PM' },
        { id: 'ord-204-3', item_name: 'Mineral Water 1L', quantity: 2, price: 20, ordered_at: '02:00 PM' }
      ]
    } 
  },
  { room_number: '205', type: 'bridal_suite', floor: 2, rate_per_day: 6500, status: 'vacant_clean' },
  { room_number: '206', type: 'deluxe_ac', floor: 2, rate_per_day: 2500, status: 'vacant_clean' },
  { 
    room_number: '207', 
    type: 'deluxe_ac', 
    floor: 2, 
    rate_per_day: 2500, 
    status: 'occupied', 
    current_guest: { 
      name: 'Anil Gupta', 
      phone: '+91 98299 88776', 
      id_proof: 'Aadhaar: 3344-5566-7788',
      address: '22, Subhash Marg, Alwar, Rajasthan - 301001',
      purpose_of_visit: 'Wedding Function Attendee',
      num_guests: 2,
      check_in: '2026-10-01 09:30 AM', 
      check_out: '2026-10-02 10:00 AM',
      total_bill: 2840, 
      paid_amount: 2500,
      orders: [
        { id: 'ord-207-1', item_name: 'Aloo Pyaz Paratha with Curd & Pickle', quantity: 2, price: 120, ordered_at: '10:00 AM' },
        { id: 'ord-207-2', item_name: 'Kullad Special Chai', quantity: 2, price: 35, ordered_at: '10:30 AM' },
        { id: 'ord-207-3', item_name: 'Packaged Drinking Water', quantity: 1, price: 20, ordered_at: '11:00 AM' }
      ]
    } 
  },
  { 
    room_number: '208', 
    type: 'family_suite', 
    floor: 2, 
    rate_per_day: 5000, 
    status: 'reserved', 
    current_guest: { 
      name: 'Khandelwal Wedding VIPs', 
      phone: '+91 94144 55667', 
      id_proof: 'Aadhaar: 4455-6677-8899',
      address: 'A-88, Raja Park, Jaipur, Rajasthan - 302004',
      purpose_of_visit: 'VIP Family Suite for Wedding',
      num_guests: 4,
      check_in: '2026-10-02 12:00 PM', 
      check_out: '2026-10-05 11:00 AM',
      total_bill: 15900, 
      paid_amount: 5000,
      orders: [
        { id: 'ord-208-1', item_name: 'VIP Welcome Kesar Badam Milk Bottles', quantity: 6, price: 70, ordered_at: 'Pre-ordered' },
        { id: 'ord-208-2', item_name: 'Assorted Premium Mithai Box', quantity: 2, price: 240, ordered_at: 'Pre-ordered' }
      ]
    } 
  },
  { room_number: '209', type: 'deluxe_ac', floor: 2, rate_per_day: 2500, status: 'vacant_clean' },
  { room_number: '210', type: 'deluxe_ac', floor: 2, rate_per_day: 2500, status: 'vacant_clean' },
  { 
    room_number: '211', 
    type: 'deluxe_ac', 
    floor: 2, 
    rate_per_day: 2500, 
    status: 'occupied', 
    current_guest: { 
      name: 'Sanjay Soni', 
      phone: '+91 97830 33445', 
      id_proof: 'Aadhaar: 6655-4433-2211',
      address: 'Station Road, Bikaner, Rajasthan - 334001',
      purpose_of_visit: 'Personal Visit & Ceremony',
      num_guests: 2,
      check_in: '2026-10-01 04:00 PM', 
      check_out: '2026-10-02 12:00 PM',
      total_bill: 2660, 
      paid_amount: 2500,
      orders: [
        { id: 'ord-211-1', item_name: 'Hot South Indian Filter Coffee', quantity: 2, price: 50, ordered_at: '04:45 PM' },
        { id: 'ord-211-2', item_name: 'Crispy French Fries Snack', quantity: 1, price: 60, ordered_at: '05:00 PM' }
      ]
    } 
  },
  { room_number: '212', type: 'deluxe_ac', floor: 2, rate_per_day: 2500, status: 'vacant_clean' },
  { room_number: '213', type: 'super_deluxe', floor: 2, rate_per_day: 3500, status: 'vacant_clean' },
];

// Initial Staff Roster
const INITIAL_STAFF: StaffMember[] = [
  { id: 'st-1', name: 'सुरेश गुर्जर (Manager)', role: 'manager', phone: '+91 98291 11222', monthly_salary: 35000, joined_date: '2024-01-15', attendance_today: 'present', advance_taken: 5000 },
  { id: 'st-2', name: 'रामअवतार शर्मा (Head Chef)', role: 'chef', phone: '+91 94142 33445', monthly_salary: 28000, joined_date: '2024-03-01', attendance_today: 'present', advance_taken: 0 },
  { id: 'st-3', name: 'मुकेश कुमावत (Electrician/DG)', role: 'electrician', phone: '+91 97855 66778', monthly_salary: 22000, joined_date: '2024-05-10', attendance_today: 'present', advance_taken: 2000 },
  { id: 'st-4', name: 'दिलीप सिंह (Head Security)', role: 'security', phone: '+91 91661 77889', monthly_salary: 18000, joined_date: '2024-02-20', attendance_today: 'present', advance_taken: 0 },
  { id: 'st-5', name: 'कैलाश मेघवाल (Housekeeping)', role: 'housekeeping', phone: '+91 94602 88990', monthly_salary: 16000, joined_date: '2024-06-01', attendance_today: 'present', advance_taken: 1000 },
  { id: 'st-6', name: 'पप्पू प्रजापत (Room Service)', role: 'room_service', phone: '+91 98288 44556', monthly_salary: 16000, joined_date: '2024-08-15', attendance_today: 'absent', advance_taken: 0 },
];

// Initial Assets & Generator Inventory
const INITIAL_ASSETS: AssetInventory[] = [
  { id: 'ast-1', name: '125 kVA Kirloskar Silent Generator Diesel', category: 'fuel', quantity: 380, unit: 'Liters', status: 'good', last_inspected: '2026-10-01' },
  { id: 'ast-2', name: '62 kVA Backup Generator Diesel', category: 'fuel', quantity: 120, unit: 'Liters', status: 'refill_needed', last_inspected: '2026-09-30' },
  { id: 'ast-3', name: 'Gold Banqueting Chairs (Chiavari + Cushions)', category: 'furniture', quantity: 1200, unit: 'Pieces', status: 'good', last_inspected: '2026-09-28' },
  { id: 'ast-4', name: 'Round Dining Tables (6-ft diameter)', category: 'furniture', quantity: 85, unit: 'Tables', status: 'good', last_inspected: '2026-09-28' },
  { id: 'ast-5', name: 'Extra AC Room Mattresses & Linen Sets', category: 'bedding', quantity: 60, unit: 'Sets', status: 'good', last_inspected: '2026-09-25' },
];

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (typeof translations)['en'] | (typeof translations)['hi'];
  bookings: Booking[];
  payments: Payment[];
  expenses: Expense[];
  rooms: Room[];
  staff: StaffMember[];
  assets: AssetInventory[];
  currentDate: string;
  formatINR: (val: number) => string;
  user: AuthUser | null;
  isLoggedIn: boolean;
  authLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  addBooking: (
    booking: Omit<Booking, 'id' | 'created_at'>,
    initialAdvance?: number
  ) => { success: boolean; error?: string };
  addExpense: (expense: Omit<Expense, 'id' | 'created_at'>) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'created_at'>) => void;
  checkSlotConflict: (
    date: string,
    slot: TimeSlot,
    excludeBookingId?: string
  ) => { conflict: boolean; conflictingBooking?: Booking; message?: string };
  updateBookingDetails: (bookingId: string, details: Partial<Booking>) => void;
  updateRoomStatus: (roomNumber: string, status: RoomStatus) => void;
  checkInRoom: (roomNumber: string, guest: NonNullable<Room['current_guest']>) => void;
  updateGuestDetails: (roomNumber: string, details: Partial<NonNullable<Room['current_guest']>>) => void;
  checkOutRoom: (roomNumber: string) => void;
  addRoomOrder: (roomNumber: string, item: { item_name: string; quantity: number; price: number }) => void;
  toggleStaffAttendance: (staffId: string) => void;
  updateAssetFuel: (assetId: string, addedLiters: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('hi');
  const [user, setUser] = useState<AuthUser | null>({
    email: 'owner@siddhivinayak.com',
    name: 'होटल मालिक',
    isDemo: true,
  });
  const [authLoading, setAuthLoading] = useState(false);

  // Core Data
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [assets, setAssets] = useState<AssetInventory[]>(INITIAL_ASSETS);

  const currentDate = '2026-10-01';

  // Persistence to localStorage
  useEffect(() => {
    const savedBookings = localStorage.getItem('siddhivinayak_bookings');
    if (savedBookings) {
      try {
        const parsedBookings: Booking[] = JSON.parse(savedBookings);
        const mergedBookings = parsedBookings.map((b) => {
          const init = INITIAL_BOOKINGS.find((ib) => ib.id === b.id);
          return {
            ...init,
            ...b,
            address: b.address || init?.address,
            whatsapp: b.whatsapp || init?.whatsapp,
            is_whatsapp_same: b.is_whatsapp_same !== undefined ? b.is_whatsapp_same : (init?.is_whatsapp_same ?? true),
            booking_reason: b.booking_reason || init?.booking_reason,
          };
        });
        setBookings(mergedBookings);
      } catch {}
    } else {
      setBookings(INITIAL_BOOKINGS);
    }

    const savedRooms = localStorage.getItem('siddhivinayak_rooms');
    if (savedRooms) {
      try {
        const parsed: Room[] = JSON.parse(savedRooms);
        // Hydrate with rich mock orders, address, purpose, pax & check_out if missing
        const merged = parsed.map((r) => {
          const init = INITIAL_ROOMS.find((ir) => ir.room_number === r.room_number);
          if (r.current_guest && init?.current_guest) {
            return {
              ...r,
              current_guest: {
                ...init.current_guest,
                ...r.current_guest,
                check_out: r.current_guest.check_out || init.current_guest.check_out,
                id_proof: r.current_guest.id_proof || init.current_guest.id_proof,
                address: r.current_guest.address || init.current_guest.address,
                purpose_of_visit: r.current_guest.purpose_of_visit || init.current_guest.purpose_of_visit,
                num_guests: r.current_guest.num_guests || init.current_guest.num_guests || 2,
                orders: r.current_guest.orders && r.current_guest.orders.length > 0
                  ? r.current_guest.orders
                  : init.current_guest.orders || [],
              },
            };
          }
          return r;
        });
        setRooms(merged);
      } catch {}
    } else {
      setRooms(INITIAL_ROOMS);
    }
    const savedStaff = localStorage.getItem('siddhivinayak_staff');
    if (savedStaff) {
      try { setStaff(JSON.parse(savedStaff)); } catch {}
    }
    const savedAssets = localStorage.getItem('siddhivinayak_assets');
    if (savedAssets) {
      try { setAssets(JSON.parse(savedAssets)); } catch {}
    }
  }, []);

  const saveBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem('siddhivinayak_bookings', JSON.stringify(newBookings));
  };

  const updateBookingDetails = (bookingId: string, details: Partial<Booking>) => {
    const updated = bookings.map((b) => (b.id === bookingId ? { ...b, ...details } : b));
    saveBookings(updated);
  };

  const saveRooms = (newRooms: Room[]) => {
    setRooms(newRooms);
    localStorage.setItem('siddhivinayak_rooms', JSON.stringify(newRooms));
  };

  const saveStaff = (newStaff: StaffMember[]) => {
    setStaff(newStaff);
    localStorage.setItem('siddhivinayak_staff', JSON.stringify(newStaff));
  };

  const saveAssets = (newAssets: AssetInventory[]) => {
    setAssets(newAssets);
    localStorage.setItem('siddhivinayak_assets', JSON.stringify(newAssets));
  };

  const formatINR = (val: number) => {
    return '₹ ' + (Number(val) || 0).toLocaleString('en-IN');
  };

  const login = async (email: string, pass: string) => {
    setUser({ email, name: 'होटल प्रबंधक (Owner)' });
    return { success: true };
  };

  const logout = async () => {
    setUser(null);
  };

  const checkSlotConflict = (date: string, slot: TimeSlot, excludeBookingId?: string) => {
    const conflicts = bookings.filter((b) => {
      if (b.status === 'cancelled') return false;
      if (excludeBookingId && b.id === excludeBookingId) return false;
      if (b.event_date !== date) return false;
      if (b.time_slot === 'full day') return true;
      if (slot === 'full day') return true;
      return b.time_slot === slot;
    });

    if (conflicts.length > 0) {
      const c = conflicts[0];
      return {
        conflict: true,
        conflictingBooking: c,
        message: `${c.customer_name} की पहले से '${c.time_slot}' बुकिंग मौजूद है!`,
      };
    }
    return { conflict: false };
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'created_at'>, initialAdvance = 0) => {
    const conflictCheck = checkSlotConflict(bookingData.event_date, bookingData.time_slot);
    if (conflictCheck.conflict) {
      return { success: false, error: conflictCheck.message };
    }

    const newBookingId = 'b-' + Date.now();
    const newBooking: Booking = {
      ...bookingData,
      id: newBookingId,
      created_at: new Date().toISOString(),
    };

    saveBookings([newBooking, ...bookings]);

    if (initialAdvance > 0) {
      const newPayment: Payment = {
        id: 'p-' + Date.now(),
        booking_id: newBookingId,
        amount: initialAdvance,
        payment_date: bookingData.event_date,
        mode: 'cash',
        note: 'बुकिंग टोकन / एडवांस',
        created_at: new Date().toISOString(),
      };
      setPayments((prev) => [newPayment, ...prev]);
    }

    return { success: true };
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'created_at'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: 'e-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const addPayment = (paymentData: Omit<Payment, 'id' | 'created_at'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: 'p-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    setPayments((prev) => [newPayment, ...prev]);

    // Update booking advance_paid
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === paymentData.booking_id) {
          const updatedAdvance = Number(b.advance_paid) + Number(paymentData.amount);
          return {
            ...b,
            advance_paid: updatedAdvance,
            status: updatedAdvance >= Number(b.total_amount) ? 'confirmed' : b.status,
          };
        }
        return b;
      })
    );
  };

  // Hotel Room Operations
  const updateRoomStatus = (roomNumber: string, status: RoomStatus) => {
    const updated = rooms.map((r) => (r.room_number === roomNumber ? { ...r, status } : r));
    saveRooms(updated);
  };

  const checkInRoom = (roomNumber: string, guest: NonNullable<Room['current_guest']>) => {
    const updated = rooms.map((r) =>
      r.room_number === roomNumber ? { ...r, status: 'occupied' as RoomStatus, current_guest: guest } : r
    );
    saveRooms(updated);
  };

  const updateGuestDetails = (
    roomNumber: string,
    details: Partial<NonNullable<Room['current_guest']>>
  ) => {
    const updated = rooms.map((r) => {
      if (r.room_number === roomNumber && r.current_guest) {
        return {
          ...r,
          current_guest: {
            ...r.current_guest,
            ...details,
          },
        };
      }
      return r;
    });
    saveRooms(updated);
  };

  const checkOutRoom = (roomNumber: string) => {
    const updated = rooms.map((r) =>
      r.room_number === roomNumber
        ? { ...r, status: 'cleaning' as RoomStatus, current_guest: undefined }
        : r
    );
    saveRooms(updated);
  };

  const addRoomOrder = (
    roomNumber: string,
    item: { item_name: string; quantity: number; price: number }
  ) => {
    const updated = rooms.map((r) => {
      if (r.room_number === roomNumber && r.current_guest) {
        const orderItem: RoomOrderItem = {
          id: 'ord-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          item_name: item.item_name,
          quantity: item.quantity,
          price: item.price,
          ordered_at: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
        const newOrders = [...(r.current_guest.orders || []), orderItem];
        const addedCost = item.quantity * item.price;
        return {
          ...r,
          current_guest: {
            ...r.current_guest,
            orders: newOrders,
            total_bill: r.current_guest.total_bill + addedCost,
          },
        };
      }
      return r;
    });
    saveRooms(updated);
  };

  // Staff Attendance
  const toggleStaffAttendance = (staffId: string) => {
    const updated = staff.map((s) => {
      if (s.id === staffId) {
        const nextState =
          s.attendance_today === 'present'
            ? 'absent'
            : s.attendance_today === 'absent'
            ? 'half_day'
            : 'present';
        return { ...s, attendance_today: nextState as 'present' | 'absent' | 'half_day' };
      }
      return s;
    });
    saveStaff(updated);
  };

  // Generator Fuel
  const updateAssetFuel = (assetId: string, addedLiters: number) => {
    const updated = assets.map((a) => {
      if (a.id === assetId) {
        const newQty = a.quantity + addedLiters;
        return {
          ...a,
          quantity: newQty,
          status: newQty < 150 ? ('refill_needed' as const) : ('good' as const),
          last_inspected: currentDate,
        };
      }
      return a;
    });
    saveAssets(updated);
  };

  const t = translations[lang] || translations['hi'];

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        bookings,
        payments,
        expenses,
        rooms,
        staff,
        assets,
        currentDate,
        formatINR,
        user,
        isLoggedIn: Boolean(user),
        authLoading,
        login,
        logout,
        addBooking,
        updateBookingDetails,
        addExpense,
        addPayment,
        checkSlotConflict,
        updateRoomStatus,
        checkInRoom,
        updateGuestDetails,
        checkOutRoom,
        addRoomOrder,
        toggleStaffAttendance,
        updateAssetFuel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
