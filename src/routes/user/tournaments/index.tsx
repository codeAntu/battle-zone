import GameCard from '@/components/gameCard';
import { getGameList, GameType } from '@/services/game';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/user/tournaments/')({
  component: RouteComponent,
});
function RouteComponent() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tournaments'],
    queryFn: getGameList,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading tournaments.</div>;
  }

  const ludoGame: GameType = {
    id: 999,
    name: 'Ludo',
    description: 'Classic Ludo game - Coming Soon!',
    iconUrl: '/games/LUDO/icon.png',
    image: '/games/LUDO/image.png',
  };

  const allGames = [...(data?.data ?? []), ludoGame];

  return (
    <div className='space-y-4 p-5'>
      <div>
        <h1 className='text-2xl font-bold'>Tournaments</h1>
        <p className='text-sm text-gray-500'>Select a game to view tournaments</p>
      </div>
      <div className='grid grid-cols-3 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {allGames.map((game) => {
          return <GameCard key={game.id} game={game} comingSoon={game.id === 999} />;
        })}
      </div>
    </div>
  );
}
