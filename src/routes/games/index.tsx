import GameCard from '@/components/gameCard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/games/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='grid grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      <GameCard />
      <GameCard />
      <GameCard />
      <GameCard />
      <GameCard />
    </div>
  );
}
