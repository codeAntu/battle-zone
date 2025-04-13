import { Button } from '@/components/ui/button';
import { useTokenStore } from '@/store/store';
import { details } from '@/utils/ls';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
export const Route = createFileRoute('/welcome')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isLoggedIn, role } = useTokenStore();
  const navigate = useNavigate();

  return (
    <div className='flex items-center justify-center'>
      <img src='/welcome/image.jpg' alt='' className='repeat-0 w-full sm:blur-md' />
      <div className='absolute top-0 right-0 bottom-0 left-0 flex flex-col items-center justify-between p-5 py-30'>
        <div className='text-center text-4xl font-bold text-white drop-shadow-lg'>
          <div className=''>Welcome</div>
          <div className='animate-pulse'>to</div>
          <div className='text-yellow-300'>{details.name}!</div>
        </div>
        <Button
          className='hover:bg-blue-red-500 h-10 w-full max-w-md rounded-lg bg-red-500/70 p-2 text-white backdrop-blur-3xl'
          onClick={() => {
            if (isLoggedIn()) {
              navigate({ to: role === 'admin' ? '/admin/tournaments' : '/user/tournaments' });
            } else {
              navigate({ to: '/login' });
            }
          }}
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
}
