'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Customer } from '@/types/database';
import { formatDate } from '@/lib/utils';
import { Search, Users, ArrowRight, Mail, Phone } from 'lucide-react';

export default function CustomersClientView({
  initialCustomers,
}: {
  initialCustomers: Customer[];
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = useMemo(() => {
    return initialCustomers.filter((c) => {
      const name = c.name || '';
      const email = c.email || '';
      const phone = c.phone || '';

      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [initialCustomers, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Search Toolbar */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-3.5 shadow-subtle">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari pelanggan berdasarkan nama, email, atau nomor telepon…"
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-2 pl-10 pr-4 text-xs outline-none transition focus:border-neutral-950 focus:bg-white focus:ring-1 focus:ring-neutral-950"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="border-b border-neutral-100 bg-neutral-50/80 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Nama Pelanggan</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Nomor Telepon</th>
                <th className="py-3.5 px-4">Terdaftar Sejak</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <tr
                    key={c.id}
                    className="transition hover:bg-neutral-50/70"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900">
                        {c.name}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-neutral-400" />
                        <span>{c.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600">
                      {c.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-neutral-400" />
                          <span>{c.phone}</span>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600">
                      {formatDate(c.created_at)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/customers/${c.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-950 hover:text-white transition"
                      >
                        <span>Profil</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <Users className="mx-auto h-8 w-8 text-neutral-300 mb-2" />
                    <p className="text-sm font-medium text-neutral-900">
                      Tidak ada pelanggan ditemukan
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      Belum ada data pelanggan yang cocok dengan pencarian Anda.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
