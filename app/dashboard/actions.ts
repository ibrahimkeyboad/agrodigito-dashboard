'use server';

import { createClient } from '@/utils/supabase/server';
import { Order, CustomerInfo } from '@/types';

export interface DashboardStats {
  stats: {
    totalRevenue: number;
    ordersCount: number;
    productsCount: number;
    usersCount: number;
  };
  chartData: { name: string; total: number }[];
  recentOrders: Order[];
}

interface SupabaseOrder {
  id: number;
  total: number;
  customer_info: CustomerInfo;
  created_at: string;
  status: Order['status'];
}

export async function getDashboardStats(): Promise<DashboardStats> {
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
    supabase.from('profile').select('*', { count: 'exact', head: true }),
    supabase
      .from('orders')
      .select('id, total, customer_info, created_at, status')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  // Map recent orders to match the Order type expected by components
  const mappedRecentOrders = ((recentOrders as SupabaseOrder[]) || []).map(
    (order) => ({
      id: order.id,
      total: order.total,
      customerInfo: order.customer_info,
      createdAt: order.created_at,
      status: order.status,
    }),
  ) as Order[];

  // 2. Calculate Revenue (Last 30 days) & Chart Data
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: monthlyOrders } = await supabase
    .from('orders')
    .select('total, created_at')
    .gte('created_at', thirtyDaysAgo.toISOString());

  // Calculate Total Revenue
  const totalRevenue =
    (monthlyOrders as { total: number; created_at: string }[] | null)?.reduce(
      (sum, order) => sum + order.total,
      0,
    ) || 0;

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
    recentOrders: mappedRecentOrders,
  };
}

export async function getPendingOrders(): Promise<Order[]> {
  const supabase = await createClient();

  const { data: pendingOrders } = await supabase
    .from('orders')
    .select('id, total, customer_info, created_at, status')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(10); // Limit to 10 notifications

  return ((pendingOrders as SupabaseOrder[]) || []).map((order) => ({
    id: order.id,
    total: order.total,
    customerInfo: order.customer_info,
    createdAt: order.created_at,
    status: order.status,
  })) as Order[];
}
