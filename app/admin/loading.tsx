import BrandLogo from '@/components/layout/brand-logo';

export default function AdminLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in">
      <div className="relative flex flex-col items-center">
        <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-amber-100/50 via-rose-100/40 to-purple-100/40 blur-xl opacity-80 animate-pulse pointer-events-none" />
        <div className="relative">
          <BrandLogo className="h-16 w-44" />
        </div>
        <div className="mt-6 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-neutral-900 animate-pulse" style={{ animationDelay: '0ms' }} />
          <span className="h-2 w-2 rounded-full bg-neutral-900 animate-pulse" style={{ animationDelay: '150ms' }} />
          <span className="h-2 w-2 rounded-full bg-neutral-900 animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="mt-3 text-[11px] font-semibold tracking-widest text-neutral-400 uppercase">
          Memuat Halaman… ✨
        </p>
      </div>
    </div>
  );
}
