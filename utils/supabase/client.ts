import { createBrowserClient } from '@supabase/ssr';
import { getAuth, getIdToken } from 'firebase/auth';

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          const auth = getAuth();
          const user = auth.currentUser;

          if (user) {
            const token = await getIdToken(user, false);
            const headers = new Headers(options.headers);
            headers.set('Authorization', `Bearer ${token}`);
            options.headers = headers;
          }

          return fetch(url, options);
        },
      },
    }
  );
