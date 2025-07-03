/* eslint-disable @typescript-eslint/no-explicit-any */
// app/context/CountryProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchAllCountries } from "@/services/api";

const CountryContext = createContext<string[]>([]);

export const CountryProvider = ({ children }: { children: React.ReactNode }) => {
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      const result = await fetchAllCountries();
      const countryList = result
        .map((c: any) => c.name.common)
        .sort((a: string, b: string) => a.localeCompare(b));
      setCountries(countryList);
    };
    load();
  }, []);

  return (
    <CountryContext.Provider value={countries}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountries = () => useContext(CountryContext);
