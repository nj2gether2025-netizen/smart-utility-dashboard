"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { isSupabaseConfigured } from "@/lib/supabase";

const navigation = [
  { href: "/", label: "แดชบอร์ด", icon: "📊" },
  { href: "/entry", label: "บันทึกข้อมูล", icon: "📝" },
  { href: "/history", label: "ประวัติข้อมูล", icon: "📋" },
  { href: "/report", label: "รายงานผู้บริหาร", icon: "🏥" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-white/70 bg-white/82 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl lg:block">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-700 text-2xl text-white shadow-lg shadow-teal-700/20">
            ✚
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">ENV Team</p>
            <h1 className="text-lg font-bold text-slate-950">Smart Utility</h1>
          </div>
        </div>

        <nav className="mt-10 space-y-2">
          {navigation.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${
                  active
                    ? "bg-teal-700 text-white shadow-lg shadow-teal-700/20"
                    : "text-slate-600 hover:bg-teal-50 hover:text-teal-800"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 rounded-3xl bg-slate-950 p-5 text-white">
          <p className="text-xs font-semibold text-teal-200">สถานะระบบ</p>
          <p className="mt-2 text-sm font-bold">V1 Mock Data + localStorage</p>
          <p className="mt-2 text-xs text-slate-300">
            Supabase: {isSupabaseConfigured ? "พร้อมเชื่อมต่อ" : "รอ ENV keys"}
          </p>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-white/70 bg-white/80 px-5 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">ENV Team</p>
              <h1 className="font-bold text-slate-950">Smart Utility Dashboard</h1>
            </div>
            <span className="rounded-2xl bg-teal-700 px-3 py-2 text-white">✚</span>
          </div>
          <nav className="mt-4 grid grid-cols-2 gap-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2 text-center text-xs font-semibold ${
                  pathname === item.href ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="mx-auto max-w-7xl px-5 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
