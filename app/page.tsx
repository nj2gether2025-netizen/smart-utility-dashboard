"use client";

import { useMemo, useState } from "react";

type FireRecord = {
  code: string;
  building: string;
  location: string;
  [key: string]: string;
};

const THAI_MONTHS = ["พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const CHECKED = "✅";
const UNCHECKED = "❌";

const normalizeKey = (key: string) => key.trim().toLowerCase();

const mapRow = (row: Record<string, string>): FireRecord => {
  const entries = Object.entries(row).map(([k, v]) => [normalizeKey(k), (v ?? "").trim()]);
  const mapped = Object.fromEntries(entries);

  return {
    code: mapped["รหัสถังดับเพลิง"] ?? mapped["code"] ?? "-",
    building: mapped["อาคาร"] ?? mapped["building"] ?? "-",
    location: mapped["จุดติดตั้ง"] ?? mapped["location"] ?? "-",
    ...mapped,
  };
};

const isCheckedForMonth = (row: FireRecord, month: string) => (row[normalizeKey(month)] ?? "") === CHECKED;

export default function FireGuardDashboardPage() {
  const [sheetUrl, setSheetUrl] = useState("");
  const [activeMonth, setActiveMonth] = useState(THAI_MONTHS[0]);
  const [records, setRecords] = useState<FireRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const summary = useMemo(() => {
    const total = records.length;
    const checked = records.filter((r) => isCheckedForMonth(r, activeMonth)).length;
    const unchecked = total - checked;
    const completionPercent = total ? Math.round((checked / total) * 100) : 0;
    return { total, checked, unchecked, completionPercent };
  }, [activeMonth, records]);

  const uncheckedRows = useMemo(
    () => records.filter((r) => !isCheckedForMonth(r, activeMonth)),
    [activeMonth, records],
  );

  const loadSheetData = async () => {
    if (!sheetUrl.trim()) {
      setError("กรุณาใส่ลิงก์ Google Sheets (CSV) ก่อน");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await fetch(sheetUrl.trim());
      if (!response.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ");

      const text = await response.text();
      const rows = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.split(",").map((cell) => cell.replace(/^"|"$/g, "").trim()));

      if (rows.length < 2) throw new Error("ไม่พบข้อมูลในชีต");
      const [headers, ...body] = rows;
      const jsonRows = body.map((row) => Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ""])));
      setRecords(jsonRows.map(mapRow));
    } catch {
      setError("ไม่สามารถอ่านข้อมูลได้ กรุณาตรวจสอบว่าเผยแพร่ Google Sheet เป็น CSV สาธารณะแล้ว");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold text-emerald-800 md:text-3xl">FireGuard QR Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">แดชบอร์ดติดตามการตรวจถังดับเพลิงจาก Google Sheet แบบเรียลไทม์</p>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
            placeholder="วางลิงก์ CSV จาก Google Sheets"
            className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
          />
          <button
            onClick={loadSheetData}
            disabled={loading}
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {loading ? "กำลังโหลด..." : "โหลดข้อมูล"}
          </button>
        </div>
        {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[`ถังทั้งหมด: ${summary.total}`, `ตรวจแล้ว: ${summary.checked}`, `ยังไม่ตรวจ: ${summary.unchecked}`, `ความครบถ้วน: ${summary.completionPercent}%`].map((item) => (
          <div key={item} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-lg font-bold text-emerald-900">{item}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-emerald-200 bg-white p-5">
        <label className="text-sm font-semibold text-slate-700">เลือกเดือนที่ต้องการดูสถานะ</label>
        <select
          value={activeMonth}
          onChange={(e) => setActiveMonth(e.target.value)}
          className="mt-2 w-full max-w-xs rounded-xl border border-emerald-200 px-4 py-2"
        >
          {THAI_MONTHS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-emerald-200 bg-white p-5">
          <h2 className="mb-4 text-xl font-bold text-emerald-800">รายการถังดับเพลิงทั้งหมด</h2>
          <Table rows={records} activeMonth={activeMonth} />
        </div>

        <div className="rounded-3xl border border-emerald-200 bg-white p-5">
          <h2 className="mb-4 text-xl font-bold text-red-700">รายการถังที่ยังไม่ตรวจ</h2>
          <Table rows={uncheckedRows} activeMonth={activeMonth} />
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-emerald-300 bg-emerald-50 p-5">
        <h2 className="text-xl font-bold text-emerald-900">พื้นที่แผนผังตำแหน่งถัง (รองรับในอนาคต)</h2>
        <p className="mt-2 text-sm text-slate-600">สามารถวางรูปผังอาคาร และเพิ่ม marker สีเขียว/แดง เพื่อแสดงสถานะรายจุดได้ในเฟสถัดไป</p>
        <div className="mt-4 flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 bg-white text-slate-500">แผนผังอาคาร / Floor Plan Placeholder</div>
      </section>
    </div>
  );
}

function Table({ rows, activeMonth }: { rows: FireRecord[]; activeMonth: string }) {
  return (
    <div className="max-h-[28rem] overflow-auto rounded-2xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-emerald-100 text-left text-emerald-900">
          <tr>
            <th className="px-3 py-2">รหัสถังดับเพลิง</th>
            <th className="px-3 py-2">อาคาร</th>
            <th className="px-3 py-2">จุดติดตั้ง</th>
            <th className="px-3 py-2">สถานะ {activeMonth}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => {
            const checked = isCheckedForMonth(r, activeMonth);
            return (
              <tr key={`${r.code}-${idx}`} className="border-t border-slate-100">
                <td className="px-3 py-2">{r.code}</td>
                <td className="px-3 py-2">{r.building}</td>
                <td className="px-3 py-2">{r.location}</td>
                <td className={`px-3 py-2 font-bold ${checked ? "text-emerald-700" : "text-red-600"}`}>{checked ? CHECKED : UNCHECKED}</td>
              </tr>
            );
          })}
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-3 py-6 text-center text-slate-500">ยังไม่มีข้อมูล</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
