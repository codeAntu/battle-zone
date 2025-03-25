import { Calendar, Clock, Gamepad2, UserRound } from 'lucide-react';
import { Button } from './ui/button';

export default function Games() {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
      <Game />
      <Game />
      <Game />
      <Game />
      <Game />
    </div>
  );
}

const game = {
  game: 'PUBG Mobile ',
  image: 'https://www.financialexpress.com/wp-content/uploads/2025/03/PUBG-MOBILE1.jpg',
  Tags: ['Action', 'Adventure', 'Shooting'],
  date: '2021-10-10',
  time: '10:00 AM',
  duration: '2 hours',
  players: '1-100',
  price: '200',
};

function Game() {
  return (
    <div className='transform overflow-hidden rounded-xl border bg-white/10 text-white/80 shadow-lg transition-transform duration-300 hover:scale-102'>
      <div className='relative'>
        <img className='aspect-[2/1] w-full object-cover' alt='Game' src={game.image} />
        <Tags />
      </div>
      <div className='space-y-3 px-4 py-2'>
        <div className='flex items-center justify-between'>
          <div className='space-y-1.5'>
            <p className='line-clamp-1 text-lg font-bold'>{game.game}</p>
          </div>
          <div className='rounded-lg bg-green-500 px-3.5 py-1.5 text-sm font-medium'>Price : ₹{game.price}</div>
        </div>
        <div className=''>
          <div className='grid grid-cols-2 items-center justify-between gap-2 px-2'>
            <div className='flex flex-col gap-1 text-sm font-semibold text-rose-500/80'>
              <div className='flex items-center gap-2'>
                <Calendar className='size-5' />
                <p className=''>{game.date}</p>
              </div>
              <div className='flex items-center gap-2'>
                <Clock className='size-5' />
                <p className=''>{game.time}</p>
              </div>
            </div>
            <div className='flex flex-col gap-1 text-sm font-semibold text-blue-500/80'>
              <div className='flex items-center gap-2'>
                <Gamepad2 className='size-5' />
                <p>{game.duration}</p>
              </div>
              <div className='flex items-center gap-2'>
                <UserRound className='size-5' />
                <p>{game.players}</p>
              </div>
            </div>
          </div>
        </div>
        <Button className='w-full rounded-full font-semibold'>Play</Button>
      </div>
    </div>
  );
}

function Tags() {
  return (
    <div className='absolute bottom-0 left-0 flex w-full gap-1 overflow-auto rounded-t-2xl px-2 pt-2 pb-1.5 backdrop-blur-sm'>
      {game.Tags.map((tag, index) => (
        <Tag key={index}>{tag}</Tag>
      ))}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <div className='rounded-lg bg-blue-500 px-2 py-1 pb-1.5 text-xs font-medium text-white'>{children}</div>;
}
