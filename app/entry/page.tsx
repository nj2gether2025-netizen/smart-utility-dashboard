"use client";

import { UtilityForm } from "@/components/UtilityForm";
import { useUtilityData } from "@/components/UtilityDataProvider";

export default function EntryPage() {
  const { addRecord } = useUtilityData();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-teal-700">Monthly Data Entry</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">บันทึกข้อมูลสาธารณูปโภครายเดือน</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          กรอกข้อมูลตามใบแจ้งหนี้หรือมิเตอร์ประจำเดือน เพื่อใช้วิเคราะห์ค่าใช้จ่ายและรายงานผู้บริหาร
        </p>
      </div>
      <UtilityForm onSubmit={addRecord} />
    </div>
  );
}
