import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Order } from '@/types';

interface RecentSalesProps {
  orders: Order[];
}

export function RecentSales({ orders }: RecentSalesProps) {
  return (
    <div className='space-y-8'>
      {orders.map((order) => (
        <div key={order.id} className='flex items-center'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src='/avatars/01.png' alt='Avatar' />
            <AvatarFallback className='bg-green-100 text-green-700 font-bold'>
              {order.customerInfo?.customerName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className='ml-4 space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {order.customerInfo?.customerName}
            </p>
            <p className='text-xs text-muted-foreground'>
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className='ml-auto font-medium'>
            +TSh {order.total.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
