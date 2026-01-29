'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Search,
  Filter,
  Eye,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Truck,
  Package,
} from 'lucide-react';
import { Order } from '@/types';
import { updateOrderStatus } from './actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { OrderDetailsSheet } from '@/components/orders/OrderDetailsSheet';

interface OrdersClientProps {
  initialOrders: Order[];
}

export function OrdersClient({ initialOrders }: OrdersClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    toast.loading('Updating status...');

    const res = await updateOrderStatus(orderId, newStatus);

    toast.dismiss();
    if (res.success) {
      toast.success(`Order marked as ${newStatus}`);
      router.refresh();
    } else {
      toast.error('Failed to update status');
    }
    setUpdating(null);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const filteredOrders = useMemo(() => {
    return initialOrders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo?.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
  }, [initialOrders, searchTerm]);

  // Stats
  const stats = useMemo(
    () => ({
      total: initialOrders.length,
      pending: initialOrders.filter((o) => o.status === 'pending').length,
      revenue: initialOrders.reduce((acc, curr) => acc + curr.total, 0),
    }),
    [initialOrders],
  );

  return (
    <div className='h-full flex flex-col gap-4'>
      {/* 1. Stats Row */}
      <div className='grid gap-4 md:grid-cols-3 shrink-0'>
        <Card className='bg-blue-600 border-none shadow-md text-white'>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-blue-100 text-sm font-medium mb-1'>
                Total Orders
              </p>
              <h3 className='text-3xl font-bold'>{stats.total}</h3>
            </div>
            <div className='h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm'>
              <Package className='h-6 w-6 text-white' />
            </div>
          </CardContent>
        </Card>
        <Card className='bg-white border-slate-200 shadow-sm'>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-slate-500 text-sm font-medium mb-1'>
                Pending Orders
              </p>
              <h3 className='text-3xl font-bold text-orange-600'>
                {stats.pending}
              </h3>
            </div>
            <div className='h-12 w-12 bg-orange-50 rounded-xl flex items-center justify-center'>
              <Truck className='h-6 w-6 text-orange-600' />
            </div>
          </CardContent>
        </Card>
        <Card className='bg-white border-slate-200 shadow-sm'>
          <CardContent className='p-6 flex items-center justify-between'>
            <div>
              <p className='text-slate-500 text-sm font-medium mb-1'>
                Total Revenue
              </p>
              <h3 className='text-3xl font-bold text-green-700'>
                TSh {(stats.revenue / 1000).toFixed(1)}k
              </h3>
            </div>
            <div className='h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center'>
              <CheckCircle2 className='h-6 w-6 text-green-600' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Controls */}
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-2 rounded-2xl border border-slate-100 shadow-sm shrink-0'>
        <div className='relative w-full sm:max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
          <Input
            placeholder='Search orders...'
            className='pl-10 border-none bg-slate-50 focus-visible:ring-0 h-11 rounded-xl'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant='outline'
          className='border-slate-200 rounded-xl h-10 gap-2 text-slate-600'>
          <Filter className='h-4 w-4' /> Filter Status
        </Button>
      </div>

      {/* 3. Orders Table */}
      <Card className='flex-1 min-h-0 shadow-sm border-slate-200 overflow-hidden rounded-2xl flex flex-col bg-white'>
        <div className='flex-1 overflow-auto'>
          <Table>
            <TableHeader className='bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm'>
              <TableRow>
                <TableHead className='pl-6 py-4'>Order ID</TableHead>
                <TableHead className='py-4'>Customer</TableHead>
                <TableHead className='py-4'>Items</TableHead>
                <TableHead className='py-4'>Total</TableHead>
                <TableHead className='py-4'>Status</TableHead>
                <TableHead className='text-right pr-6 py-4'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className='h-48 text-center text-slate-500'>
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className='hover:bg-slate-50/60 transition-colors'>
                    <TableCell className='pl-6 font-medium text-slate-900'>
                      #{order.orderNumber}
                      <div className='text-xs text-slate-400 font-normal'>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='font-medium text-slate-700'>
                        {order.customerInfo?.customerName ||
                          order.shippingAddress.fullName}
                      </div>
                      <div className='text-xs text-slate-400'>
                        {order.customerInfo?.customerPhone ||
                          order.shippingAddress.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='secondary'
                        className='bg-slate-100 text-slate-600 font-normal'>
                        {order.items.length} Items
                      </Badge>
                    </TableCell>
                    <TableCell className='font-bold text-slate-900'>
                      TSh {order.total.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className='text-right pr-6'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            className='h-8 w-8 p-0 text-slate-400 hover:text-slate-600 rounded-lg'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align='end'
                          className='w-[180px] rounded-xl'>
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(order)}>
                            <Eye className='mr-2 h-4 w-4' /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(order.id, 'confirmed')
                            }>
                            <CheckCircle2 className='mr-2 h-4 w-4 text-blue-600' />{' '}
                            Confirm
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(order.id, 'shipped')
                            }>
                            <Truck className='mr-2 h-4 w-4 text-indigo-600' />{' '}
                            Ship
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(order.id, 'delivered')
                            }>
                            <CheckCircle2 className='mr-2 h-4 w-4 text-green-600' />{' '}
                            Mark Delivered
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(order.id, 'cancelled')
                            }
                            className='text-red-600'>
                            <XCircle className='mr-2 h-4 w-4' /> Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <OrderDetailsSheet
        order={selectedOrder}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
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
      className={`capitalize ${styles[status] || styles.pending}`}>
      {status}
    </Badge>
  );
}
