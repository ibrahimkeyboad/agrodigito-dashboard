'use server';

import { cookies } from 'next/headers';
import { initAdmin } from '@/lib/firebase/admin';

export async function createSession(idToken: string) {
  const admin = await initAdmin();
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn });

    // ✅ FIX: Await the cookies() call first
    const cookieStore = await cookies();

    cookieStore.set('__session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      domain:
        process.env.NODE_ENV === 'production' ? '.agrodigito.com' : undefined,
      sameSite: 'lax',
    });

    return { success: true };
  } catch (error) {
    console.error('Session creation failed', error);
    return { success: false };
  }
}

export async function removeSession() {
  // ✅ FIX: Await here too
  (await cookies()).delete('__session');
}
