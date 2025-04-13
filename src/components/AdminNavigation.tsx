import { Gamepad, History, LayoutDashboard, Trophy } from 'lucide-react';
import Nav from './UserNavigation';

export function AdminNavigation() {
  const navItems = [
    {
      icon: <Trophy className='h-5 w-5' />,
      label: 'Create',
      path: '/admin/tournaments/',
      activeWhen: (path: string) => path === '/admin/tournaments',
    },
    {
      icon: <Gamepad className='h-5 w-5' />,
      label: 'Current',
      path: '/admin/tournaments/current',
      activeWhen: (path: string) => path === '/admin/tournaments/current',
    },
    {
      icon: <History className='h-5 w-5' />,
      label: 'History',
      path: '/admin/tournaments/history',
      activeWhen: (path: string) => path === '/admin/tournaments/history',
    },
    {
      icon: <LayoutDashboard className='h-5 w-5' />,
      label: 'Dashboard',
      path: '/admin',
      activeWhen: (path: string) => path === '/admin',
    },
  ];

  return <Nav navItems={navItems} />;
}
