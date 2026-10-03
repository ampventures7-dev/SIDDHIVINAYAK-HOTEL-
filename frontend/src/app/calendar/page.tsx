'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  PlusCircle, 
  Phone, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  CalendarCheck,
  CalendarX,
  Calendar as CalendarIcon,
  MessageCircle,
  MapPin,
  Compass,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { Booking, TimeSlot, EventType } from '@/types/database';
import { getShubhMuhurat, isShubhMuhuratDate } from '@/data/shubhMuhurat';

export default function CalendarPage() {
  const router = useRouter();
  const { lang, t, bookings, updateBookingDetails, formatINR } = useApp();

  // Current viewed month: default October 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 = October
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-24');
  const [filterMuhuratOnly, setFilterMuhuratOnly] = useState(false);

  // Customer Details Quick Edit State
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editWhatsapp, setEditWhatsapp] = useState('');
  const [isSameWhatsapp, setIsSameWhatsapp] = useState(true);
  const [editAddress, setEditAddress] = useState('');
  const [editReason, setEditReason] = useState('');

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthNamesHi = [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];

  const handleStartEdit = (b: Booking) => {
    setEditingBookingId(b.id);
    setEditCustomerName(b.customer_name);
    setEditPhone(b.phone);
    setEditWhatsapp(b.whatsapp || b.phone);
    setIsSameWhatsapp(b.is_whatsapp_same !== undefined ? b.is_whatsapp_same : (b.whatsapp === b.phone || !b.whatsapp));
    setEditAddress(b.address || '');
    setEditReason(b.booking_reason || (b.event_type === 'wedding' ? 'Marriage / Wedding Ceremony' : 'Banquet Event'));
  };

  const handleSaveEdit = (e: React.FormEvent, bookingId: string) => {
    e.preventDefault();
    const finalWhatsapp = isSameWhatsapp ? editPhone.trim() : (editWhatsapp.trim() || editPhone.trim());
    updateBookingDetails(bookingId, {
      customer_name: editCustomerName.trim() || undefined,
      phone: editPhone.trim() || undefined,
      whatsapp: finalWhatsapp,
      is_whatsapp_same: isSameWhatsapp,
      address: editAddress.trim() || undefined,
      booking_reason: editReason.trim() || undefined,
    });
    setEditingBookingId(null);
  };

  const weekDaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekDaysHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

  // Days in current selected month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // First day of month offset
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  // Map bookings by date for fast lookup
  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    bookings.forEach((b) => {
      if (!map[b.event_date]) {
        map[b.event_date] = [];
      }
      map[b.event_date].push(b);
    });
    return map;
  }, [bookings]);

  // Selected date bookings
  const selectedDayBookings = useMemo(() => {
    return bookings.filter((b) => b.event_date === selectedDate);
  }, [bookings, selectedDate]);

  const isSelectedDateBooked = selectedDayBookings.length > 0;

  const getSlotLabel = (slot: TimeSlot) => {
    if (slot === 'full day') return t.slotFullDay;
    if (slot === 'morning') return t.slotMorning;
    return t.slotEvening;
  };

  const getEventTypeLabel = (type: EventType) => {
    switch (type) {
      case 'wedding': return t.eventWedding;
      case 'engagement': return t.eventEngagement;
      case 'reception': return t.eventReception;
      default: return t.eventOther;
    }
  };

  // Month Statistics & Shubh Muhurat calculations
  const monthStats = useMemo(() => {
    let bookedDaysCount = 0;
    let muhuratDaysCount = 0;
    let availableMuhuratCount = 0;
    const currentMonthMuhurats: Array<{
      date: string;
      day: number;
      isBooked: boolean;
      bookings: Booking[];
      info: ReturnType<typeof getShubhMuhurat>;
    }> = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayBookings = bookingsByDate[dateStr] || [];
      const isBooked = dayBookings.length > 0;
      const mInfo = getShubhMuhurat(dateStr);

      if (isBooked) {
        bookedDaysCount++;
      }
      if (mInfo) {
        muhuratDaysCount++;
        if (!isBooked) availableMuhuratCount++;
        currentMonthMuhurats.push({
          date: dateStr,
          day,
          isBooked,
          bookings: dayBookings,
          info: mInfo,
        });
      }
    }
    const freeDaysCount = daysInMonth - bookedDaysCount;
    return {
      bookedDaysCount,
      freeDaysCount,
      muhuratDaysCount,
      availableMuhuratCount,
      currentMonthMuhurats,
    };
  }, [daysInMonth, currentYear, currentMonth, bookingsByDate]);

  const selectedDateMuhurat = useMemo(() => {
    return getShubhMuhurat(selectedDate);
  }, [selectedDate]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 w-full min-w-0 overflow-hidden">
      {/* TOP TITLE & MONTH SWITCHER */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 w-full min-w-0">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
            <CalendarCheck className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{lang === 'hi' ? 'शुभ विवाह मुहूर्त एवं बुकिंग कैलेंडर' : 'Shubh Vivah Muhurat & Booking Calendar'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
            {lang === 'hi' ? 'बुकिंग व तारीख कैलेंडर' : 'Booking & Date Calendar'}
          </h1>
          <p className="text-slate-500 text-xs mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span>🟢 {lang === 'hi' ? 'खाली तारीखें (Available)' : 'Available Dates'}</span>
            <span className="text-slate-300">•</span>
            <span>🔴 {lang === 'hi' ? 'बुक तारीखें (Booked)' : 'Booked Dates'}</span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 text-amber-900 font-extrabold bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 shadow-2xs">
              <span>🟡 {lang === 'hi' ? 'गोल्डन = शुभ मुहूर्त (सावा)' : 'Golden = Shubh Muhurat'}</span>
            </span>
          </p>
        </div>

        {/* Month Selector Buttons */}
        <div className="flex items-center justify-between sm:justify-start gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={prevMonth}
            className="p-1.5 sm:p-2 bg-white hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition shadow-sm"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="px-2 sm:px-4 py-1 text-center min-w-[130px] sm:min-w-[170px]">
            <span className="block text-sm sm:text-base font-black text-slate-900">
              {lang === 'hi' ? monthNamesHi[currentMonth] : monthNamesEn[currentMonth]} {currentYear}
            </span>
          </div>

          <button
            onClick={nextMonth}
            className="p-1.5 sm:p-2 bg-white hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition shadow-sm"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* CALENDAR & DAY DETAILS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 w-full min-w-0">
        {/* LEFT COLUMN: 7-DAY CALENDAR GRID */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-2.5 sm:p-5 border border-slate-200 shadow-sm space-y-3 w-full min-w-0 overflow-hidden">
          {/* COLOR LEGEND BAR WITH GOLDEN SHUBH MUHURAT & FILTER */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2.5 sm:gap-3.5 flex-wrap">
              {/* Available */}
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-emerald-100 border-2 border-emerald-400 shrink-0" />
                <span className="font-bold text-emerald-900 text-[11px] sm:text-xs">
                  {lang === 'hi' ? 'खाली' : 'Available'} ({monthStats.freeDaysCount})
                </span>
              </div>

              {/* Booked */}
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-rose-100 border-2 border-rose-400 shrink-0" />
                <span className="font-bold text-rose-900 text-[11px] sm:text-xs">
                  {lang === 'hi' ? 'बुक' : 'Booked'} ({monthStats.bookedDaysCount})
                </span>
              </div>

              {/* Golden Shubh Muhurat Legend */}
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-amber-100 border-2 border-amber-400 shrink-0 shadow-2xs" />
                <span className="font-bold text-amber-950 text-[11px] sm:text-xs">
                  {lang === 'hi' ? 'शुभ मुहूर्त (सावा)' : 'Shubh Muhurat'} ({monthStats.muhuratDaysCount})
                </span>
              </div>
            </div>

            {/* Quick Muhurat Filter Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterMuhuratOnly(!filterMuhuratOnly)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 shadow-2xs ${
                  filterMuhuratOnly
                    ? 'bg-amber-600 text-white border border-amber-700 ring-2 ring-amber-300'
                    : 'bg-white hover:bg-amber-50 text-amber-900 border border-amber-300'
                }`}
              >
                <span>
                  {filterMuhuratOnly
                    ? (lang === 'hi' ? '✓ केवल मुहूर्त (सक्रिय)' : '✓ Muhurats Only')
                    : (lang === 'hi' ? 'केवल मुहूर्त देखें' : 'Muhurats Only')}
                </span>
              </button>
            </div>
          </div>

          {/* THIS MONTH'S SHUBH MUHURAT QUICK SELECT CHIPS */}
          {monthStats.currentMonthMuhurats.length > 0 && (
            <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-300/80 rounded-xl p-2 sm:p-2.5">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
                  <CalendarIcon className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{lang === 'hi' ? 'इस माह के शुभ विवाह सावे व मुहूर्त' : 'Auspicious Dates this Month'}:</span>
                </div>
                <span className="text-[10px] font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300">
                  {monthStats.availableMuhuratCount} {lang === 'hi' ? 'सावे खाली हैं' : 'Free Dates'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
                {monthStats.currentMonthMuhurats.map((m) => {
                  const isSelected = selectedDate === m.date;
                  return (
                    <button
                      key={m.date}
                      type="button"
                      onClick={() => setSelectedDate(m.date)}
                      className={`shrink-0 px-2 sm:px-2.5 py-1 rounded-lg border text-left transition flex items-center gap-1.5 shadow-2xs ${
                        isSelected
                          ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300'
                          : m.isBooked
                          ? 'bg-rose-50/90 text-rose-950 border-rose-300 hover:bg-rose-100'
                          : 'bg-white hover:bg-amber-100/80 text-amber-950 border-amber-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 ${m.isBooked ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                      <span className="text-xs font-black">
                        {m.day} {lang === 'hi' ? monthNamesHi[currentMonth] : monthNamesEn[currentMonth].slice(0, 3)}
                      </span>
                      <span className={`text-[10px] font-bold px-1 py-0.2 rounded border ${
                        isSelected 
                          ? 'bg-amber-600 text-white border-amber-400' 
                          : m.isBooked
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : 'bg-amber-100 text-amber-900 border-amber-200'
                      }`}>
                        {lang === 'hi' ? m.info?.nakshatraHi : m.info?.nakshatraEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center w-full">
            {(lang === 'hi' ? weekDaysHi : weekDaysEn).map((day, idx) => (
              <div
                key={day}
                className={`py-1 sm:py-2 text-[10px] sm:text-xs font-bold rounded sm:rounded-lg ${
                  idx === 0 
                    ? 'text-rose-800 bg-rose-100/70 border border-rose-200' 
                    : 'text-slate-700 bg-slate-100 border border-slate-200'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 w-full">
            {/* Blank offset cells for month start */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="min-h-[55px] sm:min-h-[100px] bg-slate-50/40 rounded-lg sm:rounded-xl border border-dashed border-slate-200 opacity-30"
              />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayBookings = bookingsByDate[dateStr] || [];
              const isBooked = dayBookings.length > 0;
              const isSelected = selectedDate === dateStr;
              const muhuratInfo = getShubhMuhurat(dateStr);
              const isMuhurat = Boolean(muhuratInfo);

              // Filter Dimming
              const isDimmed = filterMuhuratOnly && !isMuhurat;

              // Golden Styling vs Standard Available/Booked
              let cellClasses = '';
              if (isMuhurat && !isBooked) {
                cellClasses = isSelected
                  ? 'bg-gradient-to-b from-amber-100 via-yellow-100 to-amber-200 border-2 border-amber-500 ring-2 ring-amber-500 shadow-md scale-[1.01]'
                  : 'bg-gradient-to-b from-amber-50/95 via-yellow-50/80 to-amber-100/60 border-2 border-amber-400 hover:border-amber-500 hover:bg-amber-100/70 shadow-xs';
              } else if (isMuhurat && isBooked) {
                cellClasses = isSelected
                  ? 'bg-gradient-to-br from-amber-100/90 via-rose-100 to-rose-200 border-2 border-amber-500 ring-2 ring-amber-500 shadow-md scale-[1.01]'
                  : 'bg-gradient-to-br from-amber-50/70 via-rose-50/90 to-rose-100/80 border-2 border-amber-400 hover:border-amber-500 shadow-xs';
              } else if (isBooked) {
                cellClasses = isSelected
                  ? 'bg-rose-100 border-rose-500 ring-2 ring-rose-500 shadow-md scale-[1.01]'
                  : 'bg-rose-50/90 border-rose-200 hover:bg-rose-100/80 hover:border-rose-300 shadow-xs';
              } else {
                cellClasses = isSelected
                  ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-500 shadow-md scale-[1.01]'
                  : 'bg-emerald-50/90 border-emerald-200 hover:bg-emerald-100/80 hover:border-emerald-300 shadow-xs';
              }

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`min-h-[55px] sm:min-h-[100px] p-1 sm:p-2.5 rounded-lg sm:rounded-xl border flex flex-col justify-between cursor-pointer transition select-none shadow-xs min-w-0 ${cellClasses} ${
                    isDimmed ? 'opacity-25 hover:opacity-100' : 'opacity-100'
                  }`}
                >
                  {/* Date Number Header & Status Badge */}
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs sm:text-lg font-black ${
                        isMuhurat 
                          ? 'text-amber-950' 
                          : isBooked 
                          ? 'text-rose-950' 
                          : 'text-emerald-950'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {/* Status Pill Badge */}
                    {isMuhurat ? (
                      !isBooked ? (
                        <span className="text-[8px] sm:text-[10px] font-bold text-amber-950 bg-amber-100 px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded border border-amber-400 shadow-2xs">
                          <span className="sm:hidden">सावा</span>
                          <span className="hidden sm:inline">{lang === 'hi' ? 'शुभ सावा' : 'Muhurat'}</span>
                        </span>
                      ) : (
                        <span className="text-[8px] sm:text-[10px] font-bold text-rose-950 bg-rose-100 px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded border border-rose-300 shadow-2xs">
                          <span className="sm:hidden">●</span>
                          <span className="hidden sm:inline">{lang === 'hi' ? 'बुक' : 'Booked'}</span>
                        </span>
                      )
                    ) : !isBooked ? (
                      <span className="text-[9px] sm:text-[10px] font-extrabold text-emerald-800 bg-emerald-100/90 px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded border border-emerald-300 shadow-2xs">
                        <span className="sm:hidden">✓</span>
                        <span className="hidden sm:inline">{lang === 'hi' ? 'खाली' : 'Free'}</span>
                      </span>
                    ) : (
                      <span className="text-[9px] sm:text-[10px] font-extrabold text-rose-800 bg-rose-100/90 px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded border border-rose-300 shadow-2xs">
                        <span className="sm:hidden">●</span>
                        <span className="hidden sm:inline">{lang === 'hi' ? 'बुक' : 'Booked'}</span>
                      </span>
                    )}
                  </div>

                  {/* Shubh Muhurat Nakshatra Sub-tag on Desktop */}
                  {isMuhurat && (
                    <div className="hidden sm:block text-[9px] font-bold text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300/80 truncate mt-0.5 text-center shadow-2xs">
                      {lang === 'hi' ? muhuratInfo?.nakshatraHi : muhuratInfo?.nakshatraEn}
                    </div>
                  )}

                  {/* Booking Badges & Markers */}
                  <div className="space-y-1 mt-1">
                    {dayBookings.map((b) => (
                      <div
                        key={b.id}
                        className="text-[9px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded bg-rose-200/90 text-rose-950 border border-rose-300/80 truncate flex items-center gap-1 shadow-2xs"
                        title={`${b.customer_name} - ${b.time_slot}`}
                      >
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-rose-600" />
                        <span className="truncate">{b.customer_name.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: SELECTED DATE DETAILS */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`rounded-2xl p-5 border shadow-sm transition ${
            selectedDateMuhurat
              ? isSelectedDateBooked
                ? 'bg-gradient-to-b from-amber-50/50 to-rose-50/50 border-amber-300'
                : 'bg-gradient-to-b from-amber-50/60 to-emerald-50/50 border-amber-300'
              : isSelectedDateBooked 
              ? 'bg-rose-50/50 border-rose-200' 
              : 'bg-emerald-50/50 border-emerald-200'
          }`}>
            {/* Selected Date Header */}
            <div className={`border-b pb-3 mb-4 ${
              selectedDateMuhurat
                ? 'border-amber-300'
                : isSelectedDateBooked ? 'border-rose-200' : 'border-emerald-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  selectedDateMuhurat
                    ? 'text-amber-900 flex items-center gap-1'
                    : isSelectedDateBooked ? 'text-rose-800' : 'text-emerald-800'
                }`}>
                  {selectedDateMuhurat && <CalendarCheck className="w-3.5 h-3.5 text-amber-700" />}
                  <span>{lang === 'hi' ? 'चुनी गई तारीख का ब्यौरा' : 'Selected Date Details'}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  {selectedDateMuhurat && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs">
                      {lang === 'hi' ? 'शुभ मुहूर्त (सावा)' : 'Shubh Muhurat'}
                    </span>
                  )}
                  <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${
                    isSelectedDateBooked 
                      ? 'bg-rose-100 text-rose-800 border-rose-300' 
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {isSelectedDateBooked 
                      ? lang === 'hi' ? '🔴 बुक (Booked)' : '🔴 Booked' 
                      : lang === 'hi' ? '🟢 खाली (Available)' : '🟢 Available'}
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-black text-slate-900 mt-1">
                {new Date(selectedDate).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </h2>
            </div>

            {/* GOLDEN SHUBH MUHURAT CARD BANNER */}
            {selectedDateMuhurat && (
              <div className="p-3.5 rounded-xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 shadow-xs space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-950">
                    <CalendarCheck className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{lang === 'hi' ? 'पावन विवाह शुभ मुहूर्त' : 'Auspicious Vivah Muhurat'}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-300">
                    {lang === 'hi' ? 'शुभ लग्न' : 'Auspicious Date'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/90 p-2 rounded-lg border border-amber-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block">
                      {lang === 'hi' ? 'शुभ तिथि (Tithi):' : 'Tithi:'}
                    </span>
                    <span className="font-black text-slate-900 text-xs">
                      {lang === 'hi' ? selectedDateMuhurat.tithiHi : selectedDateMuhurat.tithiEn}
                    </span>
                  </div>
                  <div className="bg-white/90 p-2 rounded-lg border border-amber-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block">
                      {lang === 'hi' ? 'शुभ नक्षत्र (Nakshatra):' : 'Nakshatra:'}
                    </span>
                    <span className="font-black text-slate-900 text-xs">
                      {lang === 'hi' ? selectedDateMuhurat.nakshatraHi : selectedDateMuhurat.nakshatraEn}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] font-semibold text-amber-950 leading-snug">
                  {lang === 'hi' 
                    ? 'पंचांग अनुसार यह दिन विवाह, पाणिग्रहण संस्कार व मांगलिक उत्सवों हेतु अत्यंत कल्याणकारी है।' 
                    : 'Hindu Panchang designates this date as prime auspicious for grand weddings and celebrations.'}
                </p>
              </div>
            )}

            {/* List of Bookings on this Date */}
            {selectedDayBookings.length > 0 ? (
              <div className="space-y-4">
                {selectedDayBookings.map((b) => {
                  const isConf = b.status === 'confirmed';
                  const isCancelled = b.status === 'cancelled';
                  const balance = b.total_amount - b.advance_paid;
                  const isEditing = editingBookingId === b.id;
                  const isWhatsappSame = b.is_whatsapp_same !== undefined ? b.is_whatsapp_same : (b.whatsapp === b.phone || !b.whatsapp);

                  return (
                    <div
                      key={b.id}
                      className="p-4 rounded-xl border border-rose-200 bg-white shadow-xs space-y-3"
                    >
                      {/* Booking Item Header */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          {b.time_slot} • {b.event_type}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            {b.status}
                          </span>
                          <button
                            type="button"
                            onClick={() => isEditing ? setEditingBookingId(null) : handleStartEdit(b)}
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition"
                            title="Edit Customer Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {isEditing ? (
                        /* INLINE EDIT FORM FOR CUSTOMER DETAILS */
                        <form onSubmit={(e) => handleSaveEdit(e, b.id)} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                          <div className="font-bold text-indigo-900 border-b border-slate-200 pb-1">
                            {lang === 'hi' ? 'ग्राहक विवरण बदलें / भरें:' : 'Edit Customer Details:'}
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                              {lang === 'hi' ? 'ग्राहक का नाम' : 'Customer Name'}
                            </label>
                            <input
                              type="text"
                              required
                              value={editCustomerName}
                              onChange={(e) => setEditCustomerName(e.target.value)}
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-indigo-600"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                                {lang === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
                              </label>
                              <input
                                type="tel"
                                required
                                value={editPhone}
                                onChange={(e) => {
                                  setEditPhone(e.target.value);
                                  if (isSameWhatsapp) setEditWhatsapp(e.target.value);
                                }}
                                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-indigo-600"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                                {lang === 'hi' ? 'व्हाट्सएप नंबर' : 'WhatsApp Number'}
                              </label>
                              {isSameWhatsapp ? (
                                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] font-bold truncate">
                                  Both are same
                                </div>
                              ) : (
                                <input
                                  type="tel"
                                  value={editWhatsapp}
                                  onChange={(e) => setEditWhatsapp(e.target.value)}
                                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-indigo-600"
                                />
                              )}
                            </div>
                          </div>

                          {/* "Both are same" checkbox */}
                          <label className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-slate-700">
                            <input
                              type="checkbox"
                              checked={isSameWhatsapp}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setIsSameWhatsapp(checked);
                                if (checked) setEditWhatsapp(editPhone);
                              }}
                              className="w-3.5 h-3.5 text-indigo-600 rounded"
                            />
                            <span>{lang === 'hi' ? 'मोबाइल और व्हाट्सएप दोनों एक ही हैं (Both are same)' : 'Both Mobile and WhatsApp are same'}</span>
                          </label>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                              {lang === 'hi' ? 'बुकिंग का कारण' : 'Reason of Booking'}
                            </label>
                            <input
                              type="text"
                              value={editReason}
                              onChange={(e) => setEditReason(e.target.value)}
                              placeholder={lang === 'hi' ? "उदा. विवाह समारोह (Marriage Ceremony)" : "e.g. Marriage Ceremony, Ring Ceremony"}
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-indigo-600"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                              {lang === 'hi' ? 'ग्राहक का पूरा पता' : 'Full Residential Address'}
                            </label>
                            <textarea
                              rows={2}
                              value={editAddress}
                              onChange={(e) => setEditAddress(e.target.value)}
                              placeholder="House/Plot No, Street, City, State, PIN"
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-indigo-600 resize-none"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setEditingBookingId(null)}
                              className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-lg font-semibold"
                            >
                              {t.close}
                            </button>
                            <button
                              type="submit"
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center gap-1"
                            >
                              <Save className="w-3 h-3" />
                              <span>{lang === 'hi' ? 'सहेजें' : 'Save'}</span>
                            </button>
                          </div>
                        </form>
                      ) : (
                        /* VIEWING MODE: ALL CUSTOMER DETAILS DISPLAY */
                        <>
                          <div className="text-base font-black text-slate-900">
                            {b.customer_name}
                          </div>

                          {/* Reason of Booking Badge */}
                          <div className="flex items-start gap-1.5 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 text-xs text-indigo-900">
                            <Compass className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[10px] font-bold text-indigo-600 uppercase block">
                                {lang === 'hi' ? 'बुकिंग का कारण:' : 'Reason of Booking:'}
                              </span>
                              <span className="font-semibold leading-tight">
                                {b.booking_reason || (b.event_type === 'wedding' ? 'Marriage Ceremony & Barat Reception' : b.event_type)}
                              </span>
                            </div>
                          </div>

                          {/* Contact Details: Mobile & WhatsApp */}
                          <div className="space-y-1.5 text-xs text-slate-700">
                            {/* Mobile Number */}
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-slate-500" />
                              <span>{lang === 'hi' ? 'मोबाइल:' : 'Mobile:'}</span>
                              <a href={`tel:${b.phone}`} className="font-bold text-indigo-600 hover:underline">
                                {b.phone}
                              </a>
                            </div>

                            {/* WhatsApp Number with "Both are same" badge */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{lang === 'hi' ? 'व्हाट्सएप:' : 'WhatsApp:'}</span>
                              {isWhatsappSame ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <span>{lang === 'hi' ? 'दोनों एक ही हैं (Both are same)' : 'Both are same'}</span>
                                  <span className="text-emerald-900 font-mono">({b.phone})</span>
                                </span>
                              ) : (
                                <span className="font-bold text-slate-900 font-mono">
                                  {b.whatsapp || b.phone}
                                </span>
                              )}
                            </div>

                            {/* Full Address */}
                            <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                              <div className="min-w-0">
                                <span className="text-[10px] font-bold uppercase text-slate-500 block">
                                  {lang === 'hi' ? 'ग्राहक का पता:' : 'Customer Address:'}
                                </span>
                                <span className="text-slate-800 font-medium leading-snug">
                                  {b.address || (
                                    <span className="text-slate-400 italic">
                                      Not provided.{' '}
                                      <button
                                        type="button"
                                        onClick={() => handleStartEdit(b)}
                                        className="text-indigo-600 font-bold not-italic hover:underline"
                                      >
                                        + Fill Address
                                      </button>
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>

                            {/* Guests Count */}
                            <div className="flex items-center gap-1.5 pt-1">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              <span>{b.guests} {lang === 'hi' ? 'मेहमान' : 'Guests'}</span>
                            </div>

                            {/* Financials: Total & Balance */}
                            <div className="flex justify-between pt-2 border-t border-slate-100 font-semibold">
                              <span>{lang === 'hi' ? 'कुल तय राशि:' : 'Total:'} {formatINR(b.total_amount)}</span>
                              <span className={balance > 0 ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}>
                                {lang === 'hi' ? 'बकाया:' : 'Balance:'} {formatINR(balance)}
                              </span>
                            </div>
                          </div>

                          <div className="pt-2">
                            <Link
                              href={`/bookings/${b.id}`}
                              className="w-full inline-flex items-center justify-center gap-1 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold transition"
                            >
                              <span>{lang === 'hi' ? 'रसीद व संपूर्ण ब्यौरा देखें' : 'View Booking & Receipt'}</span>
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : selectedDateMuhurat ? (
              <div className="py-8 text-center bg-gradient-to-b from-amber-50/70 via-white to-amber-50/40 rounded-xl border-2 border-amber-300 p-6 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-amber-800 mx-auto mb-3 shadow-2xs">
                  <CalendarCheck className="w-6 h-6 text-amber-700" />
                </div>
                <h3 className="text-base font-black text-amber-950 mb-1">
                  {lang === 'hi' ? 'पावन सावा / शुभ मुहूर्त पूर्णतः खाली है!' : 'Auspicious Shubh Muhurat is Available!'}
                </h3>
                <p className="text-xs text-amber-900 mb-5 max-w-xs mx-auto font-medium">
                  {lang === 'hi' 
                    ? 'यह शुभ सावा विवाह के लिए अत्यंत मांग में रहता है। इस शुभ दिन पर तुरंत शादी व समारोह की बुकिंग दर्ज करें।'
                    : 'This prime auspicious date has no bookings yet. Reserve now for wedding or reception.'}
                </p>
                <Link
                  href={`/bookings/new?date=${selectedDate}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'यह शुभ मुहूर्त बुक करें' : 'Reserve This Auspicious Date'}</span>
                </Link>
              </div>
            ) : (
              <div className="py-8 text-center bg-white rounded-xl border border-emerald-200 p-6 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 mx-auto mb-3 text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-base font-bold text-emerald-950 mb-1">
                  {lang === 'hi' ? 'यह तारीख पूरी खाली है!' : 'Completely Available!'}
                </h3>
                <p className="text-xs text-emerald-800 mb-5 max-w-xs mx-auto">
                  {lang === 'hi' 
                    ? 'इस पावन तारीख पर कोई बुकिंग नहीं है। आप सुबह, शाम या पूरा दिन बुक कर सकते हैं।'
                    : 'No bookings on this auspicious date. Full day and half-day slots are open.'}
                </p>
                <Link
                  href={`/bookings/new?date=${selectedDate}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'यह तारीख बुक करें' : 'Reserve This Date'}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
