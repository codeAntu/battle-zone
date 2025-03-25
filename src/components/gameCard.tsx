import { MoveRight } from 'lucide-react';

const game = {
  game: 'PUBG Mobile',
  image: 'https://www.financialexpress.com/wp-content/uploads/2025/03/PUBG-MOBILE1.jpg',
};

export default function GameCard() {
  return (
    <div className='relative overflow-hidden rounded-2xl'>
      <div>
        <img src={game.image} alt='game' />
      </div>
      <div className='absolute bottom-0 flex w-full items-center justify-between rounded-t-2xl bg-black/5 p-3 text-white backdrop-blur-2xl'>
        <p className='px-2 text-lg font-semibold'>{game.game}</p>
        <div className='flex items-start'>
          <button className='border-primary text-primary hover:bg-primary flex rounded-lg border bg-transparent px-8 py-2 text-xs font-semibold hover:text-black'>
            Play
            <MoveRight className='ml-2 h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
}
