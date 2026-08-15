import { notFound } from 'next/navigation';
import { OrderService } from '@/server/services/order.service';
import OrderDetailClientView from './order-detail-client';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await OrderService.getById(id);

  if (!order) {
    notFound();
  }

  return <OrderDetailClientView initialOrder={order} />;
}
