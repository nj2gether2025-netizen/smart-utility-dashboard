import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "FireGuard QR Dashboard",
  description: "แดชบอร์ดติดตามการตรวจถังดับเพลิงสำหรับ ENV Team โรงพยาบาลบางคล้า",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
