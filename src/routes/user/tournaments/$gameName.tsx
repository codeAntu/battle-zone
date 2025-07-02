import { getUserTournamentByName } from '@/api/tournament';
import TournamentNotFound from '@/components/TournamentNotFound';
import Tournaments from '@/components/Tournaments';
import { Button } from '@/components/ui/button';
import { TournamentCardSkeleton } from '@/components/ui/loading-skeletons';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateToUTC, formatTimeToUTC } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const Route = createFileRoute('/user/tournaments/$gameName')({
  component: RouteComponent,
});

function RouteComponent() {
  const { gameName } = useParams({ from: '/user/tournaments/$gameName' });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['tournaments', gameName],
    queryFn: () => getUserTournamentByName(gameName),
    enabled: !!gameName,
  });

  if (isLoading) {
    return (
      <div className='space-y-6 p-4'>
        {/* Title Skeleton */}
        <Skeleton className='h-8 w-64 bg-gray-800' />

        {/* Tournament Cards Skeleton */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <TournamentCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex min-h-[50vh] flex-col items-center justify-center p-4 text-center'>
        <div className='mb-6'>
          <AlertCircle className='mx-auto mb-4 h-16 w-16 text-red-500' />
          <h2 className='mb-2 text-xl font-semibold text-white'>Failed to Load Tournaments</h2>
          <p className='mb-4 text-gray-400'>
            We couldn't load the tournaments for <span className='font-medium text-white'>{gameName}</span>. Please
            check your connection and try again.
          </p>
        </div>

        <Button onClick={() => refetch()} className='flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700'>
          <RefreshCw className='h-4 w-4' />
          Try Again
        </Button>
      </div>
    );
  }

  console.log(data);

  const tournaments =
    data?.data?.tournaments.map((item) => {
      const tournament = item.tournament;
      const formattedDate = formatDateToUTC(tournament.scheduledAt);
      const formattedTime = formatTimeToUTC(tournament.scheduledAt);
      return { ...tournament, formattedDate, formattedTime };
    }) || [];

  console.log('tournaments', tournaments);

  return (
    <div className='p-4'>
      {tournaments.length === 0 ? (
        <TournamentNotFound />
      ) : (
        <>
          <h1 className='mb-4 text-2xl font-bold'>{gameName} Tournaments</h1>
          <Tournaments tournaments={tournaments} />
        </>
      )}
    </div>
  );
}
