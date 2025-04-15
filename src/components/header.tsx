'use client';

import { Button } from '@/components/ui/button';
import { appData } from '@/conts/data';
import { useTokenStore } from '@/store/store';
import { useNavigate } from '@tanstack/react-router';
import { LogOut, User, MessageCircle } from 'lucide-react';
import { useRef } from 'react';

export default function Header() {
  const { isLoggedIn, logout, role } = useTokenStore();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  return (
    <header className='sticky top-0 left-0 z-40 w-full bg-white/10 backdrop-blur-2xl'>
      <div className='relative flex min-h-16 w-full flex-row items-center gap-4 border'>
        <div className='flex items-center gap-4 px-5 font-semibold whitespace-nowrap'>
          <img src={appData.icon} alt='' className='w-10 rounded-full sm:w-12' />
          <p className=''>{appData.name}</p>
        </div>

        <div className='flex w-full justify-end sm:gap-4 px-3 text-sm sm:text-base'>
          {/* WhatsApp Support Button */}
          <a 
            href="https://wa.me/918854812760" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center mr-2 bg-green-600 hover:bg-green-700 transition-colors text-white px-3 py-1.5 rounded-full"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Support</span>
          </a>

          {isLoggedIn() ? (
            <>
              <Button
                variant='ghost'
                className='hidden md:inline'
                onClick={() => navigate({ to: role === 'admin' ? '/admin/tournaments' : '/user/tournaments' })}
              >
                Dashboard
              </Button>

              {role !== 'admin' && (
                <Button
                  variant='ghost'
                  className='flex items-center border'
                  onClick={() => navigate({ to: '/user/profile' })}
                >
                  <div className='flex items-center gap-2'>
                    <div className='bg-primary/10 flex items-center justify-center rounded-full'>
                      <User className='text-primary h-5 w-5' />
                    </div>
                    <span className='hidden md:inline'>Profile</span>
                  </div>
                </Button>
              )}

              <div className='hidden border-r md:inline'></div>
              <Button
                variant='ghost'
                className='hidden md:inline'
                onClick={() => {
                  logout();
                  navigate({ to: '/' });
                }}
              >
                <div className='flex items-center gap-2'>
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Logout</span>
                </div>
              </Button>
            </>
          ) : (
            <div className='relative' ref={dropdownRef}>
              <Button
                onClick={() => {
                  navigate({ to: '/login' });
                }}
                className='flex items-center gap-2'
              >
                Sign in
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
