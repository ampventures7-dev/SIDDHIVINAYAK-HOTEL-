'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  DollarSign, 
  Fuel, 
  ShieldCheck, 
  Phone, 
  Plus, 
  CheckCircle2, 
  Wrench,
  Sparkles,
  Package
} from 'lucide-react';

export default function StaffAndOperationsPage() {
  const { lang, t, staff, toggleStaffAttendance, assets, updateAssetFuel, formatINR } = useApp();

  const [fuelToAdd, setFuelToAdd] = useState('100');

  const totalMonthlyPayroll = staff.reduce((sum, s) => sum + s.monthly_salary, 0);
  const presentCount = staff.filter((s) => s.attendance_today === 'present').length;

  const handleRefillFuel = (assetId: string) => {
    const liters = parseFloat(fuelToAdd) || 0;
    if (liters <= 0) return;
    updateAssetFuel(assetId, liters);
    alert(lang === 'hi' ? `✅ ${liters} लीटर डीजल स्टॉक में जुड़ गया!` : `✅ ${liters} Liters diesel added!`);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'manager': return lang === 'hi' ? 'होटल प्रबंधक' : 'General Manager';
      case 'chef': return lang === 'hi' ? 'मुख्य रसोइया (Head Chef)' : 'Head Chef';
      case 'electrician': return lang === 'hi' ? 'इलेक्ट्रीशियन व DG ऑपरेटर' : 'Electrician & DG Tech';
      case 'security': return lang === 'hi' ? 'मुख्य सुरक्षा गार्ड' : 'Head Security';
      case 'housekeeping': return lang === 'hi' ? 'हाउसकीपिंग व सफाई' : 'Housekeeping Lead';
      case 'room_service': return lang === 'hi' ? 'रूम सर्विस अटेंडेंट' : 'Room Service';
      default: return role;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5 sm:space-y-6 min-w-0 overflow-hidden">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{lang === 'hi' ? 'स्टाफ हाजिरी, पेरोल एवं संपत्ति रजिस्टर' : 'Staff, Payroll & Generator Operations'}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {lang === 'hi' ? 'स्टाफ एवं होटल संचालन प्रबंधन' : 'Staff Roster & Asset Inventory'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'hi'
              ? 'दैनिक स्टाफ हाजिरी (1-Click), मासिक वेतन, जनरेटर डीजल स्टॉक एवं टेंट-कुर्सी इन्वेंट्री'
              : 'Daily 1-click attendance, salary advances, generator fuel stock, and banquet assets'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-center">
            <span className="block text-xl font-black text-emerald-700">{presentCount} / {staff.length}</span>
            <span className="text-[10px] text-emerald-800 font-semibold">{lang === 'hi' ? 'आज उपस्थित स्टाफ' : 'Staff Present'}</span>
          </div>
          <div className="bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl text-center">
            <span className="block text-xl font-black text-slate-900">{formatINR(totalMonthlyPayroll)}</span>
            <span className="text-[10px] text-slate-600 font-semibold">{lang === 'hi' ? 'मासिक पेरोल' : 'Monthly Payroll'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
        {/* LEFT COLUMN: STAFF ROSTER & ATTENDANCE (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 min-w-0">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              <span>{lang === 'hi' ? 'स्टाफ हाजिरी रजिस्टर (1-Click Attendance)' : 'Staff Attendance Register'}</span>
            </h2>
            <span className="text-xs text-slate-500">{lang === 'hi' ? 'बटन दबाकर हाजिरी बदलें' : 'Tap to toggle state'}</span>
          </div>

          <div className="space-y-3">
            {staff.map((s) => {
              const isPresent = s.attendance_today === 'present';
              const isAbsent = s.attendance_today === 'absent';
              const isHalf = s.attendance_today === 'half_day';

              return (
                <div
                  key={s.id}
                  className="bg-slate-50 hover:bg-slate-100/70 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition min-w-0"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold text-slate-900">{s.name}</span>
                      <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                        {getRoleLabel(s.role)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 text-xs text-slate-500 mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{s.phone}</span>
                      </span>
                      <span>•</span>
                      <span>{lang === 'hi' ? 'मासिक वेतन:' : 'Salary:'} <strong className="text-slate-800">{formatINR(s.monthly_salary)}</strong></span>
                      {s.advance_taken > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-amber-700 font-semibold">{lang === 'hi' ? 'उठाव एडवांस:' : 'Advance:'} {formatINR(s.advance_taken)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Attendance Toggle Pill Button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStaffAttendance(s.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 shadow-sm ${
                        isPresent
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                          : isHalf
                          ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500'
                          : 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600'
                      }`}
                    >
                      {isPresent && <span>🟢 {lang === 'hi' ? 'उपस्थित (Present)' : 'Present'}</span>}
                      {isHalf && <span>🟡 {lang === 'hi' ? 'आधा दिन (Half-Day)' : 'Half-Day'}</span>}
                      {isAbsent && <span>🔴 {lang === 'hi' ? 'अनुपस्थित (Absent)' : 'Absent'}</span>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: GENERATOR DIESEL & INVENTORY (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Generator Diesel Control Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
              <Fuel className="w-5 h-5 text-amber-500" />
              <span>{lang === 'hi' ? 'जनरेटर डीजल स्टॉक (DG Fuel)' : 'Generator Fuel Status'}</span>
            </h3>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">125 kVA Main DG</span>
                  <span className="text-[11px] text-slate-500">Kirloskar Silent Generator</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-amber-600 font-mono">
                    {assets.find((a) => a.id === 'ast-1')?.quantity || 380} L
                  </span>
                  <span className="text-[10px] text-emerald-700 block font-semibold">✓ {lang === 'hi' ? 'स्टॉक पर्याप्त' : 'Fuel OK'}</span>
                </div>
              </div>

              {/* Quick Diesel Refill Box */}
              <div className="pt-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'नया डीजल भरें (Liters में):' : 'Add Refill Diesel (Liters):'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={fuelToAdd}
                    onChange={(e) => setFuelToAdd(e.target.value)}
                    className="w-24 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-bold outline-none focus:border-indigo-600"
                  />
                  <button
                    onClick={() => handleRefillFuel('ast-1')}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold py-1.5 px-3 rounded-lg shadow-sm transition"
                  >
                    + {lang === 'hi' ? 'स्टॉक जोड़ें' : 'Add Stock'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Banqueting & Event Assets */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
              <Package className="w-5 h-5 text-indigo-600" />
              <span>{lang === 'hi' ? 'मैरिज गार्डन एसेट्स व कुर्सियां' : 'Banquet Furniture Assets'}</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">{lang === 'hi' ? 'गोल्डन चियावरी कुर्सियां:' : 'Golden Chiavari Chairs:'}</span>
                <strong className="text-slate-900 font-mono font-bold">1,200 Pcs</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">{lang === 'hi' ? 'राउंड डाइनिंग टेबल्स (6ft):' : 'Round Dining Tables (6ft):'}</span>
                <strong className="text-slate-900 font-mono font-bold">85 Tables</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">{lang === 'hi' ? 'अतिरिक्त गद्दे व रजाई सेट:' : 'Extra Mattress & Quilt Sets:'}</span>
                <strong className="text-slate-900 font-mono font-bold">60 Sets</strong>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">{lang === 'hi' ? 'सोफा वीआईपी सेट:' : 'VIP Lounge Sofa Sets:'}</span>
                <strong className="text-slate-900 font-mono font-bold">24 Pairs</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
