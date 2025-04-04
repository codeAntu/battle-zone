import { getAdminTournamentsById } from '@/services/tournament';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { format } from 'date-fns';
import { CalendarIcon, Clock, DollarSign, ShieldAlert, Trophy, Users } from 'lucide-react';

export const Route = createFileRoute('/admin/tournaments/$tournamentsId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { tournamentsId } = useParams({ from: '/admin/tournaments/$tournamentsId' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['tournaments', tournamentsId],
    queryFn: () => getAdminTournamentsById(tournamentsId),
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
    return (
      <div className='p-5 text-center'>
        <ShieldAlert className='mx-auto mb-4 h-12 w-12 text-yellow-500' />
        <h2 className='text-xl font-bold'>Tournament Not Found</h2>
        <p className='text-gray-400'>The requested tournament could not be found</p>
      </div>
    );
  }

  const tournament = data.tournament;
  const scheduledDate = tournament.scheduledAt ? new Date(tournament.scheduledAt) : null;

  // Determine status based on isEnded property
  const tournamentStatus = tournament.isEnded ? 'COMPLETED' : 'ONGOING';

  return (
    <div className='mx-auto max-w-4xl p-5'>
      <div className='mb-8'>
        <div className='mb-2 flex items-center space-x-2'>
          <span className='rounded-full bg-blue-900 px-3 py-1 text-xs tracking-wider uppercase'>{tournament.game}</span>
          <span
            className={`rounded-full px-3 py-1 text-xs tracking-wider uppercase ${
              tournamentStatus === 'ONGOING' ? 'bg-green-800 text-green-300' : 'bg-gray-700 text-gray-300'
            }`}
          >
            {tournamentStatus}
          </span>
        </div>
        <h1 className='mb-2 text-3xl font-bold'>{tournament.name}</h1>
        {tournament.description && <p className='mb-4 text-gray-300'>{tournament.description}</p>}
      </div>

      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div className='rounded-lg bg-gray-950 p-5 shadow-sm'>
          <h2 className='mb-4 text-xl font-semibold'>Tournament Details</h2>

          <div className='space-y-4'>
            <div className='flex items-center'>
              <Users className='mr-3 h-5 w-5 text-blue-400' />
              <div>
                <div className='text-sm text-gray-400'>Participants</div>
                <div>
                  {tournament.maxParticipants || 0} / {tournament.maxParticipants}
                </div>
              </div>
            </div>

            {scheduledDate && (
              <>
                <div className='flex items-center'>
                  <CalendarIcon className='mr-3 h-5 w-5 text-green-400' />
                  <div>
                    <div className='text-sm text-gray-400'>Date</div>
                    <div>{format(scheduledDate, 'MMMM d, yyyy')}</div>
                  </div>
                </div>

                <div className='flex items-center'>
                  <Clock className='mr-3 h-5 w-5 text-purple-400' />
                  <div>
                    <div className='text-sm text-gray-400'>Time</div>
                    <div>{format(scheduledDate, 'h:mm a')}</div>
                  </div>
                </div>
              </>
            )}

            {tournament.roomId && (
              <div className='flex items-center'>
                <div className='mr-3 flex h-5 w-5 items-center justify-center font-bold text-yellow-400'>#</div>
                <div>
                  <div className='text-sm text-gray-400'>Room ID</div>
                  <div>{tournament.roomId}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='rounded-lg bg-gray-950 p-5 shadow-sm'>
          <h2 className='mb-4 text-xl font-semibold'>Prize & Fee Details</h2>

          <div className='space-y-4'>
            <div className='flex items-center'>
              <DollarSign className='mr-3 h-5 w-5 text-green-400' />
              <div>
                <div className='text-sm text-gray-400'>Entry Fee</div>
                <div>{tournament.entryFee || 0} coins</div>
              </div>
            </div>

            <div className='flex items-center'>
              <Trophy className='mr-3 h-5 w-5 text-yellow-400' />
              <div>
                <div className='text-sm text-gray-400'>Total Prize Pool</div>
                <div>{tournament.prize || 0} coins</div>
              </div>
            </div>

            <div className='flex items-center'>
              <div className='mr-3 flex h-5 w-5 items-center justify-center font-bold text-red-400'>K</div>
              <div>
                <div className='text-sm text-gray-400'>Per Kill Prize</div>
                <div>{tournament.perKillPrize || 0} coins</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='rounded-lg bg-gray-950 p-5 shadow-sm'>
        <h2 className='mb-4 text-xl font-semibold'>Tournament Management</h2>
        <div className='space-y-4'>
          <div className='flex flex-wrap gap-3'>
            <button className='rounded-md bg-blue-700 px-4 py-2 text-white transition-colors hover:bg-blue-600'>
              Edit Tournament
            </button>
            <button className='rounded-md bg-green-700 px-4 py-2 text-white transition-colors hover:bg-green-600'>
              View Participants
            </button>
            {!tournament.isEnded && (
              <button className='rounded-md bg-yellow-700 px-4 py-2 text-white transition-colors hover:bg-yellow-600'>
                End Tournament
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
