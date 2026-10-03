'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { 
  Search, 
  PlusCircle, 
  Phone, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  Calendar as CalendarIcon, 
  X,
  FileText,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Booking, TimeSlot, EventType } from '@/types/database';

export default function BookingsListPage() {
  const { lang, t, bookings, formatINR, currentDate } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past' | 'pending' | 'cancelled'>('upcoming');

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

  // Filtered and searched bookings
  const filteredBookings = useMemo(() => {
    return bookings
      .filter((b) => {
        // 1. Text search
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchName = b.customer_name.toLowerCase().includes(query);
          const matchPhone = b.phone.includes(query);
          if (!matchName && !matchPhone) return false;
        }

        // 2. Tab filter
        if (activeFilter === 'upcoming') {
          return b.event_date >= currentDate && b.status !== 'cancelled';
        }
        if (activeFilter === 'past') {
          return b.event_date < currentDate && b.status !== 'cancelled';
        }
        if (activeFilter === 'pending') {
          return b.status !== 'cancelled' && b.total_amount > b.advance_paid;
        }
        if (activeFilter === 'cancelled') {
          return b.status === 'cancelled';
        }
        return true;
      })
      .sort((a, b) => {
        if (activeFilter === 'past') {
          return b.event_date.localeCompare(a.event_date);
        }
        return a.event_date.localeCompare(b.event_date);
      });
  }, [bookings, searchQuery, activeFilter, currentDate]);

  // Counts for each tab
  const counts = useMemo(() => {
    return {
      all: bookings.length,
      upcoming: bookings.filter((b) => b.event_date >= currentDate && b.status !== 'cancelled').length,
      past: bookings.filter((b) => b.event_date < currentDate && b.status !== 'cancelled').length,
      pending: bookings.filter((b) => b.status !== 'cancelled' && b.total_amount > b.advance_paid).length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    };
  }, [bookings, currentDate]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 w-full min-w-0 overflow-hidden">
      {/* HEADER & NEW BOOKING BUTTON */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 w-full min-w-0">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'hi' ? 'शादियां एवं समारोह' : 'Weddings & Event Operations'}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {lang === 'hi' ? 'सभी बुकिंग रजिस्टर' : 'Bookings Master Register'}
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            {lang === 'hi'
              ? 'ग्राहक का नाम या फोन नंबर से खोजें एवं बकाया भुगतान ट्रैक करें'
              : 'Search by client name/phone and monitor due balance'}
          </p>
        </div>

        <Link
          href="/bookings/new"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>{lang === 'hi' ? '+ नई बुकिंग दर्ज करें' : '+ New Booking'}</span>
        </Link>
      </div>

      {/* SEARCH BAR & FILTER TABS */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        {/* BIG SEARCH BAR */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              lang === 'hi'
                ? 'ग्राहक का नाम या 10-अंकों का मोबाइल नंबर लिखें...'
                : 'Type customer name or phone number to search...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm font-medium pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-600 text-slate-900 placeholder-slate-400 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* FILTER PILL TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full min-w-0">
          {[
            { id: 'upcoming', labelHi: 'आगामी शादियां', labelEn: 'Upcoming', count: counts.upcoming },
            { id: 'pending', labelHi: 'बकाया वाले', labelEn: 'Pending Due', count: counts.pending },
            { id: 'all', labelHi: 'सभी', labelEn: 'All Bookings', count: counts.all },
            { id: 'past', labelHi: 'संपन्न शादियां', labelEn: 'Past Events', count: counts.past },
            { id: 'cancelled', labelHi: 'रद्द', labelEn: 'Cancelled', count: counts.cancelled },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{lang === 'hi' ? tab.labelHi : tab.labelEn}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* BOOKINGS LIST CARDS */}
      <div className="space-y-3">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((b) => {
            const isConf = b.status === 'confirmed';
            const isCancelled = b.status === 'cancelled';
            const balance = Math.max(0, Number(b.total_amount) - Number(b.advance_paid));

            return (
              <div
                key={b.id}
                className="bg-white hover:border-slate-300 rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-lg font-bold text-slate-900">
                      {b.customer_name}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                      isCancelled
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : isConf
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {b.status}
                    </span>
                    <span className="text-xs text-slate-600 capitalize bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {b.event_type} • {b.time_slot}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="font-semibold text-slate-800">{b.event_date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.guests} {lang === 'hi' ? 'मेहमान' : 'Guests'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                  <div className="text-right">
                    <div className="text-xs text-slate-500">{lang === 'hi' ? 'कुल राशि:' : 'Total:'} {formatINR(Number(b.total_amount))}</div>
                    <div className="text-base font-bold">
                      {balance === 0 ? (
                        <span className="text-emerald-700">{lang === 'hi' ? 'पूर्ण चुकता' : 'Paid in Full'}</span>
                      ) : (
                        <span className="text-rose-700">{lang === 'hi' ? 'बकाया:' : 'Due:'} {formatINR(balance)}</span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/bookings/${b.id}`}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 border border-slate-200 transition flex items-center gap-1 text-xs font-semibold"
                  >
                    <span>{lang === 'hi' ? 'विवरण' : 'Details'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
            <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-xs">{lang === 'hi' ? 'कोई बुकिंग नहीं मिली।' : 'No bookings found.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
