'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  BarChart3, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Printer, 
  Download, 
  PieChart, 
  CalendarCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { ExpenseCategory } from '@/types/database';

export default function ReportsPage() {
  const { lang, t, bookings, payments, expenses, currentDate, formatINR } = useApp();

  // Selected dates for reports
  const [dailyReportDate, setDailyReportDate] = useState('2026-10-01');
  const [monthlyReportMonth, setMonthlyReportMonth] = useState('2026-10'); // YYYY-MM
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('monthly');

  // =========================================================================
  // 1. DAILY REPORT CALCULATIONS
  // =========================================================================
  const dailyPayments = useMemo(() => {
    return payments.filter((p) => p.payment_date === dailyReportDate);
  }, [payments, dailyReportDate]);

  const dailyExpensesList = useMemo(() => {
    return expenses.filter((e) => e.date === dailyReportDate);
  }, [expenses, dailyReportDate]);

  const dailyIncome = useMemo(() => {
    return dailyPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  }, [dailyPayments]);

  const dailyExpense = useMemo(() => {
    return dailyExpensesList.reduce((sum, e) => sum + Number(e.amount), 0);
  }, [dailyExpensesList]);

  const dailyNet = dailyIncome - dailyExpense;

  // =========================================================================
  // 2. MONTHLY REPORT CALCULATIONS
  // =========================================================================
  const monthPayments = useMemo(() => {
    return payments.filter((p) => p.payment_date.startsWith(monthlyReportMonth));
  }, [payments, monthlyReportMonth]);

  const monthExpenses = useMemo(() => {
    return expenses.filter((e) => e.date.startsWith(monthlyReportMonth));
  }, [expenses, monthlyReportMonth]);

  const monthBookings = useMemo(() => {
    return bookings.filter(
      (b) => b.event_date.startsWith(monthlyReportMonth) && b.status !== 'cancelled'
    );
  }, [bookings, monthlyReportMonth]);

  const totalMonthlyIncome = useMemo(() => {
    return monthPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  }, [monthPayments]);

  const totalMonthlyExpenses = useMemo(() => {
    return monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }, [monthExpenses]);

  const totalMonthlyProfit = totalMonthlyIncome - totalMonthlyExpenses;
  const totalEventsCount = monthBookings.length;

  // Days in selected report month for daily bar chart
  const daysInSelectedMonth = useMemo(() => {
    const [y, m] = monthlyReportMonth.split('-').map(Number);
    return new Date(y, m, 0).getDate();
  }, [monthlyReportMonth]);

  // Daily Chart Data for Bar Graph
  const dailyChartData = useMemo(() => {
    const data = [];
    for (let day = 1; day <= daysInSelectedMonth; day++) {
      const dateStr = `${monthlyReportMonth}-${String(day).padStart(2, '0')}`;
      const inc = payments
        .filter((p) => p.payment_date === dateStr)
        .reduce((sum, p) => sum + Number(p.amount), 0);
      const exp = expenses
        .filter((e) => e.date === dateStr)
        .reduce((sum, e) => sum + Number(e.amount), 0);

      data.push({
        day,
        date: dateStr,
        income: inc,
        expense: exp,
        net: inc - exp,
      });
    }
    return data;
  }, [monthlyReportMonth, daysInSelectedMonth, payments, expenses]);

  const maxBarValue = useMemo(() => {
    let max = 50000;
    dailyChartData.forEach((d) => {
      if (d.income > max) max = d.income;
      if (d.expense > max) max = d.expense;
    });
    return max;
  }, [dailyChartData]);

  // Category-wise Breakdown for Donut Chart
  const categorySummary = useMemo(() => {
    const categoryColors: Record<string, { labelHi: string; labelEn: string; color: string }> = {
      'staff salary': { labelHi: 'स्टाफ वेतन', labelEn: 'Staff Salary', color: '#10b981' },
      electricity: { labelHi: 'बिजली बिल', labelEn: 'Electricity', color: '#eab308' },
      other: { labelHi: 'डीजल व ईंधन', labelEn: 'Diesel / Fuel', color: '#64748b' },
      decoration: { labelHi: 'डेकोरेशन', labelEn: 'Decoration', color: '#ec4899' },
      maintenance: { labelHi: 'मेंटेनेंस', labelEn: 'Maintenance', color: '#f97316' },
      catering: { labelHi: 'कैटरिंग', labelEn: 'Catering', color: '#a855f7' },
    };

    const categories: ExpenseCategory[] = [
      'staff salary',
      'electricity',
      'other',
      'decoration',
      'maintenance',
      'catering',
    ];

    let runningAngle = 0;

    return categories.map((cat) => {
      const total = monthExpenses
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + Number(e.amount), 0);
      const percentage = totalMonthlyExpenses > 0 ? (total / totalMonthlyExpenses) * 100 : 0;
      const angle = (percentage / 100) * 360;
      const startAngle = runningAngle;
      runningAngle += angle;

      return {
        category: cat,
        labelHi: categoryColors[cat]?.labelHi || cat,
        labelEn: categoryColors[cat]?.labelEn || cat,
        color: categoryColors[cat]?.color || '#94a3b8',
        amount: total,
        percentage: Math.round(percentage),
        startAngle,
        angle,
      };
    });
  }, [monthExpenses, totalMonthlyExpenses]);

  // SVG Donut Path Builder
  const pieSegments = useMemo(() => {
    const radius = 80;
    const innerRadius = 50;
    const center = 100;

    return categorySummary
      .filter((cat) => cat.amount > 0)
      .map((cat) => {
        const startRad = (cat.startAngle - 90) * (Math.PI / 180);
        const sliceAngle = cat.angle >= 360 ? 359.99 : cat.angle;
        const endRad = (cat.startAngle + sliceAngle - 90) * (Math.PI / 180);

        const x1 = center + radius * Math.cos(startRad);
        const y1 = center + radius * Math.sin(startRad);
        const x2 = center + radius * Math.cos(endRad);
        const y2 = center + radius * Math.sin(endRad);

        const x3 = center + innerRadius * Math.cos(endRad);
        const y3 = center + innerRadius * Math.sin(endRad);
        const x4 = center + innerRadius * Math.cos(startRad);
        const y4 = center + innerRadius * Math.sin(startRad);

        const largeArc = sliceAngle > 180 ? 1 : 0;

        const pathData = `
          M ${x1} ${y1}
          A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
          L ${x3} ${y3}
          A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
          Z
        `;

        return {
          ...cat,
          pathData,
        };
      });
  }, [categorySummary, totalMonthlyExpenses]);

  const handleExportToExcel = () => {
    let csvContent = '\uFEFF';
    csvContent += lang === 'hi' 
      ? `"SIDDHIVINAYAK MARRIAGE GARDEN - वित्तीय रिपोर्ट (Financial Report)"\n`
      : `"SIDDHIVINAYAK HOTEL & BANQUET - Financial Report"\n`;
    csvContent += `${lang === 'hi' ? '"Report Month / महीना:"' : '"Report Month:"'},"${monthlyReportMonth}"\n`;
    csvContent += `${lang === 'hi' ? '"Generated On / रिपोर्ट दिनांक:"' : '"Generated On:"'},"${new Date().toLocaleString()}"\n\n`;

    csvContent += lang === 'hi' 
      ? `"1. MONTHLY FINANCIAL SUMMARY / मासिक वित्तीय सारांश"\n`
      : `"1. MONTHLY FINANCIAL SUMMARY"\n`;
    csvContent += `${lang === 'hi' ? '"कुल आय (Total Income)"' : '"Total Income"'},"${totalMonthlyIncome}"\n`;
    csvContent += `${lang === 'hi' ? '"कुल खर्चा (Total Expenses)"' : '"Total Expenses"'},"${totalMonthlyExpenses}"\n`;
    csvContent += `${lang === 'hi' ? '"शुद्ध मुनाफा (Net Profit)"' : '"Net Profit"'},"${totalMonthlyProfit}"\n`;
    csvContent += `${lang === 'hi' ? '"कुल आयोजित कार्यक्रम (Total Events)"' : '"Total Events"'},"${totalEventsCount}"\n\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Siddhivinayak_Financial_Report_${monthlyReportMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5 sm:space-y-6 min-w-0 overflow-hidden">
      {/* HEADER WITH PRINT & EXCEL EXPORT */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>{lang === 'hi' ? 'वित्तीय विश्लेषण एवं लाभ-हानि रिपोर्ट' : 'Financial Analysis & P&L'}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {lang === 'hi' ? 'वित्तीय रिपोर्ट एवं विश्लेषण' : 'Financial Reports & Analytics'}
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            {lang === 'hi'
              ? 'दैनिक आमदनी, मासिक लाभ-हानि व मद अनुसार खर्चों का संपूर्ण विश्लेषण'
              : 'Daily cashflow, monthly profit & loss, and categorized visual charts'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-xl font-bold text-xs shadow-xs transition"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>{lang === 'hi' ? 'प्रिंट रिपोर्ट' : 'Print Report'}</span>
          </button>

          <button
            onClick={handleExportToExcel}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-white" />
            <span>{lang === 'hi' ? 'एक्सेल (.CSV)' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* REPORT TYPE SELECTOR TABS */}
      <div className="flex bg-slate-100 p-1.5 rounded-xl w-fit border border-slate-200">
        <button
          onClick={() => setActiveTab('monthly')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold text-xs transition ${
            activeTab === 'monthly'
              ? 'bg-white text-slate-900 shadow-sm font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{lang === 'hi' ? 'मासिक रिपोर्ट' : 'Monthly Report'}</span>
        </button>

        <button
          onClick={() => setActiveTab('daily')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold text-xs transition ${
            activeTab === 'daily'
              ? 'bg-white text-slate-900 shadow-sm font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>{lang === 'hi' ? 'दैनिक रिपोर्ट' : 'Daily Report'}</span>
        </button>
      </div>

      {/* SECTION A: MONTHLY REPORT */}
      {activeTab === 'monthly' && (
        <div className="space-y-6">
          {/* Month Selector Bar */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs sm:text-sm font-semibold text-slate-700">
              {lang === 'hi' ? 'रिपोर्ट का महीना चुनें:' : 'Select Report Month:'}
            </span>
            <select
              value={monthlyReportMonth}
              onChange={(e) => setMonthlyReportMonth(e.target.value)}
              className="text-xs sm:text-sm font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 outline-none cursor-pointer"
            >
              <option value="2026-10">{lang === 'hi' ? 'October 2026 (अक्टूबर 2026 - चालू)' : 'October 2026 (Active)'}</option>
              <option value="2026-09">{lang === 'hi' ? 'September 2026 (सितंबर 2026)' : 'September 2026'}</option>
              <option value="2026-08">{lang === 'hi' ? 'August 2026 (अगस्त 2026)' : 'August 2026'}</option>
              <option value="2026-07">{lang === 'hi' ? 'July 2026 (जुलाई 2026)' : 'July 2026'}</option>
              <option value="2026-11">{lang === 'hi' ? 'November 2026 (नवंबर 2026)' : 'November 2026'}</option>
              <option value="2026-12">{lang === 'hi' ? 'December 2026 (दिसंबर 2026)' : 'December 2026'}</option>
            </select>
          </div>

          {/* 4 BIG METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Income */}
            <div className="bg-emerald-50/70 rounded-xl p-5 border border-emerald-200 shadow-xs">
              <span className="text-emerald-800 font-bold text-xs uppercase block">
                {lang === 'hi' ? 'कुल प्राप्त आमदनी' : 'Total Income Collected'}
              </span>
              <div className="text-2xl sm:text-3xl font-black mt-1.5 text-emerald-700">
                {formatINR(totalMonthlyIncome)}
              </div>
              <span className="text-emerald-600 text-[11px] block mt-1">
                {lang === 'hi' ? '(किश्तों व एडवांस के रूप में)' : '(Advance & instalments)'}
              </span>
            </div>

            {/* Total Expenses */}
            <div className="bg-rose-50/70 rounded-xl p-5 border border-rose-200 shadow-xs">
              <span className="text-rose-800 font-bold text-xs uppercase block">
                {lang === 'hi' ? 'कुल गार्डन खर्चा' : 'Total Venue Expenses'}
              </span>
              <div className="text-2xl sm:text-3xl font-black mt-1.5 text-rose-700">
                {formatINR(totalMonthlyExpenses)}
              </div>
              <span className="text-rose-600 text-[11px] block mt-1">
                {lang === 'hi' ? '(डीजल, बिजली, वेतन, मेंटेनेंस)' : '(Diesel, power, staff, upkeep)'}
              </span>
            </div>

            {/* Total Profit */}
            <div className="bg-indigo-50/70 rounded-xl p-5 border border-indigo-200 shadow-xs">
              <span className="text-indigo-800 font-bold text-xs uppercase block">
                {lang === 'hi' ? 'कुल शुद्ध मुनाफा' : 'Net Total Profit'}
              </span>
              <div className="text-2xl sm:text-3xl font-black mt-1.5 text-indigo-900">
                {formatINR(totalMonthlyProfit)}
              </div>
              <span className="text-indigo-600 text-[11px] block mt-1">
                {lang === 'hi' ? '(आमदनी माइनस खर्चा)' : '(Operating net margin)'}
              </span>
            </div>

            {/* Number of Events */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-xs">
              <span className="text-slate-600 font-bold text-xs uppercase block">
                {lang === 'hi' ? 'कुल कार्यक्रम' : 'Number of Events'}
              </span>
              <div className="text-2xl sm:text-3xl font-black mt-1.5 text-slate-900">
                {totalEventsCount} <span className="text-xs font-bold text-slate-500">{lang === 'hi' ? 'समारोह' : 'Events'}</span>
              </div>
              <span className="text-slate-400 text-[11px] block mt-1">
                {lang === 'hi' ? '(विवाह, रिसेप्शन, सगाई)' : '(Weddings & banquets)'}
              </span>
            </div>
          </div>

          {/* TWO VISUAL CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
            {/* 1. DAILY BAR CHART (8 Cols) */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 min-w-0 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    <span>{lang === 'hi' ? 'दैनिक आय बनाम खर्चा चार्ट' : 'Daily Income vs Expenses Chart'}</span>
                  </h2>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {lang === 'hi' ? 'तारीख अनुसार आमदनी (हरा) तथा खर्चा (लाल)' : 'Day-by-day cash inflow (green) vs outflow (red)'}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-emerald-500 rounded" />
                    <span className="text-slate-700">{lang === 'hi' ? 'आय' : 'Income'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-rose-500 rounded" />
                    <span className="text-slate-700">{lang === 'hi' ? 'खर्चा' : 'Expense'}</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart Canvas */}
              <div className="pt-4">
                <div className="h-60 sm:h-64 flex items-end gap-1.5 sm:gap-2 px-2 overflow-x-auto pb-4">
                  {dailyChartData.map((d) => {
                    const incHeight = maxBarValue > 0 ? (d.income / maxBarValue) * 100 : 0;
                    const expHeight = maxBarValue > 0 ? (d.expense / maxBarValue) * 100 : 0;
                    const hasActivity = d.income > 0 || d.expense > 0;

                    return (
                      <div
                        key={d.day}
                        className="flex-1 min-w-[18px] flex flex-col items-center justify-end h-full group relative"
                      >
                        {hasActivity && (
                          <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-slate-900 text-white text-[11px] p-2 rounded-lg shadow-xl z-20 whitespace-nowrap pointer-events-none">
                            <span className="font-bold text-slate-200">{d.date}</span>
                            <span className="text-emerald-400">{lang === 'hi' ? 'आय: ' : 'Income: '}{formatINR(d.income)}</span>
                            <span className="text-rose-400">{lang === 'hi' ? 'खर्च: ' : 'Expense: '}{formatINR(d.expense)}</span>
                            <span className="text-indigo-300">{lang === 'hi' ? 'बचत: ' : 'Net: '}{formatINR(d.net)}</span>
                          </div>
                        )}

                        <div className="w-full flex items-end justify-center gap-0.5 h-full">
                          <div
                            style={{ height: `${Math.max(4, incHeight)}%` }}
                            className={`w-1/2 rounded-t transition-all duration-300 ${
                              d.income > 0 ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-100'
                            }`}
                          />
                          <div
                            style={{ height: `${Math.max(4, expHeight)}%` }}
                            className={`w-1/2 rounded-t transition-all duration-300 ${
                              d.expense > 0 ? 'bg-rose-500 hover:bg-rose-600' : 'bg-slate-100'
                            }`}
                          />
                        </div>

                        <span className={`text-[10px] font-bold mt-1 ${
                          hasActivity ? 'text-slate-900' : 'text-slate-400'
                        }`}>
                          {d.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. CATEGORY-WISE EXPENSE PIE CHART (4 Cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
                  <PieChart className="w-5 h-5 text-indigo-600" />
                  <span>{lang === 'hi' ? 'खर्चा पाई-चार्ट' : 'Expense Breakdown'}</span>
                </h2>

                <div className="py-4 flex flex-col items-center justify-center">
                  <svg viewBox="0 0 200 200" className="w-44 h-44 drop-shadow-sm">
                    {pieSegments.length > 0 ? (
                      pieSegments.map((segment) => (
                        <path
                          key={segment.category}
                          d={segment.pathData}
                          fill={segment.color}
                          className="hover:opacity-85 transition cursor-pointer"
                        >
                          <title>{`${segment.labelHi}: ${formatINR(segment.amount)} (${segment.percentage}%)`}</title>
                        </path>
                      ))
                    ) : (
                      <circle cx="100" cy="100" r="70" fill="#f1f5f9" />
                    )}
                    <text
                      x="100"
                      y="95"
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-slate-400 uppercase"
                    >
                      {lang === 'hi' ? 'कुल खर्च' : 'Total'}
                    </text>
                    <text
                      x="100"
                      y="115"
                      textAnchor="middle"
                      className="text-xs font-black fill-slate-900"
                    >
                      {formatINR(totalMonthlyExpenses)}
                    </text>
                  </svg>
                </div>
              </div>

              {/* Legend with percentages */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs font-semibold">
                {categorySummary.map((c) => (
                  <div key={c.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="text-slate-700">
                        {lang === 'hi' ? c.labelHi : c.labelEn}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-900 font-bold">{formatINR(c.amount)}</span>
                      <span className="text-[10px] text-slate-500 ml-1">({c.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION B: DAILY REPORT */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs sm:text-sm font-semibold text-slate-700">
              {lang === 'hi' ? 'दैनिक रिपोर्ट की तारीख चुनें:' : 'Pick a Date for Daily Report:'}
            </span>
            <input
              type="date"
              value={dailyReportDate}
              onChange={(e) => setDailyReportDate(e.target.value)}
              className="text-xs sm:text-sm font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50/70 rounded-xl p-5 border border-emerald-200 shadow-xs">
              <span className="text-emerald-800 font-bold text-xs uppercase block">
                {lang === 'hi' ? 'उस दिन की कुल आमदनी' : "Daily Income"}
              </span>
              <div className="text-2xl sm:text-3xl font-black mt-1.5 text-emerald-700">
                {formatINR(dailyIncome)}
              </div>
              <span className="text-emerald-600 text-xs block mt-1">
                ({dailyPayments.length} {lang === 'hi' ? 'भुगतान प्राप्त हुए' : 'payments'})
              </span>
            </div>

            <div className="bg-rose-50/70 rounded-xl p-5 border border-rose-200 shadow-xs">
              <span className="text-rose-800 font-bold text-xs uppercase block">
                {lang === 'hi' ? 'उस दिन का कुल खर्चा' : "Daily Expenses"}
              </span>
              <div className="text-2xl sm:text-3xl font-black mt-1.5 text-rose-700">
                {formatINR(dailyExpense)}
              </div>
              <span className="text-rose-600 text-xs block mt-1">
                ({dailyExpensesList.length} {lang === 'hi' ? 'खर्चे दर्ज' : 'expenses'})
              </span>
            </div>

            <div className={`rounded-xl p-5 border shadow-xs ${
              dailyNet >= 0 ? 'bg-indigo-50/70 border-indigo-200' : 'bg-rose-50/70 border-rose-200'
            }`}>
              <span className={`font-bold text-xs uppercase block ${
                dailyNet >= 0 ? 'text-indigo-800' : 'text-rose-800'
              }`}>
                {lang === 'hi' ? 'शुद्ध बचत (Net Balance)' : "Daily Net Profit"}
              </span>
              <div className="text-2xl sm:text-3xl font-black mt-1.5 text-slate-900">
                {formatINR(dailyNet)}
              </div>
              <span className="text-slate-500 text-xs block mt-1">
                {lang === 'hi' ? '(आमदनी माइनस खर्चा)' : '(Income - Expenses)'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
