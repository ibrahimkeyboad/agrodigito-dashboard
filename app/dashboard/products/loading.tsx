import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='h-full flex flex-col gap-4'>
      {/* Top Stats Skeleton */}
      <div className='grid gap-4 md:grid-cols-4 shrink-0'>
        <Skeleton className='h-[100px] rounded-xl md:col-span-1' />
        <Skeleton className='h-[100px] rounded-xl md:col-span-1' />
      </div>

      {/* Search Bar Skeleton */}
      <div className='flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-2 rounded-2xl border border-slate-100 shadow-sm shrink-0'>
        <Skeleton className='h-11 w-full sm:max-w-md rounded-xl' />
        <Skeleton className='h-11 w-24 rounded-xl' />
      </div>

      {/* Table Skeleton */}
      <Card className='flex-1 min-h-0 shadow-sm border-slate-200 overflow-hidden rounded-2xl flex flex-col bg-white'>
        <div className='flex-1 p-6 space-y-6'>
          <div className='space-y-4'>
            {/* Header */}
            <div className='flex items-center gap-4'>
              <Skeleton className='h-8 w-8 rounded' />
              <Skeleton className='h-6 w-32 rounded' />
              <Skeleton className='h-6 w-24 rounded ml-auto' />
            </div>
            {/* Rows */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className='flex items-center gap-4 py-2 border-b border-slate-50'>
                <Skeleton className='h-12 w-12 rounded-xl' />
                <div className='space-y-2 flex-1'>
                  <Skeleton className='h-4 w-[200px]' />
                  <Skeleton className='h-3 w-[140px]' />
                </div>
                <Skeleton className='h-6 w-20 rounded-full' />
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-8 w-8 rounded-lg ml-auto' />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
