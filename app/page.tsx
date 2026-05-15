"use client";

import { DashboardCharts } from "@/components/DashboardCharts";
import { SummaryCard } from "@/components/SummaryCard";
import { useUtilityData } from "@/components/UtilityDataProvider";
import { calculateSummary, formatNumber, formatThaiCurrency } from "@/lib/calculations";

export default function DashboardPage() {
  const { records } = useUtilityData();
  const summary = calculateSummary(records);
  const latest = records.at(-1);

  return (
    <div className="space-y-8">
      <section className="executive-gradient overflow-hidden rounded-[2rem] p-8 text-white shadow-2xl shadow-teal-950/20">
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-teal-100">ทีมสิ่งแวดล้อม โรงพยาบาลบางคล้า</p>
          <h1 className="mt-4 text-3xl font-black md:text-5xl">ระบบติดตามการใช้ไฟฟ้า น้ำ และน้ำมัน</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-teal-50">
            ระบบบันทึกและแสดงผลข้อมูลการใช้ทรัพยากรของโรงพยาบาล เพื่อสนับสนุนการบริหารจัดการสิ่งแวดล้อมและพลังงานอย่างมีประสิทธิภาพ
          </p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="ค่าใช้จ่ายรวม" value={formatThaiCurrency(summary.totalUtilityCost)} subtitle={`เฉลี่ย ${formatThaiCurrency(summary.averageMonthlyCost)} / เดือน`} icon="฿" tone="slate" />
        <SummaryCard title="ไฟฟ้าสะสม" value={`${formatNumber(summary.totalElectricityKwh)} kWh`} subtitle={formatThaiCurrency(summary.totalElectricityCost)} icon="⚡" tone="teal" />
        <SummaryCard title="น้ำสะสม" value={`${formatNumber(summary.totalWaterM3)} m³`} subtitle={formatThaiCurrency(summary.totalWaterCost)} icon="💧" tone="blue" />
        <SummaryCard title="เชื้อเพลิงสะสม" value={`${formatNumber(summary.totalFuelLiters)} L`} subtitle={formatThaiCurrency(summary.totalFuelCost)} icon="⛽" tone="amber" />
      </section>

      {latest ? (
        <section className="grid gap-5 lg:grid-cols-3">
          <div className="glass-card rounded-3xl p-6 lg:col-span-2">
            <p className="text-sm font-bold text-teal-700">Executive Note</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">ประเด็นเดือนล่าสุด</h2>
            <p className="mt-4 leading-8 text-slate-600">{latest.note}</p>
          </div>
          <div className="rounded-3xl border border-dashed border-teal-300 bg-teal-50 p-6">
            <p className="text-sm font-bold text-teal-800">Future Ready</p>
            <h2 className="mt-2 text-xl font-black text-slate-950">รองรับโมดูลถัดไป</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>• SEC: kWh ต่อหน่วยบริการ</li>
              <li>• Carbon Footprint: tCO₂e</li>
              <li>• Alert ค่าใช้จ่ายผิดปกติ</li>
            </ul>
          </div>
        </section>
      ) : null}

      <DashboardCharts records={records} />
    </div>
  );
}
