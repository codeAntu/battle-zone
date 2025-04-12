import { GameType } from '@/services/game';
import { Link } from '@tanstack/react-router';
import { MoveRight } from 'lucide-react';
import { useState } from 'react';

interface GameCardProps {
  game: GameType;
  comingSoon?: boolean;
}

export default function GameCard({ game, comingSoon = false }: GameCardProps) {
  const [mobileImgError, setMobileImgError] = useState(false);
  const [desktopImgError, setDesktopImgError] = useState(false);

  // Create the card content
  const cardContent = (
    <div className='relative aspect-square overflow-hidden rounded-2xl border md:aspect-auto md:w-full'>
      {mobileImgError ? (
        <div className='flex aspect-square w-full items-center justify-center bg-black md:hidden'>
          <span className='p-2 text-sm font-bold text-white/60'>{game.name}</span>
        </div>
      ) : (
        <div className='aspect-square w-full md:hidden'>
          <img
            src={game.iconUrl}
            alt={game.name}
            className='h-full w-full object-contain'
            onError={() => setMobileImgError(true)}
          />
        </div>
      )}

      {desktopImgError ? (
        <div className='hidden aspect-video h-full w-full items-center justify-center bg-black md:flex'>
          <span className='text-3xl font-bold text-white/60'>{game.name}</span>
        </div>
      ) : (
        <img
          src={game.image}
          alt={game.name}
          className='hidden h-full w-full object-cover md:block'
          onError={() => setDesktopImgError(true)}
        />
      )}

      {/* Coming soon overlay - show when comingSoon prop is true */}
      {comingSoon && (
        <div className='absolute inset-0 flex items-center justify-center bg-black/50 md:hidden'>
          <div className='rounded-lg px-4 py-2 text-xs font-bold text-center text-yellow-500 backdrop-blur-sm'>COMING SOON</div>
        </div>
      )}

      <div className='absolute bottom-0 hidden w-full items-center justify-between rounded-t-2xl bg-black/5 p-3 text-white backdrop-blur-2xl md:flex'>
        <p className='px-2 text-lg font-semibold'>{game.name}</p>
        <div className='flex items-start'>
          <button className='border-primary text-primary hover:bg-primary flex rounded-lg border bg-transparent px-8 py-2 text-xs font-semibold hover:text-black'>
            {comingSoon ? 'Coming Soon' : 'Play'}
            {!comingSoon && <MoveRight className='ml-2 h-4 w-4' />}
          </button>
        </div>
      </div>
    </div>
  );

  // For coming soon games, don't wrap in Link
  if (comingSoon) {
    return (
      <div className='flex cursor-not-allowed flex-col items-center justify-center gap-1 overflow-hidden'>
        {cardContent}
        <div className='line-clamp-2 md:hidden'>{game.name}</div>
      </div>
    );
  }

  // Normal games get wrapped in Link
  return (
    <Link
      to='/user/tournaments/$gameName'
      params={{ gameName: game.name }}
      className='flex flex-col items-center justify-center gap-1 overflow-hidden'
    >
      {cardContent}
      <div className='line-clamp-2 md:hidden'>{game.name}</div>
    </Link>
  );
}
