import { getAdminCurrentTournaments } from '@/api/tournament';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDateToUTC, formatTimeToUTC } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/tournaments/current')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['adminCurrentTournaments'],
    queryFn: getAdminCurrentTournaments,
  });

  const router = useRouter();

  console.log('Admin Current Tournaments:', data?.data.tournaments);

  if (isLoading) {
    return <div className='flex justify-center p-8'>Loading tournaments...</div>;
  }

  if (!data?.data.tournaments || data.data.tournaments.length === 0) {
    return <div className='flex justify-center p-8'>No current tournaments found.</div>;
  }

  return (
    <div className='mx-auto max-w-7xl p-4'>
      <p className='mb-6 text-center text-2xl font-bold'>Current Tournaments</p>

      <Table className='text-center'>
        <TableCaption>A list of your active tournaments</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='text-center'>#</TableHead>
            <TableHead className='text-center'>Name</TableHead>
            <TableHead className='text-center'>Game</TableHead>
            <TableHead className='text-center'>Entry Fee</TableHead>
            <TableHead className='text-center'>Prize</TableHead>
            <TableHead className='text-center'>Per Kill Prize</TableHead>
            <TableHead className='text-center'>Participants</TableHead>
            <TableHead className='text-center'>Scheduled At</TableHead>
            <TableHead className='text-center'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.tournaments.map((tournament, index) => {
            const formattedDate = formatDateToUTC(tournament.scheduledAt);
            const formattedTime = formatTimeToUTC(tournament.scheduledAt);

            return (
              <TableRow key={tournament.id}>
                <TableCell className='text-center font-medium'>{index + 1}</TableCell>
                <TableCell className='font-medium'>{tournament.name}</TableCell>

                <TableCell className='text-center'>
                  <div className='flex items-center justify-center gap-2'>
                    {(() => {
                      const gameImage = '/games/' + tournament.game.toUpperCase() + '/icon.png';
                      return (
                        <>
                          <img src={gameImage} alt={tournament.game} className='h-8 w-8 rounded-lg object-cover' />
                          <span>{tournament.game}</span>
                        </>
                      );
                    })()}
                  </div>
                </TableCell>
                <TableCell className='text-center'>${tournament.entryFee}</TableCell>
                <TableCell className='text-center'>${tournament.prize}</TableCell>
                <TableCell className='text-center'>${tournament.perKillPrize}</TableCell>
                <TableCell className='text-center'>
                  {tournament.currentParticipants} / {tournament.maxParticipants}
                </TableCell>
                <TableCell className='text-center'>
                  {formattedDate} {formattedTime}
                </TableCell>
                <TableCell className='text-center'>
                  <div className='flex justify-center gap-2'>
                    <button
                      className='rounded-md border border-blue-500 px-3 py-1 text-xs font-semibold text-blue-500 hover:bg-blue-500 hover:text-white'
                      onClick={() => {
                        router.navigate({
                          to: '/admin/tournaments/$tournamentsId',
                          params: { tournamentsId: tournament.id.toString() },
                        });
                      }}
                    >
                      View
                    </button>
                    <button
                      className='border-primary text-primary hover:bg-primary rounded-md border px-3 py-1 text-xs font-semibold hover:text-black'
                      onClick={() => {
                        router.navigate({
                          to: '/admin/tournaments/end/$tournamentsId',
                          params: { tournamentsId: tournament.id.toString() },
                        });
                      }}
                    >
                      End Tournament
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
