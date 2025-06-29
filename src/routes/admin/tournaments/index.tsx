import { getAllGames } from '@/api/game';
import { GameCreateCard } from '@/components/gameCreateCard';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/tournaments/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tournaments'],
    queryFn: getAllGames,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading tournaments.</div>;
  }

  console.log(data);

  return (
    <div className='grid grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {/* Add create new game card */}
      {data?.data.games.map((game) => {
        return <GameCreateCard key={game.id} {...game} />;
      })}
    </div>
  );
}
