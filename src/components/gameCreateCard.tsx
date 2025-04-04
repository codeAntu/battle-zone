import { GameType } from '@/services/game';
import { Link } from '@tanstack/react-router';

export function GameCreateCard(game: GameType) {
  // Determine if game name matches one of our allowed enum values

  return (
    <Link to='/admin/tournaments/new' className='relative overflow-hidden rounded-2xl'>
      <div>
        <img src={game.image} alt={game.name} />
      </div>
      <div className='absolute bottom-0 flex w-full items-center justify-between rounded-t-2xl bg-black/5 p-3 text-white backdrop-blur-2xl'>
        <p className='px-2 text-lg font-semibold'>{game.name}</p>
        <div className='flex items-start'>
          <button className='border-primary text-primary hover:bg-primary rounded-lg border bg-transparent px-8 py-2 text-xs font-semibold hover:text-black'>
            Create Tournament
          </button>
        </div>
      </div>
    </Link>
  );
}
