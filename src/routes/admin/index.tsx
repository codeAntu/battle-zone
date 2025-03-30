import { createFileRoute, Link } from '@tanstack/react-router';
import { Gamepad, MoveRight } from 'lucide-react';

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
});

const pages = [
  {
    name: 'Create New Tournament',
    path: '/admin/tournaments',
    color: 'bg-blue-500',
  },
  {
    name: 'View Tournaments',
    path: '/admin/tournaments/currentTournaments',
    color: 'bg-green-500',
  },
  {
    name: 'View Finished Tournaments',
    path: '/admin/tournaments/finishedTournaments',
    color: 'bg-gray-500',
  },
];

function RouteComponent() {
  return (
    <div className='space-y-5 p-5'>
      <div className='space-y-5'>
        <div className='p text-2xl font-semibold'>Pages</div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {pages.map((page) => {
            return (
              <Link
                to={page.path}
                key={page.name}
                className={`rounded-xl border ${page.color} cursor-pointer px-5 py-3 transition duration-300 hover:scale-102`}
              >
                <Gamepad className='h-10 w-10' />
                <div className='flex items-center justify-between font-semibold'>
                  <div>{page.name}</div>
                  <MoveRight className='aspect-square w-8' />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div>History</div>
    </div>
  );
}
