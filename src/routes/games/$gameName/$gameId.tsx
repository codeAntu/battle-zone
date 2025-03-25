import { createFileRoute, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/games/$gameName/$gameId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { gameName, gameId } = useParams({ from: '/games/$gameName/$gameId' });

  console.log(gameName, gameId);

  return (
    <div className='p-5'>
      <div>The content will be here</div>
    </div>
  );
}
