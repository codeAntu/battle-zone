import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function GameCardSkeleton() {
  return (
    <Card className='h-48 overflow-hidden'>
      <div className='relative h-full'>
        <Skeleton className='h-full w-full' />
        <div className='absolute right-0 bottom-0 left-0 p-3'>
          <Skeleton className='mb-2 h-6 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
        </div>
      </div>
    </Card>
  );
}

export function TournamentCardSkeleton() {
  return (
    <Card className='w-full'>
      <CardHeader>
        <Skeleton className='h-6 w-3/4' />
        <Skeleton className='h-4 w-1/2' />
      </CardHeader>
      <CardContent className='space-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-2/3' />
        <div className='mt-4 flex gap-2'>
          <Skeleton className='h-8 w-20' />
          <Skeleton className='h-8 w-20' />
        </div>
      </CardContent>
    </Card>
  );
}

export function TableRowSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <div className='flex gap-4 border-b p-4'>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className='h-4 flex-1' />
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <Card className='mx-auto w-full max-w-md'>
      <CardHeader className='text-center'>
        <Skeleton className='mx-auto mb-4 h-20 w-20 rounded-full' />
        <Skeleton className='mx-auto h-6 w-32' />
        <Skeleton className='mx-auto h-4 w-48' />
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
        </div>
      </CardContent>
    </Card>
  );
}

export function FormSkeleton() {
  return (
    <Card className='mx-auto w-full max-w-md'>
      <CardHeader>
        <Skeleton className='mx-auto h-6 w-48' />
        <Skeleton className='mx-auto h-4 w-64' />
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-10 w-full' />
        </div>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-10 w-full' />
        </div>
        <Skeleton className='h-10 w-full' />
      </CardContent>
    </Card>
  );
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className='space-y-3'>
      {Array.from({ length: items }).map((_, i) => (
        <Card key={i} className='p-4'>
          <div className='flex items-center space-x-3'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-3 w-1/2' />
            </div>
            <Skeleton className='h-8 w-16' />
          </div>
        </Card>
      ))}
    </div>
  );
}
