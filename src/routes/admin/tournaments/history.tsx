import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDateToUTC, formatTimeToUTC } from '@/lib/utils';
import { getUserTournamentHistory } from '@/services/tournament';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/tournaments/history')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userTournamentHistory'],
    queryFn: getUserTournamentHistory,
  });

  const router = useRouter();

  console.log('User Tournament History:', data);

  if (isLoading) {
    return (
      <div className='flex min-h-[40vh] items-center justify-center p-3'>
        <div className='border-primary h-8 w-8 animate-spin rounded-full border-t-2 border-b-2'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-4 text-center'>
        <p className='text-red-500'>Failed to load tournament history</p>
      </div>
    );
  }

  const tournaments = data?.tournaments || [];

  if (tournaments.length === 0) {
    return <div className='flex justify-center p-8'>No tournament history found.</div>;
  }

  return (
    <div className='mx-auto max-w-7xl p-4'>
      <p className='mb-6 text-center text-2xl font-bold'>Tournament History</p>

      <Table className='text-center'>
        <TableCaption>A list of your completed tournaments</TableCaption>
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
            <TableHead className='text-center'>Ended At</TableHead>
            <TableHead className='text-center'>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tournaments.map((tournament, index) => {
            const gameImage = "/games/" + tournament.game.toUpperCase() + "/icon.png";
            const formattedDate = tournament.scheduledAt ? formatDateToUTC(tournament.scheduledAt) : null;
            const formattedTime = tournament.scheduledAt ? formatTimeToUTC(tournament.scheduledAt) : null;
            const updatedDate = formatDateToUTC(tournament.updatedAt);
            const updatedTime = formatTimeToUTC(tournament.updatedAt);

            return (
              <TableRow key={tournament.id}>
                <TableCell className='text-center font-medium'>{index + 1}</TableCell>
                <TableCell className='font-medium'>{tournament.name}</TableCell>
                <TableCell className='text-center'>
                  <div className='flex items-center justify-center gap-2'>
                    <img
                      src={gameImage}
                      alt={tournament.game}
                      className='h-8 w-8 rounded-lg object-cover'
                    />
                    <span>{tournament.game}</span>
                  </div>
                </TableCell>
                <TableCell className='text-center'>${tournament.entryFee}</TableCell>
                <TableCell className='text-center'>${tournament.prize}</TableCell>
                <TableCell className='text-center'>${tournament.perKillPrize}</TableCell>
                <TableCell className='text-center'>
                  {tournament.currentParticipants}/{tournament.maxParticipants}
                </TableCell>
                <TableCell className='text-center'>
                  {formattedDate} {formattedTime}
                </TableCell>
                <TableCell className='text-center'>
                  {updatedDate} {updatedTime}
                </TableCell>
                <TableCell className='text-center'>
                  <div className='flex justify-center'>
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
