import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/auth';
import Nav from '@/components/nav';
import BrandLogo from '@/components/brand-logo';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const a = await getAdmin();
  if (!a) redirect('/auth/login/admin');

  return (
    <div className="min-h-screen md:pl-64">
      <Nav email={a.user.email || ''} name={a.profile.full_name || 'Admin'} />

      <div className="border-b bg-white px-5 py-3 md:hidden">
        <BrandLogo className="h-12 w-36" />
      </div>

      <main className="p-5 pt-8 md:p-10">{children}</main>
    </div>
  );
}
