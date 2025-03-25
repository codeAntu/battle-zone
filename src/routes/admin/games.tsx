import { GameCreateCard } from '@/components/gameCreateCard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/games')({
  component: RouteComponent,
});


function RouteComponent() {
  return (
    <div className='grid grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      <GameCreateCard />
      <GameCreateCard />
      <GameCreateCard />
      <GameCreateCard />
    </div>
  );
}
