"use client";
import { useState, useEffect, useCallback } from "react";
import { Holding } from "@/lib/types";
import { PROPERTIES } from "@/lib/data/properties";

const HOLDINGS_KEY = "bw_holdings";
const INCOME_KEY = "bw_income_history";

type IncomePoint = { month: string; value: number; key: string };

function computeMonthlyIncome(holdings: Holding[]): number {
  return holdings.reduce((sum, h) => {
    const prop = PROPERTIES.find((p) => p.id === h.propertyId);
    if (!prop) return sum;
    return sum + Math.round((h.currentValue * prop.expectedYield) / 100 / 12);
  }, 0);
}

function currentMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function currentMonthLabel() {
  return new Date().toLocaleString("en", { month: "short" });
}

export function useHoldings() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [incomeHistory, setIncomeHistory] = useState<{ month: string; value: number }[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HOLDINGS_KEY);
      const parsed: Holding[] = raw ? JSON.parse(raw) : [];
      setHoldings(parsed);

      const rawIncome = localStorage.getItem(INCOME_KEY);
      const income: IncomePoint[] = rawIncome ? JSON.parse(rawIncome) : [];

      if (parsed.length > 0) {
        const key = currentMonthKey();
        const income$ = computeMonthlyIncome(parsed);
        const idx = income.findIndex((e) => e.key === key);
        if (idx >= 0) {
          income[idx].value = income$;
        } else {
          income.push({ month: currentMonthLabel(), value: income$, key });
        }
        if (income.length > 12) income.splice(0, income.length - 12);
        localStorage.setItem(INCOME_KEY, JSON.stringify(income));
      }

      setIncomeHistory(income.map(({ month, value }) => ({ month, value })));
    } catch {}
    setLoaded(true);
  }, []);

  const persistHoldings = (next: Holding[]) => {
    try { localStorage.setItem(HOLDINGS_KEY, JSON.stringify(next)); } catch {}
  };

  const addHolding = useCallback((h: Holding) => {
    setHoldings((prev) => {
      const idx = prev.findIndex((x) => x.propertyId === h.propertyId);
      const next = idx >= 0
        ? prev.map((x, i) => (i === idx ? h : x))
        : [...prev, h];
      persistHoldings(next);
      return next;
    });
  }, []);

  const removeHolding = useCallback((propertyId: number) => {
    setHoldings((prev) => {
      const next = prev.filter((h) => h.propertyId !== propertyId);
      persistHoldings(next);
      return next;
    });
  }, []);

  return { holdings, incomeHistory, addHolding, removeHolding, loaded };
}
