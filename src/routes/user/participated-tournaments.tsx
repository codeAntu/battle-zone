import { getParticipatedTournaments } from '@/api/tournament';
import { Tournament } from '@/api/types';
import TournamentDrawer from '@/components/TournamentDrawer';
import { Button } from '@/components/ui/button';
import { formatDateToUTC, formatTimeToUTC } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
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
      <div className='p-5'>
        <div className='mb-6 space-y-2'>
          <div className='bg-muted h-6 w-48 animate-pulse rounded'></div>
          <div className='bg-muted h-4 w-64 animate-pulse rounded'></div>
        </div>
        <div className='space-y-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='bg-card rounded-lg border p-4'>
              <div className='space-y-3'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-2'>
                    <div className='bg-muted h-5 w-32 animate-pulse rounded'></div>
                    <div className='bg-muted h-4 w-48 animate-pulse rounded'></div>
                  </div>
                  <div className='bg-muted h-6 w-20 animate-pulse rounded'></div>
                </div>
                <div className='flex gap-4'>
                  <div className='bg-muted h-4 w-24 animate-pulse rounded'></div>
                  <div className='bg-muted h-4 w-20 animate-pulse rounded'></div>
                  <div className='bg-muted h-4 w-16 animate-pulse rounded'></div>
                </div>
              </div>
            </div>
          ))}
        </div>
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

  const tournaments = data?.data?.tournaments || [];

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

  const formattedDate = formatDateToUTC(scheduledDate.toISOString());
  const formattedTime = formatTimeToUTC(scheduledDate.toISOString());

  const gameImage = '/games/' + tournament.game.toUpperCase() + '/icon.png';

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-row items-center justify-between rounded-lg border border-gray-700 p-3'>
        <div className='flex items-center'>
          <img src={gameImage} alt={tournament.game} className='mr-3 h-12 w-12 rounded-lg object-cover' />
          <div className='flex flex-col'>
            <p className='font-semibold'>{tournament.name}</p>
            <div className='flex flex-wrap items-center gap-2 text-xs text-gray-400'>
              <span>{formattedDate}</span>
              <span>{formattedTime}</span>
              <span className='text-yellow-400'>{tournament.prize} coins</span>
              {tournament.perKillPrize > 0 && (
                <span className='text-green-400'>{tournament.perKillPrize} per kill</span>
              )}
            </div>
          </div>
        </div>

        <TournamentDrawer data={tournament} viewOnly={true} showCurrency='coins'>
          <Button className='border-primary text-primary hover:bg-primary rounded-lg border bg-transparent px-3 py-1 text-xs font-semibold transition-colors hover:text-black'>
            Details
          </Button>
        </TournamentDrawer>
      </div>
    </div>
  );
}
