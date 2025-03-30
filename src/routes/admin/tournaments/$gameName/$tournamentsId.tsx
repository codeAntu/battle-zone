import { createFileRoute, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/tournaments/$gameName/$tournamentsId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { gameName, tournamentsId } = useParams({ from: '/admin/tournaments/$gameName/$tournamentsId' });

  console.log(gameName, tournamentsId);

  return (
    <div className='p-5'>
      <div>The content will be here</div>
      <div>Game Name: {gameName}</div>
      <div>Game ID: {tournamentsId}</div>
    </div>
  );
}
