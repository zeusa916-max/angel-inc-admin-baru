
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { idr, date } from "@/lib/utils";

export default async function Orders() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("orders")
    .select("id,total,status,created_at,customers(name,email)")
    .order("created_at", { ascending: false });

  return (
    <div className="rounded-2xl border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs text-neutral-400">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Pelanggan</th>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {(data ?? []).map((o) => (
              <tr key={o.id} className="border-b">
                <td className="p-4 font-mono text-xs">
                  {o.id.slice(0, 8)}
                </td>

                <td className="p-4">
  {(() => {
    const customers = (o as any).customers;

    if (Array.isArray(customers)) {
      return customers[0]?.name ?? "-";
    }

    return customers?.name ?? "-";
  })()}
</td>
                <td className="p-4">
                  {date(o.created_at)}
                </td>

                <td className="p-4">
                  {idr(o.total)}
                </td>

                <td className="p-4">
                  {o.status}
                </td>

                <td className="p-4">
                  <Link
                    href={/admin/orders/${o.id}
                    className="rounded-lg border px-3 py-2 text-xs"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}