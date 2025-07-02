import { getUserProfile } from '@/api/auth';
import { useTokenStore } from '@/store/store';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { BarChart3, CreditCard, Gamepad2, Home, LogOut, Mail, Shield, Trophy, User, Wallet } from 'lucide-react';

export const Route = createFileRoute('/user/profile')({
  component: RouteComponent,
});

function RouteComponent() {
  const logout = useTokenStore((state) => state.logout);
  const token = useTokenStore((state) => state.token);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    enabled: !!token,
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <div className='mx-auto min-h-[80vh] max-w-3xl rounded-lg bg-gray-950 p-3'>
      <h1 className='mb-5 text-center text-2xl font-bold tracking-wide text-purple-400'>User Profile</h1>      {isLoading && (
        <div className='space-y-6'>
          {/* Profile avatar skeleton */}
          <div className='flex justify-center'>
            <div className='h-24 w-24 animate-pulse rounded-full bg-muted'></div>
          </div>

          {/* Profile info skeleton */}
          <div className='rounded-lg border bg-card p-4'>
            <div className='space-y-3'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className='flex items-center gap-3 p-2 rounded-md'>
                  <div className='h-4 w-4 animate-pulse rounded bg-muted'></div>
                  <div className='h-4 w-16 animate-pulse rounded bg-muted'></div>
                  <div className='h-4 w-32 animate-pulse rounded bg-muted'></div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation skeleton */}
          <div className='rounded-lg border bg-card p-3'>
            <div className='h-5 w-32 animate-pulse rounded bg-muted mb-3'></div>
            <div className='space-y-2'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='flex items-center gap-3 p-3 rounded-md'>
                  <div className='h-4 w-4 animate-pulse rounded bg-muted'></div>
                  <div className='h-4 w-24 animate-pulse rounded bg-muted'></div>
                </div>
              ))}
            </div>
          </div>

          {/* Logout button skeleton */}
          <div className='rounded-lg border bg-card p-3'>
            <div className='h-10 w-full animate-pulse rounded bg-muted'></div>
          </div>
        </div>
      )}

      {isError && (
        <div className='mb-4 rounded border border-red-800 bg-red-950 px-4 py-3 text-red-400' role='alert'>
          <p>{(error as Error).message || 'An error occurred while fetching your profile'}</p>
        </div>
      )}

      {!isLoading && data && (
        <div className='space-y-4'>
          {/* Profile avatar */}
          <div className='flex justify-center'>
            <div className='ring-opacity-50 flex h-24 w-24 items-center justify-center rounded-full border-2 border-gray-900 bg-gradient-to-br from-purple-800 to-indigo-900 text-2xl font-bold text-white ring-2 shadow-md ring-purple-500'>
              {data.data.user.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Profile info with icons */}
          <div className='rounded-lg border border-gray-800 bg-gray-900 p-4 text-white shadow-md'>
            <div className='space-y-3'>
              <div className='flex items-center rounded-md p-1.5 transition-all hover:bg-gray-800'>
                <User className='mr-3 h-4 w-4 text-purple-400' />
                <span className='min-w-16 text-sm font-medium text-gray-400'>Username</span>
                <span className='ml-2 text-sm font-semibold text-white'>{data.data.user.name}</span>
              </div>

              <div className='flex items-center rounded-md p-1.5 transition-all hover:bg-gray-800'>
                <Mail className='mr-3 h-4 w-4 text-purple-400' />
                <span className='min-w-16 text-sm font-medium text-gray-400'>Email</span>
                <span className='ml-2 text-sm font-semibold text-white'>{data.data.user.email}</span>
              </div>

              <div className='flex items-center rounded-lg border border-gray-900 bg-gradient-to-r from-black to-gray-950 p-3 shadow-inner'>
                <Wallet className='mr-3 h-5 w-5 text-green-400' />
                <span className='min-w-16 text-sm font-medium text-gray-400'>Balance</span>
                <span className='ml-2 text-base font-bold text-green-400'>₹{data.data.user.balance?.toLocaleString()}</span>
              </div>

              {data.data.user.isVerified !== undefined && (
                <div className='flex items-center rounded-md p-1.5 transition-all hover:bg-black'>
                  <Shield className='mr-3 h-4 w-4 text-purple-400' />
                  <span className='min-w-16 text-sm font-medium text-gray-400'>Status</span>
                  <span
                    className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${data.data.user.isVerified ? 'bg-green-950 text-green-400' : 'bg-red-950 text-red-400'
                      }`}
                  >
                    {data.data.user.isVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* User Navigation */}
          <div className='rounded-lg border border-gray-900 bg-black p-3 shadow-md'>
            <h3 className='mb-3 border-b border-gray-800 pb-2 text-base font-medium text-gray-300'>User Navigation</h3>
            <div className='flex flex-col space-y-2'>
              <Link
                to='/user'
                className='flex items-center rounded-md p-3 text-sm text-white transition-all hover:bg-gray-900'
              >
                <Home className='mr-3 h-4 w-4 text-purple-400' />
                <span>Dashboard</span>
              </Link>

              <Link
                to='/user/deposit'
                className='flex items-center rounded-md p-3 text-sm text-white transition-all hover:bg-gray-900'
              >
                <CreditCard className='mr-3 h-4 w-4 text-purple-400' />
                <span>Deposit</span>
              </Link>

              <Link
                to='/user/withdraw'
                className='flex items-center rounded-md p-3 text-sm text-white transition-all hover:bg-gray-900'
              >
                <Wallet className='mr-3 h-4 w-4 text-purple-400' />
                <span>Withdraw</span>
              </Link>

              <Link
                to='/user/tournaments'
                className='flex items-center rounded-md p-3 text-sm text-white transition-all hover:bg-gray-900'
              >
                <Gamepad2 className='mr-3 h-4 w-4 text-purple-400' />
                <span>Tournaments</span>
              </Link>

              <Link
                to='/user/participated-tournaments'
                className='flex items-center rounded-md p-3 text-sm text-white transition-all hover:bg-gray-900'
              >
                <BarChart3 className='mr-3 h-4 w-4 text-purple-400' />
                <span>My Tournaments</span>
              </Link>

              <Link
                to='/user/winnings'
                className='flex items-center rounded-md p-3 text-sm text-white transition-all hover:bg-gray-900'
              >
                <Trophy className='mr-3 h-4 w-4 text-purple-400' />
                <span>Winnings</span>
              </Link>
            </div>
          </div>

          {/* Logout in a separate box */}
          <div className='rounded-lg border border-gray-900 bg-black p-3 shadow-md'>
            <button
              onClick={handleLogout}
              className='focus:ring-opacity-50 flex w-full items-center justify-center rounded-md bg-gradient-to-r from-red-950 to-red-900 px-3 py-2 text-sm text-white transition-all hover:from-red-900 hover:to-red-800 focus:ring-2 focus:ring-red-800'
            >
              <LogOut className='mr-2 h-4 w-4' />
              <span className='font-medium'>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
