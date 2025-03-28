import Header from '@/components/header';
import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className='min-h-[100dvh] bg-black text-white'>
        <Header />
        <Outlet />
        {/* <TanStackRouterDevtools /> */}
      </div>
    </>
  ),
});
