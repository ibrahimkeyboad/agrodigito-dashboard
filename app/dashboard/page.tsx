import { Suspense } from 'react';
import { getDashboardStats } from './actions';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { Overview } from '@/components/dashboard/overview';
import { RecentSales } from '@/components/dashboard/recent-sales';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default async function DashboardPage() {
  const { stats, chartData, recentOrders } = await getDashboardStats();

  return (
    <div className='flex-1 space-y-4'>
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
      </div>

      {/* 1. Stats Row */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsCards data={stats} />
      </Suspense>

      {/* 2. Charts & Recent Activity Row */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        {/* Chart */}
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Your daily revenue for the last 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent className='pl-2'>
            <Overview data={chartData} />
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className='col-span-3'>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              You made {recentOrders.length} sales this week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales recentOrders={recentOrders} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {[...Array(4)].map((_, i) => (
        <div key={i} className='h-32 rounded-xl bg-slate-100 animate-pulse' />
      ))}
    </div>
  );
}
