import Header from '@/components/header';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className='min-h-[100dvh] bg-black text-white'>
        <Toaster position='top-center' reverseOrder={false} />
        <Header />
        <Outlet />
        {/* <TanStackRouterDevtools /> */}
      </div>
    </>
  ),
});
