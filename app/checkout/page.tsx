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
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  User,
  Phone,
  Mail,
  MapPin,
  Loader2,
  Crown,
  Copy,
  Check,
  Printer,
  Tag,
  Plus,
  Minus,
  Trash2,
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
  {
    id: 'reg',
    name: 'J&T Express Atelier Dispatch',
    courier: 'J&T Express',
    etd: '2-3 Days',
    price: 15000,
  },
  {
    id: 'exp',
    name: 'SiCepat Best Priority Air',
    courier: 'SiCepat Priority',
    etd: '1 Day',
    price: 25000,
  },
  {
    id: 'ins',
    name: 'Instant White-Glove Courier',
    courier: 'GoSend / Grab Instant',
    etd: 'Same Day',
    price: 35000,
  },
];

const VALID_PROMOS: Record<string, { type: 'percent' | 'fixed'; value: number; label: string }> = {
  ANGEL10: { type: 'percent', value: 10, label: '10% Atelier Welcome Privilege' },
  VIPCOUTURE: { type: 'percent', value: 15, label: '15% Haute Guild Exclusive' },
  PARADISE: { type: 'fixed', value: 50000, label: 'IDR 50.000 Atelier Credit' },
};

export default function CheckoutPage() {
  const router = useRouter();
  const { isLoaded, cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useStorefront();
  const { success, error, info } = useToast();

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
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bank_transfer' | 'whatsapp'>('qris');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Promo Code States
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; type: 'percent' | 'fixed'; value: number; label: string } | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedInvoice, setCopiedInvoice] = useState(false);

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

  // Member 5% Privilege
  const memberDiscount = member ? Math.round((cartTotal * member.discountPercent) / 100) : 0;

  // Voucher / Promo Discount
  let promoDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      promoDiscount = Math.round(((cartTotal - memberDiscount) * appliedPromo.value) / 100);
    } else {
      promoDiscount = appliedPromo.value;
    }
  }

  const finalTotal = Math.max(0, cartTotal - memberDiscount - promoDiscount + shippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoCodeInput.trim().toUpperCase();
    if (!cleanCode) return;

    if (VALID_PROMOS[cleanCode]) {
      const p = VALID_PROMOS[cleanCode];
      setAppliedPromo({ code: cleanCode, ...p });
      setPromoCodeInput('');
      success(`Privilege Code "${cleanCode}" applied: ${p.label}`, 'Code Applied');
    } else {
      error('Invalid voucher code. Try "ANGEL10" or "PARADISE".', 'Invalid Code');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    info('Voucher code removed.');
  };

  const copyToClipboard = (text: string, type: 'account' | 'invoice') => {
    navigator.clipboard.writeText(text);
    if (type === 'account') {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2500);
      success('Bank Account number copied.', 'Copied');
    } else {
      setCopiedInvoice(true);
      setTimeout(() => setCopiedInvoice(false), 2500);
      success('Order Reference ID copied.', 'Copied');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      error('Your shopping bag is empty.');
      return;
    }

    if (!name.trim()) {
      error('Please enter the recipient full name.');
      return;
    }

    if (!phone.trim()) {
      error('Please enter a valid WhatsApp / mobile number.');
      return;
    }

    if (!address.trim()) {
      error('Please enter the complete street address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim() || undefined,
        shippingAddress: `${address.trim()}${postalCode ? ` (Postal Code: ${postalCode.trim()})` : ''}`,
        shippingCity: city,
        shippingCourier: `${selectedShippingOption.courier} (${selectedShippingOption.etd})`,
        shippingCost,
        paymentMethod,
        notes: notes.trim()
          ? `${notes.trim()}${appliedPromo ? ` [Promo: ${appliedPromo.code}]` : ''}`
          : appliedPromo
          ? `[Promo: ${appliedPromo.code}]`
          : undefined,
        items: cart.map(({ product, quantity }) => ({
          productId: product.id,
          name: product.name,
          quantity,
          price: product.discountPrice ?? product.price,
        })),
      };

      const res = await createOrderAction(orderPayload);

      if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to process checkout transaction.');
      }

      setPlacedOrder(res.data);
      clearCart();
      success('Order confirmed and recorded.', 'Order Placed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      error(err?.message || 'A network error occurred while finalizing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppMessage = () => {
    if (!placedOrder) return '';
    const itemsText = placedOrder.order_items
      ?.map((i: any) => `• ${i.product_name} (${i.quantity}x) - Rp ${i.subtotal.toLocaleString('id-ID')}`)
      .join('\n');

    const msg = `*ANGEL INC. ATELIER ORDER DISPATCH*\n\nDear Concierge,\nI have placed an order via the official boutique:\n\n*Invoice Reference:* ${placedOrder.id}\n*Client:* ${placedOrder.shipping_name}\n*Contact:* ${placedOrder.shipping_phone}\n*Delivery Address:* ${placedOrder.shipping_address}\n*City:* ${placedOrder.shipping_city || city}\n*Courier:* ${placedOrder.shipping_courier}\n\n*Archive Items:*\n${itemsText}\n\n*Subtotal:* Rp ${placedOrder.subtotal?.toLocaleString('id-ID')}\n*Shipping:* ${placedOrder.shipping_cost === 0 ? 'COMPLIMENTARY' : `Rp ${placedOrder.shipping_cost?.toLocaleString('id-ID')}`}\n*Total Balance:* Rp ${placedOrder.total?.toLocaleString('id-ID')}\n*Payment Method:* ${placedOrder.payment_method?.toUpperCase()}\n\nPlease verify and initiate dispatch. Thank you! 🕊️`;

    return encodeURIComponent(msg);
  };

  // =========================================================================
  // VIEW: Hydration Loading State
  // =========================================================================
  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[#faf9f6] dark:bg-[#0c0d0e] flex items-center justify-center p-6 text-neutral-900 dark:text-white">
        <div className="text-center space-y-3 max-w-sm">
          <Loader2 className="h-7 w-7 animate-spin mx-auto text-neutral-900 dark:text-white" />
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            Accessing Atelier Bag & Checkout…
          </p>
        </div>
      </main>
    );
  }

  // =========================================================================
  // VIEW: Order Placed Successfully (Invoice & Concierge Screen)
  // =========================================================================
  if (placedOrder) {
    return (
      <main className="min-h-screen bg-[#faf9f6] dark:bg-[#0c0d0e] py-12 px-4 sm:px-6 lg:px-8 text-neutral-900 dark:text-white transition-colors duration-200">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto flex justify-center mb-3">
              <BrandLogo size="md" />
            </div>

            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-200/60 dark:border-emerald-800">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              Order Confirmed
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
              Your requisition has been recorded. Review payment details below or notify concierge for rapid dispatch.
            </p>
          </div>

          {/* Invoice Card */}
          <div className="rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 sm:p-8 shadow-xl space-y-6">
            {/* Meta */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400">
                  Invoice Reference
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-sm font-bold text-neutral-900 dark:text-white">
                    {placedOrder.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(placedOrder.id, 'invoice')}
                    className="p-1 text-neutral-400 hover:text-black dark:hover:text-white transition"
                    title="Copy Reference ID"
                  >
                    {copiedInvoice ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <span className="rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 px-3 py-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                Awaiting Settlement
              </span>
            </div>

            {/* Payment Settlement Box */}
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/60 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-900 dark:text-white">
                <span className="uppercase tracking-wider">
                  Payment: {placedOrder.payment_method?.replace('_', ' ').toUpperCase()}
                </span>
                <span className="font-serif text-sm">
                  Total: <Price amount={placedOrder.total} />
                </span>
              </div>

              {/* QRIS */}
              {placedOrder.payment_method === 'qris' && (
                <div className="bg-white dark:bg-black p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center gap-4 text-xs">
                  <div className="h-28 w-28 bg-neutral-950 flex flex-col items-center justify-center p-2 rounded-lg shrink-0 text-white font-mono text-[9px] text-center border">
                    <QrCode className="h-10 w-10 mb-1" />
                    <span className="font-bold">QRIS PAY</span>
                  </div>
                  <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
                    <p className="font-bold text-neutral-900 dark:text-white">Instant QRIS Transfer:</p>
                    <p>1. Open your Mobile Banking (BCA, Mandiri) or E-Wallet (GoPay, OVO, ShopeePay).</p>
                    <p>2. Transfer exact balance: <strong>Rp {placedOrder.total?.toLocaleString('id-ID')}</strong></p>
                    <p>3. Notify concierge below to accelerate courier handover.</p>
                  </div>
                </div>
              )}

              {/* Bank Transfer */}
              {placedOrder.payment_method === 'bank_transfer' && (
                <div className="bg-white dark:bg-black p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                      Bank Central Asia (BCA)
                    </div>
                    <div className="font-mono text-sm font-bold text-neutral-900 dark:text-white">
                      8730 1928 3344
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      a/n PT ANGEL INCORPORATED
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard('873019283344', 'account')}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                  >
                    {copiedAccount ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Items Summary */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400">
                Items Summary
              </span>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {placedOrder.order_items?.map((item: any) => (
                  <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {item.product_name}
                      </span>
                      <span className="text-neutral-400 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-bold text-neutral-900 dark:text-white">
                      <Price amount={item.subtotal} />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Table */}
            <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 p-4 space-y-2 text-xs border border-neutral-200/60 dark:border-neutral-800">
              <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                <span>Subtotal</span>
                <Price amount={placedOrder.subtotal} />
              </div>
              <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                <span>Shipping ({placedOrder.shipping_courier})</span>
                {placedOrder.shipping_cost === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">COMPLIMENTARY</span>
                ) : (
                  <Price amount={placedOrder.shipping_cost} />
                )}
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <span>Total Payment</span>
                <Price amount={placedOrder.total} />
              </div>
            </div>

            {/* Destination */}
            <div className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/40 p-3.5 rounded-xl border border-neutral-200/60 dark:border-neutral-800">
              <div className="font-bold text-neutral-900 dark:text-white">
                Destination: {placedOrder.shipping_name} ({placedOrder.shipping_phone})
              </div>
              <div>{placedOrder.shipping_address}</div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <a
                href={`https://wa.me/6281234567890?text=${generateWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 py-3.5 text-xs font-bold uppercase tracking-wider transition hover:opacity-90 shadow-md"
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span>Confirm with WhatsApp Concierge</span>
              </a>

              <Link
                href="/"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 py-3 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                <span>Return to Atelier Catalog</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================================
  // VIEW: Empty Cart State
  // =========================================================================
  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#faf9f6] dark:bg-[#0c0d0e] flex items-center justify-center p-6 text-neutral-900 dark:text-white">
        <div className="text-center space-y-4 max-w-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-neutral-100 dark:bg-neutral-900 text-neutral-400">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h1 className="font-serif text-2xl font-semibold">Your Bag is Empty</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Select fine fragrances or pieces from the boutique before proceeding.
          </p>
          <Link
            href="/#shop"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition shadow-md"
          >
            <span>Explore Collection</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </main>
    );
  }

  // =========================================================================
  // VIEW: Simple Minimalist Checkout Page
  // =========================================================================
  return (
    <main className="min-h-screen bg-[#faf9f6] dark:bg-[#0c0d0e] py-10 px-4 sm:px-6 lg:px-8 text-neutral-900 dark:text-white transition-colors duration-200">
      <div className="mx-auto max-w-6xl">
        {/* Minimal Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-neutral-200/80 dark:border-neutral-800">
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

        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: Simple Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Member Banner (Minimal) */}
            {!member ? (
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141518] p-4 flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <Crown className="h-5 w-5 text-amber-500 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-neutral-900 dark:text-white">Atelier Member? </span>
                    <span className="text-neutral-500 dark:text-neutral-400">Sign in with phone OTP for 5% off.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(true)}
                  className="rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition shrink-0"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/20 p-3.5 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Member Active: <strong>{member.name}</strong> (5% Discount Applied)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(true)}
                  className="underline font-semibold hover:text-emerald-950 dark:hover:text-white"
                >
                  Switch
                </button>
              </div>
            )}

            {/* 1. Recipient Information */}
            <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <User className="h-4 w-4 text-neutral-400" />
                <h3 className="font-serif text-base font-semibold text-neutral-900 dark:text-white">
                  1. Recipient Details
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
                    placeholder="Jessica Angelia"
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 py-2.5 px-3.5 text-xs text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    WhatsApp / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 py-2.5 px-3.5 text-xs text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jessica@example.com"
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 py-2.5 px-3.5 text-xs text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition"
                />
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <MapPin className="h-4 w-4 text-neutral-400" />
                <h3 className="font-serif text-base font-semibold text-neutral-900 dark:text-white">
                  2. Delivery Destination
                </h3>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Street Address (Street, Building, Unit) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan"
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 py-2.5 px-3.5 text-xs text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    City / Province
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
                    <option value="Other Regions">Other Regions / Outer Islands</option>
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
            </div>

            {/* 3. Courier Option */}
            <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-neutral-400" />
                  <h3 className="font-serif text-base font-semibold text-neutral-900 dark:text-white">
                    3. Courier Service
                  </h3>
                </div>
                {isFreeShipping && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Free Shipping
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
                      className={`cursor-pointer rounded-2xl border p-3.5 flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-900 shadow-sm'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
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
                        <div className="text-xs font-bold text-neutral-900 dark:text-white">
                          {opt.courier}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono">
                          {opt.etd}
                        </div>
                      </div>

                      <div className="pt-2 mt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs font-bold text-neutral-900 dark:text-white">
                        {priceToDisplay === 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400">FREE</span>
                        ) : (
                          <Price amount={priceToDisplay} />
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 4. Payment Method (NO COD) */}
            <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <CreditCard className="h-4 w-4 text-neutral-400" />
                <h3 className="font-serif text-base font-semibold text-neutral-900 dark:text-white">
                  4. Payment Method
                </h3>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {/* QRIS */}
                <label
                  className={`cursor-pointer rounded-2xl border p-3.5 flex flex-col justify-between transition-all ${
                    paymentMethod === 'qris'
                      ? 'border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-900 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
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
                  <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-2">
                    <QrCode className="h-4 w-4 text-neutral-900 dark:text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">
                      QRIS Instant
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      BCA, Mandiri, E-Wallet
                    </div>
                  </div>
                </label>

                {/* Bank Transfer */}
                <label
                  className={`cursor-pointer rounded-2xl border p-3.5 flex flex-col justify-between transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-900 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
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
                  <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-2">
                    <Building2 className="h-4 w-4 text-neutral-900 dark:text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">
                      Bank Transfer
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      BCA 8730 1928 3344
                    </div>
                  </div>
                </label>

                {/* WhatsApp Concierge */}
                <label
                  className={`cursor-pointer rounded-2xl border p-3.5 flex flex-col justify-between transition-all ${
                    paymentMethod === 'whatsapp'
                      ? 'border-neutral-950 dark:border-white bg-neutral-50 dark:bg-neutral-900 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
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
                  <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-2">
                    <WhatsAppIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">
                      WhatsApp VIP
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      Direct Concierge Care
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Sticky Order Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-4">
            <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <h3 className="font-serif text-base font-semibold text-neutral-900 dark:text-white">
                  Order Summary
                </h3>
                <span className="text-xs font-bold text-neutral-400">
                  {cart.reduce((a, c) => a + c.quantity, 0)} Items
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="pt-2.5 first:pt-0 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-neutral-950 overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-800">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover grayscale contrast-125"
                        />
                      ) : (
                        <Sparkles className="h-4 w-4 text-amber-500 m-auto" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-neutral-400">
                        <Price amount={product.discountPrice ?? product.price} />
                      </p>

                      <div className="flex items-center gap-1.5 mt-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="h-5 w-5 rounded border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white"
                        >
                          <Minus className="h-2.5 w-2.5" />
                        </button>
                        <span className="text-[11px] font-bold px-1.5">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="h-5 w-5 rounded border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white"
                        >
                          <Plus className="h-2.5 w-2.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="text-neutral-400 hover:text-rose-500 ml-2"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      <Price amount={(product.discountPrice ?? product.price) * quantity} />
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Input */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                {!appliedPromo ? (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      placeholder="Voucher (e.g. ANGEL10)"
                      className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 py-2 px-3 text-xs uppercase text-neutral-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-3 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300">
                    <span><strong>{appliedPromo.code}</strong> applied</span>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-[10px] font-bold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Financial Calculation */}
              <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 p-4 space-y-2 text-xs border border-neutral-200/60 dark:border-neutral-800">
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Subtotal</span>
                  <Price amount={cartTotal} />
                </div>

                {memberDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Member Discount (5%)</span>
                    <span>-<Price amount={memberDiscount} /></span>
                  </div>
                )}

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Promo ({appliedPromo?.code})</span>
                    <span>-<Price amount={promoDiscount} /></span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Shipping ({selectedShippingOption.courier})</span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</span>
                  ) : (
                    <Price amount={shippingCost} />
                  )}
                </div>

                <div className="flex justify-between text-base font-bold text-neutral-900 dark:text-white pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <span>Total</span>
                  <Price amount={finalTotal} />
                </div>
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 py-3.5 text-xs font-bold uppercase tracking-wider transition hover:opacity-90 active:scale-95 disabled:opacity-50 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing…</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 text-center">
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
