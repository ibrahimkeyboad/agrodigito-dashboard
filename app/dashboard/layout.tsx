import type { Metadata } from 'next';
import { DashboardShell } from '@/components/DashboardShell';
import { OrderListener } from '@/components/orders/order-listener';

export const metadata: Metadata = {
  title: 'Dashboard | AgroDigito',
  description: 'Manage your inventory and orders',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // This file stays as a Server Component, so metadata works.
    // We render the interactive shell (Client Component) here.
    <DashboardShell>
      <OrderListener />
      {children}
    </DashboardShell>
  );
}
