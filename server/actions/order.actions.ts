'use server';

import { OrderService } from '@/server/services/order.service';
import { revalidatePath } from 'next/cache';

export interface CreateOrderItemInput {
  productId?: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  shippingCity?: string;
  shippingCourier?: string;
  shippingCost?: number;
  paymentMethod?: string;
  notes?: string;
  items: CreateOrderItemInput[];
}

export async function createOrderAction(input: CreateOrderInput) {
  try {
    if (!input.customerName?.trim()) {
      return { success: false, error: 'Nama penerima wajib diisi.' };
    }
    if (!input.customerPhone?.trim()) {
      return { success: false, error: 'Nomor telepon penerima wajib diisi.' };
    }
    if (!input.shippingAddress?.trim()) {
      return { success: false, error: 'Alamat pengiriman wajib diisi.' };
    }
    if (!input.items || input.items.length === 0) {
      return { success: false, error: 'Keranjang belanja tidak boleh kosong.' };
    }

    const order = await OrderService.create({
      customerName: input.customerName.trim(),
      customerPhone: input.customerPhone.trim(),
      customerEmail: input.customerEmail?.trim(),
      shippingAddress: input.shippingAddress.trim(),
      shippingCity: input.shippingCity?.trim(),
      shippingCourier: input.shippingCourier || 'J&T Express (Reguler)',
      shippingCost: input.shippingCost || 0,
      paymentMethod: input.paymentMethod || 'qris',
      notes: input.notes?.trim(),
      items: input.items,
    });

    revalidatePath('/admin/orders');
    revalidatePath('/admin');

    return {
      success: true,
      data: order,
      message: 'Pesanan Anda berhasil dibuat!',
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Gagal membuat pesanan.',
    };
  }
}

import { OrderStatus } from '@/types/database';

export async function updateOrderStatusAction(
  arg1: string | { id: string; status: OrderStatus },
  arg2?: OrderStatus
) {
  try {
    const id = typeof arg1 === 'string' ? arg1 : arg1.id;
    const status = typeof arg1 === 'string' ? arg2! : arg1.status;

    const updated = await OrderService.updateStatus(id, status);
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath('/admin');
    return {
      success: true,
      data: updated,
      message: `Status pesanan berhasil diperbarui menjadi ${status}.`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Gagal memperbarui status pesanan.',
    };
  }
}

export async function getOrderByIdAction(id: string) {
  try {
    const order = await OrderService.getById(id);
    if (!order) {
      return { success: false, error: 'Pesanan tidak ditemukan.' };
    }
    return { success: true, data: order };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Gagal memuat pesanan.' };
  }
}
