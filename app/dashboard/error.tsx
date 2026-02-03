'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-4'>
      <h2 className='text-xl font-bold text-red-600'>Session Expired</h2>
      <p>Please log in again to continue.</p>
      <a
        href='/login'
        className='rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700'>
        Go to Login
      </a>
    </div>
  );
}
