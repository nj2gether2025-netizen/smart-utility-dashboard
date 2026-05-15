import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { UtilityDataProvider } from "@/components/UtilityDataProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Utility Dashboard | Hospital ENV",
  description: "แดชบอร์ดบันทึกและวิเคราะห์ค่าไฟฟ้า ค่าน้ำ และค่าเชื้อเพลิงสำหรับทีม ENV โรงพยาบาล",
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
