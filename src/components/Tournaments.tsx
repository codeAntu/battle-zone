import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { format } from 'date-fns';
import { BadgeIndianRupee, Calendar, Clock, Copy, Gamepad2, IndianRupee, Trophy, UserRound } from 'lucide-react';
import { Button } from './ui/button';
import { Tournament as TournamentType } from '@/services/types';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { participateInTournament } from '@/services/tournament';

export default function Tournaments({ tournaments }: { tournaments: TournamentType[] }) {
  console.log(tournaments);

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
      {tournaments.map((tournament) => (
        <Tournament key={tournament.id} tournament={tournament} />
      ))}
    </div>
  );
}

function Tournament({ tournament }: { tournament: TournamentType }) {
  const date = format(new Date(tournament.scheduledAt), 'dd MMM yyyy');
  const time = format(new Date(tournament.scheduledAt), 'hh:mm a');

  const imageUrl = `https://placehold.co/600x300/222/ddd?text=${tournament.game}`;

  return (
    <div className='transform overflow-hidden rounded-xl border bg-white/10 text-white/80 shadow-lg transition-transform duration-300 hover:scale-102'>
      <div className='relative'>
        <img className='hidden aspect-[2/1] w-full object-cover md:block' alt={tournament.game} src={imageUrl} />
        <Tags tags={[tournament.game]} />
      </div>
      <div className='space-y-3 px-4 py-2'>
        <div className='flex items-center justify-between'>
          <p className='line-clamp-1 text-lg font-bold'>{tournament.name}</p>
          <div className='rounded-lg bg-blue-500 px-3.5 py-1.5 text-sm font-medium'>{tournament.game}</div>
        </div>

        <div className=''>
          <div className='grid grid-cols-2 items-center justify-between gap-2 px-2'>
            <div className='flex flex-col gap-1 text-sm font-semibold text-rose-500/80'>
              <div className='flex items-center gap-2 text-green-500/90'>
                <IndianRupee className='size-5' />
                <p>Per Kill: ₹{tournament.perKillPrize}</p>
              </div>

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
                <Trophy className='size-5 text-yellow-400' />
                <div>
                  <div className='text-xs text-gray-400'>Prize Pool</div>
                  <div className='text-sm text-yellow-400'>₹{tournament.prize}</div>
                </div>
              </div>
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
        <TournamentDrawer data={tournament}>
          <Button className='w-full rounded-full font-semibold'>Participate ( ₹{tournament.entryFee} )</Button>
        </TournamentDrawer>
      </div>
    </div>
  );
}

function TournamentDrawer({ children, data }: { children: React.ReactNode; data: TournamentType }) {
  const date = format(new Date(data.scheduledAt), 'dd MMM yyyy');
  const time = format(new Date(data.scheduledAt), 'hh:mm a');
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ['participateInTournament'],
    mutationFn: participateInTournament,
    onSuccess: (data) => {
      if (data.isAlert) {
        toast.error(data.message || data.error || 'Failed to participate in the tournament');
        return;
      }
      toast.success('Successfully participated in the tournament');
      setIsOpen(false);
    },
    onError: () => {
      toast.error('Failed to participate in the tournament');
    },
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className='w-full' onClick={() => setIsOpen(true)}>
        {children}
      </DrawerTrigger>
      <DrawerContent className='m-auto max-w-[800px] border border-gray-800 bg-gray-950'>
        <div className='max-w-7xl px-4 pb-6 text-white'>
          <h1 className='py-3 text-center text-xl font-semibold'>{data.name}</h1>
          <div className='rounded-lg border border-gray-800 bg-white/5 p-4 text-white shadow-lg sm:p-6'>
            <div className='flex items-center'>
              <Trophy className='mr-3 h-6 w-6 text-yellow-400' />
              <div>
                <div className='text-sm text-gray-400'>Total Prize Pool</div>
                <div className='text-lg font-semibold text-yellow-400'>₹{data.prize}</div>
                <div className='text-xs text-gray-400'>
                  Entry Fee: ₹{data.entryFee} • Per Kill: ₹{data.perKillPrize}
                </div>
              </div>
            </div>

            <div className='mt-2.5 border-y border-gray-800 py-2.5'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div className='mr-2 flex h-5 w-5 items-center justify-center text-3xl font-bold text-yellow-400 sm:mr-3'>
                    #
                  </div>
                  <div>
                    <div className='text-sm text-gray-400 sm:text-base'>Room ID</div>
                    <div className='text-base sm:text-lg'>{data.roomId || 'No Room ID assigned yet'}</div>
                  </div>
                </div>
                {data.roomId && (
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(String(data.roomId || ''));
                      toast.success('Room ID copied to clipboard');
                    }}
                    className='h-8 w-8 border border-yellow-500 bg-transparent px-0 text-yellow-500 hover:bg-yellow-500 hover:text-white sm:h-9 sm:w-auto sm:px-3'
                  >
                    <Copy className='size-4' />
                    <span className='ml-2 hidden sm:inline'>Copy</span>
                  </Button>
                )}
              </div>
            </div>

            <p className='line-clamp-3 p-2'>
              <span className='font-medium'>Description:</span> {data.description || 'No description available'}
            </p>

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
                  <p>Per Kill: ₹{data.perKillPrize}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='w-full space-y-2 py-2'>
            <div className='text-center text-gray-300'>Do you want to participate in this tournament?</div>
            <div className='flex w-full justify-center gap-4'>
              <Button
                onClick={() => setIsOpen(false)}
                className='grow rounded-full bg-gray-500 font-semibold text-white'
              >
                Cancel
              </Button>
              <Button
                onClick={() => mutate(data.id.toLocaleString())}
                disabled={isPending}
                className='grow rounded-full font-semibold'
              >
                {isPending ? 'Processing...' : 'Participate'}
              </Button>
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
