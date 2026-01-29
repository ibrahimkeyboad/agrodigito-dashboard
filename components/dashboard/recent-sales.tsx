import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface RecentSalesProps {
  orders: any[];
}

export function RecentSales({ orders }: RecentSalesProps) {
  return (
    <div className='space-y-8'>
      {orders.map((order) => (
        <div key={order.id} className='flex items-center'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src='/avatars/01.png' alt='Avatar' />
            <AvatarFallback className='bg-green-100 text-green-700 font-bold'>
              {order.customer_info?.name?.charAt(0) || 'C'}
            </AvatarFallback>
          </Avatar>
          <div className='ml-4 space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {order.customer_info?.name || 'Guest'}
            </p>
            <p className='text-xs text-muted-foreground'>
              {new Date(order.created_at).toLocaleDateString()}
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
