import { Link } from '@tanstack/react-router';
import { ReactNode } from 'react';

interface NavCardProps {
  name: string;
  path: string;
  color: string;
  icon?: ReactNode;
}

export default function NavCard({ name, path, color, icon }: NavCardProps) {
  return (
    <Link
      to={path}
      className={` ${color} group relative flex min-h-[60px] transform items-center justify-start overflow-hidden rounded-lg border border-white/10 p-3 font-medium text-white shadow-md transition-all duration-300 ease-out before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-white/0 before:via-white/5 before:to-white/0 before:transition-transform before:duration-700 hover:-translate-y-0.5 hover:scale-[1.01] hover:border-white/20 hover:shadow-xl hover:before:translate-x-[100%] sm:min-h-[70px] sm:p-4 sm:hover:-translate-y-1 sm:hover:scale-[1.02] md:min-h-[80px] md:p-6`}
    >
      {/* Background gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
      {/* Icon container */}
      {icon && (
        <div className='relative z-10 mr-2 rounded-md bg-white/10 p-1.5 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-white/20 sm:mr-3 sm:rounded-lg sm:p-2 sm:group-hover:scale-110 md:mr-4'>
          <div className='flex h-5 w-5 items-center justify-center sm:h-6 sm:w-6'>{icon}</div>
        </div>
      )}
      {/* Text content */}
      <div className='relative z-10 flex min-w-0 flex-1 flex-col'>
        <span className='truncate text-sm font-semibold tracking-wide transition-colors duration-300 group-hover:text-white/95 sm:text-base md:text-lg'>
          {name}
        </span>
        <span className='mt-0.5 hidden translate-y-1 transform text-xs text-white/70 opacity-0 transition-all duration-300 sm:mt-1 sm:block sm:group-hover:translate-y-0 sm:group-hover:opacity-100'>
          Click to navigate
        </span>
      </div>
      {/* Arrow indicator */}
      <div className='relative z-10 ml-2 translate-x-0 transform opacity-60 transition-all duration-300 sm:ml-auto sm:translate-x-2 sm:opacity-0 sm:group-hover:translate-x-0 sm:group-hover:opacity-100'>
        <svg className='h-4 w-4 sm:h-5 sm:w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
        </svg>
      </div>
      {/* Shine effect */}
      <div className='absolute inset-0 hidden -skew-x-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:block' />
    </Link>
  );
}
