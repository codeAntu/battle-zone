import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/games')({
  component: RouteComponent,
});

const game = {
  game: 'PUBG Mobile',
  image: 'https://www.financialexpress.com/wp-content/uploads/2025/03/PUBG-MOBILE1.jpg',
};

function RouteComponent() {
  return (
    <div className='grid grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      <Game />
      <Game />
      <Game />
      <Game />
    </div>
  );
}

function Game() {
  return (
    <div className='relative overflow-hidden rounded-2xl'>
      <div>
        <img src={game.image} alt='game' />
      </div>
      <div className='absolute bottom-0 flex w-full items-center justify-between rounded-t-2xl bg-black/5 p-3 text-white backdrop-blur-2xl'>
        <p className='px-2 text-lg font-semibold'>{game.game}</p>
        <div className='flex items-start'>
          <button className='border-primary text-primary hover:bg-primary rounded-lg font-semibold border bg-transparent px-8 py-2 text-xs hover:text-black'>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
