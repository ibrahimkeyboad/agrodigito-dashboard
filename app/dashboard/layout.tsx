import type { Metadata } from 'next';
import { getAuthenticatedUser } from '@/utils/firebase/server';
import { DashboardShell } from '@/components/DashboardShell';
import { OrderListener } from '@/components/orders/order-listener';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard | AgroDigito',
  description: 'Manage your inventory and orders',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ---------------------------------------------------------
  // 🔒 SECURITY CHECK (Server Side)
  // ---------------------------------------------------------
  // This runs before the page is even sent to the browser.
  // If the user has a fake cookie or no session, they get kicked out.
  try {
    await getAuthenticatedUser();
  } catch (error) {
    // Double safety: If verification crashes, redirect to login
    redirect('/login');
  }
  return (
    // This file stays as a Server Component, so metadata works.
    // We render the interactive shell (Client Component) here.
    <DashboardShell>
      <OrderListener />
      {children}
    </DashboardShell>
  );
}
