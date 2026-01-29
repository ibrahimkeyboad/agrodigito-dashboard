'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';
import { Package } from 'lucide-react';

export function OrderListener() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // 1. Create a channel to listen to the 'orders' table
    const channel = supabase
      .channel('realtime-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT', // Listen ONLY for new orders
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          // 2. Play a Notification Sound (Optional)
          const audio = new Audio('/sounds/notification.wav'); // You need to add this file
          audio.play().catch((e) => console.log('Audio play failed', e));

          // 3. Show a Toast Notification
          toast('New Order Received!', {
            description: `Order #${payload.new.order_number} just came in.`,
            icon: <Package className='h-5 w-5 text-green-600' />,
            duration: 8000, // Stay visible for 8 seconds
            action: {
              label: 'View Order',
              onClick: () => router.push('/dashboard/orders'),
            },
          });

          // 4. Refresh data if you are on the orders page
          router.refresh();
        },
      )
      .subscribe();

    // Cleanup when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, supabase]);

  return null; // This component doesn't render anything visible
}
