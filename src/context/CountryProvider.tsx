/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchAllCountries } from "@/services/api";

interface CountryContextType {
  countries: string[];
  currencies: string[];
}

const CountryContext = createContext<CountryContextType>({
  countries: [],
  currencies: [],
});

export const CountryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [countries, setCountries] = useState<string[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      const result = await fetchAllCountries();

      // Extract countries
      const countryList = result
        .map((c: any) => c.name.common)
        .sort((a: string, b: string) => a.localeCompare(b));

      // Extract currencies with symbols
      const currencySet = new Set<string>();
      result.forEach((c: any) => {
        if (c.currencies) {
          Object.values(c.currencies).forEach((currency: any) => {
            if (currency.name) {
              const symbol = currency.symbol || "";
              const currencyDisplay = symbol
                ? `${currency.name} (${symbol})`
                : currency.name;
              currencySet.add(currencyDisplay);
            }
          });
        }
      });

      const currencyList = Array.from(currencySet).sort(
        (a: string, b: string) => a.localeCompare(b)
      );

      setCountries(countryList);
      setCurrencies(currencyList);
    };
    load();
  }, []);

  return (
    <CountryContext.Provider value={{ countries, currencies }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountries = () => useContext(CountryContext).countries;
export const useCurrencies = () => useContext(CountryContext).currencies;
