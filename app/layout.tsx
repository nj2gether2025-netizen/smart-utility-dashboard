import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { UtilityDataProvider } from "@/components/UtilityDataProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ระบบติดตามทรัพยากร | ทีมสิ่งแวดล้อม รพ.บางคล้า",
  description: "ระบบบันทึกและแสดงผลข้อมูลการใช้ทรัพยากรของโรงพยาบาล เพื่อสนับสนุนการบริหารจัดการสิ่งแวดล้อมและพลังงานอย่างมีประสิทธิภาพ",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UtilityDataProvider>
          <AppShell>{children}</AppShell>
        </UtilityDataProvider>
      </body>
    </html>
  );
}
