'use client';

import { useTheme } from '@/components/providers/theme-provider';
import { useCurrency } from '@/components/providers/currency-provider';
import { Sun, Moon, DollarSign, RefreshCw } from 'lucide-react';

export default function HeaderControls({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const { currency, toggleCurrency, rate, loadingRate } = useCurrency();

  const formattedRate = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(rate);

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {/* Currency Switcher Pill */}
      <div className="relative group">
        <button
          type="button"
          onClick={toggleCurrency}
          className="flex items-center gap-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition active:scale-95"
          title={`Klik untuk beralih mata uang (Saat ini: ${currency}). Kurs: 1 USD = Rp ${formattedRate}`}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold text-[11px]">
            {currency === 'USD' ? '$' : 'Rp'}
          </span>
          <span>{currency}</span>
          {loadingRate && <RefreshCw className="h-3 w-3 animate-spin text-neutral-400" />}
        </button>

        {/* Floating Live Rate Tooltip */}
        <div className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:flex flex-col items-center rounded-xl bg-neutral-950 text-white px-3 py-1.5 text-[10px] shadow-xl border border-neutral-800 whitespace-nowrap z-50 animate-fade-in">
          <span className="font-semibold text-amber-300">Live API Exchange Rate</span>
          <span className="text-neutral-400 mt-0.5">1 USD ≈ Rp {formattedRate}</span>
        </div>
      </div>

      {/* Theme Switcher Button */}
      <button
        type="button"
        onClick={toggleTheme}
        className="flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 text-neutral-700 dark:text-neutral-300 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition active:scale-95"
        title={theme === 'dark' ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
      >
        {theme === 'dark' ? (
          <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-90" />
        ) : (
          <Moon className="h-4 w-4 text-neutral-700 transition-transform duration-300 rotate-0 hover:-rotate-12" />
        )}
      </button>
    </div>
  );
}
