import 'server-only';
import { cookies } from 'next/headers';
import { initAdmin } from '@/lib/firebase/admin';
import { redirect } from 'next/navigation';

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get('__session')?.value;

  // 1. If no cookie at all, just redirect
  if (!session) {
    redirect('/login');
  }

  try {
    const admin = await initAdmin();
    // 2. Verify the session
    const decodedClaims = await admin.auth().verifySessionCookie(session, true);
    return decodedClaims;

  } catch (error) {
    console.error('Session verification failed:', error);

    // 🛑 CRITICAL FIX: Delete the invalid cookie!
    // This stops the middleware from seeing it and redirecting back to dashboard.
    cookieStore.delete('__session');

    // Now redirect to login
    redirect('/login');
  }
}