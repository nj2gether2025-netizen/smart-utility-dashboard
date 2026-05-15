"use client";

import { useMemo, useState } from "react";
import { UtilityForm } from "@/components/UtilityForm";
import { useUtilityData } from "@/components/UtilityDataProvider";
import { thaiMonths } from "@/data/mockUtilityData";
import { formatNumber, formatThaiCurrency, getMonthlyLabel } from "@/lib/calculations";

export default function HistoryPage() {
  const { records, deleteRecord, updateRecord, resetMockData } = useUtilityData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingRecord = useMemo(() => records.find((record) => record.id === editingId), [editingId, records]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-teal-700">Historical Records</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">ตารางข้อมูลย้อนหลัง</h1>
          <p className="mt-3 max-w-3xl text-slate-600">ตรวจสอบ แก้ไข หรือลบข้อมูลรายเดือนก่อนนำไปใช้ในรายงาน</p>
        </div>
        <button
          className="rounded-2xl border border-teal-200 bg-white px-5 py-3 text-sm font-black text-teal-800 hover:bg-teal-50"
          onClick={resetMockData}
          type="button"
        >
          โหลด Mock Data ใหม่
        </button>
      </div>

      {editingRecord ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-950">แก้ไขข้อมูล {getMonthlyLabel(editingRecord.month, editingRecord.year, thaiMonths)}</h2>
            <button className="text-sm font-bold text-slate-500 hover:text-slate-950" onClick={() => setEditingId(null)} type="button">
              ยกเลิก
            </button>
          </div>
          <UtilityForm
            initialRecord={editingRecord}
            submitLabel="อัปเดตข้อมูล"
            onSubmit={(input) => {
              updateRecord(editingRecord.id, input);
              setEditingId(null);
            }}
          />
        </section>
      ) : null}

      <section className="glass-card overflow-hidden rounded-3xl">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-left text-sm">
            <thead className="bg-slate-950 text-white">
              <tr>
                <th className="px-5 py-4 font-bold">เดือน</th>
                <th className="px-5 py-4 font-bold">ไฟฟ้า</th>
                <th className="px-5 py-4 font-bold">ค่าไฟ</th>
                <th className="px-5 py-4 font-bold">น้ำ</th>
                <th className="px-5 py-4 font-bold">ค่าน้ำ</th>
                <th className="px-5 py-4 font-bold">เชื้อเพลิง</th>
                <th className="px-5 py-4 font-bold">ค่าเชื้อเพลิง</th>
                <th className="px-5 py-4 font-bold">หมายเหตุ</th>
                <th className="px-5 py-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((record) => (
                <tr key={record.id} className="bg-white/70 hover:bg-teal-50/60">
                  <td className="px-5 py-4 font-black text-slate-950">{getMonthlyLabel(record.month, record.year, thaiMonths)}</td>
                  <td className="px-5 py-4 text-slate-600">{formatNumber(record.electricity_kwh)} kWh</td>
                  <td className="px-5 py-4 font-bold text-slate-800">{formatThaiCurrency(record.electricity_cost)}</td>
                  <td className="px-5 py-4 text-slate-600">{formatNumber(record.water_m3)} m³</td>
                  <td className="px-5 py-4 font-bold text-slate-800">{formatThaiCurrency(record.water_cost)}</td>
                  <td className="px-5 py-4 text-slate-600">{record.fuel_type} / {formatNumber(record.fuel_liters)} L</td>
                  <td className="px-5 py-4 font-bold text-slate-800">{formatThaiCurrency(record.fuel_cost)}</td>
                  <td className="max-w-72 px-5 py-4 text-slate-500">{record.note}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button className="rounded-xl bg-cyan-50 px-3 py-2 text-xs font-black text-cyan-800 hover:bg-cyan-100" onClick={() => setEditingId(record.id)} type="button">
                        แก้ไข
                      </button>
                      <button className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-black text-rose-700 hover:bg-rose-100" onClick={() => deleteRecord(record.id)} type="button">
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
