import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { OrderStatus, ProductStatus } from '@/types/database';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function idr(value: number | string | null | undefined): string {
  const num = typeof value === 'string' ? parseFloat(value) : (value ?? 0);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(isNaN(num) ? 0 : num);
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—';
  try {
    const d = typeof value === 'string' ? new Date(value) : value;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return '—';
  }
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return '—';
  try {
    const d = typeof value === 'string' ? new Date(value) : value;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return '—';
  }
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function getOrderStatusBadge(status: OrderStatus): { label: string; className: string } {
  switch (status) {
    case 'pending':
      return {
        label: 'Pending',
        className: 'bg-amber-50 text-amber-700 border-amber-200/80 ring-1 ring-amber-500/20',
      };
    case 'paid':
      return {
        label: 'Paid',
        className: 'bg-blue-50 text-blue-700 border-blue-200/80 ring-1 ring-blue-500/20',
      };
    case 'processing':
      return {
        label: 'Diproses',
        className: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 ring-1 ring-indigo-500/20',
      };
    case 'shipped':
      return {
        label: 'Dikirim',
        className: 'bg-purple-50 text-purple-700 border-purple-200/80 ring-1 ring-purple-500/20',
      };
    case 'completed':
      return {
        label: 'Selesai',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-1 ring-emerald-500/20',
      };
    case 'cancelled':
      return {
        label: 'Dibatalkan',
        className: 'bg-rose-50 text-rose-700 border-rose-200/80 ring-1 ring-rose-500/20',
      };
    default:
      return {
        label: status,
        className: 'bg-neutral-100 text-neutral-700 border-neutral-200 ring-1 ring-neutral-400/20',
      };
  }
}

export function getProductStatusBadge(status: ProductStatus): { label: string; className: string } {
  switch (status) {
    case 'active':
      return {
        label: 'Aktif',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-1 ring-emerald-500/20',
      };
    case 'draft':
      return {
        label: 'Draft',
        className: 'bg-neutral-100 text-neutral-700 border-neutral-200 ring-1 ring-neutral-400/20',
      };
    case 'inactive':
      return {
        label: 'Nonaktif',
        className: 'bg-amber-50 text-amber-700 border-amber-200/80 ring-1 ring-amber-500/20',
      };
    case 'out_of_stock':
      return {
        label: 'Habis',
        className: 'bg-rose-50 text-rose-700 border-rose-200/80 ring-1 ring-rose-500/20',
      };
    default:
      return {
        label: status,
        className: 'bg-neutral-100 text-neutral-700 border-neutral-200 ring-1 ring-neutral-400/20',
      };
  }
}
