import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CreditCard, Package, Activity } from 'lucide-react';

interface StatsCardsProps {
  data: {
    totalRevenue: number;
    ordersCount: number;
    productsCount: number;
    usersCount: number;
  };
}

export function StatsCards({ data }: StatsCardsProps) {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
          <CreditCard className='h-4 w-4 text-green-600' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            TSh {(data.totalRevenue / 1000).toFixed(1)}k
          </div>
          <p className='text-xs text-muted-foreground'>
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Orders</CardTitle>
          <Activity className='h-4 w-4 text-blue-600' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>+{data.ordersCount}</div>
          <p className='text-xs text-muted-foreground'>
            +180.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Products</CardTitle>
          <Package className='h-4 w-4 text-orange-600' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{data.productsCount}</div>
          <p className='text-xs text-muted-foreground'>In stock inventory</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Active Users</CardTitle>
          <Users className='h-4 w-4 text-purple-600' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>+{data.usersCount}</div>
          <p className='text-xs text-muted-foreground'>+19 since last hour</p>
        </CardContent>
      </Card>
    </div>
  );
}
