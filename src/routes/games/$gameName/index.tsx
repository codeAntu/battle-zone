import Games from '@/components/games';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/games/$gameName/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Games />
  );
}
