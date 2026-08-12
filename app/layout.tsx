import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ANGEL INC. — Admin Portal',
  description: 'Admin Portal ANGEL INC.',
  icons: {
    icon: '/angel-inc-logo.jpg',
    apple: '/angel-inc-logo.jpg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
