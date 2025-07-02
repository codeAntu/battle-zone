import { deleteTournament, getAdminTournamentsById, updateTournament } from '@/api/tournament';
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
import { formatDateToUTC, formatTimeToUTC } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useParams, useRouter } from '@tanstack/react-router';
import {
  CalendarIcon,
  Clock,
  Copy,
  Crown,
  DollarSign,
  Eye,
  Gamepad2,
  PencilIcon,
  Settings,
  Share2,
  ShieldAlert,
  Trash2,
  Trophy,
  Users,
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
  console.log(data);

  if (isLoading) {
    return (
      <div className='mx-auto max-w-4xl p-3 sm:p-5'>
        <div className='space-y-6'>
          {/* Header skeleton */}
          <div className='space-y-4'>
            <div className='flex gap-2'>
              <div className='bg-muted h-6 w-16 animate-pulse rounded-full'></div>
              <div className='bg-muted h-6 w-20 animate-pulse rounded-full'></div>
            </div>
            <div className='bg-muted h-32 w-full animate-pulse rounded-lg'></div>
            <div className='bg-muted h-8 w-64 animate-pulse rounded'></div>
            <div className='bg-muted h-4 w-96 animate-pulse rounded'></div>
          </div>

          {/* Room details skeleton */}
          <div className='bg-card rounded-lg border p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <div className='bg-muted h-6 w-24 animate-pulse rounded'></div>
              <div className='bg-muted h-9 w-16 animate-pulse rounded'></div>
            </div>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-2'>
                  <div className='bg-muted h-4 w-16 animate-pulse rounded'></div>
                  <div className='bg-muted h-5 w-32 animate-pulse rounded'></div>
                </div>
                <div className='bg-muted h-8 w-8 animate-pulse rounded'></div>
              </div>
              <div className='flex items-center justify-between'>
                <div className='space-y-2'>
                  <div className='bg-muted h-4 w-24 animate-pulse rounded'></div>
                  <div className='bg-muted h-5 w-28 animate-pulse rounded'></div>
                </div>
                <div className='bg-muted h-8 w-8 animate-pulse rounded'></div>
              </div>
            </div>
          </div>

          {/* Details grid skeleton */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='bg-card rounded-lg border p-6'>
              <div className='bg-muted mb-4 h-6 w-40 animate-pulse rounded'></div>
              <div className='space-y-4'>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className='flex items-center gap-3'>
                    <div className='bg-muted h-5 w-5 animate-pulse rounded'></div>
                    <div className='space-y-1'>
                      <div className='bg-muted h-3 w-20 animate-pulse rounded'></div>
                      <div className='bg-muted h-4 w-16 animate-pulse rounded'></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='bg-card rounded-lg border p-6'>
              <div className='bg-muted mb-4 h-6 w-36 animate-pulse rounded'></div>
              <div className='space-y-4'>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className='flex items-center gap-3'>
                    <div className='bg-muted h-5 w-5 animate-pulse rounded'></div>
                    <div className='space-y-1'>
                      <div className='bg-muted h-3 w-20 animate-pulse rounded'></div>
                      <div className='bg-muted h-4 w-24 animate-pulse rounded'></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Management section skeleton */}
          <div className='bg-card rounded-lg border p-6'>
            <div className='bg-muted mb-4 h-6 w-48 animate-pulse rounded'></div>
            <div className='flex gap-3'>
              <div className='bg-muted h-10 w-32 animate-pulse rounded'></div>
              <div className='bg-muted h-10 w-36 animate-pulse rounded'></div>
              <div className='bg-muted h-10 w-40 animate-pulse rounded'></div>
            </div>
          </div>
        </div>
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

  if (!data?.data?.tournament) {
    return <TournamentNotFound />;
  }

  const tournament = data.data.tournament;
  const scheduledDate = tournament.scheduledAt ? new Date(tournament.scheduledAt) : null;
  const formattedDate = scheduledDate ? formatDateToUTC(scheduledDate.toISOString()) : null;
  const formattedTime = scheduledDate ? formatTimeToUTC(scheduledDate.toISOString()) : null;
  const tournamentStatus = tournament.isEnded ? 'COMPLETED' : 'ONGOING';
  console.log(formattedDate);
  console.log(formattedTime);
  return (
    <div className='min-h-screen bg-black'>
      <div className='mx-auto max-w-7xl p-4 sm:p-6 lg:p-8'>
        {/* Enhanced Header Section */}
        <div className='mb-8'>
          <div className='mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <div className='flex flex-col gap-3'>
              <div className='flex flex-wrap items-center gap-3'>
                <div className='flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1.5 text-sm font-semibold text-white shadow-lg'>
                  <Gamepad2 className='h-4 w-4' />
                  {tournament.game}
                </div>
                <div
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold shadow-lg ${
                    tournamentStatus === 'ONGOING'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                      : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                  }`}
                >
                  {tournamentStatus === 'ONGOING' ? <Crown className='h-4 w-4' /> : <Trophy className='h-4 w-4' />}
                  {tournamentStatus}
                </div>
              </div>
              <div>
                <h1 className='text-2xl font-bold text-white lg:text-4xl'>{tournament.name}</h1>
                {tournament.description && (
                  <p className='max-w-3xl text-sm text-gray-300 sm:text-lg'>{tournament.description}</p>
                )}
              </div>
            </div>

            <div className='flex gap-3'>
              <Button
                variant='outline'
                className='border-gray-600 bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white'
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Tournament link copied!');
                }}
              >
                <Share2 className='mr-1 h-3 w-3' />
                Share
              </Button>
              <Button
                className='bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700'
                onClick={() => {
                  router.navigate({
                    to: '/admin/tournaments/end/$tournamentsId',
                    params: { tournamentsId: tournamentsId },
                  });
                }}
              >
                <Eye className='mr-1 h-3 w-3' />
                View Participants
              </Button>
            </div>
          </div>

          {/* Tournament Image */}
          {tournament.image && (
            <div className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-1 shadow-2xl'>
              <div className='relative overflow-hidden rounded-xl bg-black'>
                <img
                  src={tournament.image}
                  alt={`${tournament.name} banner`}
                  className='h-64 w-full object-cover lg:h-80'
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/800x400?text=Tournament';
                    e.currentTarget.onerror = null;
                  }}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
              </div>
            </div>
          )}
        </div>{' '}
        {/* Enhanced Stats Grid */}
        <div className='mb-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4'>
          <div className='group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/50 to-blue-800/30 p-4 backdrop-blur-sm transition-all hover:from-blue-800/60 hover:to-blue-700/40 sm:p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-medium text-blue-300 sm:text-sm'>Participants</p>
                <p className='text-lg font-bold text-white sm:text-2xl'>
                  {tournament.currentParticipants || 0} / {tournament.maxParticipants}
                </p>
              </div>
              <Users className='h-6 w-6 text-blue-400 sm:h-8 sm:w-8' />
            </div>
            <div className='mt-3 h-2 overflow-hidden rounded-full bg-blue-900/50 sm:mt-4'>
              <div
                className='h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500'
                style={{
                  width: `${((tournament.currentParticipants || 0) / tournament.maxParticipants) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className='group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-900/50 to-green-800/30 p-4 backdrop-blur-sm transition-all hover:from-green-800/60 hover:to-green-700/40 sm:p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-medium text-green-300 sm:text-sm'>Prize Pool</p>
                <p className='text-lg font-bold text-white sm:text-2xl'>{tournament.prize || 0} coins</p>
              </div>
              <Trophy className='h-6 w-6 text-green-400 sm:h-8 sm:w-8' />
            </div>
          </div>

          <div className='group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 p-4 backdrop-blur-sm transition-all hover:from-yellow-800/60 hover:to-yellow-700/40 sm:p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-medium text-yellow-300 sm:text-sm'>Entry Fee</p>
                <p className='text-lg font-bold text-white sm:text-2xl'>{tournament.entryFee || 0} coins</p>
              </div>
              <DollarSign className='h-6 w-6 text-yellow-400 sm:h-8 sm:w-8' />
            </div>
          </div>

          <div className='group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/50 to-purple-800/30 p-4 backdrop-blur-sm transition-all hover:from-purple-800/60 hover:to-purple-700/40 sm:p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-medium text-purple-300 sm:text-sm'>Per Kill</p>
                <p className='text-lg font-bold text-white sm:text-2xl'>{tournament.perKillPrize || 0} coins</p>
              </div>
              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-purple-400 text-xs font-bold text-purple-900 sm:h-8 sm:w-8 sm:text-sm'>
                K
              </div>
            </div>
          </div>
        </div>
        {/* Enhanced Content Grid */}
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Room Details Card */}
          <div className='lg:col-span-2'>
            <div className='overflow-hidden rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900/70 to-gray-800/70 backdrop-blur-sm'>
              <div className='border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-700/50 p-3 md:p-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Settings className='w-5 text-yellow-400 md:w-6' />
                    <h2 className='font-semibold text-white md:text-lg'>Room Configuration</h2>
                  </div>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size='sm'
                        className='bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700'
                      >
                        <PencilIcon className='mr-0.5 w-3' />
                        {tournament.roomId ? 'Edit' : 'Add'} Room
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='dark border-gray-700 bg-gray-900'>
                      <DialogHeader>
                        <DialogTitle className='text-white'>
                          {tournament.roomId ? 'Update Room Configuration' : 'Add Room Configuration'}
                        </DialogTitle>
                        <DialogDescription className='text-gray-400'>
                          Configure the room settings for this tournament.
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
                            <label htmlFor='roomId' className='mb-2 block text-sm font-medium text-white'>
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
                              className='border-gray-600 bg-gray-800 text-white placeholder:text-gray-400'
                            />
                          </div>

                          <div>
                            <label htmlFor='roomPassword' className='mb-2 block text-sm font-medium text-white'>
                              Room Password
                            </label>
                            <Input
                              type='text'
                              id='roomPassword'
                              name='roomPassword'
                              defaultValue={tournament.roomPassword || ''}
                              placeholder='Enter Room Password'
                              className='border-gray-600 bg-gray-800 text-white placeholder:text-gray-400'
                            />
                          </div>

                          <Button
                            type='submit'
                            className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                            disabled={isUpdating}
                          >
                            {isUpdating ? (
                              <div className='flex items-center gap-2'>
                                <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent'></div>
                                Updating...
                              </div>
                            ) : (
                              'Update Room Configuration'
                            )}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className='p-3 md:p-6'>
                <div className='space-y-3 md:space-y-6'>
                  <div className='flex items-center justify-between rounded-xl bg-gray-800/50 p-2 px-3 transition-all hover:bg-gray-800/70 md:p-4 md:px-4'>
                    <div className='flex items-center gap-2.5 md:gap-4'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400 md:h-12 md:w-12'>
                        #
                      </div>
                      <div>
                        <div className='text-xs font-medium text-gray-400 md:text-sm'>Room ID</div>
                        <div className='text-base font-semibold text-white md:text-lg'>
                          {tournament.roomId || 'Not configured yet'}
                        </div>
                      </div>
                    </div>
                    {tournament.roomId && (
                      <Button
                        size='sm'
                        variant='outline'
                        className='border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10'
                        onClick={() => {
                          navigator.clipboard.writeText(String(tournament.roomId || ''));
                          toast.success('Room ID copied to clipboard');
                        }}
                      >
                        <Copy className='h-4 w-4' />
                      </Button>
                    )}
                  </div>

                  <div className='flex items-center justify-between rounded-xl bg-gray-800/50 p-2 px-3 transition-all hover:bg-gray-800/70 md:p-4'>
                    <div className='flex items-center gap-4'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 md:h-12 md:w-12'>
                        🔑
                      </div>
                      <div>
                        <div className='text-xs font-medium text-gray-400 md:text-sm'>Room Password</div>
                        <div className='text-base font-semibold text-white md:text-lg'>
                          {tournament.roomPassword || 'Not set'}
                        </div>
                      </div>
                    </div>
                    {tournament.roomPassword && (
                      <Button
                        size='sm'
                        variant='outline'
                        className='border-purple-500/50 text-purple-400 hover:bg-purple-500/10'
                        onClick={() => {
                          navigator.clipboard.writeText(String(tournament.roomPassword || ''));
                          toast.success('Room Password copied to clipboard');
                        }}
                      >
                        <Copy className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tournament Info Sidebar */}
          <div className='space-y-6'>
            {/* Schedule Card */}
            <div className='overflow-hidden rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900/70 to-gray-800/70 p-6 backdrop-blur-sm'>
              <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold text-white'>
                <CalendarIcon className='h-5 w-5 text-green-400' />
                Schedule
              </h3>
              <div className='space-y-4'>
                {formattedDate && (
                  <div className='flex items-center gap-3'>
                    <CalendarIcon className='h-5 w-5 text-green-400' />
                    <div>
                      <div className='text-sm text-gray-400'>Date</div>
                      <div className='font-medium text-white'>{formattedDate}</div>
                    </div>
                  </div>
                )}
                {formattedTime && (
                  <div className='flex items-center gap-3'>
                    <Clock className='h-5 w-5 text-blue-400' />
                    <div>
                      <div className='text-sm text-gray-400'>Time</div>
                      <div className='font-medium text-white'>{formattedTime}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Management Actions */}
            <div className='overflow-hidden rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 backdrop-blur-sm'>
              <h3 className='mb-4 flex items-center gap-2 text-base font-semibold text-white md:text-lg'>
                <Settings className='h-5 w-5 text-gray-400' />
                Tournament Management
              </h3>
              <div className='space-y-3'>
                {!tournament.isEnded && (
                  <Button
                    className='w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700'
                    onClick={() => {
                      router.navigate({
                        to: '/admin/tournaments/end/$tournamentsId',
                        params: { tournamentsId: tournamentsId },
                      });
                    }}
                  >
                    <Trophy className='mr-2 h-4 w-4' />
                    End Tournament
                  </Button>
                )}

                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant='outline'
                      className='w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300'
                    >
                      <Trash2 className='mr-2 h-4 w-4' />
                      Delete Tournament
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='dark border-gray-700 bg-gray-900'>
                    <DialogHeader>
                      <DialogTitle className='text-white'>Confirm Tournament Deletion</DialogTitle>
                      <DialogDescription className='text-gray-400'>
                        This action cannot be undone. This will permanently delete the tournament and all associated
                        data.
                      </DialogDescription>
                    </DialogHeader>

                    {tournament.currentParticipants > 0 && (
                      <div className='rounded-lg border border-amber-600 bg-amber-900/20 p-4'>
                        <p className='text-sm font-medium text-amber-400'>
                          ⚠️ Warning: This tournament has {tournament.currentParticipants} participant(s). Tournaments
                          with registered participants cannot be deleted.
                        </p>
                      </div>
                    )}

                    <DialogFooter className='gap-2'>
                      <Button
                        variant='outline'
                        onClick={() => setDeleteDialogOpen(false)}
                        disabled={isDeleting}
                        className='border-gray-600 text-gray-300 hover:bg-gray-800'
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => deleteTournamentMutation()}
                        disabled={isDeleting || tournament.currentParticipants > 0}
                        className={`bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 ${
                          tournament.currentParticipants > 0 ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                      >
                        {isDeleting ? (
                          <div className='flex items-center gap-2'>
                            <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent'></div>
                            Deleting...
                          </div>
                        ) : (
                          <>
                            <Trash2 className='mr-2 h-4 w-4' />
                            Delete Tournament
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
