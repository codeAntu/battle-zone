import { Link, useRouterState } from '@tanstack/react-router';
import { Award, Gamepad2, Trophy, Wallet } from 'lucide-react';
import { JSX } from 'react';

export function UserNavigation() {
  const navItems = [
    {
      icon: <Trophy className='h-5 w-5' />,
      label: 'Tournaments',
      path: '/user/tournaments',
      activeWhen: (path: string) => path === '/user/tournaments' || path.startsWith('/user/tournaments/'),
    },
    {
      icon: <Gamepad2 className='h-5 w-5' />,
      label: 'Participated',
      path: '/user/participated-tournaments',
      activeWhen: (path: string) => path === '/user/participated-tournaments',
    },
    {
      icon: <Wallet className='h-5 w-5' />,
      label: 'Wallet',
      path: '/user/wallet',
      activeWhen: (path: string) => path === '/user/wallet' || path === '/user/deposit' || path === '/user/withdraw',
    },
    {
      icon: <Award className='h-5 w-5' />,
      label: 'Winnings',
      path: '/user/winnings',
      activeWhen: (path: string) => path === '/user/winnings',
    },
  ];

  return <Nav navItems={navItems} />;
}

export default function Nav({
  navItems,
}: {
  navItems: Array<{
    icon: JSX.Element;
    label: string;
    path: string;
    activeWhen?: (path: string) => boolean;
  }>;
}) {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  return (
    <div className='fixed right-0 bottom-0 left-0 z-10 flex justify-around border-t border-gray-800 bg-black/95 py-3 backdrop-blur-xl'>
      {navItems.map((item) => {
        // Determine if this link is active - either use the custom function or do an exact path match
        const isActive = item.activeWhen ? item.activeWhen(currentPath) : currentPath === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center rounded-lg p-2 text-xs transition-all duration-200 sm:text-sm ${
              isActive
                ? 'border border-purple-500/30 bg-gradient-to-t from-purple-500/20 to-blue-500/20 font-semibold text-white'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
            }`}
          >
            <div className={`mb-1 px-4 ${isActive ? 'text-purple-400' : ''}`}>{item.icon}</div>
            <span className='font-medium'>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
