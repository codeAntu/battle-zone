import { createFileRoute } from '@tanstack/react-router';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { getAdminTournamentHistory } from '@/services/tournament';
export const Route = createFileRoute('/admin/tournaments/history')({
  component: RouteComponent,
});
function RouteComponent() {
  const { data } = useQuery({
    queryKey: ['adminTournamentHistory'],
    queryFn: getAdminTournamentHistory,
  });

  console.log('Admin Tournament History:', data);

  const finishedGames = [
    {
      id: 1,
      game: 'PUBG Mobile',
      image: 'https://www.financialexpress.com/wp-content/uploads/2025/03/PUBG-MOBILE1.jpg',
      price: '$1000',
      fate: 'Completed',
      perKillPrice: '$5',
      hasScreenshots: true,
    },
    {
      id: 2,
      game: 'Call of Duty Mobile',
      image: 'https://example.com/cod-mobile.jpg',
      price: '$750',
      fate: 'Completed',
      perKillPrice: '$3',
      hasScreenshots: true,
    },
  ];

  return (
    <div className='mx-auto max-w-5xl p-4'>
      <p className='mb-6 text-center text-2xl font-bold'>Finished Tournaments</p>

      <Table className='text-center'>
        <TableCaption>A list of your finished tournaments</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='text-center'>#</TableHead>
            <TableHead className='text-center'>Game</TableHead>
            <TableHead className='text-center'>Price</TableHead>
            <TableHead className='text-center'>Fate</TableHead>
            <TableHead className='text-center'>Per Kill Price</TableHead>
            <TableHead className='text-center'>Winner Screenshots</TableHead>
            <TableHead className='text-center'>Select Winner</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {finishedGames.map((game, index) => (
            <TableRow key={game.id}>
              <TableCell className='text-center font-medium'>{index + 1}</TableCell>
              <TableCell className='font-medium'>
                <div className='flex items-center justify-center gap-2'>
                  <img src={game.image} alt={game.game} className='h-10 w-10 rounded object-cover' />
                  <span>{game.game}</span>
                </div>
              </TableCell>
              <TableCell className='text-center'>{game.price}</TableCell>
              <TableCell className='text-center'>{game.fate}</TableCell>
              <TableCell className='text-center'>{game.perKillPrice}</TableCell>
              <TableCell className='text-center'>
                {game.hasScreenshots ? <button className='text-blue-500 underline'>View</button> : 'No screenshots'}
              </TableCell>
              <TableCell className='text-center'>
                <div className='flex justify-center'>
                  <button className='border-primary text-primary hover:bg-primary rounded-md border px-3 py-1 text-xs font-semibold hover:text-black'>
                    Select Winner
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
