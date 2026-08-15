import { OrderService } from '@/server/services/order.service';
import OrdersClientView from './orders-client';

export default async function OrdersPage() {
  const allOrders = await OrderService.getAll();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase">
          Transaksi Penjualan
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-neutral-900">
          Daftar Pesanan
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Kelola alur pemrosesan pesanan pelanggan dari status pending hingga selesai
        </p>
      </div>

      <OrdersClientView initialOrders={allOrders} />
    </div>
  );
}