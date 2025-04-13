import { createFileRoute } from '@tanstack/react-router';
import NavCard from '@/components/NavCard';
import { Trophy, Gamepad2, UserRound, Award, Wallet, ArrowDownToLine } from 'lucide-react';

export const Route = createFileRoute('/user/')({
  component: RouteComponent,
});

const userPages = [
  {
    name: 'Join Tournaments',
    path: '/user/tournaments',
    color: 'bg-blue-500',
    icon: <Trophy className='h-10 w-10' />,
  },
  {
    name: 'Participated Tournaments',
    path: '/user/participated-tournaments',
    color: 'bg-green-500',
    icon: <Gamepad2 className='h-10 w-10' />,
  },
  {
    name: 'My Profile',
    path: '/user/profile',
    color: 'bg-purple-500',
    icon: <UserRound className='h-10 w-10' />,
  },
  {
    name: 'Your Winnings',
    path: '/user/winnings',
    color: 'bg-amber-500',
    icon: <Award className='h-10 w-10' />,
  },
  {
    name: 'Deposit',
    path: '/user/deposit',
    color: 'bg-green-600',
    icon: <Wallet className='h-10 w-10' />,
  },
  {
    name: 'Withdraw',
    path: '/user/withdraw',
    color: 'bg-orange-500',
    icon: <ArrowDownToLine className='h-10 w-10' />,
  },
];

function RouteComponent() {
  return (
    <div className='space-y-5 p-5'>
      <div className='space-y-5'>
        <div className='text-2xl font-semibold'>User Dashboard</div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {userPages.map((page) => (
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
      <div className='mt-8'>
        <h2 className='text-xl font-semibold mb-4'></h2>
        <div className='bg-gray-100 rounded-lg p-4 text-gray-500'>
          No recent activities to show.
        </div>
      </div>
    </div>
  );
}
