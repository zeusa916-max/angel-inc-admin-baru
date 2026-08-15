import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/auth';
import Nav from '@/components/layout/nav';
import MobileNav from '@/components/layout/mobile-nav';

export const metadata: Metadata = {
  title: 'ANGEL INC. — Admin Portal',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminAuth = await getAdmin();

  if (!adminAuth) {
    redirect('/auth/login/admin');
  }

  const email = adminAuth.user.email || '';
  const name = adminAuth.profile.full_name || 'Administrator';

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0c0d0e] text-neutral-900 dark:text-neutral-100 md:pl-64 transition-colors duration-200">
      <Nav email={email} name={name} />
      <MobileNav email={email} name={name} />
      <main className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
