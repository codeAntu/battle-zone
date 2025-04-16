import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { isParticipated, participateInTournament } from '@/services/tournament';
import { Tournament as TournamentType } from '@/services/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { formatDateToUTC, formatTimeToUTC } from '@/lib/utils';
import { BadgeIndianRupee, Calendar, Copy, Gamepad2, IndianRupee, Trophy, UserRound } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Button } from './ui/button';
import { DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface TournamentDrawerProps {
  children: React.ReactNode;
  data: TournamentType;
  viewOnly?: boolean;
  showCurrency?: 'coins' | 'rupees';
}

export const participationValidator = z.object({
  playerUsername: z.string().min(1, 'Player username is required'),
  playerUserId: z.string().min(1, 'Player ID is required'),
  playerLevel: z.number().int().min(30, 'Player level must be at least 30'),
});

type FormValues = z.infer<typeof participationValidator>;

export default function TournamentDrawer({
  children,
  data: tournament,
  viewOnly = false,
  showCurrency = 'rupees',
}: TournamentDrawerProps) {
  const date = formatDateToUTC(tournament.scheduledAt);
  const time = formatTimeToUTC(tournament.scheduledAt);
  const [isOpen, setIsOpen] = useState(false);

  // Form state for participation
  const [playerUsername, setPlayerUsername] = useState('');
  const [playerUserId, setPlayerUserId] = useState('');
  const [playerLevel, setPlayerLevel] = useState(30);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currencySymbol = showCurrency === 'rupees' ? '₹' : '';
  const currencyLabel = showCurrency === 'rupees' ? '' : ' coins';

  // Query to check if user has participated
  const {
    data: participationData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['isParticipated', tournament.id],
    queryFn: () => isParticipated(tournament.id.toLocaleString()),
    enabled: !viewOnly,
  });

  // Participate mutation
  const { mutate, isPending } = useMutation({
    mutationKey: ['participateInTournament'],
    mutationFn: ({ id, playerData }: { id: string; playerData: FormValues }) => participateInTournament(id, playerData),
    onSuccess: (data) => {
      if (data.isAlert) {
        toast.error(data.message || data.error || 'Failed to participate in the tournament');
        return;
      }
      toast.success('Successfully participated in the tournament');
      resetForm();
      setIsOpen(false); // Close the drawer after successful participation
      refetch();
    },
    onError: () => {
      toast.error('Failed to participate in the tournament');
    },
  });

  const resetForm = () => {
    setPlayerUsername('');
    setPlayerUserId('');
    setPlayerLevel(30);
    setErrors({});
  };

  const validateForm = () => {
    const formData = {
      playerUsername,
      playerUserId,
      playerLevel,
    };

    try {
      participationValidator.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      mutate({
        id: tournament.id.toString(),
        playerData: {
          playerUsername,
          playerUserId,
          playerLevel,
        },
      });
    }
  };

  const hasParticipated = !isLoading && participationData?.participation;

  // Define image sources with fallbacks
  const defaultGameImage = `/games/${tournament.game.toUpperCase()}/image.png`;
  const imageUrl = tournament.image || defaultGameImage;

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className={viewOnly ? '' : 'w-full'} onClick={() => setIsOpen(true)}>
        {children}
      </DrawerTrigger>
      <DrawerContent className='m-auto w-full max-w-[800px] border border-gray-800 bg-gray-950 p-0'>
        <div className='max-w-7xl px-3 pt-2 pb-3 text-white'>
          <DialogTitle className='flex items-center justify-center'>
            <span className='line-clamp-2 py-1 text-center text-base font-semibold sm:text-xl'>
              {tournament.name}
              {tournament.isEnded && <span className='ml-2 text-xs text-red-400'>(Ended)</span>}
            </span>
          </DialogTitle>

          {/* Tournament Image Section */}

          {/* Show different content based on participation status */}
          {hasParticipated || viewOnly ? (
            <>
              {tournament.image && (
                <div className='mb-3 flex justify-center overflow-hidden'>
                  <div className='relative w-full max-w-sm rounded-lg'>
                    <img src={imageUrl} alt={tournament.name} className='h-auto w-full rounded-lg object-contain' />
                  </div>
                </div>
              )}
              {/* Tournament details UI for participants */}
              <div className='rounded-lg border border-gray-800 bg-white/5 p-3 text-white shadow-lg sm:p-6'>
                {/* Tournament info with better mobile layout */}
                <div className='border-b border-gray-800 pb-2'>
                  <div className='grid grid-cols-2 gap-x-2 gap-y-1 sm:gap-y-3'>
                    {/* Game information */}
                    <div className='flex items-center gap-2 sm:gap-2'>
                      <Gamepad2 className='size-5 text-yellow-500' />
                      <div className='-mt-0.5'>
                        <div className='text-[13px] text-gray-400 sm:text-sm'>Game</div>
                        <div className='text-[15px] font-medium sm:text-base'>{tournament.game}</div>
                      </div>
                    </div>

                    {/* Status information */}
                    <div className='flex items-center gap-2'>
                      {tournament.isEnded ? (
                        <Trophy className='size-5 text-red-500' />
                      ) : (
                        <Trophy className='size-5 text-green-500' />
                      )}
                      <div className='-mt-0.5'>
                        <div className='text-[13px] text-gray-400 sm:text-sm'>Status</div>
                        <div className='text-[15px] font-medium sm:text-base'>
                          {tournament.isEnded ? 'Ended' : 'Active'}
                        </div>
                      </div>
                    </div>

                    {/* Participants information */}
                    <div className='flex items-center gap-2'>
                      <UserRound className='size-5 text-blue-500' />
                      <div className='-mt-0.5'>
                        <div className='text-[13px] text-gray-400 sm:text-sm'>Participants</div>
                        <div className='text-[15px] font-medium sm:text-base'>
                          {tournament.currentParticipants}/{tournament.maxParticipants}
                        </div>
                      </div>
                    </div>

                    {/* Schedule information - date and time in same section but on two lines for mobile */}
                    <div className='flex items-center gap-2'>
                      <Calendar className='size-5 text-rose-500' />
                      <div className='-mt-0.5 overflow-hidden'>
                        <div className='text-[13px] text-gray-400 sm:text-sm'>Scheduled For</div>
                        <div className='text-[15px] font-medium sm:text-base'>{date}</div>
                        <div className='text-[13px] font-medium text-gray-300 sm:text-sm'>{time}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Room information section - mobile optimized */}
                <div className='mt-2 border-b border-gray-800 py-1 sm:py-1.5'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <div className='mr-2 flex h-5 w-5 items-center justify-center text-3xl font-bold text-yellow-400 sm:mr-3'>
                        #
                      </div>
                      <div>
                        <div className='text-xs text-gray-400 sm:text-base'>Room ID</div>
                        <div className='text-sm sm:text-lg'>{tournament.roomId || 'No Room ID assigned yet'}</div>
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

                  {/* Room Password Section */}
                  {tournament.roomId ? (
                    tournament.roomPassword ? (
                      <div className='mt-1 flex items-center justify-between sm:mt-1.5'>
                        <div className='flex items-center'>
                          <div className='mr-2 flex h-5 w-5 items-center justify-center text-3xl font-bold text-yellow-400 sm:mr-3'>
                            *
                          </div>
                          <div>
                            <div className='text-xs text-gray-400 sm:text-base'>Password</div>
                            <div className='text-sm sm:text-lg'>{tournament.roomPassword}</div>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(String(tournament.roomPassword));
                            toast.success('Room password copied to clipboard');
                          }}
                          className='h-8 w-8 border border-yellow-500 bg-transparent px-0 text-yellow-500 hover:bg-yellow-500 hover:text-white sm:h-9 sm:w-auto sm:px-3'
                        >
                          <Copy className='size-4' />
                          <span className='ml-2 hidden sm:inline'>Copy</span>
                        </Button>
                      </div>
                    ) : (
                      <div className='mt-1 flex items-center sm:mt-1.5'>
                        <div className='mr-2 flex h-5 w-5 items-center justify-center text-3xl font-bold text-yellow-400 sm:mr-3'>
                          *
                        </div>
                        <div>
                          <div className='text-xs text-gray-400 sm:text-base'>Password</div>
                          <div className='text-sm text-gray-500 sm:text-lg'>No game room password yet</div>
                        </div>
                      </div>
                    )
                  ) : null}
                </div>

                {/* Prize information section - restructured for mobile */}
                <div className='mt-2 mb-1 sm:mt-2.5'>
                  {/* Total Prize in its own row */}
                  <div className='mb-1 rounded-md bg-yellow-900/20 p-1 sm:p-2'>
                    <div className='flex flex-col items-center'>
                      <div className='text-xs text-gray-400'>Total Prize Pool</div>
                      <div className='flex items-center gap-1'>
                        <Trophy className='size-4 text-yellow-400' />
                        <span className='text-base font-bold text-yellow-400 sm:text-lg'>
                          {currencySymbol}
                          {tournament.prize}
                          {currencyLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Entry Fee and Per Kill in single row */}
                  <div className='grid grid-cols-2 gap-1'>
                    <div className='rounded-md bg-gray-800/30 p-1 sm:p-2'>
                      <div className='flex flex-col items-center'>
                        <div className='text-xs text-gray-400'>Entry Fee</div>
                        <div className='flex items-center gap-0.5'>
                          <IndianRupee className='size-3 text-gray-300 sm:size-4' />
                          <span className='text-sm font-bold text-white sm:text-base'>
                            {tournament.entryFee}
                            {currencyLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='rounded-md bg-gray-800/30 p-1 sm:p-2'>
                      <div className='flex flex-col items-center'>
                        <div className='text-xs text-gray-400'>Per Kill</div>
                        <div className='flex items-center gap-0.5'>
                          <BadgeIndianRupee className='size-3 text-gray-300 sm:size-4' />
                          <span className='text-sm font-bold text-white sm:text-base'>
                            {tournament.perKillPrize}
                            {currencyLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description section */}
                <div className='mt-1 sm:mt-1.5'>
                  <div className='text-sm text-gray-400'>Description</div>
                  <p className='mt-1 max-h-24 overflow-y-auto rounded-md bg-gray-800/20 p-1 text-sm sm:p-2'>
                    {tournament.description || 'No description available'}
                  </p>
                </div>
              </div>

              {!viewOnly && hasParticipated && (
                <div className='mt-2 flex items-center justify-center rounded-full bg-green-500 py-1 text-sm font-semibold text-white sm:mt-3 sm:py-2'>
                  You have already participated in this tournament
                </div>
              )}
            </>
          ) : (
            <>
              {/* Participation form UI */}
              <div className='mb-4 rounded-lg border border-gray-900 bg-black p-3 text-white shadow-lg sm:mb-6 sm:p-4'>
                <div className='flex items-center justify-between'>
                  <div className='text-lg font-medium'>{tournament.game}</div>
                  <div className='text-xl font-bold text-green-500'>
                    {currencySymbol}
                    {tournament.entryFee}
                    {currencyLabel}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className='space-y-3 sm:space-y-4'>
                <div className='space-y-1 sm:space-y-2'>
                  <Label htmlFor='playerUsername' className='text-white'>
                    Player Username
                  </Label>
                  <Input
                    id='playerUsername'
                    value={playerUsername}
                    onChange={(e) => setPlayerUsername(e.target.value)}
                    placeholder='Enter your in-game username'
                    className='border-gray-800 bg-black text-white placeholder:text-gray-500'
                  />
                  {errors.playerUsername && <p className='text-sm text-red-500'>{errors.playerUsername}</p>}
                </div>

                <div className='space-y-1 sm:space-y-2'>
                  <Label htmlFor='playerUserId' className='text-white'>
                    Player ID
                  </Label>
                  <Input
                    id='playerUserId'
                    value={playerUserId}
                    onChange={(e) => setPlayerUserId(e.target.value)}
                    placeholder='Enter your player ID'
                    className='border-gray-800 bg-black text-white placeholder:text-gray-500'
                  />
                  {errors.playerUserId && <p className='text-sm text-red-500'>{errors.playerUserId}</p>}
                </div>

                <div className='space-y-1 sm:space-y-2'>
                  <Label htmlFor='playerLevel' className='text-white'>
                    Player Level (min 30)
                  </Label>
                  <Input
                    id='playerLevel'
                    type='number'
                    value={playerLevel}
                    onChange={(e) => setPlayerLevel(e.target.valueAsNumber)}
                    placeholder='Enter your player level'
                    className='border-gray-800 bg-black text-white placeholder:text-gray-500'
                  />
                  {errors.playerLevel && <p className='text-sm text-red-500'>{errors.playerLevel}</p>}
                </div>

                <Button type='submit' className='mt-3 w-full sm:mt-4' disabled={isPending}>
                  {isPending
                    ? 'Processing...'
                    : `Participate ( ${currencySymbol}${tournament.entryFee}${currencyLabel} )`}
                </Button>
              </form>
            </>
          )}

          {(viewOnly || hasParticipated) && (
            <div className='mt-2 sm:mt-3'>
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
