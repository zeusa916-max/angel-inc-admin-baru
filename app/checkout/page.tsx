'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStorefront } from '@/components/storefront/storefront-context';
import { Price } from '@/components/providers/currency-provider';
import BrandLogo from '@/components/layout/brand-logo';
import MemberAuthModal from '@/components/storefront/member-auth-modal';
import { useToast } from '@/components/ui/toast';
import { createOrderAction } from '@/server/actions/order.actions';
import { getMemberSessionAction, MemberSession } from '@/server/actions/member.actions';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Building2,
  Banknote,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Loader2,
  Crown,
  Share2,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/social-icons';

interface ShippingOption {
  id: string;
  name: string;
  courier: string;
  etd: string;
  price: number;
}

const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'reg', name: 'J&T Express (Reguler)', courier: 'J&T', etd: '2-3 Hari', price: 15000 },
  { id: 'exp', name: 'SiCepat Best (Next Day)', courier: 'SiCepat', etd: '1 Hari', price: 25000 },
  { id: 'ins', name: 'Instant Delivery (GoSend/Grab)', courier: 'Instant', etd: 'Hari Ini', price: 35000 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useStorefront();
  const { success, error } = useToast();

  const [member, setMember] = useState<MemberSession | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  // Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Jakarta Selatan');
  const [postalCode, setPostalCode] = useState('');
  const [selectedShipping, setSelectedShipping] = useState<string>('reg');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bank_transfer' | 'cod' | 'whatsapp'>('qris');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Order Placed Success State
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  useEffect(() => {
    loadMemberSession();
  }, []);

  const loadMemberSession = async () => {
    const res = await getMemberSessionAction();
    if (res.success && res.data) {
      setMember(res.data);
      if (!name) setName(res.data.name);
      if (!phone) setPhone(res.data.phone);
      if (!email && res.data.email) setEmail(res.data.email);
      if (!address && res.data.address) setAddress(res.data.address);
    }
  };

  const selectedShippingOption = SHIPPING_OPTIONS.find((s) => s.id === selectedShipping) || SHIPPING_OPTIONS[0];
  const isFreeShipping = cartTotal >= 300000;
  const shippingCost = isFreeShipping ? 0 : selectedShippingOption.price;
  const memberDiscount = member ? Math.round((cartTotal * member.discountPercent) / 100) : 0;
  const finalTotal = Math.max(0, cartTotal - memberDiscount + shippingCost);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      error('Keranjang belanja kosong.');
      return;
    }

    if (!name.trim()) {
      error('Silakan isi nama lengkap penerima.');
      return;
    }

    if (!phone.trim()) {
      error('Silakan isi nomor telepon/WhatsApp.');
      return;
    }

    if (!address.trim()) {
      error('Silakan isi alamat lengkap pengiriman.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim() || undefined,
        shippingAddress: `${address.trim()}${postalCode ? ` (Kode Pos: ${postalCode.trim()})` : ''}`,
        shippingCity: city,
        shippingCourier: selectedShippingOption.name,
        shippingCost,
        paymentMethod,
        notes: notes.trim() || undefined,
        items: cart.map(({ product, quantity }) => ({
          productId: product.id,
          name: product.name,
          quantity,
          price: product.discountPrice ?? product.price,
        })),
      };

      const res = await createOrderAction(orderPayload);

      if (!res.success || !res.data) {
        throw new Error(res.error || 'Gagal memproses pesanan.');
      }

      setPlacedOrder(res.data);
      clearCart();
      success('Pesanan Anda berhasil dikonfirmasi!', 'Order Berhasil');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      error(err?.message || 'Terjadi kendala saat memproses pesanan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppMessage = () => {
    if (!placedOrder) return '';
    const itemsText = placedOrder.order_items
      ?.map((i: any) => `• ${i.product_name} (${i.quantity}x) - Rp ${i.subtotal.toLocaleString('id-ID')}`)
      .join('\n');

    const msg = `Halo Angel Inc. ✨\n\nSaya telah membuat pesanan di website:\n*No. Invoice:* ${placedOrder.id}\n*Penerima:* ${placedOrder.shipping_name}\n*No. HP:* ${placedOrder.shipping_phone}\n*Alamat:* ${placedOrder.shipping_address}\n\n*Daftar Produk:*\n${itemsText}\n\n*Total Tagihan:* Rp ${placedOrder.total.toLocaleString('id-ID')}\n*Metode Bayar:* ${placedOrder.payment_method?.toUpperCase() || 'QRIS'}\n\nMohon konfirmasi dan proses pesanan saya. Terima kasih! 🕊️`;

    return encodeURIComponent(msg);
  };

  // If Order is placed successfully, render the Order Confirmation invoice
  if (placedOrder) {
    return (
      <main className="min-h-screen bg-[#faf9f6] dark:bg-[#0c0d0e] py-16 px-4 sm:px-6 lg:px-8 text-neutral-900 dark:text-white transition-colors duration-200">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex justify-center mb-4">
              <BrandLogo size="md" />
            </div>
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-4 shadow-sm">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight">
              Pesanan Dikonfirmasi!
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Terima kasih telah berbelanja di Angel Inc. Detail pesanan Anda telah tersimpan di sistem.
            </p>
          </div>

          {/* Invoice Card */}
          <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 sm:p-8 shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                  Nomor Invoice
                </span>
                <div className="font-mono text-sm font-bold text-neutral-900 dark:text-white">
                  {placedOrder.id}
                </div>
              </div>
              <span className="rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900/60 px-3 py-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                Menunggu Pembayaran
              </span>
            </div>

            {/* Items Summary */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                Rincian Produk
              </span>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {placedOrder.order_items?.map((item: any) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {item.product_name}
                      </span>
                      <span className="text-neutral-400 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">
                      <Price amount={item.subtotal} />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 p-4 space-y-2 text-xs border border-neutral-200/60 dark:border-neutral-800">
              <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                <span>Subtotal Produk</span>
                <Price amount={placedOrder.subtotal} />
              </div>
              <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                <span>Biaya Pengiriman</span>
                {placedOrder.shipping_cost === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">GRATIS</span>
                ) : (
                  <Price amount={placedOrder.shipping_cost} />
                )}
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <span>Total Pembayaran</span>
                <Price amount={placedOrder.total} />
              </div>
            </div>

            {/* Delivery Info */}
            <div className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
              <div className="font-bold text-neutral-900 dark:text-white">Penerima & Alamat:</div>
              <div>{placedOrder.shipping_name} ({placedOrder.shipping_phone})</div>
              <div>{placedOrder.shipping_address}</div>
            </div>

              {/* Action CTAs */}
            <div className="space-y-3 pt-2">
              <a
                href={`https://wa.me/6281234567890?text=${generateWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 py-3.5 text-xs font-bold uppercase tracking-wider transition hover:opacity-90 shadow-md"
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span>Send & Confirm via WhatsApp Concierge</span>
              </a>

              <Link
                href="/"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 py-3 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                <span>Return to Atelier Catalog</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // If Cart is Empty
  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#faf9f6] dark:bg-[#0c0d0e] flex items-center justify-center p-6 text-neutral-900 dark:text-white">
        <div className="text-center space-y-4 max-w-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-neutral-100 dark:bg-neutral-900 text-neutral-400">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold">Your Bag is Empty</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Select pieces from our fine fragrance and atelier collections before proceeding to checkout.
          </p>
          <Link
            href="/#shop"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-6 py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition shadow-md"
          >
            <span>Explore Archive</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] dark:bg-[#0c0d0e] py-12 px-4 sm:px-6 lg:px-8 text-neutral-900 dark:text-white transition-colors duration-200">
      <div className="mx-auto max-w-7xl">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-neutral-200/80 dark:border-neutral-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition group"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            <span>Return to Boutique</span>
          </Link>

          <BrandLogo size="md" />

          <button
            type="button"
            onClick={() => setIsMemberModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 px-3.5 py-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-white transition shadow-sm"
          >
            <Crown className="h-3.5 w-3.5 text-amber-500" />
            <span>{member ? member.name : 'Member Login'}</span>
          </button>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Form Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Member Perk Banner */}
            {!member ? (
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141518] p-5 flex items-center justify-between gap-4 shadow-subtle">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Crown className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                      Have a Member Account?
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Sign in seamlessly with phone OTP to apply 5% atelier privilege and auto-fill address.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(true)}
                  className="rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition shrink-0"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/20 p-4 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    Authenticated as <strong>{member.name}</strong> ({member.memberTier}) &bull; 5% atelier privilege active.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(true)}
                  className="underline font-semibold hover:text-emerald-950 dark:hover:text-white ml-2"
                >
                  Switch
                </button>
              </div>
            )}

            {/* Section 1: Contact Information */}
            <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 sm:p-8 shadow-card space-y-5">
              <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <User className="h-4 w-4 text-neutral-400" />
                <h3 className="font-serif text-base font-semibold text-neutral-900 dark:text-white">
                  1. Recipient Information
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jessica Angelia"
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 py-2.5 px-3.5 text-xs text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+62 812-3456-7890"
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 py-2.5 px-3.5 text-xs text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Email (Optional for Digital Receipt)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jessica@angelinc.id"
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 py-2.5 px-3.5 text-xs text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition"
                />
              </div>
            </div>

            {/* Section 2: Shipping Address */}
            <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 sm:p-8 shadow-card space-y-5">
              <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <MapPin className="h-4 w-4 text-neutral-400" />
                <h3 className="font-serif text-base font-semibold text-neutral-900 dark:text-white">
                  2. Delivery Destination
                </h3>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Street Address (Building, Street, District) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan"
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 py-2.5 px-3.5 text-xs text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    City / Region
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 py-2.5 px-3.5 text-xs text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition"
                  >
                    <option value="Jakarta Selatan">Jakarta Selatan</option>
                    <option value="Jakarta Pusat">Jakarta Pusat</option>
                    <option value="Jakarta Barat">Jakarta Barat</option>
                    <option value="Jakarta Utara">Jakarta Utara</option>
                    <option value="Jakarta Timur">Jakarta Timur</option>
                    <option value="Tangerang Selatan">Tangerang Selatan</option>
                    <option value="Tangerang">Tangerang</option>
                    <option value="Bekasi">Bekasi</option>
                    <option value="Depok">Depok</option>
                    <option value="Bogor">Bogor</option>
                    <option value="Bandung">Bandung</option>
                    <option value="Surabaya">Surabaya</option>
                    <option value="Bali / Denpasar">Bali / Denpasar</option>
                    <option value="Luar Pulau Jawa">International / Other Regions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="12190"
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 py-2.5 px-3.5 text-xs text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Delivery Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Leave with concierge desk upon delivery"
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 py-2.5 px-3.5 text-xs text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition"
                />
              </div>
            </div>

            {/* Section 3: Shipping Courier Options */}
            <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 sm:p-8 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-neutral-400" />
                  <h3 className="font-serif text-base font-semibold text-neutral-900 dark:text-white">
                    3. Courier Service
                  </h3>
                </div>
                {isFreeShipping && (
                  <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider">
                    Complimentary Shipping Active
                  </span>
                )}
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {SHIPPING_OPTIONS.map((opt) => {
                  const isSelected = selectedShipping === opt.id;
                  const priceToDisplay = isFreeShipping ? 0 : opt.price;

                  return (
                    <label
                      key={opt.id}
                      className={`cursor-pointer rounded-2xl border p-4 flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-900 shadow-sm'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={opt.id}
                        checked={isSelected}
                        onChange={() => setSelectedShipping(opt.id)}
                        className="sr-only"
                      />
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white">
                            {opt.courier}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {opt.etd}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {opt.name}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs font-bold text-neutral-900 dark:text-white">
                        {priceToDisplay === 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400">COMPLIMENTARY</span>
                        ) : (
                          <Price amount={priceToDisplay} />
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Section 4: Payment Methods */}
            <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 sm:p-8 shadow-card space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <CreditCard className="h-4 w-4 text-neutral-400" />
                <h3 className="font-serif text-base font-semibold text-neutral-900 dark:text-white">
                  4. Payment Method
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <label
                  className={`cursor-pointer rounded-2xl border p-4 flex items-center gap-3 transition-all ${
                    paymentMethod === 'qris'
                      ? 'border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-900 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="qris"
                    checked={paymentMethod === 'qris'}
                    onChange={() => setPaymentMethod('qris')}
                    className="sr-only"
                  />
                  <div className="h-10 w-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                    <QrCode className="h-5 w-5 text-neutral-900 dark:text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">
                      QRIS Instant Pay
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      BCA, Mandiri, Gopay, OVO, ShopeePay
                    </div>
                  </div>
                </label>

                <label
                  className={`cursor-pointer rounded-2xl border p-4 flex items-center gap-3 transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-900 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="sr-only"
                  />
                  <div className="h-10 w-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5 text-neutral-900 dark:text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">
                      Bank Transfer
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      BCA Virtual Account / Mandiri VA
                    </div>
                  </div>
                </label>

                <label
                  className={`cursor-pointer rounded-2xl border p-4 flex items-center gap-3 transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-900 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="sr-only"
                  />
                  <div className="h-10 w-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                    <Banknote className="h-5 w-5 text-neutral-900 dark:text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">
                      COD (Cash on Delivery)
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      Pay cash upon delivery
                    </div>
                  </div>
                </label>

                <label
                  className={`cursor-pointer rounded-2xl border p-4 flex items-center gap-3 transition-all ${
                    paymentMethod === 'whatsapp'
                      ? 'border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-900 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="whatsapp"
                    checked={paymentMethod === 'whatsapp'}
                    onChange={() => setPaymentMethod('whatsapp')}
                    className="sr-only"
                  />
                  <div className="h-10 w-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                    <WhatsAppIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">
                      WhatsApp Concierge
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      Direct customer assistance
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Order Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
            <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 sm:p-8 shadow-card space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-white">
                  Order Summary
                </h3>
                <span className="text-xs font-bold text-neutral-400">
                  {cart.reduce((a, c) => a + c.quantity, 0)} Items
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1 divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-xl bg-neutral-950 overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-800">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover grayscale contrast-125"
                        />
                      ) : (
                        <Sparkles className="h-5 w-5 text-amber-500 m-auto" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        {quantity} x <Price amount={product.discountPrice ?? product.price} />
                      </p>
                    </div>
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      <Price amount={(product.discountPrice ?? product.price) * quantity} />
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation Table */}
              <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 p-4 space-y-2.5 text-xs border border-neutral-200/60 dark:border-neutral-800">
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Product Subtotal</span>
                  <Price amount={cartTotal} />
                </div>

                {memberDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Member Privilege (5%)</span>
                    <span>-<Price amount={memberDiscount} /></span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Shipping ({selectedShippingOption.courier})</span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">COMPLIMENTARY</span>
                  ) : (
                    <Price amount={shippingCost} />
                  )}
                </div>

                <div className="flex justify-between text-base font-bold text-neutral-900 dark:text-white pt-2.5 border-t border-neutral-200 dark:border-neutral-800">
                  <span>Total Amount</span>
                  <Price amount={finalTotal} />
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 py-4 text-xs font-bold uppercase tracking-[0.14em] transition hover:opacity-90 active:scale-95 disabled:opacity-50 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Placing Order…</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 text-center">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>256-Bit Encrypted Secure Checkout</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Member Phone + OTP Auth Modal */}
      <MemberAuthModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onSuccess={(m) => {
          setMember(m);
          if (!name) setName(m.name);
          if (!phone) setPhone(m.phone);
          if (!email && m.email) setEmail(m.email);
          if (!address && m.address) setAddress(m.address);
          setIsMemberModalOpen(false);
        }}
      />
    </main>
  );
}
