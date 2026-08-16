'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';
import {
  updateAdminProfileAction,
  changeAdminPasswordAction,
} from '@/server/actions/profile.actions';
import ClearDummyModal from '@/components/admin/clear-dummy-modal';
import RecreateDummyModal from '@/components/admin/recreate-dummy-modal';
import {
  User,
  KeyRound,
  ShieldCheck,
  Save,
  Loader2,
  Info,
  Database,
} from 'lucide-react';

export default function SettingsPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Loading states
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const { success, error } = useToast();

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoadingData(true);
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setEmail(user.email || '');
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) {
            setFullName(profile.full_name || '');
            setPhone(profile.phone || '');
          }
        }
      } catch (err: any) {
        console.error('Error loading admin profile:', err);
      } finally {
        setLoadingData(false);
      }
    }

    loadAdminData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSavingProfile(true);
      const res = await updateAdminProfileAction({
        full_name: fullName,
        phone: phone || null,
      });

      if (!res.success) {
        throw new Error(res.error || 'Gagal memperbarui profil.');
      }

      success('Profil administrator berhasil diperbarui.', 'Tersimpan');
    } catch (err: any) {
      error(err?.message || 'Gagal memperbarui profil.', 'Kesalahan');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      error('Password baru harus minimal 8 karakter.', 'Validasi');
      return;
    }

    if (newPassword !== confirmPassword) {
      error('Konfirmasi password tidak cocok.', 'Validasi');
      return;
    }

    try {
      setChangingPassword(true);
      const res = await changeAdminPasswordAction({
        old_password: oldPassword || undefined,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      if (!res.success) {
        throw new Error(res.error || 'Gagal mengubah password.');
      }

      success('Password berhasil diperbarui dengan aman.', 'Sukses');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      error(err?.message || 'Gagal mengubah password.', 'Kesalahan');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-neutral-400 dark:text-neutral-500 uppercase">
          Konfigurasi Sistem
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Pengaturan Akun & Database
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Kelola profil identitas administrator, keamanan, dan pembersihan / isi ulang data toko
        </p>
      </div>

      {loadingData ? (
        <div className="flex items-center justify-center p-12 text-neutral-400">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Memuat data pengaturan…</span>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Profile Card */}
            <form
              onSubmit={handleUpdateProfile}
              className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-subtle space-y-4"
            >
              <div className="flex items-center gap-2.5 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <User className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Profil Administrator
                </h2>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Alamat Email (Akun Utama)
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-900/60 px-3.5 py-2.5 text-xs text-neutral-500 cursor-not-allowed font-medium"
                />
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">
                  Email terikat pada autentikasi Supabase.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Admin Angel Inc"
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 812-3456-7890"
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex items-center gap-2 rounded-xl bg-neutral-950 dark:bg-white px-4 py-2.5 text-xs font-medium text-white dark:text-neutral-950 shadow-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition disabled:opacity-50"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Menyimpan…</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      <span>Simpan Profil</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Security & Password Card */}
            <form
              onSubmit={handleChangePassword}
              className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-subtle space-y-4"
            >
              <div className="flex items-center gap-2.5 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <KeyRound className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Ganti Kata Sandi (Password)
                </h2>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Password Lama
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Password Baru (Min. 8 Karakter)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex items-center gap-2 rounded-xl bg-neutral-950 dark:bg-white px-4 py-2.5 text-xs font-medium text-white dark:text-neutral-950 shadow-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition disabled:opacity-50"
                >
                  {changingPassword ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Mengubah Password…</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Ubah Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Database Maintenance, Recreate & Clear Dummy Data Card */}
          <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Database className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                <div>
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Manajemen & Reset Data Toko
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Bersihkan data dummy untuk memulai toko riil, atau isi ulang data sampel untuk demo testing.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                Fitur ini aman: akun administrator tidak akan terhapus.
              </div>
              <div className="flex items-center gap-3">
                <RecreateDummyModal />
                <ClearDummyModal />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Information Card */}
      <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-900 dark:bg-[#111215] p-6 text-white shadow-subtle">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
          <Info className="h-4 w-4 text-emerald-400" />
          <span>Informasi Sistem & Lingkungan</span>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-4 text-xs">
          <div>
            <div className="text-neutral-400">Framework:</div>
            <div className="font-semibold text-neutral-100 mt-0.5">
              Next.js 16 (App Router)
            </div>
          </div>
          <div>
            <div className="text-neutral-400">Backend Architecture:</div>
            <div className="font-semibold text-neutral-100 mt-0.5">
              Layered Server Actions & Services
            </div>
          </div>
          <div>
            <div className="text-neutral-400">Autentikasi:</div>
            <div className="font-semibold text-neutral-100 mt-0.5">
              Supabase Auth & Activity Logs
            </div>
          </div>
          <div>
            <div className="text-neutral-400">Lead Developer:</div>
            <div className="font-semibold text-neutral-100 mt-0.5">
              DummVinci
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
