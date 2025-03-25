import Games from '@/components/games';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/games/$gameName/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Games />
  );
}
