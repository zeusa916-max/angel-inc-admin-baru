'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import BrandLogo from '@/components/layout/brand-logo';

interface SplashContextType {
  showSplash: (message?: string) => void;
  hideSplash: () => void;
  isSplashing: boolean;
}

const SplashContext = createContext<SplashContextType>({
  showSplash: () => {},
  hideSplash: () => {},
  isSplashing: false,
});

export const useSplash = () => useContext(SplashContext);

export function SplashProvider({ children }: { children: React.ReactNode }) {
  const [isSplashing, setIsSplashing] = useState(false);
  const [message, setMessage] = useState('Memuat surga belanja… ✨');
  const [progressBar, setProgressBar] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Reset splash & progress bar when route changes finish
  useEffect(() => {
    setIsNavigating(false);
    setProgressBar(100);
    const t = setTimeout(() => {
      setIsSplashing(false);
      setProgressBar(0);
    }, 250);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  // Handle subtle progress bar animation during navigation
  useEffect(() => {
    let interval: any;
    if (isNavigating || isSplashing) {
      setProgressBar(20);
      interval = setInterval(() => {
        setProgressBar((prev) => {
          if (prev >= 85) return prev;
          return prev + Math.floor(Math.random() * 15) + 5;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isNavigating, isSplashing]);

  const showSplash = (msg?: string) => {
    if (msg) setMessage(msg);
    setIsSplashing(true);
    setIsNavigating(true);
  };

  const hideSplash = () => {
    setIsSplashing(false);
    setIsNavigating(false);
  };

  return (
    <SplashContext.Provider value={{ showSplash, hideSplash, isSplashing }}>
      {/* Top Slim Angelic Progress Bar */}
      {progressBar > 0 && (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-neutral-100 overflow-hidden pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-neutral-900 via-amber-400 to-neutral-900 transition-all duration-300 ease-out shadow-[0_0_8px_rgba(0,0,0,0.5)]"
            style={{ width: `${progressBar}%` }}
          />
        </div>
      )}

      {/* Full Luxury Angelic Splash Overlay */}
      {isSplashing && (
        <div className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md transition-all duration-300 animate-fade-in">
          <div className="relative flex flex-col items-center text-center p-8 max-w-sm">
            {/* Ambient Halo Glow */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-amber-100/60 via-rose-100/60 to-purple-100/60 blur-2xl opacity-70 animate-pulse pointer-events-none" />

            <div className="relative">
              <BrandLogo className="h-24 w-60 mx-auto" />
            </div>

            <div className="mt-8 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-neutral-900 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="h-2 w-2 rounded-full bg-neutral-900 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="h-2 w-2 rounded-full bg-neutral-900 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>

            <p className="mt-4 text-xs font-semibold tracking-wider text-neutral-600 uppercase">
              {message}
            </p>
          </div>
        </div>
      )}

      {children}
    </SplashContext.Provider>
  );
}
