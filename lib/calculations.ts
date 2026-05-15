import { UtilityRecord, UtilitySummary } from "@/types/utility";

export const formatThaiCurrency = (value: number) =>
  new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);

export const formatNumber = (value: number) => new Intl.NumberFormat("th-TH").format(value);

export const getMonthlyLabel = (month: number, year: number, months: string[]) =>
  `${months[month - 1]} ${year + 543}`;

export const calculateSummary = (records: UtilityRecord[]): UtilitySummary => {
  const totals = records.reduce(
    (summary, record) => ({
      totalElectricityKwh: summary.totalElectricityKwh + record.electricity_kwh,
      totalElectricityCost: summary.totalElectricityCost + record.electricity_cost,
      totalWaterM3: summary.totalWaterM3 + record.water_m3,
      totalWaterCost: summary.totalWaterCost + record.water_cost,
      totalFuelLiters: summary.totalFuelLiters + record.fuel_liters,
      totalFuelCost: summary.totalFuelCost + record.fuel_cost,
      totalUtilityCost:
        summary.totalUtilityCost + record.electricity_cost + record.water_cost + record.fuel_cost,
    }),
    {
      totalElectricityKwh: 0,
      totalElectricityCost: 0,
      totalWaterM3: 0,
      totalWaterCost: 0,
      totalFuelLiters: 0,
      totalFuelCost: 0,
      totalUtilityCost: 0,
    },
  );

  return {
    ...totals,
    averageMonthlyCost: records.length ? totals.totalUtilityCost / records.length : 0,
  };
};

export const getCostPerKwh = (record: UtilityRecord) =>
  record.electricity_kwh ? record.electricity_cost / record.electricity_kwh : 0;

export const getCostPerWaterM3 = (record: UtilityRecord) =>
  record.water_m3 ? record.water_cost / record.water_m3 : 0;
