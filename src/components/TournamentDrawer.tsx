import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { isParticipated, participateInTournament } from '@/services/tournament';
import { Tournament as TournamentType } from '@/services/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { BadgeIndianRupee, Calendar, Clock, Copy, Gamepad2, IndianRupee, Trophy, UserRound } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import { DialogTitle } from './ui/dialog';

interface TournamentDrawerProps {
  children: React.ReactNode;
  data: TournamentType;
  viewOnly?: boolean;
  showCurrency?: 'coins' | 'rupees';
}

export default function TournamentDrawer({
  children,
  data: tournament,
  viewOnly = false,
  showCurrency = 'rupees',
}: TournamentDrawerProps) {
  const date = format(new Date(tournament.scheduledAt), 'dd MMM yyyy');
  const time = format(new Date(tournament.scheduledAt), 'hh:mm a');
  const [isOpen, setIsOpen] = useState(false);

  const currencySymbol = showCurrency === 'rupees' ? '₹' : '';
  const currencyLabel = showCurrency === 'rupees' ? '' : ' coins';

  // Only run participation queries if not in view-only mode
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
      refetch();
    },
    onError: () => {
      toast.error('Failed to participate in the tournament');
    },
  });

  const { data, refetch } = useQuery({
    queryKey: ['isParticipated', tournament.id],
    queryFn: () => isParticipated(tournament.id.toLocaleString()),
    enabled: !viewOnly,
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className={viewOnly ? '' : 'w-full'} onClick={() => setIsOpen(true)}>
        {children}
      </DrawerTrigger>
      <DrawerContent className='m-auto max-w-[800px] border border-gray-800 bg-gray-950'>
        <div className='max-w-7xl px-4 pb-6 text-white'>
          <DialogTitle className='flex items-center justify-center py-1.5'>
            <span className='py-3 text-center text-xl font-semibold'>
              {tournament.name}
              {tournament.isEnded && <span className='ml-2 text-xs text-red-400'>(Ended)</span>}
            </span>
          </DialogTitle>
          <div className='rounded-lg border border-gray-800 bg-white/5 p-4 text-white shadow-lg sm:p-6'>
            <div className='flex items-center'>
              <Trophy className='mr-3 h-6 w-6 text-yellow-400' />
              <div>
                <div className='text-sm text-gray-400'>Total Prize Pool</div>
                <div className='text-lg font-semibold text-yellow-400'>
                  {currencySymbol}
                  {tournament.prize}
                  {currencyLabel}
                </div>
                <div className='text-xs text-gray-400'>
                  Entry Fee: {currencySymbol}
                  {tournament.entryFee}
                  {currencyLabel} • Per Kill: {currencySymbol}
                  {tournament.perKillPrize}
                  {currencyLabel}
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
                    <div className='text-base sm:text-lg'>
                      {viewOnly || data?.participation 
                        ? tournament.roomId || 'No Room ID assigned yet'
                        : 'Participate to view room ID'}
                    </div>
                  </div>
                </div>
                {tournament.roomId && (
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(String(tournament.roomId || ''));
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
              <span className='font-medium'>Description:</span> {tournament.description || 'No description available'}
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
                <div className='flex items-center gap-2'>
                  <UserRound className='size-5' />
                  <p>
                    {tournament.currentParticipants}/{tournament.maxParticipants} Players
                  </p>
                </div>
              </div>
              <div className='flex flex-col gap-1 text-sm font-semibold text-blue-500/80'>
                <div className='flex items-center gap-2'>
                  <Gamepad2 className='size-5' />
                  <p>{tournament.game}</p>
                </div>
                <div className='flex items-center gap-2 text-green-500/80'>
                  {showCurrency === 'rupees' ? <IndianRupee className='size-5' /> : <Trophy className='size-5' />}
                  <p>
                    Entry Fee: {currencySymbol}
                    {tournament.entryFee}
                    {currencyLabel}
                  </p>
                </div>
                <div className='flex items-center gap-2 text-green-500/80'>
                  <BadgeIndianRupee className='size-5' />
                  <p>
                    Per Kill: {currencySymbol}
                    {tournament.perKillPrize}
                    {currencyLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!viewOnly ? (
            data?.participation ? (
              <div className='mt-4 flex items-center justify-center rounded-full bg-green-500 py-2 text-sm font-semibold text-white'>
                You have already participated in this tournament
              </div>
            ) : (
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
                    onClick={() => mutate(tournament.id.toLocaleString())}
                    disabled={isPending}
                    className='grow rounded-full font-semibold'
                  >
                    {isPending ? 'Processing...' : 'Participate'}
                  </Button>
                </div>
              </div>
            )
          ) : (
            <div className='mt-4'>
              <Button
                onClick={() => setIsOpen(false)}
                className='w-full rounded-full bg-gray-500 font-semibold text-white hover:bg-gray-600'
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
