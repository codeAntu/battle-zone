import { GameType } from '@/services/game';
import { Link } from '@tanstack/react-router';
import { MoveRight } from 'lucide-react';

export default function GameCard({ game }: { game: GameType }) {
  return (
    <Link
      to='/user/tournaments/$gameName'
      params={{ gameName: game.name }}
      className='relative aspect-square overflow-hidden rounded-2xl border md:aspect-auto md:w-full'
    >
      <img src={game.image} alt={game.name} className='h-full w-full object-cover' />
      <div className='absolute bottom-0 hidden w-full items-center justify-between rounded-t-2xl bg-black/5 p-3 text-white backdrop-blur-2xl md:flex'>
        <p className='px-2 text-lg font-semibold'>{game.name}</p>
        <div className='flex items-start'>
          <button className='border-primary text-primary hover:bg-primary flex rounded-lg border bg-transparent px-8 py-2 text-xs font-semibold hover:text-black'>
            Play
            <MoveRight className='ml-2 h-4 w-4' />
          </button>
        </div>
      </div>
    </Link>
  );
}
