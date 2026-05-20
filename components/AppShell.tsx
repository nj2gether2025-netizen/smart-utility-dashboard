"use client";

import { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <header className="border-b border-emerald-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur md:px-8">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-xl text-white">🧯</div>
          <div>
            <h1 className="text-lg font-extrabold text-emerald-900 md:text-xl">FireGuard QR Dashboard</h1>
            <p className="text-xs font-semibold text-emerald-700 md:text-sm">ENV Team โรงพยาบาลบางคล้า</p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8">{children}</main>
    </div>
  );
}
