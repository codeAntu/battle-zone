import GameCard from '@/components/gameCard';
import { getGameList } from '@/services/game';
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

  console.log(data);

  return (
    <div className='space-y-4 p-5'>
      <div>
        <h1 className='text-2xl font-bold'>Tournaments</h1>
        <p className='text-sm text-gray-500'>Select a game to view tournaments</p>
      </div>
      <div className='grid grid-cols-4 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {data?.data.map((game) => {
          return <GameCard key={game.id} game={game} />;
        })}
      </div>
    </div>
  );
}
