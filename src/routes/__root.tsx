import Header from '@/components/header';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className='min-h-[100dvh] bg-black text-white'>
        <Header />
        <Outlet />
        <TanStackRouterDevtools />
      </div>
    </>
  ),
});
