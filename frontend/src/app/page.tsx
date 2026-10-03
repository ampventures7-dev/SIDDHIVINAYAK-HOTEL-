'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  BedDouble, 
  Calendar as CalendarIcon, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PlusCircle, 
  MinusCircle, 
  Receipt, 
  Users, 
  Phone, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Fuel, 
  ChevronRight, 
  ArrowUpRight, 
  DollarSign, 
  MessageSquare, 
  LogIn, 
  LogOut,
  X,
  FileText
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Booking, ExpenseCategory, Room } from '@/types/database';
import RoomDetailsModal from '@/components/RoomDetailsModal';

export default function HotelDashboardPage() {
  const router = useRouter();
  const { 
    lang, 
    t, 
    bookings, 
    payments, 
    expenses, 
    rooms, 
    currentDate, 
    formatINR, 
    addExpense,
    checkInRoom,
    checkOutRoom,
    updateRoomStatus,
    assets
  } = useApp();

  // Modals
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpenseCategory, setNewExpenseCategory] = useState<ExpenseCategory>('electricity');
  const [newExpenseAmount, setNewExpenseAmount] = useState('25000');
  const [newExpenseDate, setNewExpenseDate] = useState('2026-10-01');
  const [newExpenseNote, setNewExpenseNote] = useState('');

  // Selected Booking Details
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Selected Room for Details & Orders Popup
  const [selectedRoomForModal, setSelectedRoomForModal] = useState<Room | null>(null);

  const currentMonthPrefix = '2026-10';

  // --- FINANCIAL CALCULATIONS ---
  const todayIncome = useMemo(() => {
    return payments
      .filter((p) => p.payment_date === currentDate)
      .reduce((sum, p) => sum + Number(p.amount), 0);
  }, [payments, currentDate]);

  const thisMonthIncome = useMemo(() => {
    return payments
      .filter((p) => p.payment_date.startsWith(currentMonthPrefix))
      .reduce((sum, p) => sum + Number(p.amount), 0);
  }, [payments, currentMonthPrefix]);

  const thisMonthExpenses = useMemo(() => {
    return expenses
      .filter((e) => e.date.startsWith(currentMonthPrefix))
      .reduce((sum, e) => sum + Number(e.amount), 0);
  }, [expenses, currentMonthPrefix]);

  const thisMonthProfit = thisMonthIncome - thisMonthExpenses;

  const pendingBalanceToCollect = useMemo(() => {
    return bookings
      .filter((b) => b.status === 'confirmed' || b.status === 'pending')
      .reduce((sum, b) => sum + Math.max(0, Number(b.total_amount) - Number(b.advance_paid)), 0);
  }, [bookings]);

  // Rooms Overview
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied');
  const vacantRooms = rooms.filter((r) => r.status === 'vacant_clean');
  const cleaningRooms = rooms.filter((r) => r.status === 'cleaning');
  const reservedRooms = rooms.filter((r) => r.status === 'reserved');

  // Upcoming Bookings (Next 5)
  const upcomingBookings = useMemo(() => {
    return bookings
      .filter((b) => b.event_date >= currentDate && b.status !== 'cancelled')
      .sort((a, b) => a.event_date.localeCompare(b.event_date))
      .slice(0, 5);
  }, [bookings, currentDate]);

  // Clients with pending balance
  const pendingDuesList = useMemo(() => {
    return bookings
      .filter((b) => b.status !== 'cancelled' && Number(b.total_amount) > Number(b.advance_paid))
      .sort((a, b) => (Number(b.total_amount) - Number(b.advance_paid)) - (Number(a.total_amount) - Number(a.advance_paid)))
      .slice(0, 6);
  }, [bookings]);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newExpenseAmount) || 0;
    if (amt <= 0) {
      alert(lang === 'hi' ? 'कृपया सही रकम दर्ज करें' : 'Please enter valid amount');
      return;
    }
    addExpense({
      date: newExpenseDate,
      category: newExpenseCategory,
      amount: amt,
      note: newExpenseNote.trim() || undefined,
    });
    setShowAddExpenseModal(false);
    setNewExpenseNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 w-full min-w-0 overflow-hidden">
      {/* EXECUTIVE CONTROL HEADER */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 w-full min-w-0">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            <span>{lang === 'hi' ? 'होटल एवं मैरिज गार्डन मुख्य नियंत्रण केंद्र' : 'Hotel & Banquet Operations Center'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {lang === 'hi' ? 'होटल सिद्धिविनायक - मालिक डैशबोर्ड' : 'Hotel Siddhivinayak - Operations Hub'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'hi'
              ? 'दैनिक कैश काउंटर, 25 एसी रूम्स स्टेटस, आगामी शादियां एवं मार्केट बकाया वसूली'
              : 'Real-time revenue, room occupancy, banquet events, and pending balances'}
          </p>
        </div>

        {/* Quick Operational Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/rooms"
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <BedDouble className="w-4 h-4" />
            <span>{lang === 'hi' ? 'रूम्स बोर्ड (25)' : 'Rooms Board'}</span>
          </Link>
          <Link
            href="/bookings/new"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{lang === 'hi' ? '+ शादी बुकिंग' : '+ Book Lawn'}</span>
          </Link>
          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <MinusCircle className="w-4 h-4 text-rose-600" />
            <span>{lang === 'hi' ? '- खर्चा दर्ज करें' : '- Add Expense'}</span>
          </button>
        </div>
      </div>

      {/* TOP 5 FINANCIAL & OCCUPANCY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 w-full min-w-0">
        {/* Card 1: Today Income */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
              <span className="font-semibold">{lang === 'hi' ? 'आज की वसूली (Cash)' : "Today's Cashflow"}</span>
              <Wallet className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600 font-mono">
              {formatINR(todayIncome)}
            </div>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">
            {lang === 'hi' ? 'आज काउंटर पर जमा' : 'Cash & UPI collected'}
          </span>
        </div>

        {/* Card 2: October Revenue */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
              <span className="font-semibold">{lang === 'hi' ? 'माह की कुल आय' : 'Month Revenue'}</span>
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {formatINR(thisMonthIncome)}
            </div>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">
            {lang === 'hi' ? 'अक्टूबर 2026 की आय' : 'Total receipts Oct 2026'}
          </span>
        </div>

        {/* Card 3: Net Operating Profit */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
              <span className="font-semibold">{lang === 'hi' ? 'शुद्ध लाभ (Net Profit)' : 'Net Profit'}</span>
              <TrendingDown className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-600 font-mono">
              {formatINR(thisMonthProfit)}
            </div>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">
            {lang === 'hi' ? `खर्चा: ${formatINR(thisMonthExpenses)}` : `Expenses: ${formatINR(thisMonthExpenses)}`}
          </span>
        </div>

        {/* Card 4: Room Occupancy */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
              <span className="font-semibold">{lang === 'hi' ? 'रूम ऑक्यूपेंसी' : 'Room Occupancy'}</span>
              <BedDouble className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-2xl font-black text-cyan-700 font-mono">
              {occupiedRooms.length} / {rooms.length}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{vacantRooms.length} {lang === 'hi' ? 'खाली रूम्स' : 'Vacant Clean'}</span>
          </div>
        </div>

        {/* Card 5: Market Pending Receivables */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
              <span className="font-semibold">{lang === 'hi' ? 'मार्केट से बकाया' : 'Pending Receivables'}</span>
              <Receipt className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-rose-600 font-mono">
              {formatINR(pendingBalanceToCollect)}
            </div>
          </div>
          <span className="text-[11px] text-rose-700 font-semibold mt-2 block">
            {lang === 'hi' ? 'वसूली योग्य शेष' : 'To be collected'}
          </span>
        </div>
      </div>

      {/* DUAL WORKSPACE: ROOMS LIVE STATUS + UPCOMING WEDDING EVENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 w-full min-w-0">
        
        {/* LEFT COLUMN: 25 ROOMS LIVE STATUS SUMMARY (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-sm space-y-3 sm:space-y-4 w-full min-w-0">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-indigo-600 shrink-0" />
              <span className="truncate">{lang === 'hi' ? 'होटल रूम्स स्थिति (25 AC Rooms)' : 'Hotel Rooms Quick Glance'}</span>
            </h2>
            <Link
              href="/rooms"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0"
            >
              <span>{lang === 'hi' ? 'पूरा बोर्ड' : 'View PMS'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Rooms Matrix (All 25 Rooms) */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 w-full">
            {rooms.slice(0, 25).map((r) => {
              const isOcc = r.status === 'occupied';
              const isVac = r.status === 'vacant_clean';
              const isRes = r.status === 'reserved';
              const isCln = r.status === 'cleaning';

              return (
                <button
                  key={r.room_number}
                  type="button"
                  onClick={() => setSelectedRoomForModal(r)}
                  title={`Room #${r.room_number} - Click to view guest details and food/service orders`}
                  className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-center border font-mono font-bold transition cursor-pointer hover:shadow-md hover:scale-105 active:scale-95 min-w-0 ${
                    isOcc
                      ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-800 ring-1 ring-rose-300'
                      : isVac
                      ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800'
                      : isRes
                      ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800 ring-1 ring-amber-300'
                      : isCln
                      ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-800'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="block text-[11px] sm:text-xs font-black truncate">{r.room_number}</span>
                  <span className="block text-[8px] sm:text-[9px] font-extrabold truncate">
                    {isOcc ? 'Occ' : isVac ? 'Vac' : isRes ? 'Res' : 'Cln'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-600">
            <span className="flex items-center gap-1 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate">{vacantRooms.length} {lang === 'hi' ? 'खाली' : 'Vacant'}</span>
            </span>
            <span className="flex items-center gap-1 min-w-0">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span className="truncate">{occupiedRooms.length} {lang === 'hi' ? 'बुक' : 'Occupied'}</span>
            </span>
            <span className="flex items-center gap-1 min-w-0">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span className="truncate">{reservedRooms.length} {lang === 'hi' ? 'रिजर्व' : 'Reserved'}</span>
            </span>
            <span className="flex items-center gap-1 min-w-0">
              <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
              <span className="truncate">{cleaningRooms.length} {lang === 'hi' ? 'सफाई' : 'Cleaning'}</span>
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: UPCOMING CONFIRMED MARRIAGE GARDEN EVENTS (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-sm space-y-3 sm:space-y-4 w-full min-w-0">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="truncate">{lang === 'hi' ? 'आगामी विवाह एवं बैंक्वेट कार्यक्रम' : 'Upcoming Confirmed Weddings'}</span>
            </h2>
            <Link
              href="/bookings"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 shrink-0"
            >
              <span>{lang === 'hi' ? 'सभी देखें' : 'All Bookings'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {upcomingBookings.map((b) => {
              const balance = Math.max(0, Number(b.total_amount) - Number(b.advance_paid));
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className="bg-slate-50 hover:bg-slate-100/80 p-3 sm:p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 cursor-pointer transition w-full min-w-0"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm truncate">{b.customer_name}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 shrink-0">
                        {b.event_type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600">
                      <span className="text-amber-800 font-semibold shrink-0">📅 {b.event_date} ({b.time_slot})</span>
                      <span className="hidden xs:inline sm:inline">•</span>
                      <span className="shrink-0">👥 {b.guests} {lang === 'hi' ? 'मेहमान' : 'Guests'}</span>
                      <span className="hidden xs:inline sm:inline">•</span>
                      <a 
                        href={`tel:${b.phone}`} 
                        onClick={(e) => e.stopPropagation()} 
                        className="text-blue-600 hover:underline flex items-center gap-1 shrink-0"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{b.phone}</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 shrink-0">
                    <span className="text-xs text-slate-500 block">{formatINR(Number(b.total_amount))}</span>
                    <span className={`text-xs font-bold ${balance === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {balance === 0 ? (lang === 'hi' ? 'पूर्ण चुकता' : 'Paid') : (lang === 'hi' ? `बाकी ${formatINR(balance)}` : `Due: ${formatINR(balance)}`)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* PENDING DUES & PAYMENT FOLLOW-UP TABLE */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-sm space-y-3 sm:space-y-4 w-full min-w-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{lang === 'hi' ? 'बकाया भुगतान एवं तकादा रजिस्टर' : 'Pending Dues & Payment Follow-Up'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'hi'
                ? 'शादी से पूर्व बकाया वसूलने हेतु 1-क्लिक व्हाट्सएप भुगतान रिमाइंडर'
                : 'Send 1-click WhatsApp payment reminders for pending wedding balances'}
            </p>
          </div>
          <span className="text-xs font-bold text-rose-600 shrink-0">
            {lang === 'hi' ? 'कुल बकाया:' : 'Total Dues:'} {formatINR(pendingBalanceToCollect)}
          </span>
        </div>

        <div className="w-full overflow-x-auto min-w-0">
          <table className="w-full text-left text-xs min-w-[550px]">
            <thead className="text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200 pb-2">
              <tr>
                <th className="py-2.5 px-3">{lang === 'hi' ? 'ग्राहक का नाम' : 'Client'}</th>
                <th className="py-2.5 px-3">{lang === 'hi' ? 'तारीख' : 'Date'}</th>
                <th className="py-2.5 px-3">{lang === 'hi' ? 'कुल तय राशि' : 'Total Deal'}</th>
                <th className="py-2.5 px-3">{lang === 'hi' ? 'जमा एडवांस' : 'Advance Paid'}</th>
                <th className="py-2.5 px-3">{lang === 'hi' ? 'शेष बाकी' : 'Balance Due'}</th>
                <th className="py-2.5 px-3 text-right">{lang === 'hi' ? 'तकादा (Follow-up)' : 'Follow-up'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingDuesList.map((b) => {
                const balance = Number(b.total_amount) - Number(b.advance_paid);
                const waText = encodeURIComponent(
                  lang === 'hi'
                    ? `नमस्ते ${b.customer_name} जी, सिद्धिविनायक मैरिज गार्डन में आपके कार्यक्रम (${b.event_date}) का शेष बकाया ${formatINR(balance)} जमा कराने की कृपा करें। धन्यवाद।`
                    : `Dear ${b.customer_name}, this is a gentle reminder from Hotel Siddhivinayak & Banquet Lawn regarding the pending balance of ${formatINR(balance)} for your event on ${b.event_date}. Kindly arrange the payment. Thank you!`
                );

                return (
                  <tr key={b.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{b.customer_name}</div>
                      <div className="text-[11px] text-slate-500">{b.phone}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{b.event_date}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{formatINR(Number(b.total_amount))}</td>
                    <td className="py-3 px-3 text-emerald-600 font-semibold">{formatINR(Number(b.advance_paid))}</td>
                    <td className="py-3 px-3 font-bold text-rose-600">{formatINR(balance)}</td>
                    <td className="py-3 px-3 text-right">
                      <a
                        href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=${waText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'व्हाट्सएप तकादा' : 'WhatsApp'}</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUICK EXPENSE MODAL */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <MinusCircle className="w-5 h-5 text-rose-600" />
                <span>{lang === 'hi' ? 'नया खर्चा वाउचर दर्ज करें' : 'Record Expense Voucher'}</span>
              </h3>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'खर्चा श्रेणी' : 'Category'}
                </label>
                <select
                  value={newExpenseCategory}
                  onChange={(e) => setNewExpenseCategory(e.target.value as ExpenseCategory)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 outline-none"
                >
                  <option value="electricity">{lang === 'hi' ? '⚡ बिजली बिल / DG डीजल (Power)' : '⚡ Electricity & Generator Fuel'}</option>
                  <option value="staff salary">{lang === 'hi' ? '👨‍🌾 स्टाफ वेतन व दैनिक मजदूरी (Staff)' : '👨‍🌾 Staff Salary & Daily Wages'}</option>
                  <option value="decoration">{lang === 'hi' ? '🌸 टेंट, मंडप व डेकोरेशन (Decoration)' : '🌸 Mandap & Tent Decoration'}</option>
                  <option value="maintenance">{lang === 'hi' ? '🔧 ग्राउंड व मोटर रिपेयर (Maintenance)' : '🔧 Ground & Machine Maintenance'}</option>
                  <option value="catering">{lang === 'hi' ? '🍽️ कैटरिंग व राशन सामग्री (Catering)' : '🍽️ Catering & Kitchen Grocery'}</option>
                  <option value="other">{lang === 'hi' ? '⛽ अन्य विविध खर्चा (Other)' : '⛽ Other Miscellaneous Expense'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'रकम (रुपये में)' : 'Amount (INR)'} *
                </label>
                <input
                  type="number"
                  required
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'खर्चा तारीख' : 'Date'}
                </label>
                <input
                  type="date"
                  required
                  value={newExpenseDate}
                  onChange={(e) => setNewExpenseDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'विवरण / भुगतान पाने वाले का नाम' : 'Remark / Payee'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'hi' ? "उदा. 200L डीजल शादी वाले दिन" : "e.g. 200L Diesel, Electrician bill"}
                  value={newExpenseNote}
                  onChange={(e) => setNewExpenseNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow"
                >
                  {lang === 'hi' ? 'वाउचर सेव करें' : 'Save Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SELECTED BOOKING QUICK DETAILS MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedBooking.customer_name}
                </h3>
                <span className="text-xs text-indigo-600 capitalize">
                  {selectedBooking.event_type} • {selectedBooking.event_date} ({selectedBooking.time_slot})
                </span>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>{lang === 'hi' ? 'फोन नंबर:' : 'Phone Number:'}</span>
                <span className="font-bold text-slate-900">{selectedBooking.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>{lang === 'hi' ? 'मेहमान संख्या:' : 'Guest Count:'}</span>
                <span className="font-bold text-slate-900">{selectedBooking.guests}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>{lang === 'hi' ? 'कुल तय राशि:' : 'Total Amount:'}</span>
                <span className="font-bold text-slate-900">{formatINR(Number(selectedBooking.total_amount))}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>{lang === 'hi' ? 'जमा एडवांस:' : 'Advance Paid:'}</span>
                <span className="font-bold text-emerald-600">{formatINR(Number(selectedBooking.advance_paid))}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>{lang === 'hi' ? 'शेष बाकी:' : 'Balance Due:'}</span>
                <span className="font-bold text-rose-600">
                  {formatINR(Math.max(0, Number(selectedBooking.total_amount) - Number(selectedBooking.advance_paid)))}
                </span>
              </div>
              {selectedBooking.notes && (
                <div className="py-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-800">{lang === 'hi' ? 'विशेष निर्देश:' : 'Notes:'} </span>
                  {selectedBooking.notes}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Link
                href={`/bookings/${selectedBooking.id}`}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm"
              >
                {lang === 'hi' ? 'रसीद व पूरा हिसाब खोलें' : 'Open Bill & Receipts'}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ROOM DETAILS & ORDERS MODAL */}
      {selectedRoomForModal && (
        <RoomDetailsModal
          room={rooms.find((r) => r.room_number === selectedRoomForModal.room_number) || selectedRoomForModal}
          onClose={() => setSelectedRoomForModal(null)}
          onOpenCheckIn={() => router.push('/rooms')}
        />
      )}
    </div>
  );
}
