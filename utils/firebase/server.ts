import 'server-only';
import { cookies } from 'next/headers';
import { initAdmin } from '@/lib/firebase/admin';
import { redirect } from 'next/navigation';

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get('__session')?.value;

  // If no cookie, kick them out
  if (!session) {
    redirect('/login');
  }

  try {
    const admin = await initAdmin();
    // Verify the session cookie signature
    // 'true' checks for revocation (if you disabled their account in Firebase)
    const decodedClaims = await admin.auth().verifySessionCookie(session, true);

    return decodedClaims;
  } catch (error) {
    console.error('Verification failed:', error);
    // If signature is invalid (hacker) or expired, redirect to login
    redirect('/login');
  }
}
