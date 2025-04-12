import TournamentDrawer from '@/components/TournamentDrawer';
import { Button } from '@/components/ui/button';
import { getParticipatedTournaments } from '@/services/tournament';
import { Tournament } from '@/services/types';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';
import { Trophy } from 'lucide-react';

export const Route = createFileRoute('/user/participated-tournaments')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['participated-tournaments'],
    queryFn: getParticipatedTournaments,
  });

  if (isLoading) {
    return (
      <div className='flex min-h-[40vh] items-center justify-center p-3'>
        <div className='border-primary h-8 w-8 animate-spin rounded-full border-t-2 border-b-2'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-4 text-center'>
        <p className='text-red-500'>Failed to load tournaments</p>
      </div>
    );
  }

  const tournaments = data?.tournaments || [];

  console.log(tournaments);
  console.log(data);

  return (
    <div className='p-5'>
      <div className='space-y-2'>
        <div className='mb-3'>
          <h1 className='text-xl font-bold'>Your Tournaments</h1>
          <p className='text-sm text-gray-400'>View all tournaments you have participated in</p>
        </div>

        {tournaments.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-700 p-4 text-center'>
            <Trophy className='mb-1 h-8 w-8 text-gray-500' />
            <h2 className='text-lg font-semibold'>No tournaments yet</h2>
            <p className='text-xs text-gray-400'>You haven't participated in any tournaments yet.</p>
          </div>
        ) : (
          <div className='space-y-2'>
            {tournaments.map((tournament) => (
              <Game key={tournament.id} tournament={tournament} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Game({ tournament }: { tournament: Tournament }) {
  const scheduledDate = tournament.scheduledAt ? new Date(tournament.scheduledAt) : new Date(tournament.createdAt);
  
  const gameImage = "/games/" + tournament.game.toUpperCase() + "/icon.png";


  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-row items-center justify-between rounded-lg border border-gray-700 p-3'>
        <div className='flex items-center'>
          <img
            src={gameImage}
            alt={tournament.game}
            className='h-12 w-12 rounded-lg object-cover mr-3'
          />
          <div className='flex flex-col'>
            <p className='font-semibold'>{tournament.name}</p>
            <div className='flex flex-wrap items-center gap-2 text-xs text-gray-400'>
              <span>{format(scheduledDate, 'dd MMM yyyy')}</span>
              <span className='text-yellow-400'>{tournament.prize} coins</span>
              {tournament.perKillPrize > 0 && (
                <span className='text-green-400'>{tournament.perKillPrize} per kill</span>
              )}
            </div>
          </div>
        </div>

        <TournamentDrawer
          data={tournament}
          viewOnly={true}
          showCurrency="coins"
        >
          <Button
            className='border-primary text-primary hover:bg-primary rounded-lg border bg-transparent px-3 py-1 text-xs font-semibold hover:text-black transition-colors'
          >
            Details
          </Button>
        </TournamentDrawer>
      </div>
    </div>
  );
}
