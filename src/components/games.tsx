import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { BadgeIndianRupee, Calendar, Clock, Gamepad2, IndianRupee, UserRound } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import { Button } from './ui/button';

export default function Games() {
  return (
    <div className='grid grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
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
  perKill: '₹2',
  id: '1',
};

function Game() {
  return (
    <div
      // to='/games/$gameName/$gameId'
      // params={{ gameName: game.game, gameId: game.id }}
      className='transform overflow-hidden rounded-xl border bg-white/10 text-white/80 shadow-lg transition-transform duration-300 hover:scale-102'
    >
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

        <GameDrawer data={game}>
          <Button className='w-full rounded-full font-semibold'>Play</Button>
        </GameDrawer>
      </div>
    </div>
  );
}

function GameDrawer({ children, data }: { children: React.ReactNode; data: typeof game }) {
  const [formData, setFormData] = useState({
    gameLevel: '',
    gameId: '',
    gameName: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your submission logic here
  };

  return (
    <Drawer>
      <DrawerTrigger className='w-full'>{children}</DrawerTrigger>
      <DrawerContent className='m-auto max-w-[800px] border border-gray-800 bg-gray-950'>
        <div className='p-4 pb-6'>
          <div className='mx-auto max-w-7xl text-white'>
            <h1 className='mb-4 text-center text-xl font-semibold'>{data.game}</h1>
            <div className='space-y-3'>
              <div className='rounded-lg border border-gray-800 bg-white/5 p-6 text-white shadow-lg'>
                <h2 className='mb-4 line-clamp-2 text-xl font-semibold'>{data.game}</h2>
                <div className='grid grid-cols-2 items-center justify-between gap-2 px-2'>
                  <div className='flex flex-col gap-2 text-sm font-semibold text-rose-500/80'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='size-5' />
                      <p className=''>{game.date}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Clock className='size-5' />
                      <p className=''>{game.time}</p>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-green-500/80'>
                      <IndianRupee className='size-5' />
                      <p className=''>Price : ₹{game.price}</p>
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
                    <div className='flex items-center gap-2 text-green-500/80'>
                      <BadgeIndianRupee className='size-5' />
                      <p>{game.perKill}</p>
                    </div>
                  </div>
                </div>
                <p className='mt-4 mb-2 line-clamp-2'>
                  <span className='font-medium'>Description:</span> Experience the ultimate battle royale game with
                  intense action and strategic gameplay.
                </p>
              </div>

              <div className='md:col-span-3'>
                <div className='rounded-lg border border-gray-800 bg-white/5 p-6 text-white shadow-lg'>
                  <h2 className='mb-4 text-xl font-semibold'>Game Setup</h2>

                  <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                      <label htmlFor='gameId' className='mb-1 block text-sm font-medium'>
                        ID
                      </label>
                      <input
                        type='text'
                        id='gameId'
                        name='gameId'
                        value={formData.gameId}
                        onChange={handleChange}
                        className='focus:ring-primary focus:border-primary w-full rounded-md border border-gray-600 bg-white/5 px-3 py-2 text-white shadow-sm focus:outline-none'
                      />
                    </div>

                    <div>
                      <label htmlFor='gameName' className='mb-1 block text-sm font-medium'>
                        User Name
                      </label>
                      <input
                        type='text'
                        id='gameName'
                        name='gameName'
                        value={formData.gameName}
                        onChange={handleChange}
                        className='focus:ring-primary focus:border-primary w-full rounded-md border border-gray-600 bg-white/5 px-3 py-2 text-white shadow-sm focus:outline-none'
                      />
                    </div>
                    <div>
                      <label htmlFor='gameLevel' className='mb-1 block text-sm font-medium'>
                        Game Level
                      </label>
                      <input
                        type='text'
                        id='gameLevel'
                        name='gameLevel'
                        value={formData.gameLevel}
                        onChange={handleChange}
                        className='focus:ring-primary focus:border-primary w-full rounded-md border border-gray-600 bg-white/5 px-3 py-2 text-white shadow-sm focus:outline-none'
                      />
                    </div>

                    <div className='mt-5 flex w-full items-center gap-3'>
                      <DrawerClose className='w-full'>
                        <Button
                          type='button'
                          className='w-full rounded-lg border border-gray-600 bg-white/5 px-5 py-2 text-white hover:bg-white/10 focus:outline-none'
                        >
                          Cancel
                        </Button>
                      </DrawerClose>
                      <Button
                        type='submit'
                        className='bg-primary hover:bg-primary/90 w-full rounded-lg px-5 py-2 text-black focus:outline-none'
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
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
