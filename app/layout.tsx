import './globals.css';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { ToastProvider } from '@/components/ui/toast';
import { SplashProvider } from '@/components/ui/splash-loader';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { CurrencyProvider } from '@/components/providers/currency-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ANGEL INC. — Admin Portal',
  description: 'Sistem Manajemen & Portal Administrator Resmi ANGEL INC. (Made in Paradise)',
  icons: {
    icon: '/angel-inc-logo.jpg',
    apple: '/angel-inc-logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased bg-[#f8f9fa] dark:bg-[#0c0d0e] text-neutral-900 dark:text-neutral-100 selection:bg-neutral-900 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <CurrencyProvider>
            <ToastProvider>
              <Suspense fallback={null}>
                <SplashProvider>{children}</SplashProvider>
              </Suspense>
            </ToastProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
