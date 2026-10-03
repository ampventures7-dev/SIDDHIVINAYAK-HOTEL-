'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Lock, 
  Mail, 
  KeyRound, 
  LogIn, 
  ShieldCheck, 
  Sparkles, 
  Languages, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { lang, setLang, t, login, isLoggedIn, user, logout } = useApp();

  const [email, setEmail] = useState('owner@siddhivinayak.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const res = await login(email.trim(), password);
    setLoading(false);

    if (res.success) {
      router.push('/');
    } else {
      setErrorMessage(
        lang === 'hi'
          ? 'लॉगिन असफल: कृपया ईमेल या पासवर्ड जांचें।'
          : res.error || 'Login failed. Please check your credentials.'
      );
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    await login('owner@siddhivinayak.com', 'admin123');
    setLoading(false);
    router.push('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md mx-auto">
            卐
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {lang === 'hi' ? 'प्रबंधक / मालिक लॉगिन' : 'Owner & Staff Portal'}
          </h1>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'सिद्धिविनायक मैरिज गार्डन एवं होटल सॉफ्टवेयर'
              : 'Hotel Siddhivinayak & Marriage Garden ERP'}
          </p>
        </div>

        {/* If already logged in */}
        {isLoggedIn ? (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
              <p className="font-bold text-emerald-800">
                {lang === 'hi' ? 'आप पहले से लॉगिन हैं:' : 'You are currently signed in:'}
              </p>
              <p className="text-slate-900 font-semibold mt-1">{user?.email}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push('/')}
                className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                {lang === 'hi' ? 'डैशबोर्ड खोलें' : 'Open Dashboard'}
              </button>
              <button
                onClick={logout}
                className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200"
              >
                {lang === 'hi' ? 'लॉगआउट' : 'Sign Out'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'hi' ? 'ईमेल आईडी' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-indigo-600 text-slate-900 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'hi' ? 'पासवर्ड' : 'Password'}
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-indigo-600 text-slate-900 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'सत्यापन हो रहा है...' : lang === 'hi' ? 'लॉगिन करें' : 'Sign In'}</span>
            </button>

            {/* Quick Demo Access */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>{lang === 'hi' ? '1-क्लिक मालिक डेमो लॉगिन' : '1-Click Owner Demo Login'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
