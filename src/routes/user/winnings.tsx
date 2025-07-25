import { getUserWinnings } from '@/api/tournament';
import { Tournament } from '@/api/types';
import TournamentDrawer from '@/components/TournamentDrawer';
import { Button } from '@/components/ui/button';
import { formatDateToUTC, formatTimeToUTC } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Trophy } from 'lucide-react';

export const Route = createFileRoute('/user/winnings')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-winnings'],
    queryFn: getUserWinnings,
  });
  if (isLoading) {
    return (
      <div className='p-5'>
        <div className='mb-6 space-y-2'>
          <div className='bg-muted h-6 w-48 animate-pulse rounded'></div>
          <div className='bg-muted h-4 w-64 animate-pulse rounded'></div>
        </div>
        <div className='space-y-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='bg-card rounded-lg border p-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-2'>
                  <div className='bg-muted h-5 w-32 animate-pulse rounded'></div>
                  <div className='bg-muted h-4 w-24 animate-pulse rounded'></div>
                </div>
                <div className='space-y-2 text-right'>
                  <div className='bg-muted h-6 w-20 animate-pulse rounded'></div>
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
        <p className='text-red-500'>Failed to load winnings data</p>
      </div>
    );
  }

  console.log(data);
  const winnings = data?.data.winnings || [];

  return (
    <div className='p-5'>
      <div className='space-y-2'>
        <div className='mb-3'>
          <h1 className='text-xl font-bold'>Your Winnings</h1>
          <p className='text-sm text-gray-400'>View your tournament victories and rewards</p>
        </div>

        {winnings.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-700 p-4 text-center'>
            <Trophy className='mb-1 h-8 w-8 text-gray-500' />
            <h2 className='text-lg font-semibold'>No winnings yet</h2>
            <p className='text-xs text-gray-400'>You haven't won any tournaments yet.</p>
          </div>
        ) : (
          <div className='space-y-2'>
            {winnings.map((item, index) => (
              <Game
                key={index}
                tournament={item.tournament}
                amount={item.winnings.amount}
                date={item.winnings.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Game({ tournament, amount, date }: { tournament: Tournament; amount: number; date: string | Date }) {
  const gameImage = '/games/' + tournament.game.toUpperCase() + '/icon.png';
  const formattedDate = formatDateToUTC(date instanceof Date ? date.toISOString() : date);
  const formattedTime = formatTimeToUTC(date instanceof Date ? date.toISOString() : date);

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-row items-center justify-between rounded-lg border border-yellow-600/30 bg-gradient-to-r from-gray-900 to-gray-950 p-3 shadow-md'>
        <div className='flex items-center'>
          <div className='relative mr-3'>
            <img
              src={gameImage}
              alt={tournament.game}
              className='h-12 w-12 rounded-lg object-cover ring-2 ring-yellow-500/50'
            />
            <div className='absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-black'>
              <Trophy className='h-3 w-3' />
            </div>
          </div>

          <div className='flex flex-col'>
            <div className='flex items-center gap-2'>
              <p className='font-semibold text-white'>{tournament.name}</p>
              <span className='rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-400 uppercase'>
                Victory
              </span>
            </div>
            <div className='flex flex-wrap items-center gap-2 text-xs text-gray-400'>
              <span>
                {formattedDate} {formattedTime}
              </span>
              <span className='font-semibold text-yellow-400'>+{amount} coins won</span>
            </div>
          </div>
        </div>

        <TournamentDrawer data={tournament} viewOnly={true} showCurrency='coins'>
          <Button className='rounded-lg border border-yellow-500/70 bg-transparent px-3 py-1 text-xs font-semibold text-yellow-500 transition-colors hover:bg-yellow-500 hover:text-black'>
            Details
          </Button>
        </TournamentDrawer>
      </div>
    </div>
  );
}
