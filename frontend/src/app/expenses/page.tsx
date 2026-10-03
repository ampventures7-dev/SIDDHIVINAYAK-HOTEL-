'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  MinusCircle, 
  PlusCircle, 
  TrendingDown, 
  Calendar as CalendarIcon, 
  Filter, 
  Zap, 
  Fuel, 
  Users, 
  Sparkles, 
  Wrench, 
  UtensilsCrossed, 
  FileText,
  DollarSign,
  PieChart
} from 'lucide-react';
import { ExpenseCategory, Expense } from '@/types/database';

export default function ExpensesPage() {
  const { lang, t, expenses, addExpense, formatINR, currentDate } = useApp();

  // Filter states
  const [selectedMonth, setSelectedMonth] = useState('2026-10'); // YYYY-MM
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Form states for Add Expense
  const [date, setDate] = useState(currentDate);
  const [category, setCategory] = useState<ExpenseCategory>('electricity');
  const [amount, setAmount] = useState('15000');
  const [note, setNote] = useState('');

  // Handle Add Expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount) || 0;
    if (amt <= 0) {
      alert(lang === 'hi' ? 'कृपया सही खर्चे की रकम भरें!' : 'Please enter valid expense amount!');
      return;
    }

    addExpense({
      date,
      category,
      amount: amt,
      note: note.trim() || undefined,
    });

    setAmount('');
    setNote('');
    alert(lang === 'hi' ? '✅ खर्चा सफलतापूर्वक दर्ज हो गया!' : '✅ Expense recorded successfully!');
  };

  // Helper category label & icon
  const getCategoryInfo = (cat: ExpenseCategory | string) => {
    switch (cat) {
      case 'electricity':
        return {
          labelHi: 'बिजली व ग्रिड',
          labelEn: 'Electricity & Power',
          icon: Zap,
          color: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'staff salary':
        return {
          labelHi: 'स्टाफ वेतन व मजदूरी',
          labelEn: 'Staff Salary & Wages',
          icon: Users,
          color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'decoration':
        return {
          labelHi: 'टेंट व फूल सज्जा',
          labelEn: 'Decoration & Florals',
          icon: Sparkles,
          color: 'bg-pink-50 text-pink-800 border-pink-200',
        };
      case 'maintenance':
        return {
          labelHi: 'ग्राउंड व भवन रिपेयर',
          labelEn: 'Maintenance & Repairs',
          icon: Wrench,
          color: 'bg-orange-50 text-orange-800 border-orange-200',
        };
      case 'catering':
        return {
          labelHi: 'कैटरिंग व बर्तन',
          labelEn: 'Catering & Supplies',
          icon: UtensilsCrossed,
          color: 'bg-purple-50 text-purple-800 border-purple-200',
        };
      default:
        return {
          labelHi: 'डीजल व अन्य खर्च',
          labelEn: 'Diesel & Other',
          icon: Fuel,
          color: 'bg-slate-100 text-slate-800 border-slate-200',
        };
    }
  };

  // 1. Expenses in selected month
  const monthlyExpenses = useMemo(() => {
    if (selectedMonth === 'all') return expenses;
    return expenses.filter((e) => e.date.startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  // 2. Total Monthly Expense
  const totalMonthlyExpense = useMemo(() => {
    return monthlyExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }, [monthlyExpenses]);

  // 3. Category-wise Breakdown in selected month
  const categoryBreakdown = useMemo(() => {
    const cats: ExpenseCategory[] = [
      'staff salary',
      'electricity',
      'other', // diesel
      'decoration',
      'maintenance',
      'catering',
    ];

    return cats.map((c) => {
      const catTotal = monthlyExpenses
        .filter((e) => e.category === c)
        .reduce((sum, e) => sum + Number(e.amount), 0);
      const percentage = totalMonthlyExpense > 0 ? (catTotal / totalMonthlyExpense) * 100 : 0;
      return {
        category: c,
        total: catTotal,
        percentage: Math.round(percentage),
      };
    });
  }, [monthlyExpenses, totalMonthlyExpense]);

  // 4. Filtered List by Category
  const filteredList = useMemo(() => {
    return monthlyExpenses
      .filter((e) => {
        if (selectedCategory === 'all') return true;
        return e.category === selectedCategory;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [monthlyExpenses, selectedCategory]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5 sm:space-y-6 min-w-0 overflow-hidden">
      {/* PAGE TITLE & MONTH SELECTOR */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">
            <TrendingDown className="w-4 h-4" />
            <span>{lang === 'hi' ? 'दैनिक एवं मासिक व्यय रजिस्टर' : 'Expense & Operations Ledger'}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            {lang === 'hi' ? 'व्यय एवं खर्चा रजिस्टर' : 'Expenses & Operations Tracker'}
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            {lang === 'hi'
              ? 'बिजली, जनरेटर डीजल, स्टाफ वेतन व मेंटेनेंस का दैनिक व मासिक हिसाब'
              : 'Daily & monthly log for electricity, diesel, staff, and maintenance'}
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200">
          <CalendarIcon className="w-4 h-4 text-slate-500 ml-1" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs sm:text-sm font-bold bg-transparent text-slate-800 outline-none cursor-pointer"
          >
            <option value="2026-10">{lang === 'hi' ? 'October 2026 (अक्टूबर 2026 - चालू)' : 'October 2026 (Active)'}</option>
            <option value="2026-09">{lang === 'hi' ? 'September 2026 (सितंबर 2026)' : 'September 2026'}</option>
            <option value="2026-08">{lang === 'hi' ? 'August 2026 (अगस्त 2026)' : 'August 2026'}</option>
            <option value="2026-07">{lang === 'hi' ? 'July 2026 (जुलाई 2026)' : 'July 2026'}</option>
            <option value="all">{lang === 'hi' ? 'सभी महीने (All Months)' : 'All Months'}</option>
          </select>
        </div>
      </div>

      {/* TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* BIG MONTHLY TOTAL (4 Cols) */}
        <div className="lg:col-span-4 bg-rose-50/70 rounded-2xl p-6 border border-rose-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-rose-800 font-bold text-xs uppercase tracking-wider">
                {lang === 'hi' ? 'इस महीने का कुल खर्चा' : 'Total Monthly Expenses'}
              </span>
              <div className="p-2 bg-rose-100 border border-rose-200 rounded-xl">
                <TrendingDown className="w-5 h-5 text-rose-600" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-black mt-3 text-rose-700 tracking-tight">
              {formatINR(totalMonthlyExpense)}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-rose-200 text-rose-800 text-xs font-semibold flex justify-between">
            <span>{selectedMonth === 'all' ? (lang === 'hi' ? 'सभी खर्चे' : 'All Expenses') : (lang === 'hi' ? 'महीने में कुल प्रविष्टियाँ' : 'Entries in Month')}:</span>
            <span className="text-sm font-black text-slate-900">{monthlyExpenses.length}</span>
          </div>
        </div>

        {/* CATEGORY-WISE BREAKDOWN (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
            <PieChart className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              {lang === 'hi' ? 'मद अनुसार खर्चे का विवरण' : 'Category-wise Breakdown'}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categoryBreakdown.map((item) => {
              const info = getCategoryInfo(item.category);
              const Icon = info.icon;

              return (
                <div
                  key={item.category}
                  className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200">
                      <Icon className="w-4 h-4 text-slate-700" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 truncate">
                      {lang === 'hi' ? info.labelHi : info.labelEn}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="text-base font-bold text-slate-900">
                      {formatINR(item.total)}
                    </div>
                    {totalMonthlyExpense > 0 && (
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    )}
                    <span className="text-[10px] text-slate-500 font-medium block mt-1">
                      {item.percentage}% {lang === 'hi' ? 'हिस्सेदारी' : 'share'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SIMPLE ADD EXPENSE FORM */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 mb-4 border-b border-slate-200">
          <PlusCircle className="w-5 h-5 text-indigo-600" />
          <span>{lang === 'hi' ? 'नया खर्चा जोड़ें' : 'Add New Expense'}</span>
        </h2>

        <form onSubmit={handleAddExpense} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'hi' ? 'तारीख' : 'Date'} *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs sm:text-sm font-medium p-2.5 bg-white border border-slate-300 rounded-xl focus:border-indigo-600 outline-none text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'hi' ? 'खर्चे की श्रेणी' : 'Category'} *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full text-xs sm:text-sm font-medium p-2.5 bg-white border border-slate-300 rounded-xl focus:border-indigo-600 outline-none text-slate-900"
              >
                <option value="electricity">{lang === 'hi' ? '⚡ बिजली बिल (Electricity)' : '⚡ Electricity Bill'}</option>
                <option value="other">{lang === 'hi' ? '⛽ जनरेटर डीजल / ईंधन (Diesel)' : '⛽ Generator Diesel & Fuel'}</option>
                <option value="staff salary">{lang === 'hi' ? '👨‍🌾 स्टाफ वेतन / मजदूरी (Staff)' : '👨‍🌾 Staff Salary & Wages'}</option>
                <option value="decoration">{lang === 'hi' ? '🌸 टेंट व डेकोरेशन (Decoration)' : '🌸 Tent & Decoration'}</option>
                <option value="maintenance">{lang === 'hi' ? '🔧 ग्राउंड व मोटर रिपेयर (Maintenance)' : '🔧 Ground & Maintenance'}</option>
                <option value="catering">{lang === 'hi' ? '🍽️ कैटरिंग व बर्तन (Catering)' : '🍽️ Catering & Utensils'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-700 mb-1">
                {lang === 'hi' ? 'रकम (₹)' : 'Amount (₹)'} *
              </label>
              <input
                type="number"
                required
                step="500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-sm font-bold p-2.5 bg-white border border-rose-300 text-rose-700 rounded-xl focus:border-rose-500 outline-none"
              />
            </div>
          </div>

          {/* Quick Amount Tags */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-500">{lang === 'hi' ? 'त्वरित रकम:' : 'Quick Amounts:'}</span>
            {[2000, 5000, 10000, 25000, 50000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val.toString())}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-200 active:scale-95 transition"
              >
                + {formatINR(val)}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {lang === 'hi' ? 'विवरण / नोट (Remarks)' : 'Description / Remarks'}
            </label>
            <input
              type="text"
              placeholder={lang === 'hi' ? "उदा. 150 लीटर जनरेटर डीजल शादी वाले दिन, लेबर मजदूरी 3 दिन" : "e.g. 150L Generator Diesel, Labor wages, Electrician bill"}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 bg-white border border-slate-300 rounded-xl focus:border-indigo-600 outline-none text-slate-900 placeholder-slate-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-6 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{lang === 'hi' ? '✓ खर्चा दर्ज करें' : '✓ Save Expense'}</span>
          </button>
        </form>
      </div>

      {/* FILTERABLE EXPENSES LIST BELOW */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>{lang === 'hi' ? 'खर्चों की सूची' : 'Expense Records'}</span>
          </h2>
          <span className="text-xs text-slate-500">
            {filteredList.length} {lang === 'hi' ? 'प्रविष्टियां' : 'Records'}
          </span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', labelHi: 'सभी खर्चे', labelEn: 'All' },
            { id: 'electricity', labelHi: '⚡ बिजली', labelEn: 'Electricity' },
            { id: 'other', labelHi: '⛽ डीजल/ईंधन', labelEn: 'Diesel' },
            { id: 'staff salary', labelHi: '👨‍🌾 स्टाफ वेतन', labelEn: 'Staff' },
            { id: 'decoration', labelHi: '🌸 डेकोरेशन', labelEn: 'Decoration' },
            { id: 'maintenance', labelHi: '🔧 मेंटेनेंस', labelEn: 'Maintenance' },
            { id: 'catering', labelHi: '🍽️ कैटरिंग', labelEn: 'Catering' },
          ].map((catTab) => {
            const isActive = selectedCategory === catTab.id;
            return (
              <button
                key={catTab.id}
                onClick={() => setSelectedCategory(catTab.id)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs border transition ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lang === 'hi' ? catTab.labelHi : catTab.labelEn}
              </button>
            );
          })}
        </div>

        {/* LIST ROWS */}
        <div className="space-y-2.5 pt-2">
          {filteredList.length > 0 ? (
            filteredList.map((exp) => {
              const info = getCategoryInfo(exp.category);
              const Icon = info.icon;

              return (
                <div
                  key={exp.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-white rounded-lg p-2 text-center min-w-[65px] shrink-0 border border-slate-200 shadow-xs">
                      <span className="block text-[10px] uppercase font-bold text-indigo-600">
                        {new Date(exp.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="block text-lg font-black leading-none my-0.5 text-slate-900">
                        {exp.date.split('-')[2]}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        {exp.date.split('-')[0]}
                      </span>
                    </div>

                    <div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${info.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? info.labelHi : info.labelEn}</span>
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 mt-1 font-medium">
                        {exp.note || (lang === 'hi' ? 'नियमित खर्च' : 'Regular expense')}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-base font-black text-rose-700">
                      {formatINR(exp.amount)}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
              {lang === 'hi' ? 'इस श्रेणी में कोई खर्चा दर्ज नहीं है।' : 'No expenses found.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
