import { createFileRoute, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/tournaments/currentTournaments/$tournamentsId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { tournamentsId } = useParams({
    from: '/admin/tournaments/currentTournaments/$tournamentsId',
  });
  console.log(tournamentsId);

  return (
    <div className='p-5'>
      <div>The current tournament ID is: {tournamentsId}</div>
    </div>
  );
}
