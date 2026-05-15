"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { thaiMonths } from "@/data/mockUtilityData";
import { formatThaiCurrency } from "@/lib/calculations";
import { UtilityRecord } from "@/types/utility";

const colors = ["#0f766e", "#0891b2", "#f59e0b"];

export function DashboardCharts({ records }: { records: UtilityRecord[] }) {
  const chartData = records.map((record) => ({
    label: thaiMonths[record.month - 1],
    electricity: record.electricity_cost,
    water: record.water_cost,
    fuel: record.fuel_cost,
    kwh: record.electricity_kwh,
    m3: record.water_m3,
  }));

  const totalElectricity = records.reduce((sum, record) => sum + record.electricity_cost, 0);
  const totalWater = records.reduce((sum, record) => sum + record.water_cost, 0);
  const totalFuel = records.reduce((sum, record) => sum + record.fuel_cost, 0);
  const pieData = [
    { name: "ไฟฟ้า", value: totalElectricity },
    { name: "น้ำ", value: totalWater },
    { name: "เชื้อเพลิง", value: totalFuel },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
      <section className="glass-card rounded-3xl p-6">
        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold text-teal-700">แนวโน้มค่าใช้จ่ายรายเดือน</p>
            <h2 className="text-xl font-black text-slate-950">Utility Cost by Category</h2>
          </div>
          <p className="text-xs text-slate-500">หน่วย: บาท / เดือน</p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ left: 0, right: 12, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="electricity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f766e" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891b2" stopOpacity={0.32} />
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
              <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `${Number(value) / 1000000}M`} tick={{ fill: "#475569", fontSize: 12 }} />
              <Tooltip formatter={(value) => formatThaiCurrency(Number(value))} />
              <Legend />
              <Area type="monotone" dataKey="electricity" name="ไฟฟ้า" stroke="#0f766e" fill="url(#electricity)" strokeWidth={3} />
              <Area type="monotone" dataKey="water" name="น้ำ" stroke="#0891b2" fill="url(#water)" strokeWidth={3} />
              <Area type="monotone" dataKey="fuel" name="เชื้อเพลิง" stroke="#f59e0b" fill="#f59e0b22" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="glass-card rounded-3xl p-6">
        <div className="mb-4">
          <p className="text-sm font-bold text-teal-700">สัดส่วนค่าใช้จ่าย</p>
          <h2 className="text-xl font-black text-slate-950">Cost Breakdown</h2>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={68} outerRadius={105} paddingAngle={4}>
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatThaiCurrency(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="glass-card rounded-3xl p-6 xl:col-span-2">
        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold text-teal-700">การใช้ทรัพยากร</p>
            <h2 className="text-xl font-black text-slate-950">ไฟฟ้าและน้ำรายเดือน</h2>
          </div>
          <p className="text-xs text-slate-500">เตรียมต่อยอด KPI: SEC, Carbon Footprint</p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: 0, right: 12, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
              <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fill: "#475569", fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#475569", fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="kwh" name="ไฟฟ้า (kWh)" fill="#0f766e" radius={[10, 10, 0, 0]} />
              <Bar yAxisId="right" dataKey="m3" name="น้ำ (m³)" fill="#0891b2" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
