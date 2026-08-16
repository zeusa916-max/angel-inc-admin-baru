'use client';

import { useState, useEffect } from 'react';
import { useStorefront } from './storefront-context';
import { useToast } from '@/components/ui/toast';
import { Price } from '@/components/providers/currency-provider';
import {
  requestPhoneOtpAction,
  verifyPhoneOtpAction,
  getMemberSessionAction,
  memberLogoutAction,
  getMemberOrdersAction,
  getMemberActivityLogsAction,
  MemberSession,
} from '@/server/actions/member.actions';
import { Order } from '@/types/database';
import { AuthActivityLog } from '@/server/services/activity-log.service';
import {
  X,
  Phone,
  KeyRound,
  Sparkles,
  CheckCircle2,
  LogOut,
  User,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Crown,
  ShoppingBag,
  Clock,
  ChevronRight,
  Package,
} from 'lucide-react';

interface MemberAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (member: MemberSession) => void;
}

export default function MemberAuthModal({
  isOpen,
  onClose,
  onSuccess,
}: MemberAuthModalProps) {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'logs'>('profile');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [member, setMember] = useState<MemberSession | null>(null);
  const [otpHint, setOtpHint] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [activityLogs, setActivityLogs] = useState<AuthActivityLog[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const { success, error } = useToast();

  useEffect(() => {
    if (isOpen) {
      checkCurrentMember();
    }
  }, [isOpen]);

  const checkCurrentMember = async () => {
    const res = await getMemberSessionAction();
    if (res.success && res.data) {
      setMember(res.data);
      setStep('profile');
      loadMemberDetails();
    } else {
      setStep('phone');
    }
  };

  const loadMemberDetails = async () => {
    setLoadingData(true);
    try {
      const [ordersRes, logsRes] = await Promise.all([
        getMemberOrdersAction(),
        getMemberActivityLogsAction(),
      ]);
      if (ordersRes.success) setOrders(ordersRes.data);
      if (logsRes.success) setActivityLogs(logsRes.data);
    } catch {
      // Ignore
    } finally {
      setLoadingData(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      error('Silakan masukkan nomor telepon.');
      return;
    }

    setBusy(true);
    try {
      const res = await requestPhoneOtpAction({ phone });
      if (!res.success) {
        throw new Error(res.error || 'Gagal mengirim OTP.');
      }

      setOtpHint(res.data?.otpDemo || '1234');
      setStep('otp');
      success(res.message || 'Kode OTP telah dikirimkan.', 'OTP Terkirim');
    } catch (err: any) {
      error(err?.message || 'Gagal mengirim OTP.');
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      error('Silakan masukkan kode OTP.');
      return;
    }

    setBusy(true);
    try {
      const res = await verifyPhoneOtpAction({
        phone,
        otp,
        name: name.trim() || undefined,
      });

      if (!res.success || !res.data) {
        throw new Error(res.error || 'Kode OTP tidak valid.');
      }

      setMember(res.data);
      setStep('profile');
      loadMemberDetails();
      success(res.message || 'Selamat datang di ANGEL INC.!', 'Login Member Berhasil');
      if (onSuccess) onSuccess(res.data);
    } catch (err: any) {
      error(err?.message || 'Gagal verifikasi OTP.');
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    setBusy(true);
    try {
      await memberLogoutAction();
      setMember(null);
      setStep('phone');
      setPhone('');
      setOtp('');
      setOrders([]);
      setActivityLogs([]);
      success('You have been signed out of your atelier account.', 'Signed Out');
    } catch {
      error('Failed to sign out.');
    } finally {
      setBusy(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 sm:p-8 shadow-2xl z-10 animate-fade-in">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Step 1: Phone Input */}
        {step === 'phone' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200/50 dark:border-neutral-700">
                <Crown className="h-6 w-6 text-amber-500" />
              </div>
              <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">
                ANGEL INC. ATELIER MEMBERSHIP
              </span>
              <h3 className="font-serif text-2xl font-semibold text-neutral-900 dark:text-white">
                Member Sign In & Registry
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                Enter your mobile number for frictionless password-free entry. Enjoy 5% atelier savings and order tracking!
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  WhatsApp / Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+62 812-3456-7890"
                    autoComplete="tel"
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/60 py-3 pl-10 pr-4 text-xs font-medium text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Full Name (Optional)
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jessica Angelia"
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/60 py-3 pl-10 pr-4 text-xs text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 py-3.5 text-xs font-bold uppercase tracking-wider transition hover:opacity-90 active:scale-95 disabled:opacity-50 shadow-md"
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Requesting Code…</span>
                  </>
                ) : (
                  <>
                    <span>Request Passcode</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20 p-3 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-amber-500" />
              <span>Use demo OTP passcode <strong>1234</strong> for instant entry.</span>
            </div>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200/50 dark:border-neutral-700">
                <KeyRound className="h-6 w-6 text-neutral-900 dark:text-white" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-neutral-900 dark:text-white">
                Passcode Verification
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Enter the 4-digit verification code sent to <span className="font-bold text-neutral-900 dark:text-white">{phone}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="1 2 3 4"
                  className="w-full rounded-2xl border-2 border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-900 py-3 text-center text-2xl font-bold tracking-[0.4em] text-neutral-900 dark:text-white outline-none"
                />
                {otpHint && (
                  <p className="text-[11px] text-center text-neutral-400 mt-2">
                    Quick Passcode: <strong className="text-black dark:text-white">{otpHint}</strong>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 py-3.5 text-xs font-bold uppercase tracking-wider transition hover:opacity-90 active:scale-95 disabled:opacity-50 shadow-md"
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Authenticating…</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate & Enter</span>
                    <CheckCircle2 className="h-4 w-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-center text-xs text-neutral-500 hover:text-black dark:hover:text-white transition"
              >
                &larr; Change Mobile Number
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Member Dashboard with Tabs */}
        {step === 'profile' && member && (
          <div className="space-y-6">
            {/* Member Profile Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center shadow-md">
                  <Crown className="h-6 w-6 text-amber-400 dark:text-amber-500" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    {member.phone} &bull; <span className="text-amber-600 dark:text-amber-400 font-bold">{member.memberTier}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={busy}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`pb-1 text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-black dark:border-white text-black dark:text-white'
                    : 'text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                Privileges
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`pb-1 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
                  activeTab === 'orders'
                    ? 'border-b-2 border-black dark:border-white text-black dark:text-white'
                    : 'text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <span>Order Archive</span>
                <span className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.2 text-[9px]">
                  {orders.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('logs')}
                className={`pb-1 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
                  activeTab === 'logs'
                    ? 'border-b-2 border-black dark:border-white text-black dark:text-white'
                    : 'text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <span>Security Audit Trail</span>
              </button>
            </div>

            {/* Tab 1: Member Benefit */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-4 text-center">
                    <span className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
                      Atelier Privilege
                    </span>
                    <span className="font-serif text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {member.discountPercent}% OFF
                    </span>
                    <span className="text-[10px] text-neutral-500 block mt-0.5">Applied on All Pieces</span>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-4 text-center">
                    <span className="block text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
                      Lifetime Orders
                    </span>
                    <span className="font-serif text-2xl font-bold text-neutral-900 dark:text-white">
                      {orders.length} Placed
                    </span>
                    <span className="text-[10px] text-neutral-500 block mt-0.5">Synced with Supabase</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#121316] space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>Verified Atelier Patron</span>
                  </div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
                    Your destination address and contact credentials will automatically populate at checkout.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Member Order History */}
            {activeTab === 'orders' && (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {loadingData ? (
                  <div className="py-8 text-center text-xs text-neutral-400">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                    <span>Loading order archive…</span>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-8 text-center text-xs text-neutral-400 space-y-2">
                    <Package className="h-8 w-8 mx-auto text-neutral-300 dark:text-neutral-600" />
                    <p>No transactions registered under this number.</p>
                  </div>
                ) : (
                  orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-neutral-900 dark:text-white">
                          {ord.id}
                        </span>
                        <span className="rounded-full bg-neutral-200/80 dark:bg-neutral-800 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                          {ord.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-neutral-500">
                        {new Date(ord.created_at).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60 dark:border-neutral-800 text-xs font-bold">
                        <span>Total:</span>
                        <Price amount={ord.total} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 3: Login & Logout Activity Logs */}
            {activeTab === 'logs' && (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {activityLogs.length === 0 ? (
                  <div className="py-8 text-center text-xs text-neutral-400">
                    <Clock className="h-8 w-8 mx-auto text-neutral-300 dark:text-neutral-600 mb-2" />
                    <p>No activity logs recorded.</p>
                  </div>
                ) : (
                  activityLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            log.event_type === 'LOGIN'
                              ? 'bg-emerald-500'
                              : log.event_type === 'LOGOUT'
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        <div>
                          <div className="font-bold text-neutral-900 dark:text-white">
                            {log.event_type === 'LOGIN'
                              ? 'Authenticated Session'
                              : log.event_type === 'LOGOUT'
                              ? 'Session Terminated'
                              : 'Passcode Dispatched'}
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            IP: {log.ip_address || '127.0.0.1'}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-neutral-400">
                        {log.created_at
                          ? new Date(log.created_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Just now'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Footer Close */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 py-3 text-xs font-bold uppercase tracking-wider transition hover:opacity-90 shadow-md"
              >
                <span>Close</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
