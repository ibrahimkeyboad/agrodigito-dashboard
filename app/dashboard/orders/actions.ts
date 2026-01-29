'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { Order } from '@/types';

// Map DB snake_case to TS camelCase
const mapOrderData = (data: any[]): Order[] => {
  return data.map((order) => ({
    ...order,
    orderNumber: order.order_number,
    customerInfo: order.customer_info,
    shippingAddress: order.shipping_address,
    paymentMethod: order.payment_method,
    shippingCost: order.shipping_cost,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    // Ensure items is an array
    items: Array.isArray(order.items) ? order.items : [],
  }));
};

export async function getOrders() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch orders error:', error);
    return [];
  }

  return mapOrderData(data);
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('orders')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/orders');
  return { success: true };
}
