'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  LayoutDashboard, 
  BedDouble, 
  Calendar as CalendarIcon, 
  ListFilter, 
  PlusCircle, 
  MinusCircle,
  BarChart3,
  Languages,
  User,
  Users,
  Wallet,
  Building2,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export function Navbar() {
  const { lang, setLang, t, user, rooms, payments, currentDate, formatINR } = useApp();
  const pathname = usePathname();

  // Calculate live software status metrics
  const occupiedRoomsCount = rooms.filter((r) => r.status === 'occupied').length;
  const totalRoomsCount = rooms.length;
  const occupancyPercent = Math.round((occupiedRoomsCount / totalRoomsCount) * 100);

  const todayIncome = payments
    .filter((p) => p.payment_date === currentDate)
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const navItems = [
    {
      href: '/',
      label: lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/rooms',
      label: lang === 'hi' ? 'होटल रूम्स (25 Rooms)' : 'Rooms PMS',
      icon: BedDouble,
      badge: `${occupiedRoomsCount}/${totalRoomsCount}`,
    },
    {
      href: '/calendar',
      label: lang === 'hi' ? 'तारीख व बुकिंग' : 'Calendar',
      icon: CalendarIcon,
    },
    {
      href: '/bookings',
      label: lang === 'hi' ? 'मैरिज गार्डन बुकिंग्स' : 'Lawn Bookings',
      icon: ListFilter,
    },
    {
      href: '/expenses',
      label: lang === 'hi' ? 'खर्चा रजिस्टर' : 'Expenses',
      icon: MinusCircle,
    },
    {
      href: '/staff',
      label: lang === 'hi' ? 'स्टाफ व पेरोल' : 'Staff & Payroll',
      icon: Users,
    },
    {
      href: '/reports',
      label: lang === 'hi' ? 'P&L वित्तीय रिपोर्ट' : 'P&L Reports',
      icon: BarChart3,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white text-slate-800 border-b border-slate-200 shadow-sm w-full max-w-full overflow-hidden">
      {/* Top Operational Status Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-3 sm:px-4 flex items-center justify-between gap-3 overflow-x-auto w-full max-w-full">
        <div className="flex items-center gap-3 shrink-0 font-medium text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SIDDHIVINAYAK</span>
          </div>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Occupancy Indicator */}
          <div className="flex items-center gap-1.5 text-slate-300 shrink-0">
            <BedDouble className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {lang === 'hi' ? 'रूम्स:' : 'Rooms:'}{' '}
              <strong className="text-white font-bold">{occupiedRoomsCount}/{totalRoomsCount}</strong>
            </span>
          </div>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Today Collection Counter */}
          <div className="flex items-center gap-1.5 text-emerald-300 font-bold shrink-0">
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span>{formatINR(todayIncome)}</span>
          </div>
        </div>

        {/* Right Info: Current Date + Owner */}
        <div className="flex items-center gap-2 shrink-0 text-slate-400 font-semibold text-[11px] sm:text-xs">
          <span className="hidden sm:inline">📅 {currentDate} •</span>
          <span className="text-amber-400">{lang === 'hi' ? 'होटल मालिक' : 'Hotel Malik'}</span>
        </div>
      </div>

      {/* Main Software Brand & Actions Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
        {/* Software Title */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-lg sm:text-xl shadow-sm">
            H
          </div>
          <div className="min-w-0">
            <div className="text-base sm:text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5 sm:gap-2">
              <span className="truncate">{lang === 'hi' ? 'होटल सिद्धिविनायक' : 'Hotel Siddhivinayak'}</span>
              <span className="shrink-0 bg-indigo-50 text-indigo-700 text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded font-bold border border-indigo-200 uppercase font-mono">
                ERP
              </span>
            </div>
            <div className="text-xs text-slate-500 hidden sm:block truncate">
              {lang === 'hi' ? 'होटल रूम्स एवं मैरिज गार्डन मैनेजमेंट' : 'Hotel & Banquet Operations Software'}
            </div>
          </div>
        </Link>

        {/* Quick Operational Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 transition"
          >
            <Languages className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="hidden sm:inline">{t.toggleLang}</span>
            <span className="sm:hidden">{lang === 'hi' ? 'EN' : 'हिं'}</span>
          </button>

          {/* Quick New Booking Button */}
          <Link
            href="/bookings/new"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
          >
            <PlusCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{lang === 'hi' ? '+ बुकिंग' : '+ Booking'}</span>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="border-t border-slate-200 bg-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-indigo-800 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
