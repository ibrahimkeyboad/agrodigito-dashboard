'use server';

import { createClient } from '@/utils/supabase/server';

export async function getDashboardStats() {
  const supabase = await createClient();

  // 1. Fetch Counts (Parallel Requests for speed)
  const [
    { count: productsCount },
    { count: ordersCount },
    { count: usersCount },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase
      .from('orders')
      .select('id, total, customer_info, created_at, status')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  // 2. Calculate Revenue (Last 30 days) & Chart Data
  // Note: For huge datasets, use a Database Function (RPC) instead of fetching all.
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: monthlyOrders } = await supabase
    .from('orders')
    .select('total, created_at')
    .gte('created_at', thirtyDaysAgo.toISOString());

  // Calculate Total Revenue
  const totalRevenue =
    monthlyOrders?.reduce((sum, order) => sum + order.total, 0) || 0;

  // Group by Date for the Chart
  const chartMap = new Map<string, number>();

  monthlyOrders?.forEach((order) => {
    const date = new Date(order.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    chartMap.set(date, (chartMap.get(date) || 0) + order.total);
  });

  // Convert Map to Array for Recharts
  const chartData = Array.from(chartMap.entries())
    .map(([name, total]) => ({
      name,
      total,
    }))
    .reverse(); // Show oldest to newest

  return {
    stats: {
      totalRevenue,
      productsCount: productsCount || 0,
      ordersCount: ordersCount || 0,
      usersCount: usersCount || 0,
    },
    chartData,
    recentOrders: recentOrders || [],
  };
}
