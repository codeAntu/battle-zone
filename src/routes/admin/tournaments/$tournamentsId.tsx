import TournamentNotFound from '@/components/TournamentNotFound';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { deleteTournament, getAdminTournamentsById, updateTournament } from '@/services/tournament';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useParams, useRouter } from '@tanstack/react-router';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Clock,
  Copy,
  DollarSign,
  PencilIcon,
  ShieldAlert,
  Trash2,
  Trophy,
  Users
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/admin/tournaments/$tournamentsId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { tournamentsId } = useParams({ from: '/admin/tournaments/$tournamentsId' });
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['tournaments', tournamentsId],
    queryFn: () => getAdminTournamentsById(tournamentsId),
  });

  const { mutate: updateTournamentMutation, isPending: isUpdating } = useMutation({
    mutationKey: ['tournaments', tournamentsId],
    mutationFn: (data: { roomId: string; roomPassword: string }) => {
      return updateTournament(tournamentsId, data.roomId, data.roomPassword);
    },
    onSuccess: (data) => {
      if (data.isAlert) {
        toast.error('Room ID or Password already exists');
        return;
      }

      toast.success('Tournament updated successfully');
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['tournaments', tournamentsId] });
    },
  });

  const { mutate: deleteTournamentMutation, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteTournament(tournamentsId),
    onSuccess: (data) => {
      console.log(data);

      if (data.isAlert) {
        toast.error(data.error || data.message || 'Failed to delete tournament');
        return;
      }

      toast.success('Tournament deleted successfully');
      setDeleteDialogOpen(false);
      router.navigate({ to: '/admin/tournaments' });
    },
    onError: (error) => {
      toast.error((error as Error).message || 'Failed to delete tournament');
    },
  });

  if (isLoading) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center p-5'>
        <div className='border-primary h-12 w-12 animate-spin rounded-full border-t-2 border-b-2'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-5 text-center'>
        <ShieldAlert className='mx-auto mb-4 h-12 w-12 text-red-500' />
        <h2 className='text-xl font-bold'>Error Loading Tournament</h2>
        <p className='text-gray-400'>{(error as Error).message || 'Failed to load tournament details'}</p>
      </div>
    );
  }

  if (!data?.tournament) {
    return <TournamentNotFound />;
  }

  const tournament = data.tournament;
  const scheduledDate = tournament.scheduledAt ? new Date(tournament.scheduledAt) : null;
  const tournamentStatus = tournament.isEnded ? 'COMPLETED' : 'ONGOING';

  return (
    <div className='mx-auto max-w-4xl p-3 sm:p-5'>
      <div className='mb-4 sm:mb-8'>
        <div className='mb-2 flex items-center space-x-2'>
          <span className='rounded-full bg-blue-500 px-4 py-0.5 text-sm tracking-wider uppercase'>
            {tournament.game}
          </span>
          <span
            className={`rounded-full px-4 py-0.5 text-sm tracking-wider uppercase ${
              tournamentStatus === 'ONGOING' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
            }`}
          >
            {tournamentStatus}
          </span>
        </div>
        <h1 className='mb-1 text-2xl font-bold sm:mb-2 sm:text-3xl'>{tournament.name}</h1>
        {tournament.description && (
          <p className='mb-2 text-base text-gray-300 sm:mb-4 sm:text-base'>{tournament.description}</p>
        )}
      </div>
      <div className='mb-4 rounded-lg bg-gray-950 p-3 shadow-sm sm:mb-8 sm:p-5'>
        <div className='flex items-start justify-between'>
          <h2 className='mb-2 text-xl font-semibold sm:mb-4 sm:text-xl'>Room Id</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Button className='h-9 border px-3 text-sm sm:h-auto sm:px-3'>
                <PencilIcon className='mr-1 h-4 w-4 sm:mr-2 sm:h-4 sm:w-4' />
                {tournament.roomId ? <span>Edit</span> : <span>Add</span>}
              </Button>
            </DialogTrigger>
            <DialogContent className='dark bg-gray-950'>
              <DialogHeader>
                <DialogTitle>{tournament.roomId ? 'Update Room ID' : 'Add Room ID'}</DialogTitle>
                <DialogDescription>
                  Enter the {tournament.roomId ? 'new' : ''} Room ID and Password for the tournament.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newRoomId = formData.get('roomId') as string;
                  const newRoomPassword = formData.get('roomPassword') as string;
                  updateTournamentMutation({ roomId: newRoomId, roomPassword: newRoomPassword });
                }}
              >
                <div className='space-y-4'>
                  <div>
                    <label htmlFor='roomId' className='mb-2 block text-sm font-medium'>
                      Room ID
                    </label>
                    <Input
                      type='text'
                      id='roomId'
                      name='roomId'
                      defaultValue={tournament.roomId || ''}
                      placeholder='Enter Room ID'
                      pattern='[0-9]*'
                      inputMode='numeric'
                      required
                      className='text-white'
                    />
                  </div>

                  <div>
                    <label htmlFor='roomPassword' className='mb-2 block text-sm font-medium'>
                      Room Password
                    </label>
                    <Input
                      type='text'
                      id='roomPassword'
                      name='roomPassword'
                      defaultValue={tournament.roomPassword || ''}
                      placeholder='Enter Room Password'
                      className='text-white'
                    />
                  </div>

                  <Button type='submit' className='w-full' disabled={isUpdating}>
                    {isUpdating ? 'Updating...' : 'Update Room Details'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className='space-y-3 sm:space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <div className='mr-2 flex h-5 w-5 items-center justify-center font-bold text-yellow-400 sm:mr-3'>#</div>
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
              </Button>
            )}
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <div className='mr-2 flex h-5 w-5 items-center justify-center font-bold text-yellow-400 sm:mr-3'>🔑</div>
              <div>
                <div className='text-sm text-gray-400 sm:text-base'>Room Password</div>
                <div className='text-base sm:text-lg'>{tournament.roomPassword || 'No password set'}</div>
              </div>
            </div>
            {tournament.roomPassword && (
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(String(tournament.roomPassword || ''));
                  toast.success('Room Password copied to clipboard');
                }}
                className='h-8 w-8 border border-yellow-500 bg-transparent px-0 text-yellow-500 hover:bg-yellow-500 hover:text-white sm:h-9 sm:w-auto sm:px-3'
              >
                <Copy className='size-4' />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className='mb-4 grid grid-cols-1 gap-3 sm:mb-8 sm:gap-6 md:grid-cols-2'>
        <div className='rounded-lg bg-gray-950 p-3 shadow-sm sm:p-5'>
          <h2 className='mb-2 text-xl font-semibold sm:mb-4'>Tournament Details</h2>

          <div className='space-y-3 sm:space-y-4'>
            <div className='flex items-center'>
              <Users className='mr-2 h-5 w-5 text-blue-400 sm:mr-3' />
              <div>
                <div className='text-sm text-gray-400 sm:text-base'>Participants</div>
                <div className='text-base sm:text-lg'>
                  {tournament.currentParticipants || 0} / {tournament.maxParticipants}
                </div>
              </div>
            </div>

            {scheduledDate && (
              <>
                <div className='flex items-center'>
                  <CalendarIcon className='mr-2 h-5 w-5 text-green-400 sm:mr-3' />
                  <div>
                    <div className='text-sm text-gray-400 sm:text-base'>Date</div>
                    <div className='text-base sm:text-lg'>{format(scheduledDate, 'MMMM d, yyyy')}</div>
                  </div>
                </div>

                <div className='flex items-center'>
                  <Clock className='mr-2 h-5 w-5 text-purple-400 sm:mr-3' />
                  <div>
                    <div className='text-sm text-gray-400 sm:text-base'>Time</div>
                    <div className='text-base sm:text-lg'>{format(scheduledDate, 'h:mm a')}</div>
                  </div>
                </div>
              </>
            )}

            {tournament.roomId && (
              <div className='flex items-center'>
                <div className='mr-2 flex h-5 w-5 items-center justify-center font-bold text-yellow-400 sm:mr-3'>#</div>
                <div>
                  <div className='text-sm text-gray-400 sm:text-base'>Room ID</div>
                  <div className='text-base sm:text-lg'>{tournament.roomId}</div>
                </div>
              </div>
            )}

            {tournament.roomPassword && (
              <div className='flex items-center'>
                <div className='mr-2 flex h-5 w-5 items-center justify-center font-bold text-yellow-400 sm:mr-3'>
                  🔑
                </div>
                <div>
                  <div className='text-sm text-gray-400 sm:text-base'>Room Password</div>
                  <div className='text-base sm:text-lg'>{tournament.roomPassword}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='rounded-lg bg-gray-950 p-3 shadow-sm sm:p-5'>
          <h2 className='mb-2 text-xl font-semibold sm:mb-4'>Prize & Fee Details</h2>

          <div className='space-y-3 sm:space-y-4'>
            <div className='flex items-center'>
              <DollarSign className='mr-2 h-5 w-5 text-green-400 sm:mr-3' />
              <div>
                <div className='text-sm text-gray-400 sm:text-base'>Entry Fee</div>
                <div className='text-base sm:text-lg'>{tournament.entryFee || 0} coins</div>
              </div>
            </div>

            <div className='flex items-center'>
              <Trophy className='mr-2 h-5 w-5 text-yellow-400 sm:mr-3' />
              <div>
                <div className='text-sm text-gray-400 sm:text-base'>Total Prize Pool</div>
                <div className='text-base sm:text-lg'>{tournament.prize || 0} coins</div>
              </div>
            </div>

            <div className='flex items-center'>
              <div className='mr-2 flex h-5 w-5 items-center justify-center font-bold text-red-400 sm:mr-3'>K</div>
              <div>
                <div className='text-sm text-gray-400 sm:text-base'>Per Kill Prize</div>
                <div className='text-base sm:text-lg'>{tournament.perKillPrize || 0} coins</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='rounded-lg bg-gray-950 p-3 shadow-sm sm:p-5'>
        <h2 className='mb-2 text-xl font-semibold sm:mb-4'>Tournament Management</h2>
        <div className='space-y-3 sm:space-y-4'>
          <div className='flex flex-wrap gap-2 sm:gap-3'>
            {!tournament.isEnded && (
              <Button
                className='bg-yellow-500 text-white hover:bg-yellow-400'
                onClick={() => {
                  router.navigate({
                    to: '/admin/tournaments/end/$tournamentsId',
                    params: { tournamentsId: tournamentsId },
                  });
                }}
              >
                End Tournament
              </Button>
            )}
            <Button
              className='bg-green-500 text-white hover:bg-green-400'
              onClick={() => {
                router.navigate({
                  to: '/admin/tournaments/end/$tournamentsId',
                  params: { tournamentsId: tournamentsId },
                });
              }}
            >
              View Participants
            </Button>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button className='bg-red-500 text-white hover:bg-red-600'>
                  <Trash2 className='mr-1 h-4 w-4' />
                  Delete Tournament
                </Button>
              </DialogTrigger>
              <DialogContent className='dark bg-gray-950'>
                <DialogHeader>
                  <DialogTitle>Confirm Tournament Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this tournament? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>

                {tournament.currentParticipants > 0 && (
                  <div className='mt-2 rounded border border-amber-700 bg-amber-900/20 p-3'>
                    <p className='text-sm font-medium text-amber-400'>
                      Warning: This tournament has {tournament.currentParticipants} participant(s). Tournaments with
                      registered participants cannot be deleted.
                    </p>
                  </div>
                )}

                <DialogFooter className='mt-4'>
                  <Button
                    variant='outline'
                    onClick={() => setDeleteDialogOpen(false)}
                    disabled={isDeleting}
                    className='text-white'
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => deleteTournamentMutation()}
                    disabled={isDeleting || tournament.currentParticipants > 0}
                    className={`bg-red-500 text-white hover:bg-red-600 ${
                      tournament.currentParticipants > 0 ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Tournament'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
