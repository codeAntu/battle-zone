'use client';

import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { appData } from '@/conts/data';
import { useTokenStore } from '@/store/store';
import { Link, useNavigate } from '@tanstack/react-router';
import { ChevronDown, LogOut, Menu, MoveRight, X } from 'lucide-react';
import { useRef, useState } from 'react';

export default function Header() {
  const { isLoggedIn, logout, role } = useTokenStore();
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigationItems = [
    {
      title: 'Home',
      href: '/',
      description: '',
    },
    {
      title: 'Product',
      description: 'Managing a small business today is already tough.',
      items: [
        {
          title: 'Reports',
          href: '/reports',
        },
        {
          title: 'Statistics',
          href: '/statistics',
        },
        {
          title: 'Dashboards',
          href: '/dashboards',
        },
        {
          title: 'Recordings',
          href: '/recordings',
        },
      ],
    },
    {
      title: 'Company',
      description: 'Managing a small business today is already tough.',
      items: [
        {
          title: 'About us',
          href: '/about',
        },
        {
          title: 'Fundraising',
          href: '/fundraising',
        },
        {
          title: 'Investors',
          href: '/investors',
        },
        {
          title: 'Contact us',
          href: '/contact',
        },
      ],
    },
  ];

  return (
    <header className='sticky top-0 left-0 z-40 w-full bg-white/10 backdrop-blur-2xl'>
      <div className='relative flex min-h-16 w-full flex-row items-center gap-4 border'>
        <div className='hidden items-center gap-4 px-5 font-semibold whitespace-nowrap lg:flex'>
          <div className='text-lg font-bold'>
            <img src={appData.icon} alt='' className='w-24 rounded-full' />
          </div>
          <p className=''>{appData.name}</p>
        </div>
        <div className='flex items-center justify-center lg:hidden'>
          <Button variant='ghost' onClick={() => setOpen(!isOpen)}>
            {isOpen ? <X className='size-6' /> : <Menu className='size-6' />}
          </Button>
          <p className='font-semibold whitespace-nowrap'>{appData.name}</p>

          {isOpen && (
            <div className='bg-background absolute top-20 right-0 container flex w-full flex-col gap-8 border-t p-5 shadow-lg'>
              {navigationItems.map((item) => (
                <div key={item.title}>
                  <div className='flex flex-col gap-2'>
                    {item.href ? (
                      <Link to={item.href} className='flex items-center justify-between'>
                        <span className='text-lg'>{item.title}</span>
                      </Link>
                    ) : (
                      <p className='text-lg'>{item.title}</p>
                    )}
                    {item.items &&
                      item.items.map((subItem) => (
                        <Link key={subItem.title} to={subItem.href} className='flex items-center justify-between'>
                          <span className='text-muted-foreground'>{subItem.title}</span>
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='hidden flex-row items-center justify-start gap-4 lg:flex'>
          <NavigationMenu className='flex items-start justify-start'>
            <NavigationMenuList className='flex flex-row justify-start gap-4'>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.href ? (
                    <>
                      <NavigationMenuLink>
                        <Button variant='ghost'>{item.title}</Button>
                      </NavigationMenuLink>
                    </>
                  ) : (
                    <>
                      <NavigationMenuTrigger className='text-sm font-medium'>{item.title}</NavigationMenuTrigger>
                      <NavigationMenuContent className='!w-[450px] p-4'>
                        <div className='flex grid-cols-2 flex-col gap-4 lg:grid'>
                          <div className='flex h-full flex-col justify-between'>
                            <div className='flex flex-col'>
                              <p className='text-base'>{item.title}</p>
                              <p className='text-muted-foreground text-sm'>{item.description}</p>
                            </div>
                            <Button size='sm' className='mt-10'>
                              Book a call today
                            </Button>
                          </div>
                          <div className='flex h-full flex-col justify-end text-sm'>
                            {item.items?.map((subItem) => (
                              <NavigationMenuLink
                                href={subItem.href}
                                key={subItem.title}
                                className='hover:bg-muted flex flex-row items-center justify-between rounded px-4 py-2'
                              >
                                <span>{subItem.title}</span>
                                <MoveRight className='text-muted-foreground h-4 w-4' />
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className='flex w-full justify-end gap-4 px-3 text-sm sm:text-base'>
          {isLoggedIn() ? (
            <>
              <Button
                variant='ghost'
                className='hidden md:inline'
                onClick={() => navigate({ to: role === 'admin' ? '/admin/tournaments' : '/user/tournaments' })}
              >
                Dashboard
              </Button>
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
              <Button onClick={() => setLoginDropdownOpen(!loginDropdownOpen)} className='flex items-center gap-2'>
                Sign in <ChevronDown className='h-4 w-4' />
              </Button>

              {loginDropdownOpen && (
                <div className='bg-card border-border absolute right-0 z-50 mt-2 w-40 rounded-md border shadow-lg'>
                  <Button
                    variant='ghost'
                    className='w-full justify-start'
                    onClick={() => {
                      navigate({ to: '/user/login' });
                      setLoginDropdownOpen(false);
                    }}
                  >
                    Player Login
                  </Button>
                  <Button
                    variant='ghost'
                    className='w-full justify-start'
                    onClick={() => {
                      navigate({ to: '/admin/login' });
                      setLoginDropdownOpen(false);
                    }}
                  >
                    Admin Login
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
