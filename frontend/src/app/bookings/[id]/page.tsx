'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { 
  ArrowLeft, 
  Phone, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  Printer, 
  Receipt, 
  Wallet, 
  CreditCard, 
  Banknote, 
  X, 
  FileCheck, 
  Share2, 
  Sparkles,
  MessageCircle,
  MapPin,
  Compass,
  Edit3,
  Save
} from 'lucide-react';
import { PaymentMode, TimeSlot, EventType, Payment } from '@/types/database';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const { 
    lang, 
    t, 
    bookings, 
    payments, 
    addPayment, 
    updateBookingDetails,
    formatINR, 
    currentDate 
  } = useApp();

  // Edit Customer Details Modal State
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editWhatsapp, setEditWhatsapp] = useState('');
  const [isSameWhatsapp, setIsSameWhatsapp] = useState(true);
  const [editAddress, setEditAddress] = useState('');
  const [editReason, setEditReason] = useState('');

  const booking = useMemo(() => {
    return bookings.find((b) => b.id === bookingId);
  }, [bookings, bookingId]);

  const bookingPayments = useMemo(() => {
    return payments
      .filter((p) => p.booking_id === bookingId)
      .sort((a, b) => b.payment_date.localeCompare(a.payment_date));
  }, [payments, bookingId]);

  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<Payment | null>(null);

  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(currentDate);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  const [paymentNote, setPaymentNote] = useState('');

  const handleOpenEditCustomer = () => {
    if (!booking) return;
    setEditCustomerName(booking.customer_name);
    setEditPhone(booking.phone);
    setEditWhatsapp(booking.whatsapp || booking.phone);
    setIsSameWhatsapp(booking.is_whatsapp_same !== undefined ? booking.is_whatsapp_same : (booking.whatsapp === booking.phone || !booking.whatsapp));
    setEditAddress(booking.address || '');
    setEditReason(booking.booking_reason || (booking.event_type === 'wedding' ? 'Marriage / Wedding Ceremony' : 'Banquet Celebration'));
    setShowEditCustomerModal(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    const finalWhatsapp = isSameWhatsapp ? editPhone.trim() : (editWhatsapp.trim() || editPhone.trim());
    updateBookingDetails(booking.id, {
      customer_name: editCustomerName.trim() || undefined,
      phone: editPhone.trim() || undefined,
      whatsapp: finalWhatsapp,
      is_whatsapp_same: isSameWhatsapp,
      address: editAddress.trim() || undefined,
      booking_reason: editReason.trim() || undefined,
    });
    setShowEditCustomerModal(false);
  };

  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-rose-600 mb-4">
          {lang === 'hi' ? 'बुकिंग नहीं मिली!' : 'Booking Not Found!'}
        </h1>
        <Link
          href="/bookings"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस जाएं' : 'Back to Bookings'}</span>
        </Link>
      </div>
    );
  }

  const totalAgreed = Number(booking.total_amount) || 0;
  const totalPaid = bookingPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  const balanceRemaining = Math.max(0, totalAgreed - totalPaid);
  const isFullySettled = balanceRemaining <= 0;

  const handleAddPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(paymentAmount) || 0;
    if (amt <= 0) {
      alert(lang === 'hi' ? 'कृपया सही भुगतान रकम भरें!' : 'Please enter valid payment amount!');
      return;
    }

    addPayment({
      booking_id: bookingId,
      amount: amt,
      payment_date: paymentDate,
      mode: paymentMode,
      note: paymentNote.trim() || undefined,
    });

    setShowAddPaymentModal(false);
    setPaymentAmount('');
    setPaymentNote('');
    alert(
      lang === 'hi'
        ? `✅ ₹ ${amt.toLocaleString('en-IN')} का भुगतान दर्ज हो गया!`
        : `✅ Payment of ₹ ${amt.toLocaleString('en-IN')} recorded successfully!`
    );
  };

  const handleOpenReceipt = (payment?: Payment) => {
    setSelectedPaymentForReceipt(payment || (bookingPayments[0] || null));
    setShowReceiptModal(true);
  };

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* TOP HEADER & NAVIGATION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/bookings"
          className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-bold text-xs bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'सभी बुकिंग रजिस्टर' : 'Back to Bookings'}</span>
        </Link>

        {/* TOP ACTION BUTTONS */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenReceipt()}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>{lang === 'hi' ? 'रसीद प्रिंट / डाउनलोड' : 'Official Receipt'}</span>
          </button>

          {!isFullySettled && (
            <button
              onClick={() => {
                setPaymentAmount(balanceRemaining.toString());
                setShowAddPaymentModal(true);
              }}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm active:scale-95 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === 'hi' ? '+ भुगतान जोड़ें' : '+ Add Payment'}</span>
            </button>
          )}
        </div>
      </div>

      {/* CUSTOMER & EVENT HERO CARD */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {booking.customer_name}
              </h1>
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold px-3 py-0.5 rounded-full capitalize">
                {getEventTypeLabel(booking.event_type)}
              </span>
              <span
                className={`text-xs font-bold px-3 py-0.5 rounded-full border ${
                  isFullySettled
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {isFullySettled
                  ? lang === 'hi' ? '✓ पूर्ण चुकता (Settled)' : '✓ Fully Settled'
                  : lang === 'hi' ? 'बकाया भुगतान बाकी' : 'Balance Due'}
              </span>

              <button
                type="button"
                onClick={handleOpenEditCustomer}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-bold border border-slate-200 transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                <span>{lang === 'hi' ? 'ग्राहक विवरण बदलें / भरें' : 'Edit Customer Details'}</span>
              </button>
            </div>

            {/* Reason of Booking Banner */}
            <div className="mt-3 flex items-center gap-2 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100 text-xs text-indigo-950 flex-wrap">
              <Compass className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-bold text-indigo-700">{lang === 'hi' ? 'बुकिंग का कारण:' : 'Reason of Booking:'}</span>
              <strong className="text-indigo-900 font-extrabold">
                {booking.booking_reason || (booking.event_type === 'wedding' ? 'Marriage Ceremony & Barat Reception' : booking.event_type)}
              </strong>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 mt-3 text-slate-600 text-xs font-semibold flex-wrap">
              <span className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
                <CalendarIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span>{booking.event_date}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{getSlotLabel(booking.time_slot)}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{booking.guests} {t.guestCount}</span>
              </span>

              <a
                href={`tel:${booking.phone}`}
                className="inline-flex items-center gap-1.5 text-slate-800 hover:text-indigo-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 transition font-bold"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{booking.phone}</span>
              </a>

              {/* WhatsApp Display with "Both are same" badge */}
              {(booking.is_whatsapp_same || !booking.whatsapp || booking.whatsapp === booking.phone) ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-200 font-bold">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp: {lang === 'hi' ? 'दोनों एक ही हैं (Both are same)' : 'Both are same'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-800 px-3 py-1 rounded-lg border border-slate-200 font-bold">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp: {booking.whatsapp}</span>
                </span>
              )}
            </div>

            {/* Full Residential Address Box */}
            <div className="mt-3 flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-500 uppercase text-[10px] block">
                  {lang === 'hi' ? 'ग्राहक का पूरा पता (Full Residential Address):' : 'Customer Full Address:'}
                </span>
                <span className="text-slate-900 font-medium leading-relaxed">
                  {booking.address || (
                    <span className="text-slate-400 italic">
                      Address not provided yet.{' '}
                      <button
                        type="button"
                        onClick={handleOpenEditCustomer}
                        className="text-indigo-600 font-bold not-italic hover:underline"
                      >
                        + Fill Address
                      </button>
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {booking.notes && (
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <span className="font-bold text-slate-900 block mb-0.5">
              {lang === 'hi' ? 'विशेष निर्देश / नोट्स:' : 'Special Notes:'}
            </span>
            <span className="text-slate-600">{booking.notes}</span>
          </div>
        )}

        {/* 3 FINANCIAL METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider block">
              {lang === 'hi' ? 'कुल तय राशि' : 'Total Contract Value'}
            </span>
            <div className="text-2xl sm:text-3xl font-black mt-1 text-slate-900">
              {formatINR(totalAgreed)}
            </div>
            <div className="text-slate-400 text-[11px] mt-1">
              {lang === 'hi' ? '(गार्डन + हॉल + व्यवस्था)' : '(Venue + Amenities)'}
            </div>
          </div>

          <div className="bg-emerald-50/70 rounded-xl p-5 border border-emerald-200">
            <span className="text-emerald-800 font-bold text-xs uppercase tracking-wider block">
              {lang === 'hi' ? 'जमा रकम (एडवांस)' : 'Total Amount Paid'}
            </span>
            <div className="text-2xl sm:text-3xl font-black mt-1 text-emerald-700">
              {formatINR(totalPaid)}
            </div>
            <div className="text-emerald-600 text-[11px] mt-1">
              ({bookingPayments.length} {lang === 'hi' ? 'किश्तों में प्राप्त' : 'installments'})
            </div>
          </div>

          <div
            className={`rounded-xl p-5 border ${
              isFullySettled ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50/70 border-rose-200'
            }`}
          >
            <span className={`font-bold text-xs uppercase tracking-wider block ${
              isFullySettled ? 'text-emerald-800' : 'text-rose-800'
            }`}>
              {lang === 'hi' ? 'बाकी बकाया रकम' : 'Balance Remaining'}
            </span>
            <div className="text-2xl sm:text-3xl font-black mt-1">
              {isFullySettled ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-6 h-6" />
                  <span>{lang === 'hi' ? 'पूर्ण चुकता' : 'Nil (0)'}</span>
                </span>
              ) : (
                <span className="text-rose-700">{formatINR(balanceRemaining)}</span>
              )}
            </div>
            <div className="text-slate-500 text-[11px] mt-1">
              {isFullySettled
                ? lang === 'hi' ? 'सभी भुगतान प्राप्त हो चुके हैं' : 'All installments cleared'
                : lang === 'hi' ? 'समारोह से पूर्व वसूली योग्य' : 'To be collected'}
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT HISTORY TABLE SECTION */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-indigo-600" />
              <span>{lang === 'hi' ? 'भुगतान इतिहास' : 'Payment History'}</span>
            </h2>
            <p className="text-slate-500 text-xs">
              {lang === 'hi' ? 'अब तक प्राप्त सभी किश्तों और रसीदों का ब्यौरा' : 'Log of installments and generated receipts'}
            </p>
          </div>

          {!isFullySettled && (
            <button
              onClick={() => {
                setPaymentAmount(balanceRemaining.toString());
                setShowAddPaymentModal(true);
              }}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === 'hi' ? '+ नया भुगतान जोड़ें' : '+ Add Payment'}</span>
            </button>
          )}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50">
                <th className="py-2.5 px-3">{lang === 'hi' ? 'तारीख' : 'Date'}</th>
                <th className="py-2.5 px-3">{lang === 'hi' ? 'भुगतान रकम' : 'Amount'}</th>
                <th className="py-2.5 px-3">{lang === 'hi' ? 'माध्यम' : 'Mode'}</th>
                <th className="py-2.5 px-3">{lang === 'hi' ? 'विवरण' : 'Note'}</th>
                <th className="py-2.5 px-3 text-right">{lang === 'hi' ? 'रसीद' : 'Receipt'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookingPayments.map((p, idx) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900">{p.payment_date}</span>
                    <span className="text-[10px] text-slate-400 block">
                      #{bookingPayments.length - idx}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-base font-bold text-emerald-700">
                      {formatINR(p.amount)}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold uppercase text-slate-700">
                      {p.mode}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-600">
                    {p.note || (lang === 'hi' ? 'किश्त भुगतान' : 'Installment')}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleOpenReceipt(p)}
                      className="inline-flex items-center gap-1 text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3 py-1 rounded-lg border border-slate-200 text-xs font-semibold transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'रसीद' : 'Receipt'}</span>
                    </button>
                  </td>
                </tr>
              ))}

              {bookingPayments.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                    {lang === 'hi' ? 'अभी कोई भुगतान दर्ज नहीं है।' : 'No payments recorded yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ADD PAYMENT MODAL */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <span>{lang === 'hi' ? 'नया भुगतान दर्ज करें' : 'Record New Payment'}</span>
              </h2>
              <button
                onClick={() => setShowAddPaymentModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPaymentSubmit} className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex justify-between items-center text-xs">
                <span className="text-slate-500">{lang === 'hi' ? 'वर्तमान बाकी:' : 'Balance Due:'}</span>
                <span className="text-base font-bold text-rose-700">{formatINR(balanceRemaining)}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'भुगतान रकम (₹)' : 'Payment Amount (₹)'} *
                </label>
                <input
                  type="number"
                  required
                  step="500"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full text-base font-bold p-2.5 bg-white border border-slate-300 text-slate-900 rounded-xl outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'hi' ? 'तारीख' : 'Date'} *
                  </label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 bg-white border border-slate-300 rounded-xl outline-none text-slate-900 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'hi' ? 'माध्यम' : 'Mode'} *
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                    className="w-full text-xs font-medium p-2.5 bg-white border border-slate-300 rounded-xl outline-none text-slate-900 focus:border-indigo-600"
                  >
                    <option value="cash">{lang === 'hi' ? '💵 नकद (Cash)' : '💵 Cash'}</option>
                    <option value="UPI">📱 UPI / QR</option>
                    <option value="bank">{lang === 'hi' ? '🏦 बैंक ट्रांसफर' : '🏦 Bank Transfer / NEFT'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'विवरण / ट्रांजेक्शन नोट' : 'Note (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'hi' ? "उदा. UPI ref #9812984" : "e.g. UPI ref #9812984"}
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl outline-none text-slate-900 placeholder-slate-400 focus:border-indigo-600"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPaymentModal(false)}
                  className="w-1/3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700"
                >
                  {t.close}
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm"
                >
                  {lang === 'hi' ? '✓ भुगतान जमा करें' : '✓ Save Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PRINTABLE RECEIPT MODAL */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-6 border border-slate-200">
            <div className="bg-slate-900 text-white p-3.5 flex justify-between items-center print:hidden">
              <span className="font-bold text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'hi' ? 'भुगतान रसीद' : 'Payment Receipt'}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'प्रिंट / PDF' : 'Print Receipt'}</span>
                </button>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PRINTABLE RECEIPT BODY */}
            <div id="printable-receipt" className="p-8 space-y-5 text-slate-900 bg-white">
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <div className="text-lg font-bold text-slate-800">
                  {lang === 'hi' ? '卐 श्री गणेशाय नमः 卐' : 'HOTEL & BANQUET OFFICIAL RECEIPT VOUCHER'}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-slate-950 tracking-wider">
                  SIDDHIVINAYAK MARRIAGE GARDEN & HOTEL
                </h2>
                <div className="text-sm font-bold text-slate-700">
                  {lang === 'hi' ? 'सिद्धिविनायक मैरिज गार्डन एवं होटल' : 'Hotel Siddhivinayak & Banquet Lawn'}
                </div>
                <p className="text-xs text-slate-500">
                  {lang === 'hi' 
                    ? 'शादी, रिसेप्शन व मांगलिक अवसरों हेतु सर्वसुविधायुक्त वातानुकूलित परिसर' 
                    : 'Air-Conditioned Banquet & Luxury Lawn for Weddings & Special Occasions'}
                </p>
                <p className="text-xs font-bold text-slate-800">
                  {lang === 'hi' 
                    ? 'फोन: +91 98765 43210 | संपर्क: जयपुर-अजमेर हाईवे' 
                    : 'Phone: +91 98765 43210 | Location: Jaipur-Ajmer Highway'}
                </p>
              </div>

              <div className="flex justify-between items-center text-xs font-bold border-b border-slate-200 pb-2">
                <div>
                  <span className="text-slate-500">{lang === 'hi' ? 'रसीद संख्या: ' : 'Receipt No: '}</span>
                  <span className="text-slate-900">SVMG-{selectedPaymentForReceipt?.id.replace('p-', '') || '001'}</span>
                </div>
                <div>
                  <span className="text-slate-500">{lang === 'hi' ? 'तारीख: ' : 'Date: '}</span>
                  <span className="text-slate-900">{selectedPaymentForReceipt?.payment_date || currentDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">{lang === 'hi' ? 'ग्राहक नाम:' : 'Customer Name:'}</span>
                  <span className="text-sm font-black text-slate-950">{booking.customer_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">{lang === 'hi' ? 'मोबाइल नंबर:' : 'Mobile Number:'}</span>
                  <span className="text-sm font-bold text-slate-900">{booking.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">{lang === 'hi' ? 'व्हाट्सएप:' : 'WhatsApp:'}</span>
                  <span className="text-xs font-bold text-emerald-800">
                    {(booking.is_whatsapp_same || !booking.whatsapp || booking.whatsapp === booking.phone)
                      ? `${lang === 'hi' ? 'दोनों एक ही हैं' : 'Same as Mobile'} (${booking.phone})`
                      : booking.whatsapp}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">{lang === 'hi' ? 'बुकिंग का कारण:' : 'Event Purpose:'}</span>
                  <span className="text-xs font-bold text-slate-900">
                    {booking.booking_reason || getEventTypeLabel(booking.event_type)}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block text-[10px] uppercase">{lang === 'hi' ? 'ग्राहक का पूरा पता:' : 'Customer Address:'}</span>
                  <span className="text-xs font-semibold text-slate-800">
                    {booking.address || (lang === 'hi' ? 'पते का विवरण उपलब्ध नहीं' : 'Address not specified')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">{lang === 'hi' ? 'कार्यक्रम:' : 'Event Type:'}</span>
                  <span className="text-sm font-bold text-slate-900 capitalize">{getEventTypeLabel(booking.event_type)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">{lang === 'hi' ? 'तारीख व शिफ्ट:' : 'Date & Slot:'}</span>
                  <span className="text-sm font-bold text-slate-900">{booking.event_date} ({booking.time_slot})</span>
                </div>
              </div>

              <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 border-b border-slate-300 uppercase text-[10px] font-bold text-slate-700">
                    <tr>
                      <th className="p-2.5">{lang === 'hi' ? 'विवरण' : 'Particulars / Description'}</th>
                      <th className="p-2.5 text-right">{lang === 'hi' ? 'रकम' : 'Amount'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2.5">{lang === 'hi' ? 'कुल तय राशि (Total Deal)' : 'Total Deal Amount'}</td>
                      <td className="p-2.5 text-right font-bold text-slate-900">{formatINR(totalAgreed)}</td>
                    </tr>
                    <tr className="bg-emerald-50 text-emerald-950 font-bold">
                      <td className="p-2.5">
                        <span>{lang === 'hi' ? 'इस रसीद में प्राप्त राशि:' : 'Amount Received in This Receipt:'}</span>
                        <span className="block text-[10px] text-emerald-700">
                          {lang === 'hi' ? 'माध्यम: ' : 'Mode: '}{selectedPaymentForReceipt?.mode.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-2.5 text-right text-base text-emerald-800">
                        {formatINR(selectedPaymentForReceipt?.amount || totalPaid)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5">{lang === 'hi' ? 'कुल अब तक जमा' : 'Total Paid So Far'}</td>
                      <td className="p-2.5 text-right font-bold text-slate-900">{formatINR(totalPaid)}</td>
                    </tr>
                    <tr className="bg-rose-50 text-rose-950 font-bold">
                      <td className="p-2.5">{lang === 'hi' ? 'अंतिम शेष बाकी (Balance Due)' : 'Balance Due to Collect'}</td>
                      <td className="p-2.5 text-right text-rose-700">{formatINR(balanceRemaining)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-xs">
                <div className="space-y-0.5 text-slate-500 text-[10px] max-w-xs">
                  <p>{lang === 'hi' ? '• यह रसीद चेक/UPI क्लियर होने के अधीन है।' : '• Subject to realization of Cheque / UPI clearance.'}</p>
                  <p>{lang === 'hi' ? '• रद्द करने पर अग्रिम राशि वापसी योग्य नहीं होगी।' : '• Advance token is non-refundable upon cancellation.'}</p>
                </div>
                <div className="text-center">
                  <div className="border-t border-slate-800 pt-1 font-bold text-slate-900 text-xs">
                    {lang === 'hi' ? 'अधिकृत हस्ताक्षरकर्ता' : 'Authorized Signatory'}<br />
                    {lang === 'hi' ? 'सिद्धिविनायक मैरिज गार्डन एवं होटल' : 'Hotel Siddhivinayak & Banquet'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT CUSTOMER DETAILS MODAL */}
      {showEditCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  {lang === 'hi' ? 'ग्राहक का विवरण बदलें / अपडेट करें' : 'Update Customer & Booking Details'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEditCustomerModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {lang === 'hi' ? 'ग्राहक का नाम (Customer Full Name)' : 'Customer Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={editCustomerName}
                  onChange={(e) => setEditCustomerName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {lang === 'hi' ? 'मोबाइल नंबर (Mobile No.)' : 'Mobile Number'} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => {
                      setEditPhone(e.target.value);
                      if (isSameWhatsapp) setEditWhatsapp(e.target.value);
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {lang === 'hi' ? 'व्हाट्सएप नंबर (WhatsApp No.)' : 'WhatsApp Number'}
                  </label>
                  {isSameWhatsapp ? (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold truncate">
                      Both are same
                    </div>
                  ) : (
                    <input
                      type="tel"
                      value={editWhatsapp}
                      onChange={(e) => setEditWhatsapp(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600 text-xs"
                    />
                  )}
                </div>
              </div>

              {/* Both are same checkbox */}
              <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-50 p-2.5 rounded-xl border border-slate-200 w-full hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={isSameWhatsapp}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsSameWhatsapp(checked);
                    if (checked) setEditWhatsapp(editPhone);
                  }}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="text-xs font-bold text-slate-700">
                  {lang === 'hi' ? 'मोबाइल और व्हाट्सएप दोनों एक ही हैं (Both are same)' : 'Both Mobile and WhatsApp numbers are same'}
                </span>
              </label>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{lang === 'hi' ? 'बुकिंग का कारण / उद्देश्य (Reason of Booking)' : 'Reason / Purpose of Booking'} *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'hi' ? "उदा. विवाह समारोह" : "e.g. Marriage Ceremony"}
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600 text-xs"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
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
                  ]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setEditReason(r)}
                      className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 rounded transition"
                    >
                      + {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{lang === 'hi' ? 'ग्राहक का पूरा पता (Full Residential Address)' : 'Customer Full Address'} *</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Plot/Flat No., Street, City, State, PIN Code"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:border-indigo-600 text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowEditCustomerModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                >
                  {t.close}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'विवरण सहेजें' : 'Save Details'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
