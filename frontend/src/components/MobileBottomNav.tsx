'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  LayoutDashboard, 
  BedDouble, 
  Calendar as CalendarIcon, 
  Plus, 
  Menu,
  X,
  ListFilter,
  MinusCircle,
  Users,
  BarChart3,
  Languages,
  ChevronRight
} from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { lang, setLang, rooms } = useApp();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const occupiedCount = rooms.filter((r) => r.status === 'occupied').length;
  const isMoreActive = ['/bookings', '/expenses', '/staff', '/reports'].some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

  const moreMenuItems = [
    {
      href: '/bookings',
      labelHi: 'मैरिज गार्डन बुकिंग्स',
      labelEn: 'Lawn Bookings Master',
      icon: ListFilter,
      badge: lang === 'hi' ? 'रजिस्टर' : 'Master',
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      href: '/expenses',
      labelHi: 'खर्चा रजिस्टर',
      labelEn: 'Expense & Cash Outflow',
      icon: MinusCircle,
      badge: lang === 'hi' ? 'रोकड़' : 'Ledger',
      color: 'text-rose-600 bg-rose-50',
    },
    {
      href: '/staff',
      labelHi: 'स्टाफ हाजिरी व पेरोल',
      labelEn: 'Staff Attendance & Payroll',
      icon: Users,
      badge: '25 Staff',
      color: 'text-amber-600 bg-amber-50',
    },
    {
      href: '/reports',
      labelHi: 'लाभ-हानि (Profit & Loss)',
      labelEn: 'Profit & Loss Reports',
      icon: BarChart3,
      badge: 'GST / Profit & Loss',
      color: 'text-emerald-600 bg-emerald-50',
    },
  ];

  return (
    <>
      {/* Slide-up "More" Mobile Menu Sheet */}
      {isMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsMoreOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative bg-white rounded-t-2xl shadow-2xl border-t border-slate-200 p-4 pb-24 z-10 animate-in slide-in-from-bottom duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  ☰
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {lang === 'hi' ? 'सभी कार्य एवं मॉड्यूल' : 'All Modules & Services'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {lang === 'hi' ? 'होटल एवं मैरिज गार्डन मेनू' : 'Hotel Siddhivinayak ERP'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 gap-2 pt-3">
              {moreMenuItems.map((item) => {
                const isItemActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMoreOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition ${
                      isItemActive
                        ? 'bg-indigo-50/80 border-indigo-200 text-indigo-900 font-bold'
                        : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/80 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">
                          {lang === 'hi' ? item.labelHi : item.labelEn}
                        </div>
                        <div className="text-[10px] text-slate-500 font-normal">
                          {item.badge}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                );
              })}
            </div>

            {/* Quick Language Switcher Inside Drawer */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-indigo-600" />
                {lang === 'hi' ? 'भाषा (Language):' : 'Language:'}
              </span>
              <button
                type="button"
                onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
                className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
              >
                {lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Symmetrical 5-Slot Bottom Bar */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)' }}
      >
        <div className="grid grid-cols-5 items-center w-full px-1 pt-1.5 pb-1">
          {/* 1. Dashboard (Left 1) */}
          <Link
            href="/"
            onClick={() => setIsMoreOpen(false)}
            className={`flex flex-col items-center justify-center py-1 transition ${
              pathname === '/' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1 rounded-lg ${pathname === '/' ? 'bg-indigo-50 text-indigo-600' : ''}`}>
              <LayoutDashboard className={`w-5 h-5 ${pathname === '/' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            </div>
            <span className={`text-[10px] mt-0.5 truncate font-medium ${pathname === '/' ? 'font-bold text-indigo-700' : ''}`}>
              {lang === 'hi' ? 'डैशबोर्ड' : 'Home'}
            </span>
          </Link>

          {/* 2. Hotel Rooms (Left 2) */}
          <Link
            href="/rooms"
            onClick={() => setIsMoreOpen(false)}
            className={`flex flex-col items-center justify-center py-1 transition ${
              pathname === '/rooms' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`relative p-1 rounded-lg ${pathname === '/rooms' ? 'bg-indigo-50 text-indigo-600' : ''}`}>
              <BedDouble className={`w-5 h-5 ${pathname === '/rooms' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-black px-1 rounded-full leading-tight">
                {occupiedCount}
              </span>
            </div>
            <span className={`text-[10px] mt-0.5 truncate font-medium ${pathname === '/rooms' ? 'font-bold text-indigo-700' : ''}`}>
              {lang === 'hi' ? 'रूम्स' : 'Rooms'}
            </span>
          </Link>

          {/* 3. Center FAB: New Booking (Exact Center Column 3 of 5) */}
          <div className="flex flex-col items-center justify-center -mt-5">
            <Link
              href="/bookings/new"
              onClick={() => setIsMoreOpen(false)}
              className="flex flex-col items-center justify-center group focus:outline-none"
              aria-label="New Booking"
            >
              <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 group-hover:from-emerald-700 group-hover:to-teal-600 group-active:scale-95 text-white flex items-center justify-center shadow-lg shadow-emerald-600/35 border-[3.5px] border-white transition-all duration-150">
                <Plus className="w-7 h-7 stroke-[3]" />
              </div>
              <span className="text-[10px] font-black text-emerald-700 mt-1 tracking-tight whitespace-nowrap">
                {lang === 'hi' ? 'बुकिंग' : 'Book'}
              </span>
            </Link>
          </div>

          {/* 4. Calendar (Right 1) */}
          <Link
            href="/calendar"
            onClick={() => setIsMoreOpen(false)}
            className={`flex flex-col items-center justify-center py-1 transition ${
              pathname === '/calendar' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1 rounded-lg ${pathname === '/calendar' ? 'bg-indigo-50 text-indigo-600' : ''}`}>
              <CalendarIcon className={`w-5 h-5 ${pathname === '/calendar' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            </div>
            <span className={`text-[10px] mt-0.5 truncate font-medium ${pathname === '/calendar' ? 'font-bold text-indigo-700' : ''}`}>
              {lang === 'hi' ? 'कैलेंडर' : 'Calendar'}
            </span>
          </Link>

          {/* 5. More Menu Drawer (Right 2) */}
          <button
            type="button"
            onClick={() => setIsMoreOpen((prev) => !prev)}
            className={`flex flex-col items-center justify-center py-1 transition focus:outline-none ${
              isMoreActive || isMoreOpen ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1 rounded-lg ${isMoreActive || isMoreOpen ? 'bg-indigo-50 text-indigo-600' : ''}`}>
              <Menu className={`w-5 h-5 ${isMoreActive || isMoreOpen ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            </div>
            <span className={`text-[10px] mt-0.5 truncate font-medium ${isMoreActive || isMoreOpen ? 'font-bold text-indigo-700' : ''}`}>
              {lang === 'hi' ? 'मेनू' : 'More'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}

