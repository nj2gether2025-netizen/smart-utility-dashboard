"use client";

import { useMemo, useState } from "react";

type FireRecord = {
  code: string;
  building: string;
  location: string;
  mapX?: string;
  mapY?: string;
  [key: string]: string | undefined;
};

const THAI_MONTHS = ["พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const CHECKED = "✅";
const UNCHECKED = "❌";

const normalizeKey = (key: string) => key.trim().toLowerCase();

const getMonthStatus = (row: FireRecord, month: string) => (row[normalizeKey(month)] ?? "").trim();

const getStatusTone = (status: string) => {
  if (status === CHECKED) return "checked";
  if (status === UNCHECKED) return "unchecked";
  return "unknown";
};

const mapRow = (row: Record<string, string>): FireRecord => {
  const entries = Object.entries(row).map(([k, v]) => [normalizeKey(k), (v ?? "").trim()]);
  const mapped = Object.fromEntries(entries);

  return {
    code: mapped["รหัสถังดับเพลิง"] ?? mapped["code"] ?? "-",
    building: mapped["อาคาร"] ?? mapped["building"] ?? "-",
    location: mapped["จุดติดตั้ง"] ?? mapped["location"] ?? "-",
    mapX: mapped["mapx"],
    mapY: mapped["mapy"],
    ...mapped,
  };
};

const parsePercent = (value?: string) => {
  const n = Number((value ?? "").replace("%", ""));
  if (Number.isNaN(n)) return null;
  return Math.max(0, Math.min(100, n));
};

export default function FireGuardDashboardPage() {
  const [sheetUrl, setSheetUrl] = useState("");
  const [activeMonth, setActiveMonth] = useState(THAI_MONTHS[0]);
  const [records, setRecords] = useState<FireRecord[]>([]);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const summary = useMemo(() => {
    const total = records.length;
    const checked = records.filter((r) => getMonthStatus(r, activeMonth) === CHECKED).length;
    const unchecked = records.filter((r) => getMonthStatus(r, activeMonth) === UNCHECKED).length;
    const completionPercent = total ? Math.round((checked / total) * 100) : 0;
    return { total, checked, unchecked, completionPercent };
  }, [activeMonth, records]);

  const uncheckedRows = useMemo(
    () => records.filter((r) => getMonthStatus(r, activeMonth) !== CHECKED),
    [activeMonth, records],
  );

  const mappableRecords = useMemo(
    () =>
      records
        .map((r) => {
          const x = parsePercent(r.mapX);
          const y = parsePercent(r.mapY);
          return x === null || y === null ? null : { record: r, x, y };
        })
        .filter((r): r is { record: FireRecord; x: number; y: number } => r !== null),
    [records],
  );

  const selectedRecord = useMemo(() => records.find((r) => r.code === selectedCode) ?? null, [records, selectedCode]);

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
      const nextRecords = jsonRows.map(mapRow);
      setRecords(nextRecords);
      setSelectedCode(nextRecords[0]?.code ?? null);
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
          <input value={sheetUrl} onChange={(e) => setSheetUrl(e.target.value)} placeholder="วางลิงก์ CSV จาก Google Sheets" className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
          <button onClick={loadSheetData} disabled={loading} className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-50">
            {loading ? "กำลังโหลด..." : "โหลดข้อมูล"}
          </button>
        </div>
        {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[`ถังทั้งหมด: ${summary.total}`, `ตรวจแล้ว: ${summary.checked}`, `ยังไม่ตรวจ: ${summary.unchecked}`, `ความครบถ้วน: ${summary.completionPercent}%`].map((item) => (
          <div key={item} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><p className="text-lg font-bold text-emerald-900">{item}</p></div>
        ))}
      </section>

      <section className="rounded-3xl border border-emerald-200 bg-white p-5">
        <h2 className="text-xl font-bold text-emerald-900">แผนผังถังดับเพลิง อาคารอุบัติเหตุ ชั้น 1</h2>
        <p className="mt-2 text-sm text-slate-600">ใช้รูป /maps/er-floor1.png และอ่านตำแหน่ง marker จากคอลัมน์ mapX / mapY (เปอร์เซ็นต์)</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-white">
            <img src="/maps/er-floor1.png" alt="แผนผังอาคารอุบัติเหตุ ชั้น 1" className="h-auto w-full object-contain" />
            {mappableRecords.map(({ record, x, y }, idx) => {
              const status = getMonthStatus(record, activeMonth);
              const tone = getStatusTone(status);
              const bg = tone === "checked" ? "bg-emerald-600" : tone === "unchecked" ? "bg-red-600" : "bg-slate-500";

              return (
                <button
                  key={`${record.code}-${idx}`}
                  type="button"
                  onClick={() => setSelectedCode(record.code)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white px-2 py-1 text-[10px] font-bold text-white shadow-md ${bg}`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  title={record.code}
                >
                  {record.code}
                </button>
              );
            })}
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
            <h3 className="font-bold text-emerald-900">รายละเอียด marker</h3>
            {selectedRecord ? (
              <ul className="mt-3 space-y-2 text-slate-700">
                <li><b>รหัสถัง:</b> {selectedRecord.code}</li>
                <li><b>อาคาร:</b> {selectedRecord.building}</li>
                <li><b>จุดติดตั้ง:</b> {selectedRecord.location}</li>
                <li><b>สถานะ {activeMonth}:</b> {getMonthStatus(selectedRecord, activeMonth) || "ไม่มีข้อมูล"}</li>
              </ul>
            ) : <p className="mt-3 text-slate-600">คลิก marker เพื่อดูรายละเอียด</p>}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-200 bg-white p-5">
        <label className="text-sm font-semibold text-slate-700">เลือกเดือนที่ต้องการดูสถานะ</label>
        <select value={activeMonth} onChange={(e) => setActiveMonth(e.target.value)} className="mt-2 w-full max-w-xs rounded-xl border border-emerald-200 px-4 py-2">
          {THAI_MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-emerald-200 bg-white p-5"><h2 className="mb-4 text-xl font-bold text-emerald-800">รายการถังดับเพลิงทั้งหมด</h2><Table rows={records} activeMonth={activeMonth} /></div>
        <div className="rounded-3xl border border-emerald-200 bg-white p-5"><h2 className="mb-4 text-xl font-bold text-red-700">รายการถังที่ยังไม่ตรวจ</h2><Table rows={uncheckedRows} activeMonth={activeMonth} /></div>
      </section>
    </div>
  );
}

function Table({ rows, activeMonth }: { rows: FireRecord[]; activeMonth: string }) {
  return (
    <div className="max-h-[28rem] overflow-auto rounded-2xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-emerald-100 text-left text-emerald-900"><tr><th className="px-3 py-2">รหัสถังดับเพลิง</th><th className="px-3 py-2">อาคาร</th><th className="px-3 py-2">จุดติดตั้ง</th><th className="px-3 py-2">สถานะ {activeMonth}</th></tr></thead>
        <tbody>
          {rows.map((r, idx) => {
            const status = getMonthStatus(r, activeMonth);
            const tone = getStatusTone(status);
            const textColor = tone === "checked" ? "text-emerald-700" : tone === "unchecked" ? "text-red-600" : "text-slate-500";
            return (
              <tr key={`${r.code}-${idx}`} className="border-t border-slate-100">
                <td className="px-3 py-2">{r.code}</td><td className="px-3 py-2">{r.building}</td><td className="px-3 py-2">{r.location}</td>
                <td className={`px-3 py-2 font-bold ${textColor}`}>{status || "ไม่มีข้อมูล"}</td>
              </tr>
            );
          })}
          {rows.length === 0 ? <tr><td colSpan={4} className="px-3 py-6 text-center text-slate-500">ยังไม่มีข้อมูล</td></tr> : null}
        </tbody>
      </table>
    </div>
  );
}
