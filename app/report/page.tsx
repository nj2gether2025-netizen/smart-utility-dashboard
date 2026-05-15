"use client";

import { DashboardCharts } from "@/components/DashboardCharts";
import { SummaryCard } from "@/components/SummaryCard";
import { useUtilityData } from "@/components/UtilityDataProvider";
import { calculateSummary, formatNumber, formatThaiCurrency, getCostPerKwh, getCostPerWaterM3 } from "@/lib/calculations";

export default function ReportPage() {
  const { records } = useUtilityData();
  const summary = calculateSummary(records);
  const latest = records.at(-1);
  const previous = records.at(-2);
  const latestTotal = latest ? latest.electricity_cost + latest.water_cost + latest.fuel_cost : 0;
  const previousTotal = previous ? previous.electricity_cost + previous.water_cost + previous.fuel_cost : 0;
  const changePercent = previousTotal ? ((latestTotal - previousTotal) / previousTotal) * 100 : 0;

  return (
    <div className="space-y-8">
      <section className="executive-gradient rounded-[2rem] p-8 text-white shadow-2xl shadow-teal-950/20">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-teal-100">Executive Report</p>
        <h1 className="mt-4 text-3xl font-black md:text-5xl">รายงานสาธารณูปโภคสำหรับผู้บริหาร</h1>
        <p className="mt-4 max-w-3xl leading-8 text-teal-50">
          สรุปสถานะค่าใช้จ่ายหลักของโรงพยาบาล พร้อมข้อสังเกตและโครงสร้างข้อมูลที่พร้อมเชื่อมต่อ Supabase Authentication ใน V2
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="งบประมาณใช้จริง" value={formatThaiCurrency(summary.totalUtilityCost)} subtitle="รวมทุกหมวดในชุดข้อมูล" icon="📌" tone="slate" />
        <SummaryCard title="เดือนล่าสุด" value={formatThaiCurrency(latestTotal)} subtitle={`${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(1)}% เทียบเดือนก่อน`} icon="📈" tone="teal" />
        <SummaryCard title="ค่าไฟเฉลี่ย" value={latest ? `${getCostPerKwh(latest).toFixed(2)} บาท/kWh` : "-"} subtitle="ตัวชี้วัดเบื้องต้นก่อน SEC" icon="⚡" tone="blue" />
        <SummaryCard title="ค่าน้ำเฉลี่ย" value={latest ? `${getCostPerWaterM3(latest).toFixed(2)} บาท/m³` : "-"} subtitle="ติดตามความผิดปกติรายเดือน" icon="💧" tone="amber" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card rounded-3xl p-6 lg:col-span-2">
          <p className="text-sm font-bold text-teal-700">Management Insight</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">ข้อเสนอแนะเบื้องต้น</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <h3 className="font-black text-slate-950">ควบคุมไฟฟ้า</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">ติดตามโหลดระบบปรับอากาศและ Chiller ในช่วงอากาศร้อน พร้อมกำหนด baseline สำหรับ SEC</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <h3 className="font-black text-slate-950">บริหารน้ำ</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">เปรียบเทียบ m³ ต่อพื้นที่หรือจำนวนผู้รับบริการ เพื่อเตรียมแจ้งเตือนการรั่วไหล</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <h3 className="font-black text-slate-950">เชื้อเพลิง</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">แยกประเภทเชื้อเพลิงเพื่อรองรับ emission factor และรายงาน Carbon Footprint</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <h3 className="font-black text-slate-950">Data Governance</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">V1 ใช้ mock/localStorage และมี schema Supabase พร้อม RLS สำหรับแยกข้อมูลตามผู้ใช้งาน</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-3xl p-6">
          <p className="text-sm font-bold text-teal-700">KPI Snapshot</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">ตัวเลขสำคัญ</h2>
          <dl className="mt-5 space-y-4">
            <div className="rounded-2xl bg-teal-50 p-4">
              <dt className="text-xs font-bold text-teal-800">Electricity</dt>
              <dd className="mt-1 text-xl font-black text-slate-950">{formatNumber(summary.totalElectricityKwh)} kWh</dd>
            </div>
            <div className="rounded-2xl bg-cyan-50 p-4">
              <dt className="text-xs font-bold text-cyan-800">Water</dt>
              <dd className="mt-1 text-xl font-black text-slate-950">{formatNumber(summary.totalWaterM3)} m³</dd>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4">
              <dt className="text-xs font-bold text-amber-800">Fuel</dt>
              <dd className="mt-1 text-xl font-black text-slate-950">{formatNumber(summary.totalFuelLiters)} L</dd>
            </div>
          </dl>
        </div>
      </section>

      <DashboardCharts records={records} />
    </div>
  );
}
