import { Suspense } from 'react';
import { ProductsClient } from './products-client';
import { createClient } from '@/utils/supabase/server';
import { Product } from '@/types';

export default async function ProductsPage() {
  // 1. Create the Supabase client
  const supabase = await createClient();

  // 2. Fetch data directly using the client
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    // You could throw an error here or pass an empty array
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
            Products
          </h1>
          <p className='text-sm text-slate-500 mt-1'>
            Manage your inventory, prices, and variants.
          </p>
        </div>
      </div>

      <Suspense fallback={<ProductsLoadingSkeleton />}>
        {/* Pass the data to the client component */}
        <ProductsClient initialProducts={(products as Product[]) || []} />
      </Suspense>
    </div>
  );
}

function ProductsLoadingSkeleton() {
  return (
    <div className='space-y-4 animate-pulse'>
      <div className='h-24 w-full bg-slate-100 rounded-lg'></div>
      <div className='h-64 w-full bg-slate-100 rounded-lg'></div>
    </div>
  );
}
