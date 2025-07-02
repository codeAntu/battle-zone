'use client';

import { Button } from '@/components/ui/button';
import { appData } from '@/conts/data';
import { useTokenStore } from '@/store/store';
import { useNavigate } from '@tanstack/react-router';
import { LogOut, MessageCircle, User } from 'lucide-react';
import { useRef } from 'react';

export default function Header() {
  const { isLoggedIn, logout, role } = useTokenStore();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  return (
    <header className='sticky top-0 left-0 z-40 w-full border-b border-gray-800 bg-black/95 backdrop-blur-xl'>
      <div className='relative flex min-h-16 w-full flex-row items-center gap-4'>
        <div className='flex items-center gap-4 px-5 font-semibold whitespace-nowrap text-white'>
          <img src={appData.icon} alt='' className='w-10 rounded-full ring-2 ring-gray-700 sm:w-12' />
          <p className='bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-lg font-bold text-transparent'>
            {appData.name}
          </p>
        </div>{' '}
        <div className='flex w-full justify-end px-3 text-sm sm:gap-4 sm:text-base'>
          {/* WhatsApp Support Button */}
          {/* <a
            href="https://wa.me/919800211400"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center mr-2 bg-green-600 hover:bg-green-700 transition-all duration-200 text-white px-3 py-1.5 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline font-medium">Support</span>
          </a> */}

          {isLoggedIn() ? (
            <>
              <Button
                variant='ghost'
                className='hidden text-gray-300 transition-all duration-200 hover:bg-gray-800/50 hover:text-white md:inline'
                onClick={() => navigate({ to: role === 'admin' ? '/admin/tournaments' : '/user/tournaments' })}
              >
                <div className='flex items-center gap-2'>
                  <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
                  </svg>
                  Dashboard
                </div>
              </Button>

              {role !== 'admin' && (
                <Button
                  variant='ghost'
                  className='flex items-center border-gray-700 text-gray-300 transition-all duration-200 hover:border-gray-600 hover:bg-gray-800/50 hover:text-white md:border'
                  onClick={() => navigate({ to: '/user/profile' })}
                >
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/20 p-1.5'>
                      <User className='h-4 w-4 text-blue-400' />
                    </div>
                    <span className='hidden font-medium md:inline'>Profile</span>
                  </div>
                </Button>
              )}

              <div className='hidden h-6 border-r border-gray-700 md:inline'></div>
              {role === 'admin' && (
                <Button
                  variant='ghost'
                  className='text-gray-300 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400'
                  onClick={() => {
                    logout();
                    navigate({ to: '/' });
                  }}
                >
                  <div className='flex items-center gap-2'>
                    <LogOut className='h-4 w-4' />
                    <span className='font-medium'>Logout</span>
                  </div>
                </Button>
              )}
            </>
          ) : (
            <div className='relative' ref={dropdownRef}>
              <Button
                onClick={() => {
                  navigate({ to: '/login' });
                }}
                className='flex transform items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl'
              >
                <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                Sign in
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
