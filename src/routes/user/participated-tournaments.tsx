import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/user/participated-tournaments')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='p-4'>
      <div className='space-y-2.5'>
        <p className='text-2xl font-bold'>Your Active Games</p>
        <Game />
        <Game />
      </div>
    </div>
  );
}

function Game() {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between rounded-lg border p-3'>
        <div className='flex items-center'>
          <img
            src='https://www.financialexpress.com/wp-content/uploads/2025/03/PUBG-MOBILE1.jpg'
            alt='game'
            className='h-16 w-16 rounded-lg object-cover'
          />
          <div className='ml-4'>
            <p className='text-lg font-semibold'>PUBG Mobile</p>
            <p className='text-sm text-gray-500'>Active since: Oct 1, 2023</p>
          </div>
        </div>
        <button className='border-primary text-primary hover:bg-primary flex rounded-lg border bg-transparent px-8 py-2 text-xs font-semibold hover:text-black'>
          Game Details
        </button>
      </div>
    </div>
  );
}
