'use client';

import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProductSheet } from '@/components/products/ProductSheet';

// Mock Data for Charts
const chartData = [
  { day: 'Mon', revenue: 250000 },
  { day: 'Tue', revenue: 180000 },
  { day: 'Wed', revenue: 320000 },
  { day: 'Thu', revenue: 290000 },
  { day: 'Fri', revenue: 450000 },
  { day: 'Sat', revenue: 580000 },
  { day: 'Sun', revenue: 380000 },
];

export default function Dashboard() {
  return (
    <div className='flex flex-col gap-4'>
      {/* 1. TOP STATS CARDS */}
      <div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4'>
        <Card x-chunk='dashboard-01-chunk-0'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>TSh 2.4M</div>
            <p className='text-xs text-muted-foreground'>
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card x-chunk='dashboard-01-chunk-1'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Subscriptions</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>+2350</div>
            <p className='text-xs text-muted-foreground'>
              +180.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card x-chunk='dashboard-01-chunk-2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Sales</CardTitle>
            <CreditCard className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>+12,234</div>
            <p className='text-xs text-muted-foreground'>
              +19% from last month
            </p>
          </CardContent>
        </Card>

        <Card x-chunk='dashboard-01-chunk-3'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Now</CardTitle>
            <Activity className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>+573</div>
            <p className='text-xs text-muted-foreground'>
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. CHART & TRANSACTIONS GRID */}
      <div className='grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3'>
        {/* CHART SECTION (Takes 2 columns on XL) */}
        <Card className='xl:col-span-2' x-chunk='dashboard-01-chunk-4'>
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
            <CardDescription>
              Your revenue performance over the last 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent className='pl-2'>
            <div className='h-[300px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id='colorRevenue'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'>
                      <stop offset='5%' stopColor='#16a34a' stopOpacity={0.2} />
                      <stop offset='95%' stopColor='#16a34a' stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    stroke='#e5e7eb'
                  />
                  <XAxis
                    dataKey='day'
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    dy={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Area
                    type='monotone'
                    dataKey='revenue'
                    stroke='#16a34a'
                    strokeWidth={2}
                    fillOpacity={1}
                    fill='url(#colorRevenue)'
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* RECENT ORDERS TABLE */}
        <Card x-chunk='dashboard-01-chunk-5'>
          <CardHeader className='flex flex-row items-center'>
            <div className='grid gap-2'>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>
                Recent transactions from your store.
              </CardDescription>
            </div>
            <Button
              asChild
              size='sm'
              className='ml-auto gap-1 bg-green-600 hover:bg-green-700'>
              <a href='#'>
                View All
                <ArrowUpRight className='h-4 w-4' />
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className='text-right'>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className='font-medium'>Liam Johnson</div>
                    <div className='hidden text-sm text-muted-foreground md:inline'>
                      liam@example.com
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>TSh 25,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className='font-medium'>Olivia Smith</div>
                    <div className='hidden text-sm text-muted-foreground md:inline'>
                      olivia@example.com
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>TSh 14,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className='font-medium'>Noah Williams</div>
                    <div className='hidden text-sm text-muted-foreground md:inline'>
                      noah@example.com
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>TSh 8,500</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className='font-medium'>Emma Brown</div>
                    <div className='hidden text-sm text-muted-foreground md:inline'>
                      emma@example.com
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>TSh 42,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className='font-medium'>James Bond</div>
                    <div className='hidden text-sm text-muted-foreground md:inline'>
                      007@example.com
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>TSh 150,000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <ProductSheet isOpen />
      </div>
    </div>
  );
}
