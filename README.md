# Smart Utility Dashboard

เว็บแอป Next.js สำหรับทีม ENV โรงพยาบาล เพื่อบันทึกและสรุปข้อมูลสาธารณูปโภครายเดือน ได้แก่ ไฟฟ้า น้ำ เชื้อเพลิง และหมายเหตุการดำเนินงาน

## Features V1

- Dashboard ภาษาไทย พร้อม summary cards และ charts จาก Recharts
- Monthly data entry form สำหรับปี เดือน electricity_kwh/electricity_cost water_m3/water_cost fuel_type/fuel_liters/fuel_cost และ note
- Historical table พร้อม edit/delete actions
- Executive report page สำหรับผู้บริหาร
- Mock data + localStorage เพื่อเริ่มใช้งานทันที
- โครงสร้าง Supabase client และ SQL schema เตรียมต่อ database/authentication
- รองรับการต่อยอด SEC และ Carbon Footprint

## วิธีรันเพื่อดูหน้าเว็บจริง

> V1 ใช้ mock data และ `localStorage` ดังนั้นยังไม่จำเป็นต้องตั้งค่า Supabase ก็สามารถเปิดดูเว็บได้ทันทีหลังติดตั้ง dependencies สำเร็จ

### 1) ติดตั้ง dependencies

```bash
npm install
```

ถ้าใช้ pnpm:

```bash
pnpm install
```

### 2) เปิด development server

สำหรับเครื่อง local ทั่วไป:

```bash
npm run dev
```

สำหรับ preview ใน container/Codespace ให้ bind host เป็น `0.0.0.0`:

```bash
npm run dev:preview
```

จากนั้นเปิดหน้าเว็บที่:

```text
http://localhost:3000
```

ถ้า environment ของคุณแสดง forwarded port ให้เปิด URL ของ port `3000` ที่ระบบสร้างให้

### 3) ตรวจสอบว่าไม่มี error ก่อนส่งงาน

รันคำสั่งต่อไปนี้หลัง `npm install` สำเร็จ:

```bash
npm run typecheck
npm run lint
npm run build
```

ถ้า build ผ่าน ให้ลอง production mode:

```bash
npm run start
```

## สถานะการตรวจสอบใน environment นี้

ใน container ปัจจุบันยังไม่สามารถเปิด preview จริงได้ เพราะ package manager ถูกบล็อกจากการดาวน์โหลด dependencies จาก `registry.npmjs.org` ด้วย HTTP `403 Forbidden` ดังนั้นคำสั่ง `next dev` / `next build` ยังรันไม่ได้ใน environment นี้จนกว่าจะติดตั้ง dependencies ได้สำเร็จ

คำสั่งที่ลองแล้ว:

```bash
npm install
pnpm install
bun install
npm run build
```

ผลลัพธ์หลักคือ registry คืนค่า `403 Forbidden` และเมื่อไม่มี `node_modules` จึงเกิด `next: not found` ตอน build

## Supabase Preparation

1. สร้างโปรเจกต์ Supabase และเปิด Authentication ตาม policy ของโรงพยาบาล
2. คัดลอก SQL จาก `lib/supabase-schema.sql` ไป run ใน Supabase SQL editor
3. ตั้งค่า environment variables โดยคัดลอกจาก `.env.example` เป็น `.env.local`:

```bash
cp .env.example .env.local
```

แล้วใส่ค่าจริง:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

V1 ยังใช้ mock/localStorage เป็นหลัก แต่ `lib/supabase.ts` และ schema ถูกเตรียมไว้เพื่อเชื่อมต่อใน V2
