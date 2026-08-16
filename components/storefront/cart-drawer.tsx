'use client';

import { useStorefront } from './storefront-context';
import { Price } from '@/components/providers/currency-provider';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    clearCart,
  } = useStorefront();

  if (!isCartOpen) return null;

  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;
    const itemsList = cart
      .map(
        (item) =>
          `• ${item.product.name} (${item.quantity}x) - Rp ${(
            (item.product.discountPrice ?? item.product.price) * item.quantity
          ).toLocaleString('id-ID')}`
      )
      .join('\n');

    const totalStr = `Rp ${cartTotal.toLocaleString('id-ID')}`;
    const text = encodeURIComponent(
      `Halo Angel Inc., saya ingin memesan produk berikut:\n\n${itemsList}\n\n*Total:* ${totalStr}\n\nMohon info ketersediaan dan cara pembayarannya. Terima kasih!`
    );

    window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-in Drawer */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#141518] shadow-2xl flex flex-col justify-between z-10 border-l border-neutral-200 dark:border-neutral-800 animate-fade-in">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 px-6 py-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-neutral-900 dark:text-white" />
            <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-white">
              Shopping Bag ({cartCount})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Body: Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-neutral-100 dark:divide-neutral-800">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16 space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <div>
                <h4 className="font-serif text-base font-semibold text-neutral-900 dark:text-white">
                  Keranjang Anda masih kosong
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs">
                  Temukan parfum, body care, dan fashion terbaik di katalog Angel Inc.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            cart.map(({ product, quantity }) => (
              <div key={product.id} className="py-4 flex gap-4 items-center">
                {/* Item Thumbnail */}
                <div className="h-16 w-16 rounded-xl bg-neutral-950 flex items-center justify-center shrink-0 overflow-hidden border border-neutral-200 dark:border-neutral-800">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover object-center grayscale contrast-125 brightness-95"
                    />
                  ) : (
                    <Sparkles className="h-6 w-6 text-amber-500" />
                  )}
                </div>

                {/* Item Info */}
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                    {product.categoryName}
                  </span>
                  <h5 className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                    {product.name}
                  </h5>
                  <div className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mt-0.5">
                    <Price amount={product.discountPrice ?? product.price} />
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-700 px-2 py-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="text-neutral-400 hover:text-black dark:hover:text-white"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-[11px] font-bold text-neutral-900 dark:text-white w-4 text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="text-neutral-400 hover:text-black dark:hover:text-white"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="text-neutral-400 hover:text-rose-600 transition p-1"
                      title="Hapus produk"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="border-t border-neutral-100 dark:border-neutral-800 p-6 space-y-4 bg-[#faf9f6] dark:bg-[#101114]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Total Belanja
              </span>
              <span className="font-serif text-lg font-bold text-neutral-950 dark:text-white">
                <Price amount={cartTotal} />
              </span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleCheckoutWhatsApp}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 py-3.5 text-xs font-bold uppercase tracking-wider transition hover:opacity-90 shadow-md active:scale-95"
              >
                <span>Checkout via WhatsApp</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={clearCart}
                className="w-full text-center text-[11px] text-neutral-400 hover:text-rose-600 py-1 transition"
              >
                Kosongkan Keranjang
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
