export type FuelType = "Diesel" | "LPG" | "Gasoline" | "Natural Gas";

export type UtilityRecord = {
  id: string;
  year: number;
  month: number;
  electricity_kwh: number;
  electricity_cost: number;
  water_m3: number;
  water_cost: number;
  fuel_type: FuelType;
  fuel_liters: number;
  fuel_cost: number;
  note: string;
  created_at: string;
  updated_at: string;
};

export type UtilityFormInput = Omit<UtilityRecord, "id" | "created_at" | "updated_at">;

export type UtilitySummary = {
  totalElectricityKwh: number;
  totalElectricityCost: number;
  totalWaterM3: number;
  totalWaterCost: number;
  totalFuelLiters: number;
  totalFuelCost: number;
  totalUtilityCost: number;
  averageMonthlyCost: number;
};
