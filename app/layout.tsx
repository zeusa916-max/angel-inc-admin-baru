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
  // Inline script to apply theme before first paint — prevents dark flash
  const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('angel_theme');
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  } catch(e) {}
})();
`;

  return (
    <html lang="id" className={`${inter.variable} ${jakarta.variable}`} style={{ colorScheme: 'light' }} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
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
