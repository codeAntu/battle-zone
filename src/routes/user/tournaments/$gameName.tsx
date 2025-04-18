import Tournaments from '@/components/Tournaments';
import TournamentNotFound from '@/components/TournamentNotFound';
import { getUserTournamentByName } from '@/services/tournament';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { formatDateToUTC, formatTimeToUTC } from '@/lib/utils';

export const Route = createFileRoute('/user/tournaments/$gameName')({
  component: RouteComponent,
});

function RouteComponent() {
  const { gameName } = useParams({ from: '/user/tournaments/$gameName' });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tournaments', gameName],
    queryFn: () => getUserTournamentByName(gameName),
    enabled: !!gameName,
  });

  if (isLoading) {
    return <div className='p-4'>Loading tournaments for {gameName}...</div>;
  }

  if (isError) {
    return <div className='p-4 text-red-500'>Error loading tournaments for {gameName}.</div>;
  }

  console.log(data);
  
  const tournaments = data?.tournaments?.map((item) => {
    const tournament = item.tournament;
    const formattedDate = formatDateToUTC(tournament.scheduledAt);
    const formattedTime = formatTimeToUTC(tournament.scheduledAt);
    return { ...tournament, formattedDate, formattedTime };
  }) || [];
  
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
