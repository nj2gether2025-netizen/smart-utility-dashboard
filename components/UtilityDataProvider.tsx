"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { mockUtilityData } from "@/data/mockUtilityData";
import { UtilityFormInput, UtilityRecord } from "@/types/utility";

const storageKey = "smart-utility-dashboard-records";

type UtilityDataContextValue = {
  records: UtilityRecord[];
  addRecord: (input: UtilityFormInput) => void;
  updateRecord: (id: string, input: UtilityFormInput) => void;
  deleteRecord: (id: string) => void;
  resetMockData: () => void;
};

const UtilityDataContext = createContext<UtilityDataContextValue | undefined>(undefined);

const sortRecords = (records: UtilityRecord[]) =>
  [...records].sort((a, b) => a.year - b.year || a.month - b.month);

const createRecord = (input: UtilityFormInput): UtilityRecord => {
  const now = new Date().toISOString();

  return {
    ...input,
    id: `${input.year}-${String(input.month).padStart(2, "0")}-${crypto.randomUUID()}`,
    created_at: now,
    updated_at: now,
  };
};

export function UtilityDataProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<UtilityRecord[]>(mockUtilityData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      setRecords(sortRecords(JSON.parse(saved) as UtilityRecord[]));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(storageKey, JSON.stringify(records));
    }
  }, [hydrated, records]);

  const value = useMemo<UtilityDataContextValue>(
    () => ({
      records,
      addRecord: (input) => setRecords((current) => sortRecords([...current, createRecord(input)])),
      updateRecord: (id, input) =>
        setRecords((current) =>
          sortRecords(
            current.map((record) =>
              record.id === id ? { ...record, ...input, updated_at: new Date().toISOString() } : record,
            ),
          ),
        ),
      deleteRecord: (id) => setRecords((current) => current.filter((record) => record.id !== id)),
      resetMockData: () => setRecords(mockUtilityData),
    }),
    [records],
  );

  return <UtilityDataContext.Provider value={value}>{children}</UtilityDataContext.Provider>;
}

export const useUtilityData = () => {
  const context = useContext(UtilityDataContext);
  if (!context) {
    throw new Error("useUtilityData must be used within UtilityDataProvider");
  }

  return context;
};
