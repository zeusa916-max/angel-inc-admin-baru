import { CustomerService } from '@/server/services/customer.service';
import CustomersClientView from './customers-client';

export default async function CustomersPage() {
  const customers = await CustomerService.getAll();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase">
          Basis Data Pengguna
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-neutral-900">
          Daftar Pelanggan
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Daftar pelanggan terdaftar dan riwayat aktivitas transaksi
        </p>
      </div>

      <CustomersClientView initialCustomers={customers} />
    </div>
  );
}
