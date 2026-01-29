'use server';

import { revalidateTag } from 'next/cache';
import { supabase } from '@/lib/supabase'; // Admin client preferred here if available, but anon works if RLS allows

export async function revalidateProducts() {
  revalidateTag('products', { expire: 0 });
}

export async function deleteProductAction(id: string) {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;

    // Purge the cache so the next fetch gets fresh data
    revalidateTag('products', { expire: 0 });
    return { success: true };
  } catch (error) {
    console.error('Delete failed:', error);
    return { success: false, error };
  }
}
