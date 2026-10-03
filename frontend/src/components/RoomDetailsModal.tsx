'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Room, RoomStatus, RoomType, RoomOrderItem } from '@/types/database';
import { 
  X, 
  User, 
  Phone, 
  Calendar, 
  Clock, 
  UtensilsCrossed, 
  CreditCard, 
  CheckCircle2, 
  LogOut, 
  LogIn, 
  Plus, 
  BedDouble, 
  ShieldCheck, 
  Wrench,
  Receipt,
  FileText,
  Coffee,
  PackageCheck,
  Users,
  MapPin,
  Compass,
  Edit3,
  Save,
  Check,
  Building
} from 'lucide-react';

interface RoomDetailsModalProps {
  room: Room | null;
  onClose: () => void;
  onOpenCheckIn?: (room: Room) => void;
}

export default function RoomDetailsModal({ room, onClose, onOpenCheckIn }: RoomDetailsModalProps) {
  const { lang, t, formatINR, checkOutRoom, updateRoomStatus, addRoomOrder, updateGuestDetails } = useApp();

  // Quick Order State
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [selectedQuickItem, setSelectedQuickItem] = useState('Ginger Masala Chai');
  const [customItemName, setCustomItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('30');
  const [itemQuantity, setItemQuantity] = useState('2');

  // Customer Details Edit State
  const [isEditingGuest, setIsEditingGuest] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAadhaar, setEditAadhaar] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editPurpose, setEditPurpose] = useState('');
  const [editNumGuests, setEditNumGuests] = useState('2');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const guest = room?.current_guest;

  useEffect(() => {
    if (guest) {
      setEditName(guest.name || '');
      setEditPhone(guest.phone || '');
      setEditAadhaar(guest.id_proof || '');
      setEditAddress(guest.address || '');
      setEditPurpose(guest.purpose_of_visit || '');
      setEditNumGuests((guest.num_guests || 2).toString());
    }
  }, [guest, room]);

  if (!room) return null;

  const isOcc = room.status === 'occupied';
  const isRes = room.status === 'reserved';
  const isBooked = isOcc || isRes;

  const getRoomTypeLabel = (type: RoomType) => {
    switch (type) {
      case 'deluxe_ac': return lang === 'hi' ? 'डीलक्स एसी रूम' : 'Deluxe AC Room';
      case 'super_deluxe': return lang === 'hi' ? 'सुपर डीलक्स एसी रूम' : 'Super Deluxe AC Room';
      case 'bridal_suite': return lang === 'hi' ? 'शाही ब्राइडल सुइट' : 'Royal Bridal Suite';
      case 'family_suite': return lang === 'hi' ? 'फैमिली 4-बेड सुइट' : 'Family Suite';
    }
  };

  const getStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case 'occupied':
        return { label: lang === 'hi' ? '🔴 अतिथि मौजूद (Occupied)' : '🔴 Occupied', bg: 'bg-rose-50 text-rose-800 border-rose-200' };
      case 'reserved':
        return { label: lang === 'hi' ? '🟡 आरक्षित (Reserved)' : '🟡 Reserved', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'vacant_clean':
        return { label: lang === 'hi' ? '🟢 खाली व तैयार (Vacant Ready)' : '🟢 Vacant Clean', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'cleaning':
        return { label: lang === 'hi' ? '🧹 सफाई जारी (Housekeeping)' : '🧹 Housekeeping', bg: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'maintenance':
        return { label: lang === 'hi' ? '🔧 मरम्मत (Maintenance)' : '🔧 Under Maintenance', bg: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
  };

  const quickItemPresets = [
    { name: 'Ginger Masala Chai (2 Cups)', price: 60 },
    { name: 'Special Filter Coffee', price: 50 },
    { name: 'Bisleri Mineral Water 1L', price: 20 },
    { name: 'Poha & Jalebi Breakfast', price: 120 },
    { name: 'Aloo Pyaz Paratha with Curd', price: 110 },
    { name: 'Mix Veg Pakoda Platter', price: 160 },
    { name: 'Paneer Butter Masala + Rotis', price: 320 },
    { name: 'Extra AC Mattress & Blanket Set', price: 400 },
    { name: 'Cold Drink (Thumbs Up / Sprite)', price: 50 },
  ];

  const purposePresets = lang === 'hi' ? [
    'शादी समारोह (Wedding)',
    'व्यापार / आधिकारिक कार्य',
    'पारिवारिक अवकाश व भ्रमण',
    'व्यक्तिगत यात्रा'
  ] : [
    'Wedding Ceremony',
    'Business / Official Work',
    'Family Vacation & Holiday',
    'Personal & Leisure Visit'
  ];

  const handleQuickItemSelect = (preset: typeof quickItemPresets[0]) => {
    setSelectedQuickItem(preset.name);
    setCustomItemName('');
    setItemPrice(preset.price.toString());
  };

  const handleAddOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = customItemName.trim() || selectedQuickItem;
    const finalPrice = parseFloat(itemPrice) || 0;
    const finalQty = parseInt(itemQuantity) || 1;

    if (!finalName || finalPrice <= 0 || finalQty <= 0) {
      alert(lang === 'hi' ? 'कृपया सही आइटम और मूल्य दर्ज करें' : 'Please provide valid item and price');
      return;
    }

    addRoomOrder(room.room_number, {
      item_name: finalName,
      quantity: finalQty,
      price: finalPrice,
    });

    setShowAddOrder(false);
    setCustomItemName('');
  };

  const handleSaveGuestDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;

    updateGuestDetails(room.room_number, {
      name: editName.trim() || guest?.name,
      phone: editPhone.trim() || guest?.phone,
      id_proof: editAadhaar.trim() || undefined,
      address: editAddress.trim() || undefined,
      purpose_of_visit: editPurpose.trim() || undefined,
      num_guests: parseInt(editNumGuests) || 2,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
    setIsEditingGuest(false);
  };

  const handleCheckout = () => {
    if (confirm(lang === 'hi' 
      ? `क्या आप रूम #${room.room_number} का चेक-आउट करना चाहते हैं? कुल बकाया राशि चुकता कर ली गई है?` 
      : `Complete check-out for Room #${room.room_number}? Verify total settlement.`)) {
      checkOutRoom(room.room_number);
      onClose();
    }
  };

  const orders = guest?.orders || [];
  const ordersTotal = orders.reduce((sum, o) => sum + (o.price * o.quantity), 0);
  const balanceDue = guest ? Math.max(0, guest.total_bill - guest.paid_amount) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-2.5 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto sm:my-8 min-w-0">
        
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-800">
              <BedDouble className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {lang === 'hi' ? `कमरा #${room.room_number}` : `Room #${room.room_number}`}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-bold border shrink-0 ${getStatusBadge(room.status).bg}`}>
                  {getStatusBadge(room.status).label}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5 truncate">
                {getRoomTypeLabel(room.type)} • {lang === 'hi' ? `मंजिल ${room.floor}` : `Floor ${room.floor}`} • {formatINR(room.rate_per_day)}/day
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 max-h-[80vh] overflow-y-auto min-w-0">

          {/* 1. IF ROOM IS BOOKED / OCCUPIED / RESERVED */}
          {isBooked && guest ? (
            <>
              {/* GUEST PROFILE & STAY DETAILS CARD */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
                
                {/* Header of Customer Details */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      {lang === 'hi' ? 'अतिथि विवरण व पहचान (Customer Details)' : 'Customer & Stay Details'}
                    </span>
                    {saveSuccess && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 animate-in fade-in">
                        <Check className="w-3 h-3" />
                        <span>Saved Successfully</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditingGuest(!isEditingGuest)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 transition text-slate-700"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{isEditingGuest ? (lang === 'hi' ? 'रद्द करें' : 'Cancel Edit') : (lang === 'hi' ? 'विवरण बदलें / भरें' : 'Edit / Fill Details')}</span>
                  </button>
                </div>

                {/* EDITING FORM */}
                {isEditingGuest ? (
                  <form onSubmit={handleSaveGuestDetails} className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-900">
                        {lang === 'hi' ? 'अतिथि की जानकारी भरें या अपडेट करें:' : 'Update or Fill Customer Details:'}
                      </span>
                      <span className="text-[11px] text-slate-500">All fields saved to system</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {lang === 'hi' ? 'अतिथि का नाम (Customer Name)' : 'Customer Full Name'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-indigo-600 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {lang === 'hi' ? 'मोबाइल नंबर (Phone Number)' : 'Mobile / Phone Number'} *
                        </label>
                        <input
                          type="tel"
                          required
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-indigo-600 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {lang === 'hi' ? 'आधार कार्ड / आईडी नंबर (Aadhaar Details)' : 'Aadhaar / Govt ID Details'}
                        </label>
                        <input
                          type="text"
                          placeholder={lang === 'hi' ? "उदा. Aadhaar: 4829-1029-4821" : "e.g. Aadhaar: 4829-1029-4821"}
                          value={editAadhaar}
                          onChange={(e) => setEditAadhaar(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-indigo-600 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {lang === 'hi' ? 'कमरे में कितने लोग हैं? (Pax Count)' : 'How Many People in Room (Pax)'} *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          required
                          value={editNumGuests}
                          onChange={(e) => setEditNumGuests(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-indigo-600 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        {lang === 'hi' ? 'आने का कारण / उद्देश्य (Reason of Visit)' : 'Reason / Purpose of Visit'}
                      </label>
                      <input
                        type="text"
                        placeholder={lang === 'hi' ? "उदा. शादी समारोह, व्यापार, अवकाश" : "e.g. Wedding Ceremony, Business, Vacation"}
                        value={editPurpose}
                        onChange={(e) => setEditPurpose(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-indigo-600"
                      />
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {purposePresets.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setEditPurpose(preset)}
                            className="text-[10px] px-2 py-0.5 bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 rounded transition"
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        {lang === 'hi' ? 'पूरा पता (Full Address)' : 'Full Residential / Official Address'}
                      </label>
                      <textarea
                        rows={2}
                        placeholder={lang === 'hi' ? "उदा. फ्लैट/प्लॉट नं, गली, शहर, राज्य, पिन कोड" : "e.g. Flat/Plot No., Street, City, State, PIN Code"}
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-indigo-600 resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setIsEditingGuest(false)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700"
                      >
                        {t.close}
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'विवरण सहेजें' : 'Save Details'}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* VIEWING MODE */
                  <div className="space-y-4">
                    {/* Top Row: Name, Phone & Timings */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{lang === 'hi' ? 'ग्राहक का नाम' : 'Guest Name'}</span>
                        <span className="text-base font-black text-slate-900">{guest.name}</span>
                        <a
                          href={`tel:${guest.phone}`}
                          className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold mt-1"
                        >
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{guest.phone}</span>
                        </a>
                      </div>

                      {/* Check-In & Expected Check-Out Timings */}
                      <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 flex items-center gap-1">
                            <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{lang === 'hi' ? 'चेक-इन:' : 'Check-In:'}</span>
                          </span>
                          <strong className="text-slate-900 font-bold">{guest.check_in}</strong>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                          <span className="text-slate-500 flex items-center gap-1">
                            <LogOut className="w-3.5 h-3.5 text-rose-600" />
                            <span>{lang === 'hi' ? 'अपेक्षित चेक-आउट:' : 'Expected Check-Out:'}</span>
                          </span>
                          <strong className="text-slate-900 font-bold">
                            {guest.check_out || '2026-10-02 11:00 AM'}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Middle Row: Aadhaar Details, Number of People (Pax), & Reason of Visit */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Aadhaar Details */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500 mb-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{lang === 'hi' ? 'आधार कार्ड / आईडी' : 'Aadhaar / ID Proof'}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-900 block truncate">
                          {guest.id_proof || (
                            <button
                              type="button"
                              onClick={() => setIsEditingGuest(true)}
                              className="text-indigo-600 hover:underline font-semibold"
                            >
                              + Add Aadhaar
                            </button>
                          )}
                        </span>
                      </div>

                      {/* Number of People (Pax) */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500 mb-1">
                          <Users className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{lang === 'hi' ? 'कमरे में लोग' : 'People in Room (Pax)'}</span>
                        </div>
                        <span className="text-xs font-black text-slate-900 block">
                          {guest.num_guests ? `${guest.num_guests} Persons / Guests` : '2 Persons'}
                        </span>
                      </div>

                      {/* Reason of Visit */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500 mb-1">
                          <Compass className="w-3.5 h-3.5 text-amber-600" />
                          <span>{lang === 'hi' ? 'आने का कारण' : 'Reason of Visit'}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-900 block truncate" title={guest.purpose_of_visit}>
                          {guest.purpose_of_visit || (
                            <button
                              type="button"
                              onClick={() => setIsEditingGuest(true)}
                              className="text-indigo-600 hover:underline font-semibold"
                            >
                              + Add Reason
                            </button>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Full Address */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2.5">
                      <div className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4 text-rose-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                          {lang === 'hi' ? 'ग्राहक का पूरा पता (Full Residential Address)' : 'Customer Full Address'}
                        </span>
                        <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                          {guest.address || (
                            <span className="text-slate-400 italic">
                              Address not provided yet.{' '}
                              <button
                                type="button"
                                onClick={() => setIsEditingGuest(true)}
                                className="text-indigo-600 not-italic font-bold hover:underline"
                              >
                                Fill Full Address
                              </button>
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. THINGS ORDERED / ROOM SERVICE ORDERS SECTION */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-amber-600" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {lang === 'hi' ? 'कमरे में ऑर्डर की गई सामग्री (Room Service & Orders)' : 'Items & Food Ordered by Guest'}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {lang === 'hi' ? 'चाय, नाश्ता, भोजन, मिनरल वाटर व अतिरिक्त गद्दा ऑर्डर' : 'Room food service, beverages, extra mattress orders'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAddOrder(!showAddOrder)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1 transition shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? '+ नया ऑर्डर जोड़ें' : '+ Add Order'}</span>
                  </button>
                </div>

                {/* ADD ORDER INLINE DRAWER */}
                {showAddOrder && (
                  <form onSubmit={handleAddOrderSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 animate-in fade-in duration-200">
                    <span className="text-xs font-bold text-slate-800 block">
                      {lang === 'hi' ? 'त्वरित सामग्री चुनें या नाम लिखें:' : 'Quick Select or Enter Custom Order:'}
                    </span>

                    {/* Quick Presets */}
                    <div className="flex flex-wrap gap-1.5">
                      {quickItemPresets.map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => handleQuickItemSelect(p)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition ${
                            selectedQuickItem === p.name && !customItemName
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {p.name} ({formatINR(p.price)})
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          {lang === 'hi' ? 'आइटम नाम (कस्टम)' : 'Custom Item Name'}
                        </label>
                        <input
                          type="text"
                          placeholder={lang === 'hi' ? "उदा. पोहा, कोल्ड ड्रिंक" : "e.g. Tea, Cold drink, Snacks"}
                          value={customItemName}
                          onChange={(e) => setCustomItemName(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-indigo-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          {lang === 'hi' ? 'मात्रा (Quantity)' : 'Quantity'}
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={itemQuantity}
                          onChange={(e) => setItemQuantity(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-indigo-600 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          {lang === 'hi' ? 'दर प्रति यूनिट (₹)' : 'Price / Unit (₹)'}
                        </label>
                        <input
                          type="number"
                          min="10"
                          step="10"
                          required
                          value={itemPrice}
                          onChange={(e) => setItemPrice(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-indigo-600 font-bold"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddOrder(false)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700"
                      >
                        {t.close}
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                      >
                        {lang === 'hi' ? '✓ ऑर्डर बिल में जोड़ें' : '✓ Add to Room Bill'}
                      </button>
                    </div>
                  </form>
                )}

                {/* ORDERS TABLE */}
                {orders.length > 0 ? (
                  <div className="border border-slate-200 rounded-xl overflow-x-auto text-xs w-full min-w-0">
                    <table className="w-full text-left min-w-[360px]">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase">
                        <tr>
                          <th className="py-2.5 px-3">{lang === 'hi' ? 'ऑर्डर की गई वस्तु' : 'Item Description'}</th>
                          <th className="py-2.5 px-3 text-center">{lang === 'hi' ? 'समय' : 'Time'}</th>
                          <th className="py-2.5 px-3 text-center">{lang === 'hi' ? 'मात्रा' : 'Qty'}</th>
                          <th className="py-2.5 px-3 text-right">{lang === 'hi' ? 'दर' : 'Rate'}</th>
                          <th className="py-2.5 px-3 text-right">{lang === 'hi' ? 'कुल' : 'Total'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              <span>{ord.item_name}</span>
                            </td>
                            <td className="py-2.5 px-3 text-center text-slate-500 text-[11px]">
                              {ord.ordered_at}
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                              {ord.quantity}
                            </td>
                            <td className="py-2.5 px-3 text-right text-slate-600">
                              {formatINR(ord.price)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono">
                              {formatINR(ord.price * ord.quantity)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-slate-50 font-bold border-t border-slate-200 text-slate-800">
                          <td colSpan={4} className="py-2 px-3 text-right text-slate-600">
                            {lang === 'hi' ? 'कुल रूम सर्विस जोड़:' : 'Total Room Orders:'}
                          </td>
                          <td className="py-2 px-3 text-right font-black text-indigo-700">
                            {formatINR(ordersTotal)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                    {lang === 'hi' ? 'अभी कोई रूम सर्विस / फूड ऑर्डर नहीं है।' : 'No room service or food orders recorded yet.'}
                  </div>
                )}
              </div>

              {/* 3. TOTAL BILL & PAYMENT SETTLEMENT CARD */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-indigo-600" />
                    <span>{lang === 'hi' ? 'बिल व भुगतान स्थिति' : 'Billing & Payment Breakdown'}</span>
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    balanceDue <= 0 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {balanceDue <= 0 ? (lang === 'hi' ? 'पूर्ण चुकता' : 'Paid in Full') : (lang === 'hi' ? 'बकाया देय' : 'Balance Pending')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">{lang === 'hi' ? 'कुल बिल' : 'Gross Bill'}</span>
                    <span className="text-lg font-black text-slate-900 mt-0.5 block">{formatINR(guest.total_bill)}</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-2xs">
                    <span className="text-[10px] text-emerald-800 uppercase font-bold block">{lang === 'hi' ? 'जमा रकम' : 'Paid Advance'}</span>
                    <span className="text-lg font-black text-emerald-700 mt-0.5 block">{formatINR(guest.paid_amount)}</span>
                  </div>

                  <div className={`p-3 rounded-lg border shadow-2xs ${balanceDue > 0 ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'}`}>
                    <span className={`text-[10px] uppercase font-bold block ${balanceDue > 0 ? 'text-rose-800' : 'text-slate-500'}`}>
                      {lang === 'hi' ? 'बाकी बकाया' : 'Due Balance'}
                    </span>
                    <span className={`text-lg font-black mt-0.5 block ${balanceDue > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {formatINR(balanceDue)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* VACANT / READY ROOM VIEW */
            <div className="py-8 text-center bg-emerald-50/50 rounded-2xl border border-emerald-200 p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto text-xl font-bold">
                ✓
              </div>
              <h3 className="text-lg font-bold text-emerald-950">
                {lang === 'hi' ? 'यह कमरा पूरी तरह खाली व साफ है' : 'This Room is Vacant & Ready'}
              </h3>
              <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                {lang === 'hi' 
                  ? 'हाउसकीपिंग द्वारा कमरा साफ और सेनेटाइज्ड है। आप तुरंत नए अतिथि को चेक-इन करवा सकते हैं।' 
                  : 'Room is cleaned and sanitized. Ready for immediate guest check-in.'}
              </p>
              {onOpenCheckIn && (
                <div className="pt-2">
                  <button
                    onClick={() => { onClose(); onOpenCheckIn(room); }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{lang === 'hi' ? '+ नया चेक-इन दर्ज करें' : '+ Check-In New Guest'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODAL FOOTER ACTIONS */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs transition"
          >
            {t.close}
          </button>

          {isOcc && (
            <button
              onClick={handleCheckout}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex items-center gap-1.5 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>{lang === 'hi' ? 'कमरा चेक-आउट करें' : 'Check-Out & Settlement'}</span>
            </button>
          )}

          {room.status === 'cleaning' && (
            <button
              onClick={() => { updateRoomStatus(room.room_number, 'vacant_clean'); onClose(); }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'hi' ? 'सफाई पूर्ण (Release to Vacant)' : 'Mark Clean & Ready'}</span>
            </button>
          )}

          {room.status === 'maintenance' && (
            <button
              onClick={() => { updateRoomStatus(room.room_number, 'vacant_clean'); onClose(); }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5 transition"
            >
              <Wrench className="w-4 h-4" />
              <span>{lang === 'hi' ? 'मरम्मत समाप्त (Release)' : 'Release Maintenance'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
