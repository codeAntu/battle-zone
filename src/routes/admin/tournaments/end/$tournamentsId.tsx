import { addUserKillAmount, endTournament, getAdminTournamentsById, getTournamentParticipants } from '@/api/tournament';
import { Participant as ParticipantType } from '@/api/types';
import TournamentDrawer from '@/components/TournamentDrawer';
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
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDateToUTC, formatTimeToUTC } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { format } from 'date-fns';
import { Crosshair, Medal, Search, Trophy } from 'lucide-react';
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
    enabled: !!tournamentData?.data.tournament,
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
      <div className='mx-auto max-w-6xl p-4'>
        <div className='space-y-6'>
          {/* Header skeleton */}
          <div className='space-y-4'>
            <div className='flex gap-2'>
              <div className='bg-muted h-6 w-16 animate-pulse rounded-full'></div>
              <div className='bg-muted h-6 w-20 animate-pulse rounded-full'></div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='bg-muted h-8 w-64 animate-pulse rounded'></div>
              <div className='bg-muted h-10 w-20 animate-pulse rounded'></div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className='space-y-4'>
            <div className='bg-muted h-6 w-48 animate-pulse rounded'></div>
            <div className='bg-muted h-10 w-full animate-pulse rounded'></div>

            {/* Table skeleton */}
            <div className='bg-card rounded-lg border p-4'>
              <div className='space-y-3'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className='flex items-center gap-4 border-b p-3 last:border-b-0'>
                    <div className='bg-muted h-4 w-8 animate-pulse rounded'></div>
                    <div className='bg-muted h-4 w-32 animate-pulse rounded'></div>
                    <div className='bg-muted h-4 w-48 animate-pulse rounded'></div>
                    <div className='bg-muted h-4 w-20 animate-pulse rounded'></div>
                    <div className='bg-muted h-4 w-24 animate-pulse rounded'></div>
                    <div className='bg-muted h-4 w-16 animate-pulse rounded'></div>
                    <div className='bg-muted h-4 w-20 animate-pulse rounded'></div>
                    <div className='bg-muted ml-auto h-8 w-24 animate-pulse rounded'></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tournament = tournamentData?.data.tournament;

  if (!tournament) {
    return <div className='p-8 text-center'>Tournament not found</div>;
  }

  // Filter participants based on search query
  const filteredParticipants =
    participants?.data.participants?.filter(
      (participant) =>
        participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        participant.email.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  // Find the selected winner
  const winnerParticipant = participants?.data.participants?.find((p) => p.userId === selectedWinner);

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
          <TournamentDrawer data={tournament} viewOnly={true}>
            <Button variant='outline' className='mt-2'>
              Details
            </Button>
          </TournamentDrawer>
        </div>
      </div>

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
            <AlertDialogCancel className='text-white/80'>Cancel</AlertDialogCancel>{' '}
            <AlertDialogAction
              className='bg-red-500 text-white hover:bg-red-600'
              onClick={() => {
                if (selectedWinner) {
                  endTournamentMutation.mutate(selectedWinner);
                }
              }}
              disabled={endTournamentMutation.isPending}
            >
              {endTournamentMutation.isPending ? (
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent'></div>
                  Ending Tournament...
                </div>
              ) : (
                'End Tournament & Distribute Prizes'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {!tournament.isEnded ? (
        <>
          <h2 className='mb-4 text-lg font-semibold sm:text-xl'>End Tournament by choosing a Winner</h2>

          {selectedWinner && !changeWinner && (
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-md flex items-center gap-2 font-medium'>
                <Trophy className='h-4 w-4 text-yellow-400' />
                Selected Winner: <span className='font-semibold text-yellow-500'>{winnerParticipant?.name}</span>
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
          )}

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
            <>
              <Table className='text-center'>
                <TableCaption>List of tournament participants</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-center'>#</TableHead>
                    <TableHead className='text-center'>Name</TableHead>
                    <TableHead className='text-center'>Email</TableHead>
                    <TableHead className='text-center'>Game ID</TableHead>
                    <TableHead className='text-center'>Game Username</TableHead>
                    <TableHead className='text-center'>Level</TableHead>
                    <TableHead className='text-center'>Joined At</TableHead>
                    {!tournament.isEnded && <TableHead className='text-center'>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParticipants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={tournament.isEnded ? 7 : 8} className='h-24 text-center'>
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
                        tournamentEnded={tournament.isEnded}
                      />
                    ))
                  )}
                </TableBody>
              </Table>

              {selectedWinner && !changeWinner && (
                <div className='mt-4 flex justify-center'>
                  <Button
                    className='bg-red-500 px-8 text-white hover:bg-red-600'
                    onClick={() => setShowEndConfirmation(true)}
                  >
                    End Tournament with Selected Winner
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className='rounded-lg border border-gray-700 bg-gray-800/30 p-6'>
          <h2 className='mb-4 text-lg font-semibold sm:text-xl'>Tournament Results</h2>
          <div className='mb-6 flex flex-col items-center justify-center p-6'>
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

          {/* Display participants for ended tournaments */}
          {isParticipantsLoading ? (
            <div className='flex min-h-[20vh] items-center justify-center p-5'>
              <div className='border-primary h-10 w-10 animate-spin rounded-full border-t-2 border-b-2'></div>
            </div>
          ) : (
            <>
              <h3 className='text-md mb-4 font-medium'>Tournament Participants</h3>
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

              <Table className='text-center'>
                <TableCaption>List of tournament participants</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-center'>#</TableHead>
                    <TableHead className='text-center'>Name</TableHead>
                    <TableHead className='text-center'>Email</TableHead>
                    <TableHead className='text-center'>Game ID</TableHead>
                    <TableHead className='text-center'>Game Username</TableHead>
                    <TableHead className='text-center'>Level</TableHead>
                    <TableHead className='text-center'>Joined At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParticipants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className='h-24 text-center'>
                        {searchQuery ? 'No participants match your search' : 'No participants found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredParticipants.map((participant, index) => {
                      return (
                        <ParticipantRow
                          key={participant.id}
                          participant={participant}
                          index={index}
                          onSelectWinner={handleSelectWinner}
                          tournamentEnded={tournament.isEnded}
                        />
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </div>
      )}

      <div className='mt-4 text-center text-sm text-gray-400'>
        {!tournament.isEnded ? (
          <p>Note: Make sure all participants are properly recorded before ending the tournament</p>
        ) : (
          <p>This tournament was completed on {format(new Date(tournament.updatedAt.toString()), 'MMMM d, yyyy')}</p>
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
  tournamentEnded,
}: {
  participant: ParticipantType;
  index: number;
  isWinner?: boolean;
  onSelectWinner: (id: number) => void;
  tournamentEnded: boolean;
}) {
  const { tournamentsId } = useParams({ from: '/admin/tournaments/end/$tournamentsId' });
  const queryClient = useQueryClient();
  const [killCount, setKillCount] = useState<string>(''); // Changed to string for better input handling
  const [showKillDialog, setShowKillDialog] = useState(false);
  const joinedDate = participant.joinedAt ? new Date(participant.joinedAt) : null;
  const formattedJoinedDate = joinedDate ? formatDateToUTC(joinedDate.toISOString()) : null;
  const formattedJoinedTime = joinedDate ? formatTimeToUTC(joinedDate.toISOString()) : null;

  const addKillsMutation = useMutation({
    mutationFn: (kills: number) => addUserKillAmount(tournamentsId, participant.userId, kills),
    onSuccess: (data) => {
      if (data.isAlert) {
        toast.error(data.message || data.error || 'Failed to add kills');
        return;
      }

      toast.success(`Kill count added for ${participant.name}`);
      setShowKillDialog(false);
      queryClient.invalidateQueries({ queryKey: ['tournamentParticipants', tournamentsId] });
    },
    onError: (error) => {
      toast.error(`Failed to add kills: ${(error as Error).message}`);
    },
  });

  const handleAddKills = () => {
    const kills = parseInt(killCount);
    if (!isNaN(kills) && kills >= 0) {
      addKillsMutation.mutate(kills);
    } else {
      toast.error('Kill count must be a valid positive number');
    }
  };

  // Reset kill count when dialog is opened
  const handleOpenKillDialog = () => {
    setKillCount('');
    setShowKillDialog(true);
  };

  return (
    <TableRow className={isWinner ? 'bg-green-950/30' : ''}>
      <TableCell className='text-center'>{index + 1}</TableCell>
      <TableCell className='text-center font-medium'>{participant.name}</TableCell>
      <TableCell className='text-center'>{participant.email}</TableCell>
      <TableCell className='text-center'>
        {participant.playerUserId || <span className='text-gray-500'>Not provided</span>}
      </TableCell>
      <TableCell className='text-center'>
        {participant.playerUsername || <span className='text-gray-500'>Not provided</span>}
      </TableCell>
      <TableCell className='text-center'>
        {participant.playerLevel ? (
          <span className='rounded-full bg-blue-900/30 px-2 py-1 text-blue-400'>Level {participant.playerLevel}</span>
        ) : (
          <span className='text-gray-500'>N/A</span>
        )}
      </TableCell>
      {participant.joinedAt && (
        <TableCell className='text-center'>
          {formattedJoinedDate} at {formattedJoinedTime}
        </TableCell>
      )}
      {!tournamentEnded && (
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

            <AlertDialog open={showKillDialog} onOpenChange={setShowKillDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  variant='default'
                  size='sm'
                  className='h-8 bg-blue-500 text-xs hover:bg-blue-600'
                  onClick={handleOpenKillDialog}
                >
                  <Crosshair className='mr-1 h-3 w-3' />
                  Add Kill Prizes
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className='dark'>
                <AlertDialogHeader>
                  <AlertDialogTitle className='text-white'>Record Kill Prizes</AlertDialogTitle>
                  <AlertDialogDescription>
                    Enter the number of kills achieved by
                    <span className='font-semibold text-yellow-500'>{' ' + participant.name}</span>. Kill prizes will be
                    calculated based on tournament settings.
                  </AlertDialogDescription>
                  <div className='mt-4 space-y-2'>
                    <label className='text-sm text-gray-300'>Kill Count:</label>
                    <Input
                      type='number'
                      // min='0'
                      value={killCount}
                      onChange={(e) => setKillCount(e.target.value)}
                      className='border-gray-700 bg-gray-800 text-white'
                      placeholder='Enter number of kills'
                    />
                  </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className='text-white/80'>Cancel</AlertDialogCancel>{' '}
                  <AlertDialogAction
                    onClick={handleAddKills}
                    className='bg-blue-500 hover:bg-blue-600'
                    disabled={addKillsMutation.isPending}
                  >
                    {addKillsMutation.isPending ? (
                      <div className='flex items-center gap-2'>
                        <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent'></div>
                        Recording...
                      </div>
                    ) : (
                      'Record Kill Prizes'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}
