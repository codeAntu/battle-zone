import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { endTournament, getAdminTournamentsById, getTournamentParticipants } from '@/services/tournament';
import { Participant as ParticipantType, Tournament } from '@/services/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { format } from 'date-fns';
import {
  BadgeIndianRupee,
  CalendarIcon,
  Clock,
  Copy,
  DollarSign,
  Gamepad2,
  Medal,
  Search,
  Trophy,
  UserRound,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/admin/tournaments/end/$tournamentsId')({
  component: RouteComponent,
});
function RouteComponent() {
  const { tournamentsId } = useParams({ from: '/admin/tournaments/end/$tournamentsId' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWinner, setSelectedWinner] = useState<number | null>(null);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [changeWinner, setChangeWinner] = useState(false);

  const { data: tournamentData, isLoading: isTournamentLoading } = useQuery({
    queryKey: ['tournaments', tournamentsId],
    queryFn: () => getAdminTournamentsById(tournamentsId),
  });

  const { data: participants, isLoading: isParticipantsLoading } = useQuery({
    queryKey: ['tournamentParticipants', tournamentsId],
    queryFn: () => getTournamentParticipants(tournamentsId),
    enabled: !!tournamentData?.tournament,
  });

  const endTournamentMutation = useMutation({
    mutationFn: (winnerId: number) => endTournament(tournamentsId, winnerId.toString()),
    onSuccess: (data) => {
      if (data.isAlert) {
        toast.error(data.message || data.error || 'Failed to end tournament');
        return;
      }
      toast.success('Tournament ended successfully');
      queryClient.invalidateQueries({ queryKey: ['adminCurrentTournaments'] });
      setShowEndConfirmation(false);
      setTimeout(() => {
        navigate({ to: '/admin/tournaments/current' });
      }, 1500);
    },
    onError: (error) => {
      toast.error(`Failed to end tournament: ${(error as Error).message}`);
    },
  });

  const handleSelectWinner = (userId: number) => {
    setSelectedWinner(userId);
    toast.success('Winner selected successfully');
    setShowEndConfirmation(true);
    setChangeWinner(false);
  };

  const handleResetWinner = () => {
    setChangeWinner(true);
  };

  if (isTournamentLoading) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center p-5'>
        <div className='border-primary h-12 w-12 animate-spin rounded-full border-t-2 border-b-2'></div>
      </div>
    );
  }

  const tournament = tournamentData?.tournament;

  if (!tournament) {
    return <div className='p-8 text-center'>Tournament not found</div>;
  }

  // Filter participants based on search query
  const filteredParticipants =
    participants?.participants?.filter(
      (participant) =>
        participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        participant.email.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  // Find the selected winner
  const winnerParticipant = participants?.participants?.find((p) => p.userId === selectedWinner);

  console.log('participants', participants);

  console.log(selectedWinner);

  return (
    <div className='mx-auto max-w-6xl p-4'>
      <div className='mb-6'>
        <div className='mb-2 flex items-center space-x-2'>
          <span className='rounded-full bg-blue-500 px-4 py-0.5 text-sm tracking-wider uppercase'>
            {tournament.game}
          </span>
          {tournament.isEnded ? (
            <span className='rounded-full bg-red-500 px-4 py-0.5 text-sm tracking-wider text-white uppercase'>
              ENDED
            </span>
          ) : (
            <span className='rounded-full bg-green-500 px-4 py-0.5 text-sm tracking-wider text-white uppercase'>
              ENDING
            </span>
          )}
        </div>

        <div className='flex items-center justify-between'>
          <h1 className='line-clamp-2 text-center text-lg font-bold sm:text-2xl'>{tournament.name}</h1>
          <TournamentInfoDrawer tournament={tournament} />
        </div>
      </div>

      {/* Tournament Ended Banner */}
      {tournament.isEnded && (
        <div className='mb-6 rounded-lg border border-red-800 bg-red-900/20 p-4 text-center'>
          <div className='flex items-center justify-center gap-2'>
            <Trophy className='h-5 w-5 text-yellow-400' />
            <h3 className='text-lg font-medium text-red-200'>This tournament has already ended</h3>
          </div>
          <p className='mt-2 text-sm text-gray-300'>
            The tournament was completed and prizes were distributed. No further actions can be performed.
          </p>
        </div>
      )}

      {/* End Tournament Alert Dialog */}
      <AlertDialog open={showEndConfirmation && !tournament.isEnded} onOpenChange={setShowEndConfirmation}>
        <AlertDialogContent className='dark border border-gray-700'>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2 text-white'>
              <Trophy className='h-5 w-5 text-yellow-400' />
              End Tournament and Distribute Prizes
            </AlertDialogTitle>
            <AlertDialogDescription>
              You've selected <span className='font-semibold text-yellow-500'>{winnerParticipant?.name}</span> as the
              winner. Are you ready to end the tournament and distribute prizes? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='text-white/80'>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className='bg-red-500 text-white hover:bg-red-600'
              onClick={() => {
                if (selectedWinner) {
                  endTournamentMutation.mutate(selectedWinner);
                }
              }}
              disabled={endTournamentMutation.isPending}
            >
              {endTournamentMutation.isPending ? 'Ending Tournament...' : 'End Tournament & Distribute Prizes'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {!tournament.isEnded ? (
        <>
          <h2 className='mb-4 text-lg font-semibold sm:text-xl'>End Tournament by choosing a Winner</h2>

          {selectedWinner && !changeWinner ? (
            <div className='mb-6'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-md flex items-center gap-2 font-medium'>
                  <Trophy className='h-4 w-4 text-yellow-400' />
                  Selected Winner
                </h3>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleResetWinner}
                  className='border-yellow-500/70 text-xs text-yellow-500/90 hover:bg-yellow-950/30'
                >
                  Change Winner
                </Button>
              </div>

              <Table className='text-center'>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-center'>#</TableHead>
                    <TableHead className='text-center'>Name</TableHead>
                    <TableHead className='text-center'>Email</TableHead>
                    <TableHead className='text-center'>Status</TableHead>
                    <TableHead className='text-center'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {winnerParticipant && (
                    <ParticipantRow
                      key={winnerParticipant.id}
                      participant={winnerParticipant}
                      index={0}
                      isWinner={true}
                      onSelectWinner={handleSelectWinner}
                    />
                  )}
                </TableBody>
              </Table>

              <div className='mt-4 flex justify-center'>
                <Button
                  className='bg-red-500 px-8 text-white hover:bg-red-600'
                  onClick={() => setShowEndConfirmation(true)}
                >
                  End Tournament with Selected Winner
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className='relative mb-6'>
                <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
                <Input
                  type='text'
                  placeholder='Search participants by name or email'
                  className='pl-10'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {isParticipantsLoading ? (
                <div className='flex min-h-[20vh] items-center justify-center p-5'>
                  <div className='border-primary h-10 w-10 animate-spin rounded-full border-t-2 border-b-2'></div>
                </div>
              ) : (
                <Table className='text-center'>
                  <TableCaption>List of tournament participants</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='text-center'>#</TableHead>
                      <TableHead className='text-center'>Name</TableHead>
                      <TableHead className='text-center'>Email</TableHead>
                      <TableHead className='text-center'>Joined At</TableHead>
                      <TableHead className='text-center'>Status</TableHead>
                      <TableHead className='text-center'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParticipants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className='h-24 text-center'>
                          {searchQuery ? 'No participants match your search' : 'No participants found'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredParticipants.map((participant, index) => (
                        <ParticipantRow
                          key={participant.id}
                          participant={participant}
                          index={index}
                          isWinner={selectedWinner === participant.userId}
                          onSelectWinner={handleSelectWinner}
                        />
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </>
      ) : (
        <div className='rounded-lg border border-gray-700 bg-gray-800/30 p-6'>
          <h2 className='mb-4 text-lg font-semibold sm:text-xl'>Tournament Results</h2>
          <div className='flex flex-col items-center justify-center p-6'>
            <Trophy className='mb-3 h-12 w-12 text-yellow-400' />
            <h3 className='mb-1 text-xl font-semibold text-yellow-400'>Tournament Completed</h3>
            <p className='text-center text-gray-400'>
              This tournament has been completed and the prizes have been distributed to the winners.
            </p>
            <Button
              variant='outline'
              className='mt-4 border-yellow-500/70 text-yellow-500/90 hover:bg-yellow-950/30'
              onClick={() => navigate({ to: '/admin/tournaments/history' })}
            >
              View Tournament History
            </Button>
          </div>
        </div>
      )}

      <div className='mt-4 text-center text-sm text-gray-400'>
        {!tournament.isEnded ? (
          <p>Note: Make sure all participants are properly recorded before ending the tournament</p>
        ) : (
          <p>This tournament was completed on {format(new Date(tournament.updatedAt), 'MMMM d, yyyy')}</p>
        )}
      </div>
    </div>
  );
}

function ParticipantRow({
  participant,
  index,
  isWinner,
  onSelectWinner,
}: {
  participant: ParticipantType;
  index: number;
  isWinner: boolean;
  onSelectWinner: (id: number) => void;
}) {
  const joinedDate = new Date(participant.joinedAt);

  return (
    <TableRow className={isWinner ? 'bg-green-950/30' : ''}>
      <TableCell className='text-center'>{index + 1}</TableCell>
      <TableCell className='text-center font-medium'>{participant.name}</TableCell>
      <TableCell className='text-center'>{participant.email}</TableCell>
      <TableCell className='text-center'>
        {format(joinedDate, 'MMM d, yyyy')} at {format(joinedDate, 'h:mm a')}
      </TableCell>
      <TableCell className='text-center'>
        {isWinner ? (
          <div className='flex items-center justify-center gap-1 text-yellow-400'>
            <Trophy className='h-4 w-4' />
            <span>Winner</span>
          </div>
        ) : (
          <span className='text-gray-400'>Participant</span>
        )}
      </TableCell>
      <TableCell className='text-center'>
        <div className='flex items-center justify-center space-x-2'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              {!isWinner ? (
                <Button variant='default' size='sm' className='h-8 bg-yellow-500 text-xs hover:bg-yellow-600'>
                  <Trophy className='mr-1 h-3 w-3' />
                  Select Winner
                </Button>
              ) : (
                <Button variant='outline' size='sm' className='h-8 border-yellow-500 text-xs text-yellow-500'>
                  <Medal className='mr-1 h-3 w-3' />
                  Tournament Winner
                </Button>
              )}
            </AlertDialogTrigger>
            <AlertDialogContent className='dark'>
              <AlertDialogHeader>
                <AlertDialogTitle className='text-white'>Confirm Winner Selection</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to select
                  <span className='font-semibold text-yellow-500'>{' ' + participant.name + ' '}</span>
                  as the winner of this tournament? This action will mark them as the winner and they will receive the
                  tournament prize.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className='text-white/80'>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onSelectWinner(participant.userId)}
                  className='bg-yellow-500 hover:bg-yellow-600'
                >
                  Yes, Select Winner
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}

function TournamentInfoDrawer({ tournament }: { tournament: Tournament }) {
  const [isOpen, setIsOpen] = useState(false);
  const scheduledDate = tournament.scheduledAt ? new Date(tournament.scheduledAt) : null;
  const date = scheduledDate ? format(scheduledDate, 'dd MMM yyyy') : 'Not scheduled';
  const time = scheduledDate ? format(scheduledDate, 'hh:mm a') : 'Not scheduled';

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger onClick={() => setIsOpen(true)}>
        <Button variant='outline' className='mt-2'>
          Details
        </Button>
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
                <div className='text-lg font-semibold text-yellow-400'>{tournament.prize} coins</div>
                <div className='text-xs text-gray-400'>
                  Entry Fee: {tournament.entryFee} coins • Per Kill: {tournament.perKillPrize} coins
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
                    <div className='text-base sm:text-lg'>{tournament.roomId || 'No Room ID assigned yet'}</div>
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
                  <CalendarIcon className='size-5' />
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
                  <DollarSign className='size-5' />
                  <p>Entry Fee: {tournament.entryFee} coins</p>
                </div>
                <div className='flex items-center gap-2 text-green-500/80'>
                  <BadgeIndianRupee className='size-5' />
                  <p>Per Kill: {tournament.perKillPrize} coins</p>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-4'>
            <Button
              onClick={() => setIsOpen(false)}
              className='w-full rounded-full bg-gray-500 font-semibold text-white hover:bg-gray-600'
            >
              Close
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
