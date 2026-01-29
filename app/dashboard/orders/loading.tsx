import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='h-full flex flex-col gap-4'>
      {/* Stats Row Skeleton */}
      <div className='grid gap-4 md:grid-cols-3 shrink-0'>
        <Skeleton className='h-32 rounded-xl' />
        <Skeleton className='h-32 rounded-xl' />
        <Skeleton className='h-32 rounded-xl' />
      </div>

      {/* Controls Skeleton */}
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-2 rounded-2xl border border-slate-100 shadow-sm shrink-0'>
        <Skeleton className='h-11 w-full sm:max-w-md rounded-xl' />
        <Skeleton className='h-11 w-32 rounded-xl' />
      </div>

      {/* Table Skeleton */}
      <Card className='flex-1 min-h-0 shadow-sm border-slate-200 overflow-hidden rounded-2xl flex flex-col bg-white'>
        <div className='p-6 space-y-6'>
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className='flex items-center justify-between py-3 border-b border-slate-50'>
              <div className='flex items-center gap-4'>
                <Skeleton className='h-10 w-24 rounded-lg' />
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-3 w-20' />
                </div>
              </div>
              <Skeleton className='h-6 w-24 rounded-full' />
              <Skeleton className='h-8 w-8 rounded-lg' />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
