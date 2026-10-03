'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { 
  PlusCircle, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  Calculator, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Users,
  CalendarCheck,
  MapPin,
  MessageCircle,
  Compass
} from 'lucide-react';
import { EventType, TimeSlot } from '@/types/database';
import { getShubhMuhurat } from '@/data/shubhMuhurat';

function NewBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, t, addBooking, checkSlotConflict, formatINR } = useApp();

  const prefilledDate = searchParams.get('date') || '2026-10-15';
  const prefilledSlot = (searchParams.get('slot') as TimeSlot) || 'evening';

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSameWhatsapp, setIsSameWhatsapp] = useState(true);
  const [address, setAddress] = useState('');
  const [bookingReason, setBookingReason] = useState('Marriage / Wedding Ceremony');
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [eventDate, setEventDate] = useState(prefilledDate);
  const [timeSlot, setTimeSlot] = useState<TimeSlot>(prefilledSlot);
  const [guests, setGuests] = useState('500');
  const [totalAmount, setTotalAmount] = useState('350000');
  const [advancePaid, setAdvancePaid] = useState('100000');
  const [notes, setNotes] = useState('');

  // Conflict state
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Auto-calculated balance
  const parsedTotal = parseFloat(totalAmount) || 0;
  const parsedAdvance = parseFloat(advancePaid) || 0;
  const balanceDue = Math.max(0, parsedTotal - parsedAdvance);

  // Validate conflict whenever date or slot changes
  useEffect(() => {
    const result = checkSlotConflict(eventDate, timeSlot);
    if (result.conflict) {
      setConflictWarning(result.message || 'Slot conflict detected!');
    } else {
      setConflictWarning(null);
    }
  }, [eventDate, timeSlot, checkSlotConflict]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (conflictWarning) {
      alert(lang === 'hi' ? '⚠️ तारीख और समय पहले से बुक है!' : '⚠️ Selected slot is already booked!');
      return;
    }

    if (!customerName.trim() || !phone.trim() || parsedTotal <= 0) {
      alert(lang === 'hi' ? 'कृपया सभी जरूरी विवरण भरें!' : 'Please complete all required fields!');
      return;
    }

    const finalWhatsapp = isSameWhatsapp ? phone.trim() : (whatsapp.trim() || phone.trim());

    const res = addBooking(
      {
        customer_name: customerName.trim(),
        phone: phone.trim(),
        whatsapp: finalWhatsapp,
        is_whatsapp_same: isSameWhatsapp,
        address: address.trim() || undefined,
        booking_reason: bookingReason.trim() || undefined,
        event_type: eventType,
        event_date: eventDate,
        time_slot: timeSlot,
        guests: parseInt(guests) || 100,
        total_amount: parsedTotal,
        advance_paid: parsedAdvance,
        status: parsedAdvance > 0 ? 'confirmed' : 'pending',
        notes: notes.trim() || null,
      },
      parsedAdvance
    );

    if (res.success) {
      alert(lang === 'hi' ? '✅ बुकिंग सफलतापूर्वक दर्ज हो गई!' : '✅ Booking confirmed successfully!');
      router.push('/bookings');
    } else {
      alert(res.error || 'Error adding booking');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* TOP HEADER */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/calendar"
          className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-bold text-xs bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'कैलेंडर पर लौटें' : 'Back to Calendar'}</span>
        </Link>

        <h1 className="text-2xl font-black text-slate-900 text-right">
          {lang === 'hi' ? 'नई विवाह / समारोह बुकिंग' : 'New Event Booking'}
        </h1>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        {/* CONFLICT WARNING BANNER */}
        {conflictWarning ? (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-rose-900">
                {lang === 'hi' ? '⚠️ तारीख पहले से बुक है!' : '⚠️ Slot Conflict Detected!'}
              </div>
              <div className="text-xs mt-0.5 text-rose-700">
                {conflictWarning}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl flex items-center gap-2.5 mb-6 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{lang === 'hi' ? 'यह तारीख और समय खाली है, आप सुरक्षित रूप से बुक कर सकते हैं।' : 'This date & slot is currently available for reservation.'}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: CUSTOMER DETAILS */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span>{lang === 'hi' ? '1. ग्राहक / आयोजक परिवार की जानकारी (Customer Details)' : '1. Customer & Contact Details'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'ग्राहक का नाम' : 'Customer Name'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'hi' ? "उदा. राजेश कुमार शर्मा" : "e.g. Rajesh Kumar Sharma"}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-sm font-medium p-2.5 bg-white border border-slate-300 rounded-xl focus:border-indigo-600 outline-none text-slate-900 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'मोबाइल नंबर (Mobile No.)' : 'Mobile Number'} *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98290 12345"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (isSameWhatsapp) setWhatsapp(e.target.value);
                  }}
                  className="w-full text-sm font-medium p-2.5 bg-white border border-slate-300 rounded-xl focus:border-indigo-600 outline-none text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>

            {/* WhatsApp Number & "Both are same" checkbox */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'hi' ? 'व्हाट्सएप नंबर (WhatsApp No.)' : 'WhatsApp Number'}</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={isSameWhatsapp}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setIsSameWhatsapp(checked);
                      if (checked) setWhatsapp(phone);
                    }}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span>{lang === 'hi' ? 'मोबाइल नंबर ही व्हाट्सएप है (Both are same)' : 'Both are same (Same as Mobile)'}</span>
                </label>
              </div>

              {isSameWhatsapp ? (
                <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{lang === 'hi' ? 'व्हाट्सएप और मोबाइल दोनों एक ही हैं:' : 'Both Mobile and WhatsApp numbers are same:'}</span>
                  <strong className="font-mono">{phone || '+91 98290 12345'}</strong>
                </div>
              ) : (
                <input
                  type="tel"
                  placeholder={lang === 'hi' ? "+91 98290 54321 (अलग व्हाट्सएप नंबर)" : "+91 98290 54321 (Separate WhatsApp No.)"}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full text-sm font-medium p-2.5 bg-white border border-slate-300 rounded-xl focus:border-indigo-600 outline-none text-slate-900 placeholder-slate-400"
                />
              )}
            </div>

            {/* Reason of Booking */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                <span>{lang === 'hi' ? 'बुकिंग का कारण / उद्देश्य (Reason of Booking)' : 'Reason / Purpose of Booking'} *</span>
              </label>
              <input
                type="text"
                required
                placeholder={lang === 'hi' ? "उदा. विवाह समारोह, सगाई, रिसेप्शन" : "e.g. Marriage Ceremony, Ring Ceremony, Reception"}
                value={bookingReason}
                onChange={(e) => setBookingReason(e.target.value)}
                className="w-full text-sm font-medium p-2.5 bg-white border border-slate-300 rounded-xl focus:border-indigo-600 outline-none text-slate-900 placeholder-slate-400"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(lang === 'hi' ? [
                  'विवाह समारोह (Marriage Ceremony)',
                  'सगाई / रोका (Ring Ceremony)',
                  'रिसेप्शन एवं प्रीतिभोज (Wedding Reception)',
                  'महिला संगीत (Sangeet)',
                  'पारिवारिक उत्सव (Family Celebration)'
                ] : [
                  'Marriage Ceremony',
                  'Tilak / Ring Ceremony',
                  'Wedding Reception & Dinner',
                  'Sangeet & Musical Evening',
                  'Birthday / Family Celebration'
                ]).map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setBookingReason(reason)}
                    className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-lg transition"
                  >
                    + {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Residential Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{lang === 'hi' ? 'ग्राहक का पूरा पता (Full Residential Address)' : 'Customer Full Address'} *</span>
              </label>
              <textarea
                rows={2}
                required
                placeholder={lang === 'hi' ? "उदा. मकान/प्लॉट नं. 42, टोंक रोड, जयपुर, राजस्थान" : "e.g. House/Plot No. 42, Tonk Road, Jaipur, Rajasthan - 302022"}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-sm font-medium p-2.5 bg-white border border-slate-300 rounded-xl focus:border-indigo-600 outline-none text-slate-900 placeholder-slate-400 resize-none"
              />
            </div>
          </div>

          {/* SECTION 2: EVENT DETAILS */}
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>{lang === 'hi' ? '2. कार्यक्रम एवं तारीख विवरण' : '2. Event Details'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'कार्यक्रम का प्रकार' : 'Event Type'}
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="w-full text-xs sm:text-sm font-medium p-2.5 bg-white border border-slate-300 rounded-xl focus:border-indigo-600 outline-none text-slate-900"
                >
                  <option value="wedding">{t.eventWedding}</option>
                  <option value="engagement">{t.eventEngagement}</option>
                  <option value="reception">{t.eventReception}</option>
                  <option value="other">{t.eventOther}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'कार्यक्रम की तारीख' : 'Event Date'} *
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full text-xs sm:text-sm font-medium p-2.5 bg-white border border-slate-300 rounded-xl focus:border-indigo-600 outline-none text-slate-900"
                />
                {getShubhMuhurat(eventDate) && (
                  <div className="mt-1.5 p-2 rounded-lg bg-amber-50 border border-amber-300 flex items-center gap-1.5 text-[11px] font-bold text-amber-950 shadow-2xs">
                    <CalendarCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>
                      {lang === 'hi' 
                        ? `शुभ सावा: ${getShubhMuhurat(eventDate)?.nakshatraHi} (${getShubhMuhurat(eventDate)?.tithiHi})` 
                        : `Auspicious Muhurat: ${getShubhMuhurat(eventDate)?.nakshatraEn} (${getShubhMuhurat(eventDate)?.tithiEn})`}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'समय / स्लॉट' : 'Time Slot'} *
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value as TimeSlot)}
                  className="w-full text-xs sm:text-sm font-medium p-2.5 bg-white border border-slate-300 rounded-xl focus:border-indigo-600 outline-none text-slate-900"
                >
                  <option value="evening">{t.slotEvening}</option>
                  <option value="morning">{t.slotMorning}</option>
                  <option value="full day">{t.slotFullDay}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'अपेक्षित मेहमान संख्या' : 'Expected Guests'}
                </label>
                <input
                  type="number"
                  step="50"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full text-xs sm:text-sm font-medium p-2.5 bg-white border border-slate-300 rounded-xl outline-none text-slate-900 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'विशेष निर्देश / नोट्स' : 'Special Notes'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'hi' ? "उदा. 4 रूम चाहिए, मंडप में विशेष रोशनी" : "e.g. 4 AC rooms needed, special mandap lighting"}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 bg-white border border-slate-300 rounded-xl outline-none text-slate-900 placeholder-slate-400 focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: PRICING & AUTOMATIC BALANCE CALCULATOR */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <span>{lang === 'hi' ? '3. तय राशि एवं एडवांस भुगतान' : '3. Pricing & Advance'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'कुल तय राशि (₹)' : 'Total Amount (₹)'} *
                </label>
                <input
                  type="number"
                  required
                  step="5000"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="w-full text-base font-bold p-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:border-indigo-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-700 mb-1">
                  {lang === 'hi' ? 'एडवांस प्राप्त रकम (₹)' : 'Advance Received (₹)'}
                </label>
                <input
                  type="number"
                  step="5000"
                  value={advancePaid}
                  onChange={(e) => setAdvancePaid(e.target.value)}
                  className="w-full text-base font-bold p-2.5 bg-white border border-emerald-300 text-emerald-800 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              {/* AUTOMATIC BALANCE DISPLAY CARD */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-right">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  {lang === 'hi' ? 'स्वतः बाकी बकाया रकम' : 'Automatic Balance Due'}
                </span>
                <div
                  className={`text-lg font-black mt-0.5 ${
                    balanceDue <= 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {balanceDue <= 0 ? (
                    <span className="flex items-center justify-end gap-1 text-emerald-700 text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      {lang === 'hi' ? 'पूर्ण चुकता' : 'Paid in Full'}
                    </span>
                  ) : (
                    formatINR(balanceDue)
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={Boolean(conflictWarning)}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition active:scale-98 ${
                conflictWarning
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              <span>
                {conflictWarning
                  ? lang === 'hi'
                    ? 'तारीख टकराव - बुकिंग संभव नहीं'
                    : 'Conflict - Cannot Book'
                  : lang === 'hi'
                  ? '✓ बुकिंग सुरक्षित दर्ज करें'
                  : '✓ Confirm & Save Booking'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-500 font-semibold">Loading...</div>}>
      <NewBookingContent />
    </Suspense>
  );
}
