import { createFileRoute } from '@tanstack/react-router';
import NavCard from '@/components/NavCard';

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
});

const pages = [
  // Tournament Management
  {
    name: 'Create New Tournament',
    path: '/admin/tournaments',
    color: 'bg-blue-500',
  },
  {
    name: 'Current Tournaments',
    path: '/admin/tournaments/current',
    color: 'bg-green-500',
  },
  {
    name: 'Tournament History',
    path: '/admin/tournaments/history',
    color: 'bg-gray-500',
  },
  {
    name: 'Deposits',
    path: '/admin/deposits',
    color: 'bg-emerald-500',
  },
  {
    name: 'Withdrawals',
    path: '/admin/withdrawals',
    color: 'bg-amber-500',
  },
];

function RouteComponent() {
  return (
    <div className='space-y-5 p-5'>
      <div className='space-y-5'>
        <div className='p text-2xl font-semibold'>Admin Dashboard</div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {pages.map((page) => (
            <NavCard key={page.name} name={page.name} path={page.path} color={page.color} />
          ))}
        </div>
      </div>
    </div>
  );
}
