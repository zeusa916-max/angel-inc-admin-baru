'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Currency = 'IDR' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  rate: number; // 1 USD in IDR (e.g. 16250)
  loadingRate: boolean;
  lastUpdated: string;
  toggleCurrency: () => void;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInIdr: number | string | null | undefined) => string;
  convertPrice: (amountInIdr: number | string | null | undefined) => number;
  refreshRate: () => Promise<void>;
}

const DEFAULT_USD_RATE = 16250; // Fallback rate if offline or API unavailable

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'IDR',
  rate: DEFAULT_USD_RATE,
  loadingRate: false,
  lastUpdated: '',
  toggleCurrency: () => {},
  setCurrency: () => {},
  formatPrice: () => '',
  convertPrice: () => 0,
  refreshRate: async () => {},
});

export const useCurrency = () => useContext(CurrencyContext);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('IDR');
  const [rate, setRate] = useState<number>(DEFAULT_USD_RATE);
  const [loadingRate, setLoadingRate] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchLiveRate = async () => {
    try {
      setLoadingRate(true);
      // Fetch live rates against USD from open exchange rate API
      const res = await fetch('https://open.er-api.com/v6/latest/USD', {
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const data = await res.json();
        const idrRate = data?.rates?.IDR;
        if (idrRate && typeof idrRate === 'number') {
          setRate(idrRate);
          setLastUpdated(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
          localStorage.setItem('angel_usd_rate', String(idrRate));
        }
      }
    } catch {
      // Graceful fallback to stored or default rate
      const stored = localStorage.getItem('angel_usd_rate');
      if (stored) setRate(parseFloat(stored) || DEFAULT_USD_RATE);
    } finally {
      setLoadingRate(false);
    }
  };

  useEffect(() => {
    // 1. Load saved currency preference
    const savedCurrency = localStorage.getItem('angel_currency') as Currency | null;
    if (savedCurrency === 'USD' || savedCurrency === 'IDR') {
      setCurrencyState(savedCurrency);
    }

    // 2. Fetch live rate
    fetchLiveRate();
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('angel_currency', c);
  };

  const toggleCurrency = () => {
    const next = currency === 'IDR' ? 'USD' : 'IDR';
    setCurrency(next);
  };

  const convertPrice = (amountInIdr: number | string | null | undefined): number => {
    if (amountInIdr === null || amountInIdr === undefined || amountInIdr === '') return 0;
    const num = typeof amountInIdr === 'string' ? parseFloat(amountInIdr) : amountInIdr;
    if (isNaN(num)) return 0;

    if (currency === 'USD') {
      return num / rate;
    }
    return num;
  };

  const formatPrice = (amountInIdr: number | string | null | undefined): string => {
    if (amountInIdr === null || amountInIdr === undefined || amountInIdr === '') return '—';
    const num = typeof amountInIdr === 'string' ? parseFloat(amountInIdr) : amountInIdr;
    if (isNaN(num)) return '—';

    if (currency === 'USD') {
      const inUsd = num / rate;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: inUsd >= 100 ? 0 : 2,
        maximumFractionDigits: 2,
      }).format(inUsd);
    }

    // IDR formatting
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        rate,
        loadingRate,
        lastUpdated,
        toggleCurrency,
        setCurrency,
        formatPrice,
        convertPrice,
        refreshRate: fetchLiveRate,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

/**
 * Convenient visual component to render dynamic currency prices.
 */
export function Price({
  value,
  className = '',
}: {
  value: number | string | null | undefined;
  className?: string;
}) {
  const { formatPrice } = useCurrency();
  return <span className={className}>{formatPrice(value)}</span>;
}
