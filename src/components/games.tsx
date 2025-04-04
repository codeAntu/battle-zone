import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { format } from 'date-fns';
import { BadgeIndianRupee, Calendar, Clock, Gamepad2, IndianRupee, UserRound } from 'lucide-react';
import { Button } from './ui/button';
import { Tournament } from '@/services/types';

// Change the function signature to accept props object with tournaments array
export default function Games({ tournaments }: { tournaments: Tournament[] }) {
  console.log(tournaments);

  return (
    <div className='grid grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
      {tournaments.map((tournament) => (
        <Game key={tournament.id} tournament={tournament} />
      ))}
    </div>
  );
}

function Game({ tournament }: { tournament: Tournament }) {
  // Format the date and time from scheduledAt
  const date = format(new Date(tournament.scheduledAt), 'dd MMM yyyy');
  const time = format(new Date(tournament.scheduledAt), 'hh:mm a');

  // Placeholder image URL - replace with actual tournament image when available
  const imageUrl = `https://placehold.co/600x300/222/ddd?text=${tournament.game}`;

  return (
    <div className='transform overflow-hidden rounded-xl border bg-white/10 text-white/80 shadow-lg transition-transform duration-300 hover:scale-102'>
      <div className='relative'>
        <img className='aspect-[2/1] w-full object-cover' alt={tournament.game} src={imageUrl} />
        <Tags tags={[tournament.game]} />
      </div>
      <div className='space-y-3 px-4 py-2'>
        <div className='flex items-center justify-between'>
          <div className='space-y-1.5'>
            <p className='line-clamp-1 text-lg font-bold'>{tournament.name}</p>
          </div>
          <div className='rounded-lg bg-green-500 px-3.5 py-1.5 text-sm font-medium'>Price: ₹{tournament.entryFee}</div>
        </div>
        <div className=''>
          <div className='grid grid-cols-2 items-center justify-between gap-2 px-2'>
            <div className='flex flex-col gap-1 text-sm font-semibold text-rose-500/80'>
              <div className='flex items-center gap-2'>
                <Calendar className='size-5' />
                <p className=''>{date}</p>
              </div>
              <div className='flex items-center gap-2'>
                <Clock className='size-5' />
                <p className=''>{time}</p>
              </div>
            </div>
            <div className='flex flex-col gap-1 text-sm font-semibold text-blue-500/80'>
              <div className='flex items-center gap-2'>
                <Gamepad2 className='size-5' />
                <p>{tournament.game}</p>
              </div>
              <div className='flex items-center gap-2'>
                <UserRound className='size-5' />
                <p>{tournament.maxParticipants} Players</p>
              </div>
            </div>
          </div>
        </div>

        <GameDrawer data={tournament}>
          <Button className='w-full rounded-full font-semibold'>Play</Button>
        </GameDrawer>
      </div>
    </div>
  );
}

function GameDrawer({ children, data }: { children: React.ReactNode; data: Tournament }) {
  // const [formData, setFormData] = useState({
  //   gameLevel: '',
  //   gameId: '',
  //   gameName: '',
  // });

  // Format the date and time
  const date = format(new Date(data.scheduledAt), 'dd MMM yyyy');
  const time = format(new Date(data.scheduledAt), 'hh:mm a');

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  // const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log('Form submitted:', formData);
  //   // Add your submission logic here
  // };

  return (
    <Drawer>
      <DrawerTrigger className='w-full'>{children}</DrawerTrigger>
      <DrawerContent className='m-auto max-w-[800px] border border-gray-800 bg-gray-950'>
        <div className='p-4 pb-6'>
          <div className='mx-auto max-w-7xl text-white'>
            <h1 className='mb-4 text-center text-xl font-semibold'>{data.name}</h1>
            <div className='space-y-3'>
              <div className='rounded-lg border border-gray-800 bg-white/5 p-6 text-white shadow-lg'>
                <h2 className='mb-4 line-clamp-2 text-xl font-semibold'>{data.game}</h2>
                <div className='grid grid-cols-2 items-center justify-between gap-2 px-2'>
                  <div className='flex flex-col gap-2 text-sm font-semibold text-rose-500/80'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='size-5' />
                      <p className=''>{date}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Clock className='size-5' />
                      <p className=''>{time}</p>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-green-500/80'>
                      <IndianRupee className='size-5' />
                      <p className=''>Price: ₹{data.entryFee}</p>
                    </div>
                  </div>
                  <div className='flex flex-col gap-1 text-sm font-semibold text-blue-500/80'>
                    <div className='flex items-center gap-2'>
                      <Gamepad2 className='size-5' />
                      <p>{data.game}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <UserRound className='size-5' />
                      <p>{data.maxParticipants} Players</p>
                    </div>
                    <div className='flex items-center gap-2 text-green-500/80'>
                      <BadgeIndianRupee className='size-5' />
                      <p> Per Kill: ₹{data.perKillPrize}</p>
                    </div>
                  </div>
                </div>
                <p className='mt-4 mb-2 line-clamp-2'>
                  <span className='font-medium'>Description:</span> {data.description || 'No description available'}
                </p>
                <p className='mt-2 text-yellow-400'>
                  <span className='font-medium'>Prize Pool:</span> ₹{data.prize}
                </p>
                <p className='mt-1 text-sm'>
                  <span className='font-medium'>Room ID:</span> {data.roomId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className='absolute bottom-0 left-0 flex w-full gap-1 overflow-auto rounded-t-2xl px-2 pt-2 pb-1.5 backdrop-blur-sm'>
      {tags.map((tag, index) => (
        <Tag key={index}>{tag}</Tag>
      ))}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <div className='rounded-lg bg-blue-500 px-2 py-1 pb-1.5 text-xs font-medium text-white'>{children}</div>;
}
