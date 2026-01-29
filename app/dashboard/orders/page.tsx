import { Suspense } from 'react';
import { getOrders } from './actions';
import { OrdersClient } from './orders-client';

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className='h-[calc(100vh-140px)]'>
      {' '}
      {/* Constrain height to viewport minus headers */}
      <Suspense fallback={<OrdersSkeleton />}>
        <OrdersClient initialOrders={orders} />
      </Suspense>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className='space-y-4 animate-pulse'>
      <div className='grid grid-cols-3 gap-4'>
        <div className='h-32 bg-slate-100 rounded-xl'></div>
        <div className='h-32 bg-slate-100 rounded-xl'></div>
        <div className='h-32 bg-slate-100 rounded-xl'></div>
      </div>
      <div className='h-96 bg-slate-100 rounded-xl'></div>
    </div>
  );
}
