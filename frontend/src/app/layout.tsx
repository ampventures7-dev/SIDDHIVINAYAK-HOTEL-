import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "HOTEL SIDDHIVINAYAK - Hotel & Banquet Management System (HMS)",
  description: "Complete operations software for Hotel Siddhivinayak: 25 Room PMS, Marriage Garden Bookings, Cashflow Ledger, Staff Attendance, and Profit & Loss Reports.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased overflow-x-hidden max-w-full">
      <body suppressHydrationWarning className="min-h-full w-full max-w-full overflow-x-hidden flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
        <AppProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-full min-w-0 overflow-x-hidden pb-24 md:pb-8">{children}</main>
          <MobileBottomNav />
        </AppProvider>
      </body>
    </html>
  );
}
