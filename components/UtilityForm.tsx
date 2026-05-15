"use client";

import { FormEvent, useMemo, useState } from "react";
import { thaiMonths } from "@/data/mockUtilityData";
import { FuelType, UtilityFormInput, UtilityRecord } from "@/types/utility";

const currentYear = new Date().getFullYear();
const fuelTypes: FuelType[] = ["Diesel", "LPG", "Gasoline", "Natural Gas"];

const defaultInput: UtilityFormInput = {
  year: currentYear,
  month: new Date().getMonth() + 1,
  electricity_kwh: 0,
  electricity_cost: 0,
  water_m3: 0,
  water_cost: 0,
  fuel_type: "Diesel",
  fuel_liters: 0,
  fuel_cost: 0,
  note: "",
};

type UtilityFormProps = {
  initialRecord?: UtilityRecord;
  submitLabel?: string;
  onSubmit: (input: UtilityFormInput) => void;
};

export function UtilityForm({ initialRecord, submitLabel = "บันทึกข้อมูล", onSubmit }: UtilityFormProps) {
  const [form, setForm] = useState<UtilityFormInput>(initialRecord ?? defaultInput);
  const [saved, setSaved] = useState(false);

  const totalCost = useMemo(
    () => form.electricity_cost + form.water_cost + form.fuel_cost,
    [form.electricity_cost, form.fuel_cost, form.water_cost],
  );

  const updateField = <K extends keyof UtilityFormInput>(key: K, value: UtilityFormInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(form);
    setSaved(true);
    if (!initialRecord) {
      setForm(defaultInput);
    }
  };

  const numberInputClass =
    "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10";

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm font-bold text-slate-700">
          ปีงบประมาณ
          <input
            className={numberInputClass}
            type="number"
            min="2020"
            value={form.year}
            onChange={(event) => updateField("year", Number(event.target.value))}
            required
          />
        </label>
        <label className="text-sm font-bold text-slate-700">
          เดือน
          <select
            className={numberInputClass}
            value={form.month}
            onChange={(event) => updateField("month", Number(event.target.value))}
          >
            {thaiMonths.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-bold text-slate-700">
          Electricity (kWh)
          <input
            className={numberInputClass}
            type="number"
            min="0"
            value={form.electricity_kwh}
            onChange={(event) => updateField("electricity_kwh", Number(event.target.value))}
            required
          />
        </label>
        <label className="text-sm font-bold text-slate-700">
          ค่าไฟฟ้า (บาท)
          <input
            className={numberInputClass}
            type="number"
            min="0"
            value={form.electricity_cost}
            onChange={(event) => updateField("electricity_cost", Number(event.target.value))}
            required
          />
        </label>
        <label className="text-sm font-bold text-slate-700">
          Water (m³)
          <input
            className={numberInputClass}
            type="number"
            min="0"
            value={form.water_m3}
            onChange={(event) => updateField("water_m3", Number(event.target.value))}
            required
          />
        </label>
        <label className="text-sm font-bold text-slate-700">
          ค่าน้ำ (บาท)
          <input
            className={numberInputClass}
            type="number"
            min="0"
            value={form.water_cost}
            onChange={(event) => updateField("water_cost", Number(event.target.value))}
            required
          />
        </label>
        <label className="text-sm font-bold text-slate-700">
          Fuel Type
          <select
            className={numberInputClass}
            value={form.fuel_type}
            onChange={(event) => updateField("fuel_type", event.target.value as FuelType)}
          >
            {fuelTypes.map((fuelType) => (
              <option key={fuelType} value={fuelType}>
                {fuelType}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-bold text-slate-700">
          Fuel (liters)
          <input
            className={numberInputClass}
            type="number"
            min="0"
            value={form.fuel_liters}
            onChange={(event) => updateField("fuel_liters", Number(event.target.value))}
            required
          />
        </label>
        <label className="text-sm font-bold text-slate-700">
          ค่าเชื้อเพลิง (บาท)
          <input
            className={numberInputClass}
            type="number"
            min="0"
            value={form.fuel_cost}
            onChange={(event) => updateField("fuel_cost", Number(event.target.value))}
            required
          />
        </label>
        <div className="rounded-2xl bg-teal-50 p-4 text-sm text-teal-900 xl:col-span-3">
          <p className="font-bold">ยอดรวมเดือนนี้</p>
          <p className="mt-2 text-2xl font-black">
            {new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(totalCost)}
          </p>
        </div>
        <label className="text-sm font-bold text-slate-700 md:col-span-2 xl:col-span-4">
          หมายเหตุ / Action Taken
          <textarea
            className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
            value={form.note}
            onChange={(event) => updateField("note", event.target.value)}
            placeholder="เช่น มาตรการประหยัดพลังงาน เหตุการณ์ผิดปกติ แผนปรับปรุง"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">V1 บันทึกลง localStorage และพร้อมเปลี่ยนเป็น Supabase table</p>
        <div className="flex items-center gap-3">
          {saved ? <span className="text-sm font-bold text-teal-700">บันทึกสำเร็จ</span> : null}
          <button className="rounded-2xl bg-teal-700 px-6 py-3 text-sm font-black text-white shadow-lg shadow-teal-700/20 hover:bg-teal-800" type="submit">
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
