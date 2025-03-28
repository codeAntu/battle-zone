import GameCard from '@/components/gameCard';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className='space-y-3 p-5'>
      <div className='px-2 text-3xl font-semibold'>Games</div>
      <div className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        <GameCard />
        <GameCard />
        <GameCard />
        <GameCard />
        <GameCard />
      </div>
    </div>
  );
}
