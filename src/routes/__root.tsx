import { AdminNavigation } from '@/components/AdminNavigation';
import Header from '@/components/header';
import { UserNavigation } from '@/components/UserNavigation';
import { useTokenStore } from '@/store/store';
import { createRootRoute, Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

export const Route = createRootRoute({
  component: Component,
});

function Component() {
  const { isLoggedIn, role } = useTokenStore();
  const router = useRouterState();
  const navigate = useNavigate();
  const currentPath = router.location.pathname;

  const isLoginPage = currentPath === '/login' || currentPath === '/user/login' || currentPath === '/admin/login';

  useEffect(() => {
    if (isLoginPage && isLoggedIn()) {
      const redirectPath = role === 'admin' ? '/admin' : '/user';
      navigate({ to: redirectPath });
      return;
    }

    if (isLoginPage) return;

    if (currentPath.startsWith('/admin/') && isLoggedIn() && role !== 'admin') {
      navigate({ to: '/user' });
    }

    if ((currentPath.startsWith('/admin/') || currentPath.startsWith('/user/')) && !isLoggedIn()) {
      navigate({ to: '/login' });
    }
  }, [currentPath, isLoggedIn, role, navigate, isLoginPage]);

  return (
    <>
      <div className='flex min-h-[100dvh] flex-col bg-black text-white'>
        <Toaster position='top-center' reverseOrder={false} />
        <Header />

        <div className='flex-1 overflow-y-auto pb-16'>
          <Outlet />

          {!isLoginPage && isLoggedIn() && role === 'admin' && <AdminNavigation />}
          {!isLoginPage && isLoggedIn() && role === 'user' && <UserNavigation />}
        </div>
      </div>
    </>
  );
}
