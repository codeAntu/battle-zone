import NavCard from '@/components/NavCard';
import { createFileRoute } from '@tanstack/react-router';
// Import Lucide icons
import { Trophy, CalendarCheck, History, Banknote, Receipt, Users } from 'lucide-react';

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
});

const pages = [
  // Tournament Management
  {
    name: 'Create New Tournament',
    path: '/admin/tournaments',
    color: 'bg-blue-500',
    icon: <Trophy size={24} />,
  },
  {
    name: 'Current Tournaments',
    path: '/admin/tournaments/current',
    color: 'bg-green-500',
    icon: <CalendarCheck size={24} />,
  },
  {
    name: 'Tournament History',
    path: '/admin/tournaments/history',
    color: 'bg-gray-500',
    icon: <History size={24} />,
  },
  {
    name: 'Deposits',
    path: '/admin/deposits',
    color: 'bg-emerald-500',
    icon: <Banknote size={24} />,
  },
  {
    name: 'Withdrawals',
    path: '/admin/withdrawals',
    color: 'bg-amber-500',
    icon: <Receipt size={24} />,
  },
  {
    name: 'Users',
    path: '/admin/users',
    color: 'bg-red-500',
    icon: <Users size={24} />,
  },
];

function RouteComponent() {
  return (
    <div className='space-y-5 p-5'>
      <div className='space-y-5'>
        <div className='p text-2xl font-semibold'>Admin Dashboard</div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {pages.map((page) => (
            <NavCard 
              key={page.name} 
              name={page.name} 
              path={page.path} 
              color={page.color} 
              icon={page.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
