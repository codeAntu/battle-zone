import { getAllGames } from '@/api/game';
import { GameCreateCard } from '@/components/gameCreateCard';
import { GameCardSkeleton } from '@/components/ui/loading-skeletons';
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
    return (
      <div className='grid grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {Array.from({ length: 8 }).map((_, i) => (
          <GameCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <div className='text-red-500 mb-2'>Error loading tournaments</div>
          <div className='text-sm text-gray-500'>Please try again later</div>
        </div>
      </div>
    );
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
