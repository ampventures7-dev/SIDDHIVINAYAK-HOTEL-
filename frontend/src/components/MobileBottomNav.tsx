'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  LayoutDashboard, 
  BedDouble, 
  Calendar as CalendarIcon, 
  MinusCircle, 
  Plus, 
  Users 
} from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { lang, rooms } = useApp();

  const occupiedCount = rooms.filter((r) => r.status === 'occupied').length;

  const links = [
    {
      href: '/',
      labelHi: 'डैशबोर्ड',
      labelEn: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/rooms',
      labelHi: `रूम्स (${occupiedCount})`,
      labelEn: `Rooms (${occupiedCount})`,
      icon: BedDouble,
    },
    {
      href: '/bookings/new',
      labelHi: '+ बुकिंग',
      labelEn: '+ Book',
      icon: Plus,
      isCenterAction: true,
    },
    {
      href: '/calendar',
      labelHi: 'कैलेंडर',
      labelEn: 'Calendar',
      icon: CalendarIcon,
    },
    {
      href: '/staff',
      labelHi: 'स्टाफ',
      labelEn: 'Staff',
      icon: Users,
    },
    {
      href: '/expenses',
      labelHi: 'खर्चा',
      labelEn: 'Expenses',
      icon: MinusCircle,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 w-full max-w-full overflow-hidden bg-white border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-safe">
      <div className="grid grid-cols-6 items-center px-1 py-1 w-full max-w-full">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          if (link.isCenterAction) {
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center justify-center -mt-5 group"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-600 group-active:scale-95 text-white flex items-center justify-center shadow-lg border-2 border-white transition">
                  <Icon className="w-6 h-6 stroke-[3]" />
                </div>
                <span className="text-[10px] font-black text-emerald-700 mt-1">
                  {lang === 'hi' ? link.labelHi : link.labelEn}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center py-1 transition ${
                isActive ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-indigo-50 text-indigo-600' : ''}`}>
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : ''}`} />
              </div>
              <span className={`text-[9px] mt-0.5 truncate max-w-full font-medium ${isActive ? 'font-bold text-indigo-700' : ''}`}>
                {lang === 'hi' ? link.labelHi : link.labelEn}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
