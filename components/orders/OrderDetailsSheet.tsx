'use client';

import { format } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
// REMOVE: import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Phone, User, CreditCard, Package } from 'lucide-react';
import { Order } from '@/types';
import Image from 'next/image';

interface OrderDetailsSheetProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsSheet({
  order,
  open,
  onOpenChange,
}: OrderDetailsSheetProps) {
  if (!order) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* Ensure h-full is present so the flex container fills the screen */}
      <SheetContent className='sm:max-w-150 w-full p-0 h-full flex flex-col bg-slate-50 overflow-hidden'>
        {/* Fixed Header */}
        <SheetHeader className='p-6 bg-white border-b border-slate-100 shrink-0'>
          <div className='flex items-center justify-between'>
            <SheetTitle className='text-xl font-bold'>
              Order #{order.orderNumber}
            </SheetTitle>
            <StatusBadge status={order.status} />
          </div>
          <p className='text-sm text-slate-500'>
            Placed on {format(new Date(order.createdAt), "PPP 'at' p")}
          </p>
        </SheetHeader>

        {/* Scrollable Content Area */}
        {/* We replace ScrollArea with a simple div using overflow-y-auto */}
        <div className='flex-1 overflow-y-auto'>
          <div className='p-6 space-y-8 pb-10'>
            {' '}
            {/* Added pb-10 for bottom spacing */}
            {/* 1. Order Items */}
            <section>
              <h4 className='text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2'>
                <Package className='h-4 w-4' /> Items ({order.items.length})
              </h4>
              <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className='flex items-center gap-4 p-4 border-b border-slate-100 last:border-0'>
                    <div className='relative h-16 w-16 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0'>
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <div className='h-full w-full flex items-center justify-center text-slate-400 text-xs'>
                          No Img
                        </div>
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-slate-900 truncate'>
                        {item.name}
                      </p>
                      <p className='text-sm text-slate-500'>
                        {item.quantity} x TSh {item.price.toLocaleString()}
                      </p>
                    </div>
                    <p className='font-semibold text-slate-900'>
                      TSh {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}

                {/* Order Summary Footer inside the card */}
                <div className='p-4 bg-slate-50/50 space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-slate-500'>Subtotal</span>
                    <span>TSh {order.subtotal?.toLocaleString() || 0}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-slate-500'>Shipping</span>
                    <span>TSh {order.shippingCost?.toLocaleString() || 0}</span>
                  </div>
                  <Separator className='my-2' />
                  <div className='flex justify-between font-bold text-lg'>
                    <span>Total</span>
                    <span className='text-green-700'>
                      TSh {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </section>
            {/* 2. Customer & Delivery Info */}
            <div className='grid sm:grid-cols-2 gap-6'>
              <section>
                <h4 className='text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2'>
                  <User className='h-4 w-4' /> Customer
                </h4>
                <div className='bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm space-y-3'>
                  <div className='flex items-center gap-3'>
                    <div className='h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold shrink-0'>
                      {order.customerInfo?.customerName?.charAt(0) || 'C'}
                    </div>
                    <div className='min-w-0'>
                      <p className='font-medium truncate'>
                        {order.customerInfo?.customerName ||
                          order.shippingAddress.fullName}
                      </p>
                      <p className='text-slate-500 truncate'>
                        {order.customerInfo?.customerPhone ||
                          order.shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h4 className='text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2'>
                  <MapPin className='h-4 w-4' /> Shipping
                </h4>
                <div className='bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm'>
                  <p className='font-medium mb-1'>
                    {order.shippingAddress?.fullName}
                  </p>
                  <p className='text-slate-500 leading-relaxed'>
                    {order.shippingAddress?.address}
                    <br />
                    {order.shippingAddress?.city},{' '}
                    {order.shippingAddress?.region}
                  </p>
                  <p className='text-slate-500 mt-2 flex items-center gap-2'>
                    <Phone className='h-3 w-3' /> {order.shippingAddress?.phone}
                  </p>
                </div>
              </section>
            </div>
            {/* 3. Payment Info */}
            <section>
              <h4 className='text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2'>
                <CreditCard className='h-4 w-4' /> Payment
              </h4>
              <div className='bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4'>
                <div className='h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0'>
                  <CreditCard className='h-5 w-5 text-slate-500' />
                </div>
                <div>
                  <p className='font-medium capitalize'>
                    {order.paymentMethod?.type?.replace('_', ' ')}
                  </p>
                  <p className='text-sm text-slate-500'>
                    {order.paymentMethod?.provider}
                  </p>
                </div>
                <Badge
                  variant='outline'
                  className='ml-auto bg-green-50 text-green-700 border-green-200'>
                  Paid
                </Badge>
              </div>
            </section>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    processing: 'bg-purple-50 text-purple-700 border-purple-200',
    shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <Badge
      variant='outline'
      className={`capitalize px-3 py-1 ${styles[status] || styles.pending}`}>
      {status}
    </Badge>
  );
}
