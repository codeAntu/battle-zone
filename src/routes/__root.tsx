import Header from '@/components/header';
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';
import { UserNavigation } from '@/components/UserNavigation';
import { AdminNavigation } from '@/components/AdminNavigation';
import { useTokenStore } from '@/store/store';
export const Route = createRootRoute({
  component: Component,
});

function Component() {
  const { isLoggedIn, role } = useTokenStore();
  const router = useRouterState();
  const currentPath = router.location.pathname;
  
  // Check if current route is a login page
  const isLoginPage = currentPath === '/login' || 
                      currentPath === '/user/login' || 
                      currentPath === '/admin/login';

  return (
    <>
      <div className='min-h-[100dvh] flex flex-col bg-black text-white'>
        <Toaster position='top-center' reverseOrder={false} />
        <Header />

        <div className='flex-1 pb-16 overflow-y-auto'>
          <Outlet />

          {/* Only show navigation when not on login page and user is logged in */}
          {!isLoginPage && isLoggedIn() && role === 'admin' && <AdminNavigation />}
          {!isLoginPage && isLoggedIn() && role === 'user' && <UserNavigation />}
        </div>

        {/* <TanStackRouterDevtools /> */}
      </div>
    </>
  );
}
