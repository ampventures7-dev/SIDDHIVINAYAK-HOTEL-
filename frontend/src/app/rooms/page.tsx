'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  BedDouble, 
  CheckCircle2, 
  Clock, 
  Phone, 
  User, 
  LogIn, 
  LogOut, 
  Sparkles, 
  Wrench, 
  X, 
  Filter, 
  DollarSign, 
  Building2, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { Room, RoomStatus, RoomType } from '@/types/database';
import RoomDetailsModal from '@/components/RoomDetailsModal';

export default function RoomsManagementPage() {
  const { lang, t, rooms, updateRoomStatus, checkInRoom, checkOutRoom, formatINR } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | RoomStatus>('all');
  const [floorFilter, setFloorFilter] = useState<'all' | 1 | 2>('all');

  // Check-In Modal
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedRoomForCheckIn, setSelectedRoomForCheckIn] = useState<Room | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestIdProof, setGuestIdProof] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [guestPurpose, setGuestPurpose] = useState('Attending Wedding Ceremony');
  const [guestPax, setGuestPax] = useState('2');
  const [roomTariff, setRoomTariff] = useState('');
  const [advancePaid, setAdvancePaid] = useState('');

  // Selected Room Details Modal
  const [selectedRoomDetails, setSelectedRoomDetails] = useState<Room | null>(null);

  // Status Counts
  const counts = useMemo(() => {
    return {
      all: rooms.length,
      vacant_clean: rooms.filter((r) => r.status === 'vacant_clean').length,
      occupied: rooms.filter((r) => r.status === 'occupied').length,
      reserved: rooms.filter((r) => r.status === 'reserved').length,
      cleaning: rooms.filter((r) => r.status === 'cleaning').length,
      maintenance: rooms.filter((r) => r.status === 'maintenance').length,
    };
  }, [rooms]);

  // Filtered Rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (floorFilter !== 'all' && r.floor !== floorFilter) return false;
      return true;
    });
  }, [rooms, statusFilter, floorFilter]);

  const handleOpenCheckIn = (room: Room) => {
    setSelectedRoomForCheckIn(room);
    setRoomTariff(room.rate_per_day.toString());
    setAdvancePaid(room.rate_per_day.toString());
    setGuestName('');
    setGuestPhone('');
    setGuestIdProof('');
    setGuestAddress('');
    setGuestPurpose('Attending Wedding Ceremony');
    setGuestPax('2');
    setShowCheckInModal(true);
  };

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomForCheckIn) return;
    if (!guestName.trim() || !guestPhone.trim()) {
      alert(lang === 'hi' ? 'कृपया गेस्ट का नाम और फोन नंबर दर्ज करें!' : 'Please enter guest name and phone number!');
      return;
    }

    const tariff = parseFloat(roomTariff) || selectedRoomForCheckIn.rate_per_day;
    const paid = parseFloat(advancePaid) || 0;

    checkInRoom(selectedRoomForCheckIn.room_number, {
      name: guestName.trim(),
      phone: guestPhone.trim(),
      id_proof: guestIdProof.trim() || undefined,
      address: guestAddress.trim() || undefined,
      purpose_of_visit: guestPurpose.trim() || undefined,
      num_guests: parseInt(guestPax) || 2,
      check_in: new Date().toISOString().slice(0, 16).replace('T', ' '),
      total_bill: tariff,
      paid_amount: paid,
    });

    setShowCheckInModal(false);
    setSelectedRoomForCheckIn(null);
  };

  const handleCheckOut = (roomNumber: string) => {
    if (confirm(lang === 'hi' ? `क्या आप रूम ${roomNumber} का चेकआउट करना चाहते हैं?` : `Check out room ${roomNumber}?`)) {
      checkOutRoom(roomNumber);
      setSelectedRoomDetails(null);
    }
  };

  const getStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case 'vacant_clean':
        return {
          label: lang === 'hi' ? 'खाली (Ready)' : 'Vacant Clean',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'occupied':
        return {
          label: lang === 'hi' ? 'अतिथि (Occupied)' : 'Occupied',
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
        };
      case 'reserved':
        return {
          label: lang === 'hi' ? 'आरक्षित (Reserved)' : 'Reserved',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
        };
      case 'cleaning':
        return {
          label: lang === 'hi' ? 'सफाई जारी' : 'Housekeeping',
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          dot: 'bg-indigo-500',
        };
      case 'maintenance':
        return {
          label: lang === 'hi' ? 'मरम्मत' : 'Maintenance',
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          dot: 'bg-slate-400',
        };
    }
  };

  const getRoomTypeLabel = (type: RoomType) => {
    switch (type) {
      case 'deluxe_ac': return lang === 'hi' ? 'डीलक्स एसी रूम' : 'Deluxe AC';
      case 'super_deluxe': return lang === 'hi' ? 'सुपर डीलक्स एसी' : 'Super Deluxe';
      case 'bridal_suite': return lang === 'hi' ? 'शाही ब्राइडल सुइट' : 'Bridal Suite';
      case 'family_suite': return lang === 'hi' ? 'फैमिली 4-बेड सुइट' : 'Family Suite';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 w-full min-w-0 overflow-hidden">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 w-full min-w-0">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            <span>{lang === 'hi' ? 'होटल रूम प्रबंधन प्रणाली (PMS)' : 'Hotel Property Management System'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {lang === 'hi' ? 'होटल रूम्स कंट्रोल बोर्ड (25 AC Rooms)' : '25 Hotel AC Rooms Live Grid'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'hi'
              ? 'रूम चेक-इन, चेक-आउट, लाइव सफाई स्टेटस एवं टैरिफ बिलिंग'
              : 'Live check-in, check-out, housekeeping status, and guest billing'}
          </p>
        </div>

        {/* Room KPI Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-center min-w-[75px] sm:min-w-[85px]">
            <span className="block text-lg sm:text-xl font-black text-emerald-700">{counts.vacant_clean}</span>
            <span className="text-[10px] text-emerald-800 font-semibold">{lang === 'hi' ? 'खाली रूम्स' : 'Vacant'}</span>
          </div>
          <div className="bg-rose-50 border border-rose-200 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-center min-w-[75px] sm:min-w-[85px]">
            <span className="block text-lg sm:text-xl font-black text-rose-700">{counts.occupied}</span>
            <span className="text-[10px] text-rose-800 font-semibold">{lang === 'hi' ? 'भरे हुए' : 'Occupied'}</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-center min-w-[75px] sm:min-w-[85px]">
            <span className="block text-lg sm:text-xl font-black text-amber-700">{counts.reserved}</span>
            <span className="text-[10px] text-amber-800 font-semibold">{lang === 'hi' ? 'आरक्षित' : 'Reserved'}</span>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-center min-w-[75px] sm:min-w-[85px]">
            <span className="block text-lg sm:text-xl font-black text-indigo-700">{counts.cleaning}</span>
            <span className="text-[10px] text-indigo-800 font-semibold">{lang === 'hi' ? 'सफाई में' : 'Cleaning'}</span>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 w-full min-w-0">
        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full min-w-0">
          {[
            { id: 'all', labelHi: 'सभी 25 रूम्स', labelEn: 'All Rooms', count: counts.all },
            { id: 'vacant_clean', labelHi: 'खाली (Vacant)', labelEn: 'Vacant Clean', count: counts.vacant_clean },
            { id: 'occupied', labelHi: 'भरे हुए (Occupied)', labelEn: 'Occupied', count: counts.occupied },
            { id: 'reserved', labelHi: 'आरक्षित (Reserved)', labelEn: 'Reserved', count: counts.reserved },
            { id: 'cleaning', labelHi: 'सफाई जारी', labelEn: 'Cleaning', count: counts.cleaning },
            { id: 'maintenance', labelHi: 'मेंटेनेंस', labelEn: 'Maintenance', count: counts.maintenance },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{lang === 'hi' ? tab.labelHi : tab.labelEn}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${statusFilter === tab.id ? 'bg-indigo-800 text-white' : 'bg-slate-200 text-slate-700'}`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Floor Filter */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="font-semibold">{lang === 'hi' ? 'फ्लोर:' : 'Floor:'}</span>
          <button
            onClick={() => setFloorFilter('all')}
            className={`px-2.5 py-1 rounded text-xs font-bold ${floorFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            {lang === 'hi' ? 'दोनों' : 'All'}
          </button>
          <button
            onClick={() => setFloorFilter(1)}
            className={`px-2.5 py-1 rounded text-xs font-bold ${floorFilter === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            {lang === 'hi' ? '1st फ्लोर' : 'Floor 1'}
          </button>
          <button
            onClick={() => setFloorFilter(2)}
            className={`px-2.5 py-1 rounded text-xs font-bold ${floorFilter === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            {lang === 'hi' ? '2nd फ्लोर' : 'Floor 2'}
          </button>
        </div>
      </div>

      {/* 25 ROOMS INTERACTIVE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredRooms.map((room) => {
          const badge = getStatusBadge(room.status);
          const isOccupied = room.status === 'occupied';
          const isVacant = room.status === 'vacant_clean';
          const isCleaning = room.status === 'cleaning';

          return (
            <div
              key={room.room_number}
              onClick={() => setSelectedRoomDetails(room)}
              className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 p-4 shadow-sm hover:shadow transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Room Number & Status */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-black text-slate-900 font-mono">
                      #{room.room_number}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      (Fl {room.floor})
                    </span>
                  </div>

                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    <span>{badge.label}</span>
                  </span>
                </div>

                {/* Room Type & Rate */}
                <div className="flex justify-between items-center text-xs mb-3">
                  <span className="text-slate-600 font-medium">{getRoomTypeLabel(room.type)}</span>
                  <span className="text-indigo-600 font-bold">{formatINR(room.rate_per_day)}/day</span>
                </div>

                {/* Guest Info if Occupied or Reserved */}
                {room.current_guest ? (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-3 space-y-1 text-xs">
                    <div className="font-bold text-slate-900 truncate flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{room.current_guest.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{room.current_guest.phone}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                      <span>{lang === 'hi' ? 'बिल:' : 'Bill:'} {formatINR(room.current_guest.total_bill)}</span>
                      <span className={room.current_guest.paid_amount >= room.current_guest.total_bill ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                        {room.current_guest.paid_amount >= room.current_guest.total_bill 
                          ? (lang === 'hi' ? 'चुकता' : 'Paid') 
                          : `${lang === 'hi' ? 'बाकी' : 'Due'} ${formatINR(room.current_guest.total_bill - room.current_guest.paid_amount)}`}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center text-slate-400 text-xs">
                    {isVacant ? (
                      <span className="text-emerald-700 font-medium">✓ {lang === 'hi' ? 'चेक-इन हेतु तैयार' : 'Ready for guest'}</span>
                    ) : isCleaning ? (
                      <span className="text-indigo-700 font-medium">🧹 {lang === 'hi' ? 'सफाई कर्मी कार्यरत' : 'Under cleaning'}</span>
                    ) : (
                      <span>{lang === 'hi' ? 'रूम ब्लॉक' : 'Blocked'}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                {isVacant && (
                  <button
                    onClick={() => handleOpenCheckIn(room)}
                    className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'चेक-इन करें' : 'Check-In'}</span>
                  </button>
                )}

                {isOccupied && (
                  <button
                    onClick={() => handleCheckOut(room.room_number)}
                    className="w-full py-1.5 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'चेक-आउट' : 'Check-Out'}</span>
                  </button>
                )}

                {isCleaning && (
                  <button
                    onClick={() => updateRoomStatus(room.room_number, 'vacant_clean')}
                    className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'सफाई पूरी (Mark Clean)' : 'Mark Ready'}</span>
                  </button>
                )}

                {room.status === 'reserved' && (
                  <button
                    onClick={() => handleOpenCheckIn(room)}
                    className="w-full py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'अतिथि चेक-इन' : 'Guest Check-In'}</span>
                  </button>
                )}

                {room.status === 'maintenance' && (
                  <button
                    onClick={() => updateRoomStatus(room.room_number, 'vacant_clean')}
                    className="w-full py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'मरम्मत समाप्त' : 'Release'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CHECK-IN MODAL */}
      {showCheckInModal && selectedRoomForCheckIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <LogIn className="w-5 h-5 text-emerald-600" />
                  <span>{lang === 'hi' ? `रूम #${selectedRoomForCheckIn.room_number} चेक-इन` : `Check-In Room #${selectedRoomForCheckIn.room_number}`}</span>
                </h2>
                <span className="text-xs text-indigo-600 font-semibold">
                  {getRoomTypeLabel(selectedRoomForCheckIn.type)} • Floor {selectedRoomForCheckIn.floor}
                </span>
              </div>
              <button
                onClick={() => setShowCheckInModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckInSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'hi' ? 'अतिथि / गेस्ट का नाम' : 'Guest Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'hi' ? "उदा. महेश जोशी" : "e.g. Mahesh Joshi"}
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'hi' ? 'मोबाइल नंबर' : 'Phone Number'} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98290 12345"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'hi' ? 'आधार कार्ड / आईडी नंबर (Aadhaar)' : 'Aadhaar / ID Proof'}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === 'hi' ? "उदा. 4829-1029-4821" : "e.g. 4829-1029-4821"}
                    value={guestIdProof}
                    onChange={(e) => setGuestIdProof(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'hi' ? 'कमरे में कितने लोग (Pax Count)' : 'Guests in Room (Pax)'} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={guestPax}
                    onChange={(e) => setGuestPax(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 text-slate-900 outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'आने का कारण / उद्देश्य (Reason of Visit)' : 'Reason / Purpose of Visit'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'hi' ? "उदा. शादी समारोह, व्यापार, अवकाश" : "e.g. Wedding Ceremony, Business Meeting, Vacation"}
                  value={guestPurpose}
                  onChange={(e) => setGuestPurpose(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'ग्राहक का पूरा पता (Full Residential Address)' : 'Customer Full Address'}
                </label>
                <textarea
                  rows={2}
                  placeholder={lang === 'hi' ? "उदा. फ्लैट/प्लॉट नं., गली, शहर, राज्य" : "e.g. Plot No., Street, City, State, PIN Code"}
                  value={guestAddress}
                  onChange={(e) => setGuestAddress(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 text-slate-900 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'hi' ? 'रूम किराया / दर (₹/दिन)' : 'Room Tariff (₹/Day)'} *
                  </label>
                  <input
                    type="number"
                    required
                    value={roomTariff}
                    onChange={(e) => setRoomTariff(e.target.value)}
                    className="w-full text-sm font-bold p-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-700 mb-1">
                    {lang === 'hi' ? 'प्राप्त एडवांस रकम (₹)' : 'Advance Received (₹)'}
                  </label>
                  <input
                    type="number"
                    value={advancePaid}
                    onChange={(e) => setAdvancePaid(e.target.value)}
                    className="w-full text-sm font-bold p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  {t.close}
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow"
                >
                  {lang === 'hi' ? '✓ चेक-इन कन्फर्म करें' : '✓ Confirm Check-In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE ROOM DETAILS & ORDERS MODAL */}
      {selectedRoomDetails && (
        <RoomDetailsModal
          room={rooms.find((r) => r.room_number === selectedRoomDetails.room_number) || selectedRoomDetails}
          onClose={() => setSelectedRoomDetails(null)}
          onOpenCheckIn={handleOpenCheckIn}
        />
      )}
    </div>
  );
}
