import { Link, useRouterState } from '@tanstack/react-router';
import { Award, Gamepad2, Trophy, Wallet } from 'lucide-react';
import { JSX } from 'react';

export function UserNavigation() {
  const navItems = [
    { 
      icon: <Trophy className='h-5 w-5' />, 
      label: 'Tournaments', 
      path: '/user/tournaments',
      activeWhen: (path: string) => path === '/user/tournaments' || path.startsWith('/user/tournaments/') 
    },
    { 
      icon: <Gamepad2 className='h-5 w-5' />, 
      label: 'Participated', 
      path: '/user/participated-tournaments',
      activeWhen: (path: string) => path === '/user/participated-tournaments' 
    },
    { 
      icon: <Wallet className='h-5 w-5' />, 
      label: 'Wallet', 
      path: '/user/wallet',
      activeWhen: (path: string) => path === '/user/wallet' || path === '/user/deposit' || path === '/user/withdraw'
    },
    { 
      icon: <Award className='h-5 w-5' />, 
      label: 'Winnings', 
      path: '/user/winnings',
      activeWhen: (path: string) => path === '/user/winnings' 
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
    <div className='bg-card border-border fixed right-0 bottom-0 left-0 z-10 flex justify-around border-t py-2'>
      {navItems.map((item) => {
        // Determine if this link is active - either use the custom function or do an exact path match
        const isActive = item.activeWhen 
          ? item.activeWhen(currentPath) 
          : currentPath === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`hover:bg-accent flex flex-col items-center rounded-lg p-2 text-xs sm:text-sm ${
              isActive ? 'font-semibold text-[var(--color-primary)]' : ''
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
